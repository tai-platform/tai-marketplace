---
name: write-tests
description: Add focused tests for a class, function or recent change, matching the repository's existing test framework and style, then run them.
argument-hint: 'What to test, e.g. "OrderService.cancel" or "the changes on this branch"'
agent: agent
version: 1.0.0
author: herrhilmi
maturity: stable
phase: test
tags: [testing, unit-tests, quality]
---

Add tests for what the user points at.

1. Find the existing tests nearest to the target. Reuse their framework, naming, fixtures and assertion style. Do not add a new test library.
2. Read the target and list its behaviours: the normal path, each branch, each error it raises or maps, and boundary values. Skip getters, constants and framework behaviour.
3. Write one test per behaviour with a name that states the behaviour. Arrange, act, assert, nothing more. Prefer real objects over mocks, and mock only at process boundaries such as network, clock and filesystem.
4. Put each test next to its siblings in the existing test file, or create the file where the project's convention says.
5. Run only the new tests with the project's own command and fix failures in the tests. If a failure reveals a real bug in the code, stop and report it instead of bending the test.
6. Report the tests added, the command used and the result.
