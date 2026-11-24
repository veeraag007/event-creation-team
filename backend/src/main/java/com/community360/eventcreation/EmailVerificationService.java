// Sends one-time email codes and enforces expiration, resend limits and single-use verification.
package com.community360.eventcreation;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationService {
    private static final Duration EXPIRY = Duration.ofMinutes(10);
    private static final Duration COOLDOWN = Duration.ofSeconds(60);
    private static final int MAX_ATTEMPTS = 5;
    private final JavaMailSender mail;
    private final String from;
    private final Clock clock;
    private final SecureRandom random = new SecureRandom();
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
    private final Map<String, Challenge> challenges = new HashMap<>();
    private final Map<String, Window> addressLimits = new HashMap<>();
    private final Map<String, Window> ipLimits = new HashMap<>();

    private record Challenge(String hash, Instant expires, int attempts) {}
    private record Window(Instant started, Instant last, int count) {}

    @Autowired
    public EmailVerificationService(JavaMailSender mail, @Value("${app.mail.from}") String from) {
        this(mail, from, Clock.systemUTC());
    }

    EmailVerificationService(JavaMailSender mail, String from, Clock clock) {
        this.mail = mail;
        this.from = from;
        this.clock = clock;
    }

    public static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static String key(String purpose, String email) {
        return purpose + ":" + normalize(email);
    }

    public synchronized void send(String purpose, String email, String ip) {
        if (from.isBlank()) throw new VerificationFailure(503, "Email service is not configured. Contact the administrator.");
        Instant now = clock.instant();
        challenges.entrySet().removeIf(entry -> !entry.getValue().expires().isAfter(now));
        addressLimits.entrySet().removeIf(entry -> !entry.getValue().started().plus(EXPIRY).isAfter(now));
        ipLimits.entrySet().removeIf(entry -> !entry.getValue().started().plus(EXPIRY).isAfter(now));
        String address = normalize(email);
        Window addressWindow = addressLimits.get(address);
        Window ipWindow = ipLimits.get(ip);
        if ((addressWindow != null && (addressWindow.count() >= 3 ||
                addressWindow.last().plus(COOLDOWN).isAfter(now))) ||
                (ipWindow != null && ipWindow.count() >= 12) ||
                addressLimits.size() >= 1000 || ipLimits.size() >= 1000 || challenges.size() >= 1000) {
            throw new VerificationFailure(429, "Too many verification requests. Wait before requesting another code.");
        }
        // Record an attempt even if delivery fails, so repeated failures cannot flood SMTP.
        addressLimits.put(address, nextWindow(addressWindow, now));
        ipLimits.put(ip, nextWindow(ipWindow, now));
        String code = String.format(Locale.ROOT, "%06d", random.nextInt(1_000_000));
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(address);
        message.setSubject("Community 360 — Verify your email");
        message.setText("Your Community 360 verification code is " + code +
                ". It expires in 10 minutes. Do not share this code. If you did not request it, ignore this message.");
        try {
            mail.send(message);
        } catch (MailException failure) {
            throw new VerificationFailure(503, "Could not send the verification email. Check mail configuration or try again later.");
        }
        challenges.put(key(purpose, address), new Challenge(encoder.encode(code), now.plus(EXPIRY), 0));
    }

    private Window nextWindow(Window before, Instant now) {
        return new Window(before == null ? now : before.started(), now, before == null ? 1 : before.count() + 1);
    }

    public synchronized void verify(String purpose, String email, String code) {
        String key = key(purpose, email);
        Challenge pending = challenges.get(key);
        if (pending == null || !pending.expires().isAfter(clock.instant()) || pending.attempts() >= MAX_ATTEMPTS) {
            challenges.remove(key);
            throw new VerificationFailure(400, "Code expired or attempts exhausted. Request a new code.");
        }
        if (code == null || !code.matches("[0-9]{6}") || !encoder.matches(code, pending.hash())) {
            challenges.put(key, new Challenge(pending.hash(), pending.expires(), pending.attempts() + 1));
            throw new VerificationFailure(400, "Incorrect verification code.");
        }
        challenges.remove(key);
    }
}
