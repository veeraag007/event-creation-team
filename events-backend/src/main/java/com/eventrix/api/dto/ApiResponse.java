
// Wraps a single API response.
package com.eventrix.api.dto;

public record ApiResponse<T>(
    boolean success,
    String message,
    T data
) {
}
