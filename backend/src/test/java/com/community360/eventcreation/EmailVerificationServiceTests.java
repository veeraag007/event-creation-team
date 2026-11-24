// Verifies OTP lifetime, purpose binding, single use, resend limits and failure handling.
package com.community360.eventcreation;

import java.time.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmailVerificationServiceTests {
    private static final String EMAIL = "person@example.com";
    private static final String IP = "127.0.0.1";
    private JavaMailSender mail;
    private MutableClock clock;
    private EmailVerificationService service;
    private static class MutableClock extends Clock {
        Instant now = Instant.parse("2026-01-01T00:00:00Z");
        public ZoneId getZone() { return ZoneOffset.UTC; }
        public Clock withZone(ZoneId zone) { return Clock.fixed(now, zone); }
        public Instant instant() { return now; }
    }
    @BeforeEach void setup() {
        mail = mock(JavaMailSender.class);
        clock = new MutableClock();
        service = new EmailVerificationService(mail, "sender@example.com", clock);
    }
    private String requestCode() {
        service.send("admin-signup", EMAIL, IP);
        ArgumentCaptor<SimpleMailMessage> captured = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mail, atLeastOnce()).send(captured.capture());
        String text = captured.getValue().getText();
        return text.replaceFirst(".* code is ([0-9]{6}).*", "$1");
    }
    @Test void acceptsCodeOnlyOnceForCorrectAddressAndPurpose() {
        String code = requestCode();
        assertThrows(VerificationFailure.class, () -> service.verify("attendee-signup", EMAIL, code));
        assertThrows(VerificationFailure.class, () -> service.verify("admin-signup", "other@example.com", code));
        service.verify("admin-signup", EMAIL.toUpperCase(java.util.Locale.ROOT), code);
        assertThrows(VerificationFailure.class, () -> service.verify("admin-signup", EMAIL, code));
    }
    @Test void expiresAndBlocksRepeatedRequests() {
        String code = requestCode();
        assertEquals(429, assertThrows(VerificationFailure.class, () -> service.send("admin-signup", EMAIL, IP)).status());
        clock.now = clock.now.plus(Duration.ofMinutes(10));
        assertThrows(VerificationFailure.class, () -> service.verify("admin-signup", EMAIL, code));
    }
    @Test void blocksAfterFiveIncorrectCodes() {
        String code = requestCode();
        String wrong = code.equals("000000") ? "111111" : "000000";
        for (int i = 0; i < 5; i++) assertThrows(VerificationFailure.class, () -> service.verify("admin-signup", EMAIL, wrong));
        assertThrows(VerificationFailure.class, () -> service.verify("admin-signup", EMAIL, code));
    }
    @Test void deliveryFailureDoesNotCreateChallenge() {
        doThrow(new MailSendException("SMTP unavailable")).when(mail).send(any(SimpleMailMessage.class));
        assertEquals(503, assertThrows(VerificationFailure.class, () -> service.send("admin-signup", EMAIL, IP)).status());
        assertThrows(VerificationFailure.class, () -> service.verify("admin-signup", EMAIL, "000000"));
    }
}
