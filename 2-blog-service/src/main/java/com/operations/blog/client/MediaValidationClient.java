package com.operations.blog.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class MediaValidationClient {
  private static final Logger log = LoggerFactory.getLogger(MediaValidationClient.class);

  private final RestClient restClient;

  public MediaValidationClient(@Value("${media.service.base-url}") String baseUrl) {
    this.restClient = RestClient.builder().baseUrl(baseUrl).build();
  }

  public boolean exists(String publicId) {
    try {
      Boolean ok = restClient.get()
          .uri("/media/{publicId}", publicId)
          .exchange((request, response) -> response.getStatusCode().is2xxSuccessful());
      return Boolean.TRUE.equals(ok);
    } catch (Exception ex) {
      log.debug("Media asset not found for publicId={}: {}", publicId, ex.getMessage());
      return false;
    }
  }
}
