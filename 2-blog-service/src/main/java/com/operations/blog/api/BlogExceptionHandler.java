package com.operations.blog.api;

import com.operations.blog.api.dto.ErrorResponse;
import com.operations.blog.service.BlogException;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class BlogExceptionHandler {

  @ExceptionHandler(BlogException.class)
  public ResponseEntity<ErrorResponse> handleBlog(BlogException ex) {
    HttpStatus status = ex.getMessage().startsWith("Unknown media")
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.NOT_FOUND;
    if (ex.getMessage().contains("already exists") || ex.getMessage().contains("requires")) {
      status = HttpStatus.BAD_REQUEST;
    }
    return ResponseEntity.status(status)
        .body(new ErrorResponse("BLOG_ERROR", ex.getMessage(), Instant.now()));
  }

  @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
  public ResponseEntity<ErrorResponse> handleValidation(Exception ex) {
    return ResponseEntity.badRequest()
        .body(new ErrorResponse("VALIDATION_ERROR", "Invalid request payload", Instant.now()));
  }
}
