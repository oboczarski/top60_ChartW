---
description: "Use when replacing, creating, or updating ECharts widgets. Covers widget replacement workflow, skill usage, data handling, summary-chip logic, and preservation of layout/responsiveness."
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

## Skill Preference

- When the task is to replace, create, rebuild, restyle, or prototype the current chart widget in this repository, prefer using the `echarts-widget-builder` skill if it is available

## Standing Rules

### Before Making Changes
- Always inspect the current HTML, CSS, and JS before making changes
- Preserve the general widget size, spacing, padding, margins, and overall layout unless explicitly told otherwise
- Preserve the widget-shell concept and overall visual footprint
- Preserve the summary-chip / summary-card area at the bottom of the widget
- Keep the overall widget composition stable unless the prompt explicitly requires structural changes

### Data & Calculations
- Use only the provided data unless explicitly instructed to derive, calculate, transform, aggregate, normalize, or enrich it
- Do not invent fields, assumptions, categories, or unsupported calculations
- Basic direct summaries that are deterministically computed from the provided data are allowed when needed for labels, tooltips, axes, legends, or summary chips/cards
- Do not introduce inferred metrics, estimated values, or interpretive statistics unless explicitly requested
- If a requested summary chip/card would require assumptions beyond the provided data, keep it limited to directly supported information instead of fabricating support

### Summary Chips / Cards
- Intelligently redesign the summary chips/cards so they fit the currently provided data and chart
- Do not blindly reuse prior chip/card content
- Keep summary cards meaningfully tied to the current data and the purpose of the chart
- Prefer concise, high-value summaries such as totals, counts, shares, ranges, leaders, latest values, changes, or other directly supported summaries when appropriate to the chart type
- If the provided data does not support strong summaries, keep the chips/cards simple, truthful, and visually balanced

### Code Quality
- Keep the widget visually polished and production-like
- Prefer clear, maintainable ECharts configuration over overly abstract patterns
- Keep the app self-contained unless explicitly asked to introduce new files or dependencies
- When updating the widget, replace the prior chart implementation cleanly rather than layering on dead code
- Remove or refactor obsolete markup, CSS, helper functions, chart config, and stale data structures from the previous widget implementation
- Keep chart code readable enough that a future agent can easily replace it again

### Responsiveness
- Preserve responsiveness unless explicitly told to target only desktop or only mobile
- Preserve the existing layout feel across breakpoints unless the prompt explicitly requests a different desktop/mobile treatment

## Implementation Preferences

Default preference unless the prompt says otherwise:
- Use ECharts
- Keep a stable single-widget app structure
- Update HTML/CSS only as needed for the new chart
- Keep the summary-chip / summary-card section relevant to the active chart
- Keep the result easy to swap out again later

## Output Expectations

When completing a chart replacement task:
- Briefly state what changed
- Note any assumptions avoided
- Mention any data limitations that constrained labels, chips/cards, legend, axes, or tooltip behavior