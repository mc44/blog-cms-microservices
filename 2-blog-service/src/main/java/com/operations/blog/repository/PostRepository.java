package com.operations.blog.repository;

import com.operations.blog.model.PostDocument;
import com.operations.blog.model.PostStatus;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<PostDocument, String> {
  List<PostDocument> findByTenantIdAndStatusOrderByUpdatedAtDesc(String tenantId, PostStatus status);

  List<PostDocument> findByTenantIdOrderByUpdatedAtDesc(String tenantId);

  List<PostDocument> findByTenantIdAndAuthorIdOrderByUpdatedAtDesc(String tenantId, String authorId);

  List<PostDocument> findByTenantIdAndAuthorIdAndStatusOrderByUpdatedAtDesc(
      String tenantId, String authorId, PostStatus status);

  java.util.Optional<PostDocument> findByIdAndTenantId(String id, String tenantId);
}
