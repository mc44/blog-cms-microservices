package com.operations.blog.repository;

import com.operations.blog.model.TagDocument;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TagRepository extends MongoRepository<TagDocument, String> {
  Optional<TagDocument> findBySlug(String slug);
}
