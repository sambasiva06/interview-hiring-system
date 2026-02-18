package com.example.hiringsystem.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        return createErrorResponse(ex.getMessage() != null ? ex.getMessage() : "Email already exists",
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return createErrorResponse(ex.getMessage() != null ? ex.getMessage() : "Invalid credentials",
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
        return createErrorResponse(ex.getMessage() != null ? ex.getMessage() : "Resource not found",
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateApplicationException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateApplication(DuplicateApplicationException ex) {
        return createErrorResponse(ex.getMessage() != null ? ex.getMessage() : "Duplicate application",
                HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidApplicationException.class)
    public ResponseEntity<Map<String, String>> handleInvalidApplication(InvalidApplicationException ex) {
        return createErrorResponse(ex.getMessage() != null ? ex.getMessage() : "Invalid application",
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return createErrorResponse("Database error: Possible duplicate record or constraint violation",
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder message = new StringBuilder("Validation failed: ");
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = (error instanceof FieldError fieldError) ? fieldError.getField()
                    : error.getObjectName();
            String errorMessage = error.getDefaultMessage();
            message.append(fieldName).append(": ").append(errorMessage).append("; ");
        });
        return createErrorResponse(message.toString(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        return createErrorResponse(
                "An unexpected error occurred: "
                        + (ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<Map<String, String>> createErrorResponse(String message, HttpStatus status) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.status(status).body(response);
    }
}
