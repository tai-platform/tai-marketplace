---
name: java-spring
description: Conventions for Java and Spring Boot code, covering layering, injection, validation, errors, transactions and tests.
applyTo: "**/*.java"
version: 1.0.0
author: herrhilmi
maturity: stable
phase: build
tags: [java, spring-boot, conventions]
---

# Java and Spring Boot

- Constructor injection only. Final fields, no field injection, no `@Autowired` on constructors with a single one.
- Layers: controller (HTTP only) calls service (rules and transactions) calls repository or client (I/O). No business logic in controllers, no HTTP types in services.
- Never expose entities over the API. Use records for request and response models and map explicitly.
- Validate input at the edge with Bean Validation (`@Valid`, `@NotBlank`, `@Size`). Services may assume valid input.
- One `@RestControllerAdvice` maps exceptions to RFC 9457 problem responses. Throw specific domain exceptions, never `RuntimeException` or `Exception`.
- Put `@Transactional` on service methods, never on controllers. Mark read only methods `readOnly = true`.
- Configuration through `@ConfigurationProperties` records, not scattered `@Value`.
- No `System.out`. Log with SLF4J, parameterized messages, no secrets or personal data in logs.
- Prefer `Optional` returns over null, immutable collections, and `var` only when the type is obvious.
- Tests: unit tests without Spring context for logic, slice tests (`@WebMvcTest`, `@DataJpaTest`) for layers, a few `@SpringBootTest` for wiring. Test names state behaviour.
