// Carries safe verification errors from the email service to the REST API.
package com.community360.eventcreation;

public class VerificationFailure extends RuntimeException {
    private final int status;

    public VerificationFailure(int status, String message) {
        super(message);
        this.status = status;
    }

    public int status() { return status; }
}
