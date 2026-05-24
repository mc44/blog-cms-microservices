# 12 - Portfolio Packaging Checklist

Use this after finishing the upgrade playbooks to turn your work into a clean, reviewable portfolio artifact.

## Goal

Present your microservices project as evidence of engineering depth, not just code volume.

## Portfolio package structure

Create a folder (or section in your repo/docs) with:

- architecture overview
- milestone evidence
- testing and reliability proof
- deployment and operations proof
- lessons learned

## Required artifacts per milestone

### R2 Auth

- API collection for login/refresh/logout
- evidence of protected-route enforcement (`401` vs authorized success)
- token lifecycle diagram

### R3 Core domain

- incident/task domain model diagram
- request/response examples for core workflows
- correlation ID trace evidence across services

### R4 Frontend

- short UI walkthrough video (login -> incidents/tasks -> logout)
- screenshots for loading/error/empty states
- frontend auth/session handling note

### R5 Notifications sync MVP

- sequence diagram: domain action -> notification trigger
- success/failure request evidence
- migration note from sync to async notification path

### R6 Async backbone

- event catalog (producer, consumer, schema version)
- retry and DLQ evidence (logs/screenshots)
- idempotency strategy note

### R7 Realtime

- two-client realtime demo evidence
- unauthorized websocket rejection evidence
- reconnect behavior test notes

### R8-R9 Observability and deploy

- dashboard screenshots (latency, errors, queue health)
- trace screenshot across gateway + downstream service
- CI run showing selective/path-filtered behavior
- deploy + rollback runbook excerpt

## Presentation checklist

- Add a one-page project summary:
  - problem solved
  - architecture choices
  - tradeoffs made
  - reliability and security posture
- Add a progression timeline showing milestones completed.
- Add direct links to key docs under `docs/learning/`.
- Keep screenshots readable and labeled by milestone.

## Recruiter/interviewer-ready README section

Include:

- "What this project demonstrates"
- "Key engineering decisions"
- "Failure scenarios tested"
- "How to run baseline locally"
- "What I would build next"

## Quality bar before sharing

- all baseline commands in `04-command-reference.md` still work
- milestone docs do not contradict `README.md`, `SYSTEM_DESIGN.md`, or `docs/ROADMAP.md`
- examples are anonymized and free of secrets
- links in docs are valid

## Reflection prompts (final)

- What was your hardest architecture tradeoff and why?
- Which reliability failure taught you the most?
- What would you change if this were production tomorrow?
- What does this project prove about your engineering level?
