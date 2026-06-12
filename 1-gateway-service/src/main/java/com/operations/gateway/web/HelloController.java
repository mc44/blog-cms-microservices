package com.operations.gateway.web;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class HelloController {

  @GetMapping("/hello")
  public Mono<Map<String, String>> hello() {
    return Mono.just(Map.of("service", "gateway-service", "status", "up"));
  }
}
