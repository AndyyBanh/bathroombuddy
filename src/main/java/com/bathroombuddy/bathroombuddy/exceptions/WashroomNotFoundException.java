package com.bathroombuddy.bathroombuddy.exceptions;

public class WashroomNotFoundException extends RuntimeException {
    public WashroomNotFoundException(String message) {
        super(message);
    }
}
