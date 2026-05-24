package com.operations.blog.model;

public class MediaRef {
  private String cloudinaryPublicId;
  private String secureUrl;

  public String getCloudinaryPublicId() {
    return cloudinaryPublicId;
  }

  public void setCloudinaryPublicId(String cloudinaryPublicId) {
    this.cloudinaryPublicId = cloudinaryPublicId;
  }

  public String getSecureUrl() {
    return secureUrl;
  }

  public void setSecureUrl(String secureUrl) {
    this.secureUrl = secureUrl;
  }
}
