# Layer Slice Segment Decision Tree

Use this when deciding where new code belongs.

## Step 1: Choose the layer

```text
Is it app-wide setup or initialization?
-> app

Is it a route or screen?
-> pages

Is it a large UI block composed from lower layers?
-> widgets

Is it a user capability or action?
-> features

Is it a stable business noun?
-> entities

Is it generic infrastructure or reusable primitive?
-> shared
```

## Step 2: Choose the slice

```text
Can I name this by business meaning or product capability?
-> create or use that slice

Do I only have a technical name?
-> the slice is probably not ready yet
```

## Step 3: Choose the segment

```text
Is it rendering?
-> ui

Is it state, orchestration, validation, selectors, events?
-> model

Is it transport or requests?
-> api

Is it local helper logic with no better home?
-> lib

Is it static configuration?
-> config
```

## Final guardrail

If you need many sibling imports to make the design work, you probably chose the wrong slice boundary.
