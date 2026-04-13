---
description: "Use when replacing, creating, or updating ECharts widgets. Covers widget replacement workflow, data handling, and preservation of layout/responsiveness."
applyTo: "**/*.{js,html,css}"
---

# ECharts Widget Development

## Repo Purpose

This repository is a disposable ECharts widget playground used to prototype and test individual chart widgets.

The default operating model is:
- Replace the current widget with the new requested widget
- Do not preserve prior chart implementations unless explicitly asked
- Keep the app runnable at all times
- Keep the implementation self-contained and clean

## Standing Rules

### Before Making Changes
- Always inspect the current HTML, CSS, and JS before making changes
- Preserve the general widget size, spacing, padding, margins, and overall layout unless explicitly told otherwise
- Preserve the widget-shell concept and overall visual footprint
- Preserve the summary-chip / summary-card area at the bottom of the widget

### Data & Calculations
- Use only the provided data unless explicitly instructed to derive, calculate, transform, aggregate, normalize, or enrich it
- Do not invent fields, assumptions, categories, or calculations
- When requested summary chips require calculations not explicitly allowed, ask first; otherwise keep summary cards limited to directly supported data

### Summary Chips/Cards
- Intelligently redesign the summary chips/cards so they fit the currently provided data and chart
- Avoid blindly reusing prior chip content
- Keep summary cards meaningfully tied to the current data

### Code Quality
- Keep the widget visually polished and production-like
- Prefer clear, maintainable ECharts configuration over overly abstract patterns
- Keep the app self-contained unless explicitly asked to introduce new files or dependencies
- When updating the widget, replace the prior chart implementation cleanly rather than layering on dead code
- Avoid leaving behind unused markup, CSS, helper functions, or stale data structures
- Keep chart code readable enough that a future agent can easily replace it again

### Responsiveness
- Preserve responsiveness unless explicitly told to target only desktop or only mobile

## Implementation Preferences

Default preference unless the prompt says otherwise:
- Use ECharts
- Keep a stable single-widget app structure
- Update HTML/CSS only as needed for the new chart
- Keep the result easy to swap out again later

## Output Expectations

When completing a chart replacement task:
- Briefly state what changed
- Note any assumptions avoided
- Mention any data limitations that constrained labels, chips, legend, axes, or tooltip behavior
