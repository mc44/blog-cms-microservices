package com.operations.blog.service;

import com.operations.blog.api.dto.TagRequest;
import com.operations.blog.api.dto.TagResponse;
import com.operations.blog.model.TagDocument;
import com.operations.blog.repository.TagRepository;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class TagService {
  private final TagRepository tagRepository;

  public TagService(TagRepository tagRepository) {
    this.tagRepository = tagRepository;
  }

  public TagResponse create(TagRequest request) {
    String slug = slugify(request.name());
    if (tagRepository.findBySlug(slug).isPresent()) {
      throw new BlogException("Tag slug already exists");
    }
    TagDocument doc = new TagDocument();
    doc.setName(request.name());
    doc.setSlug(slug);
    doc.setCreatedAt(Instant.now());
    TagDocument saved = tagRepository.save(doc);
    return toResponse(saved);
  }

  public List<TagResponse> list() {
    return tagRepository.findAll().stream().map(this::toResponse).toList();
  }

  private TagResponse toResponse(TagDocument doc) {
    return new TagResponse(doc.getId(), doc.getName(), doc.getSlug(), doc.getCreatedAt());
  }

  private String slugify(String name) {
    return name.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
  }
}
