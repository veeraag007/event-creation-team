// Creates one workspace per authenticated admin and reads only that organization's operations.
package com.community360.eventcreation;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/admin/organization")
@CrossOrigin(origins = "http://localhost:3001", allowCredentials = "true")
public class OrganizationController {
    private final JdbcTemplate db;
    private final ObjectMapper json;
    public OrganizationController(JdbcTemplate db, ObjectMapper json) { this.db = db; this.json = json; }

    public record Setup(@NotBlank @Size(max=120) String legalName, @NotBlank @Size(max=40) String phone,
        @NotBlank @Size(max=100) String role, @NotBlank @Size(max=80) String sector,
        @NotBlank @Size(max=180) String name, @NotNull @Pattern(regexp="[a-z0-9]+(?:-[a-z0-9]+)*") @Size(max=80) String slug,
        @NotBlank @Size(max=100) String city, @NotBlank @Size(max=50) String scale, @NotBlank @Size(max=80) String policy,
        @NotBlank @Size(max=80) String member, @NotBlank @Size(max=80) String members,
        @NotBlank @Size(max=80) String unit, @NotBlank @Size(max=80) String units,
        @NotNull @Size(max=16) List<@NotBlank @Size(max=80) String> modules,
        @Size(max=150) String hall, @Size(max=100) String seating,
        @NotNull @Pattern(regexp="Starter Community|Growth & Professional|Enterprise & Campus") String plan,
        @NotNull @Pattern(regexp="Monthly|Annual") String cycle) {}

    public record Launch(@NotNull @Valid Setup configuration, @NotBlank @Size(max=72) String password) {}

    @GetMapping
    public ResponseEntity<?> read(HttpSession session) {
        Object owner = session.getAttribute("communityId");
        if (owner == null) return error(401,"Please log in.");
        var configs = db.queryForList("select configuration::text from organization_workspaces where owner_id=?",String.class,owner);
        if (configs.isEmpty()) return ResponseEntity.ok(Map.of("configured",false));
        var events = db.queryForList("select id,name,start_date,venue,status from organization_events where owner_id=? order by start_date desc",owner);
        var registrations = db.queryForMap("""
            select count(*) as registrations, count(distinct attendee_id) as attendees,
            count(*) filter(where lower(r.status)='confirmed') as confirmed,
            count(*) filter(where lower(r.status)='pending') as pending,
            count(*) filter(where lower(r.status)='cancelled') as cancelled
            from organization_registrations r join organization_events e on e.id=r.event_id where e.owner_id=?
            """,owner);
        return ResponseEntity.ok(Map.of("configured",true,"organization",json.readValue(configs.get(0),Setup.class),
            "events",events,"stats",registrations,
            "members",db.queryForList("select id,name,email from organization_members where owner_id=? order by name",owner),
            "bookings",db.queryForList("select r.id,e.id as event_id,e.name as event,m.name as attendee,r.status from organization_registrations r join organization_events e on e.id=r.event_id join organization_members m on m.id::text=r.attendee_id and m.owner_id=e.owner_id where e.owner_id=?",owner)));
    }

    @PostMapping(consumes="application/json")
    public ResponseEntity<?> launch(@Valid @RequestBody Launch launch,HttpSession session) {
        Object owner = session.getAttribute("communityId");
        if (owner == null) return error(401,"Please log in.");
        var hashes = db.queryForList("select password_hash from admins where community_id=?",String.class,owner);
        if (hashes.isEmpty() || !new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().matches(launch.password(),hashes.get(0)))
            return error(400,"Confirm your current admin password in Admin identity.");
        Setup setup = launch.configuration();
        int inserted = db.update("insert into organization_workspaces(owner_id,slug,configuration) values(?,?,cast(? as jsonb)) on conflict do nothing",
            owner,setup.slug(),json.writeValueAsString(setup));
        if (inserted == 0 && !Boolean.TRUE.equals(db.queryForObject("select exists(select 1 from organization_workspaces where owner_id=?)",Boolean.class,owner)))
            return error(409,"That organization slug is already in use. Choose another in Organization details.");
        return read(session);
    }

    public record EventInput(@NotBlank @Size(max=180) String name, @NotNull java.time.LocalDate date,
                             @Size(max=180) String venue, @Pattern(regexp="Upcoming|Active|Completed|Cancelled") @NotNull String status) {}
    public record MemberInput(@NotBlank @Size(max=120) String name,@Email @NotBlank @Size(max=254) String email) {}
    public record BookingInput(@NotNull java.util.UUID event,@NotNull java.util.UUID member,
                               @NotNull @Pattern(regexp="Confirmed|Pending|Cancelled") String status) {}

    @PostMapping(value="/events",consumes="application/json")
    public ResponseEntity<?> event(@Valid @RequestBody EventInput event,HttpSession session) {
        Object owner=session.getAttribute("communityId");
        if(owner==null)return error(401,"Please log in.");
        int rows=db.update("insert into organization_events(id,owner_id,name,start_date,venue,status) select ?,owner_id,?,?,?,? from organization_workspaces where owner_id=?",
            java.util.UUID.randomUUID(),event.name(),event.date(),event.venue(),event.status(),owner);
        return rows==0?error(409,"Complete organization setup first."):read(session);
    }

    @PostMapping(value="/members",consumes="application/json")
    public ResponseEntity<?> member(@Valid @RequestBody MemberInput member,HttpSession session) {
        Object owner=session.getAttribute("communityId");
        if(owner==null)return error(401,"Please log in.");
        int rows=db.update("insert into organization_members(id,owner_id,name,email) select ?,owner_id,?,lower(?) from organization_workspaces where owner_id=? on conflict do nothing",
            java.util.UUID.randomUUID(),member.name(),member.email(),owner);
        return rows==0?error(409,"Complete setup or check for an existing member."):read(session);
    }

    @PostMapping(value="/registrations",consumes="application/json")
    public ResponseEntity<?> registration(@Valid @RequestBody BookingInput booking,HttpSession session) {
        Object owner=session.getAttribute("communityId");
        if(owner==null)return error(401,"Please log in.");
        int rows=db.update("""
            insert into organization_registrations(id,event_id,attendee_id,status)
            select ?,e.id,m.id::text,? from organization_events e join organization_members m on m.owner_id=e.owner_id
            where e.owner_id=? and e.id=? and m.id=? on conflict(event_id,attendee_id) do update set status=excluded.status
            """,java.util.UUID.randomUUID(),booking.status(),owner,booking.event(),booking.member());
        return rows==0?error(400,"Choose an event and attendee from this workspace."):read(session);
    }

    private ResponseEntity<?> error(int status,String message) { return ResponseEntity.status(status).body(Map.of("error",message)); }
}
