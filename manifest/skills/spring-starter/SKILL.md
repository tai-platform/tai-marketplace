---
name: spring-starter
description: 'Scaffold a runnable Spring Boot project from start.spring.io. Use when asked to start, create, bootstrap or scaffold a Spring Boot service, for example "start product-api using latest stable spring and add rest and jpa" or "new orders-service with gradle, kafka and postgres".'
argument-hint: 'Project name and what it needs, e.g. "product-api with rest and jpa"'
version: 1.0.0
author: herrhilmi
maturity: beta
phase: build
tags: [java, spring-boot, scaffold, maven, gradle, example]
---

# Spring Starter

Generates a project with the official [Spring Initializr](https://start.spring.io) API
and proves it builds. No template is stored here, so versions and dependencies are
always current.

## Example requests

- `start product-api using latest stable spring and add rest and jpa`
- `new orders-service with gradle, kafka, postgres and actuator, package com.acme.orders`
- `scaffold a kotlin gateway on java 21 with security and oauth2 resource server`

## Inputs and defaults

| Input | Default when not given |
| --- | --- |
| Name (artifactId) | required, ask once if missing |
| Spring Boot | latest stable: omit `--boot`, the server picks it. Never choose a SNAPSHOT or milestone unless asked |
| Java | major version of `JAVA_HOME`, else of `java` on the path. Tell the user which one was used |
| Build | Maven. Gradle only if the user says gradle (`gradle-kotlin` for the Kotlin DSL) |
| Language | Java. Kotlin only if asked |
| Group | `com.example`. Prefer the user's own: ask, or reuse the group from a sibling project or `git config user.email` domain, reversed |
| Package | `group.name` with dots and dashes removed, chosen by the server. Pass `--package` only when the user states one |
| Packaging | jar |
| Folder | `./<name>` |

## Choose dependencies

Every id is listed in [reference/dependencies.md](reference/dependencies.md). The live catalog is
authoritative if an id is missing or rejected:

```bash
curl -s -H "Accept: application/json" https://start.spring.io/metadata/client
```

Common wording to id:

| User says | id |
| --- | --- |
| rest, web, api, mvc | `web` |
| reactive, webflux | `webflux` |
| jpa, hibernate, database access | `data-jpa` |
| jdbc | `jdbc` |
| postgres, mysql, h2 | `postgresql`, `mysql`, `h2` |
| flyway, liquibase | `flyway`, `liquibase` |
| validation | `validation` |
| security | `security` |
| oauth2 resource server | `oauth2-resource-server` |
| actuator, health, metrics | `actuator` |
| prometheus | `prometheus` |
| kafka, rabbit | `kafka`, `rabbitmq` |
| redis, mongo | `data-redis`, `data-mongodb` |
| openapi, swagger | `springdoc-openapi` |
| lombok, devtools | `lombok`, `devtools` |
| tests with containers | `testcontainers` |

If a word matches nothing, search the catalog and propose the closest id. If JPA is
requested without a database, ask which one, or use `h2` and say so.

## Generate

The whole project is one request. This is all the helpers do, plus the Java detection and cleanup:

```bash
curl -G https://start.spring.io/starter.zip -o product-api.zip \
  -d type=maven-project -d language=java -d javaVersion=21 \
  -d groupId=com.acme -d artifactId=product-api -d name=product-api \
  -d dependencies=web,data-jpa,h2
unzip product-api.zip -d product-api && rm product-api.zip
```

Run the helper that matches the shell. tai installs these files but never runs them, so
read them first. Installed paths are `.github/skills/spring-starter/` in a repo or
`~/.copilot/skills/spring-starter/` globally.

```bash
scripts/new-project.sh product-api --deps web,data-jpa,h2 --group com.acme
scripts/new-project.sh orders --build gradle --java 21 --deps web,kafka,postgresql,actuator
```

```powershell
scripts/new-project.ps1 product-api -Deps web,data-jpa,h2 -Group com.acme
scripts/new-project.ps1 orders -Build gradle -Java 21 -Deps web,kafka,postgresql,actuator
```

Options: group, package, build (`maven`, `gradle`, `gradle-kotlin`), lang, java, boot,
deps (comma separated), packaging, dir. The script refuses a non-empty target folder,
downloads to a temp file and removes it, and prints the server's message on a bad request
(unknown dependency, unsupported Java).

If the Java version is rejected, the JDK in use is newer or older than Initializr
supports. Report it and ask which supported version to use. Do not silently change it.

## Verify it runs

From the new folder, with the same JDK the project was generated for:

```bash
./mvnw -q verify          # gradle: ./gradlew build
./mvnw spring-boot:run    # gradle: ./gradlew bootRun
```

On Windows cmd use `mvnw.cmd` or `gradlew.bat`. The first run downloads the wrapper and
dependencies. Report the build result and, for a web project, that it starts on
port 8080. Stop the app afterwards.

A project with `data-jpa` and no datasource fails to start. That is why a database
dependency must be chosen with it.

## Finish

Summarise what was generated: Boot version, Java, build tool, dependency list and folder.
Do not add code, endpoints or entities unless the user asks. Do not commit.
