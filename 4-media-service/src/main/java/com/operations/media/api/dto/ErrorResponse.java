package com.operations.media.api.dto;

import java.time.Instant;

public record ErrorResponse(String code, String message, Instant timestamp) {}
