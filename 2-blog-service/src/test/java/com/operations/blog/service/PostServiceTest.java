package com.operations.blog.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.operations.blog.api.dto.CreatePostRequest;
import com.operations.blog.api.dto.MediaRefDto;
import com.operations.blog.client.AuditClient;
import com.operations.blog.client.MediaValidationClient;
import com.operations.blog.messaging.BlogEventPublisher;
import com.operations.blog.repository.PostRepository;
import com.operations.blog.repository.RevisionRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

  @Mock
  private PostRepository postRepository;

  @Mock
  private RevisionRepository revisionRepository;

  @Mock
  private MediaValidationClient mediaValidationClient;

  @Mock
  private AuditClient auditClient;

  @Mock
  private BlogEventPublisher eventPublisher;

  private PostService postService;

  @BeforeEach
  void initService() {
    postService = new PostService(
        "blog-cms", postRepository, revisionRepository, mediaValidationClient, auditClient, eventPublisher);
  }

  @Test
  void create_rejectsUnknownMediaReference() {
    when(mediaValidationClient.exists("missing-id")).thenReturn(false);
    CreatePostRequest request = new CreatePostRequest(
        "Title",
        "Body",
        null,
        List.of(),
        List.of(),
        List.of(new MediaRefDto("missing-id", null)));

    assertThrows(BlogException.class, () -> postService.create(request, "blog-cms", "user-1", null));
  }
}
