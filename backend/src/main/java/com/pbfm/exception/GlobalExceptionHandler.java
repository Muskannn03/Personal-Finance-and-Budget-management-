package com.pbfm.exception;

import com.pbfm.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // 1. Handle custom BusinessException subclasses (NotFound, Duplicate, Validation, Auth)
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        log.warn("Business Exception [{}]: {}", ex.getStatus(), ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error(ex.getStatus().value(), ex.getMessage());
        return new ResponseEntity<>(response, ex.getStatus());
    }

    // 2. Handle Bean Validation exceptions (@Valid request payloads)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());
        
        log.warn("Bean Validation Failure: {} errors found", errors.size());
        ApiResponse<Void> response = ApiResponse.error(HttpStatus.BAD_REQUEST.value(), "Validation failed", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 3. Handle SQL / Data Integrity constraints
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.error("Data Integrity Violation: ", ex);
        String message = "Database constraint violation occurred";
        Throwable rootCause = ex.getRootCause();
        if (rootCause != null && rootCause.getMessage() != null) {
            String rootMsg = rootCause.getMessage();
            if (rootMsg.contains("duplicate key value")) {
                message = "A resource with this identifier already exists";
                ApiResponse<Void> response = ApiResponse.error(HttpStatus.CONFLICT.value(), message);
                return new ResponseEntity<>(response, HttpStatus.CONFLICT);
            }
        }
        ApiResponse<Void> response = ApiResponse.error(HttpStatus.BAD_REQUEST.value(), message);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 4. Handle Illegal Argument / Bad Request
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Bad Request Argument: {}", ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 5. Handle Authentication / Bad Credentials
    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(org.springframework.security.core.AuthenticationException ex) {
        log.warn("Authentication failed: {}", ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error(HttpStatus.UNAUTHORIZED.value(), "Invalid email address or password. Please try again.");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    // 6. Handle Type Mismatches (e.g. invalid UUIDs or numbers in parameters)
    @ExceptionHandler(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentTypeMismatch(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException ex) {
        log.warn("Method argument type mismatch: param '{}', value '{}'", ex.getName(), ex.getValue());
        String msg = String.format("Invalid format for parameter '%s': '%s'. Please provide a valid %s.",
                ex.getName(), ex.getValue(), ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "value");
        ApiResponse<Void> response = ApiResponse.error(HttpStatus.BAD_REQUEST.value(), msg);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 7. Fallback Catch-all for General Exceptions (HTTP 500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        log.error("Unexpected System Error occurred: ", ex);
        ApiResponse<Void> response = ApiResponse.error(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected internal server error occurred"
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
