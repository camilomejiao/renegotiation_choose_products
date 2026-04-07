---
name: fsd-task-intake
description: Use when a feature, refactor, review, or bugfix request in an FSD-based frontend project is underspecified and the agent needs to ask the minimum targeted questions before proceeding. Also use when shaping a strong prompt for the project's architecture and workflow.
---

# FSD Task Intake

Use this skill when the user request is incomplete, ambiguous, or too broad to execute safely in one pass.

This skill is for shaping work, not blocking it. Make a reasonable assumption whenever the risk is low. Ask questions only when the missing information could cause rework, architectural drift, or behavior changes.

## When to use
- The user asks for a refactor but does not name the target file, module, or outcome
- The user asks for a feature without saying where it belongs or how it should behave
- The user asks for a review without naming the diff, scope, or concern
- The request could mean either a bugfix, cleanup, architecture correction, or behavior change

## Default behavior
- Prefer action over long planning
- Ask the minimum number of questions needed
- Keep questions short and concrete
- Do not ask multiple broad brainstorming questions
- If one question unlocks the task, ask only one

## Refactor intake
For a refactor request, try to determine only these points:
1. Target scope
2. Desired outcome
3. Behavior constraints

Use questions like:
- "What should I refactor exactly: a file, module, or feature?"
- "Is the goal cleanup, architecture alignment, performance, or bug reduction?"
- "Should I preserve current behavior exactly, or can I change behavior if I find issues?"

If the codebase already reveals the target and intent with high confidence, do not ask. Proceed.

## Feature intake
Clarify only what is missing:
- User-visible outcome
- Data source or route if unclear
- Whether navigation, filters, or tables are involved

Use questions like:
- "What should the user be able to do when this is done?"
- "Do you already have an endpoint or existing page this should connect to?"
- "Should this live in an existing screen or a new route?"

## Review intake
Ask for the smallest missing pointer:
- Target files
- Branch, diff, or feature name
- Review focus if special

Use questions like:
- "What should I review exactly?"
- "Do you want a bug-risk review, architecture review, or both?"

## Prompt shaping pattern
When the user wants help writing a better prompt, push toward this structure:
- Goal
- Scope
- Relevant project skills
- Constraints
- Expected output

## Output expectation
- Either ask one to three concise questions
- Or proceed directly with clear assumptions
- Once clarified, switch into the implementation or review skills that match the task
