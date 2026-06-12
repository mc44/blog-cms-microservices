package com.operations.media.api.dto;

public record MediaAssetResponse(
    String publicId,
    String secureUrl,
    String format,
    int width,
    int height) {}
