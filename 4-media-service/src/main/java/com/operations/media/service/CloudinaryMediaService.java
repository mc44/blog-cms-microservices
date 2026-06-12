package com.operations.media.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.operations.media.api.dto.MediaAssetResponse;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CloudinaryMediaService {
  private static final Logger log = LoggerFactory.getLogger(CloudinaryMediaService.class);

  private final Cloudinary cloudinary;
  private final boolean cloudinaryConfigured;
  private final ConcurrentHashMap<String, MediaAssetResponse> devRegistry = new ConcurrentHashMap<>();

  public CloudinaryMediaService(
      Cloudinary cloudinary,
      @Value("${cloudinary.cloud-name:}") String cloudName,
      @Value("${cloudinary.api-key:}") String apiKey,
      @Value("${cloudinary.api-secret:}") String apiSecret) {
    this.cloudinary = cloudinary;
    this.cloudinaryConfigured =
        cloudName != null && !cloudName.isBlank()
            && apiKey != null && !apiKey.isBlank()
            && apiSecret != null && !apiSecret.isBlank();
    if (!cloudinaryConfigured) {
      log.warn("Cloudinary credentials missing — using in-memory dev registry for uploads");
    }
  }

  public MediaAssetResponse upload(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new MediaException("File is required");
    }
    if (!cloudinaryConfigured) {
      return devUpload(file);
    }
    try {
      @SuppressWarnings("unchecked")
      Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
      return mapResult(result);
    } catch (IOException ex) {
      throw new MediaException("Upload failed: " + ex.getMessage());
    }
  }

  public MediaAssetResponse get(String publicId) {
    if (publicId == null || publicId.isBlank()) {
      throw new MediaException("publicId is required");
    }
    if (!cloudinaryConfigured) {
      MediaAssetResponse asset = devRegistry.get(publicId);
      if (asset == null) {
        throw new MediaException("Asset not found");
      }
      return asset;
    }
    try {
      @SuppressWarnings("unchecked")
      Map<String, Object> result = cloudinary.api().resource(publicId, ObjectUtils.emptyMap());
      return mapResult(result);
    } catch (Exception ex) {
      throw new MediaException("Asset not found");
    }
  }

  private MediaAssetResponse devUpload(MultipartFile file) {
    String publicId = "dev-" + System.currentTimeMillis();
    String secureUrl = "https://res.cloudinary.com/dev/image/upload/" + publicId;
    MediaAssetResponse asset = new MediaAssetResponse(publicId, secureUrl, "jpg", 0, 0);
    devRegistry.put(publicId, asset);
    log.info("Dev media upload registered publicId={} filename={}", publicId, file.getOriginalFilename());
    return asset;
  }

  private MediaAssetResponse mapResult(Map<String, Object> result) {
    String publicId = String.valueOf(result.get("public_id"));
    String secureUrl = String.valueOf(result.get("secure_url"));
    String format = result.get("format") != null ? String.valueOf(result.get("format")) : "";
    int width = result.get("width") instanceof Number n ? n.intValue() : 0;
    int height = result.get("height") instanceof Number n ? n.intValue() : 0;
    return new MediaAssetResponse(publicId, secureUrl, format, width, height);
  }
}
