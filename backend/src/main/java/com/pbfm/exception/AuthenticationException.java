package com.pbfm.exception;

import org.springframework.http.HttpStatus;

public class AuthenticationException extends BusinessException {
    
    public AuthenticationException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}
