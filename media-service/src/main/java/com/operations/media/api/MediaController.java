package com.operations.media.api;

import com.operations.media.api.dto.MediaAssetResponse;
import com.operations.media.service.CloudinaryMediaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/media")
public class MediaController {
  private final CloudinaryMediaService mediaService;

  public MediaController(CloudinaryMediaService mediaService) {
    this.mediaService = mediaService;
  }

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<MediaAssetResponse> upload(@RequestParam("file") MultipartFile file) {
    return ResponseEntity.status(HttpStatus.CREATED).body(mediaService.upload(file));
  }

  @GetMapping("/{publicId}")
  public MediaAssetResponse get(@PathVariable String publicId) {
    return mediaService.get(publicId);
  }
}
