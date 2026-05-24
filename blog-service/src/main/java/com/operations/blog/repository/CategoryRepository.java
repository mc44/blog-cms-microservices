package com.operations.blog.repository;

import com.operations.blog.model.CategoryDocument;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<CategoryDocument, String> {
  Optional<CategoryDocument> findBySlug(String slug);
}
