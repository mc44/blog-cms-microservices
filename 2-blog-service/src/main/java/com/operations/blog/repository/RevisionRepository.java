package com.operations.blog.repository;

import com.operations.blog.model.RevisionDocument;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RevisionRepository extends MongoRepository<RevisionDocument, String> {
  List<RevisionDocument> findByPostIdOrderByRevisionNumberDesc(String postId);

  int countByPostId(String postId);
}
