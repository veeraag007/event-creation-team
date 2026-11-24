// Returns readable verification errors without exposing SMTP credentials or internal exceptions.
package com.community360.eventcreation;

import java.util.Map;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class VerificationErrorHandler {
    @ExceptionHandler(VerificationFailure.class)
    public ResponseEntity<?> handle(VerificationFailure failure) {
        return ResponseEntity.status(failure.status()).cacheControl(CacheControl.noStore())
                .body(Map.of("error", failure.getMessage()));
    }
}
