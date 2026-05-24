package com.operations.blog.api;

import com.operations.blog.api.dto.TagRequest;
import com.operations.blog.api.dto.TagResponse;
import com.operations.blog.service.TagService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/blog/tags")
public class TagController {
  private final TagService tagService;

  public TagController(TagService tagService) {
    this.tagService = tagService;
  }

  @PostMapping
  public ResponseEntity<TagResponse> create(@Valid @RequestBody TagRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(tagService.create(request));
  }

  @GetMapping
  public List<TagResponse> list() {
    return tagService.list();
  }
}
