package com.operations.blog.service;

import com.operations.blog.api.dto.CategoryRequest;
import com.operations.blog.api.dto.CategoryResponse;
import com.operations.blog.model.CategoryDocument;
import com.operations.blog.repository.CategoryRepository;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {
  private final CategoryRepository categoryRepository;

  public CategoryService(CategoryRepository categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public CategoryResponse create(CategoryRequest request) {
    String slug = slugify(request.name());
    if (categoryRepository.findBySlug(slug).isPresent()) {
      throw new BlogException("Category slug already exists");
    }
    CategoryDocument doc = new CategoryDocument();
    doc.setName(request.name());
    doc.setSlug(slug);
    doc.setCreatedAt(Instant.now());
    CategoryDocument saved = categoryRepository.save(doc);
    return toResponse(saved);
  }

  public List<CategoryResponse> list() {
    return categoryRepository.findAll().stream().map(this::toResponse).toList();
  }

  private CategoryResponse toResponse(CategoryDocument doc) {
    return new CategoryResponse(doc.getId(), doc.getName(), doc.getSlug(), doc.getCreatedAt());
  }

  private String slugify(String name) {
    return name.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
  }
}
