package com.pbfm.exception;

import org.springframework.http.HttpStatus;

public class DatabaseException extends BusinessException {
    
    public DatabaseException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
