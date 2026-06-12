package com.operations.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class TenantIdForwardingGatewayFilter implements GlobalFilter, Ordered {
  public static final String HEADER = "X-Tenant-Id";

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    return ReactiveSecurityContextHolder.getContext()
        .flatMap(ctx -> {
          if (ctx.getAuthentication() == null
              || !(ctx.getAuthentication().getPrincipal() instanceof Jwt jwt)) {
            return chain.filter(exchange);
          }
          String tenantId = jwt.getClaimAsString("tenantId");
          if (tenantId == null || tenantId.isBlank()) {
            return chain.filter(exchange);
          }
          ServerHttpRequest request =
              exchange.getRequest().mutate().header(HEADER, tenantId).build();
          return chain.filter(exchange.mutate().request(request).build());
        })
        .switchIfEmpty(chain.filter(exchange));
  }

  @Override
  public int getOrder() {
    return Ordered.HIGHEST_PRECEDENCE + 11;
  }
}
