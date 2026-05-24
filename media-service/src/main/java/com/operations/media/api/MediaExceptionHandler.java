package com.operations.media.api;

import com.operations.media.api.dto.ErrorResponse;
import com.operations.media.service.MediaException;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class MediaExceptionHandler {

  @ExceptionHandler(MediaException.class)
  public ResponseEntity<ErrorResponse> handle(MediaException ex) {
    HttpStatus status = ex.getMessage().contains("not found")
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;
    return ResponseEntity.status(status)
        .body(new ErrorResponse("MEDIA_ERROR", ex.getMessage(), Instant.now()));
  }
}
