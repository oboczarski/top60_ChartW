---
name: echarts-widget-builder
description: Replace the current ECharts widget in this repo with a new chart widget while preserving the overall widget shell, footprint, layout, and summary-chip area.
argument-hint: Chart type, data, and requirements
---

# ECharts Widget Builder

## Purpose

Use this skill when the user wants to replace the current chart widget in this repository with a different ECharts chart and provides new data and chart requirements.

This repository is a chart-widget playground. The goal is usually to overwrite the current widget with a new one, not preserve chart history.

## When to Use

- Replacing the current chart with a new ECharts chart type
- Updating to different data while keeping the widget structure intact
- Modernizing or redesigning the summary information display
- Experimenting with new visualization approaches in a disposable environment

## Required Workflow

### 1) Inspect Current Files First

Before making changes:
- Inspect the current HTML
- Inspect the current CSS
- Inspect the current JS
- Understand the existing widget shell, overall dimensions, spacing, and summary-chip area
- Identify what should remain stable versus what should be replaced

Do not assume the old widget structure should be discarded entirely.
Do not assume the old summary chips should be reused literally.

### 2) Preserve the Shell

Unless the user explicitly says otherwise, preserve:
- The general widget size
- Padding
- Margins
- Card/shell structure
- Overall layout footprint
- The presence of a summary-chip/card section below the chart

You may refine internals as needed for the new chart, but do not unnecessarily change the overall widget composition.

### 3) Replace the Chart Implementation Cleanly

The repository is intended for disposable chart experiments.

That means:
- Replace the current chart implementation with the new requested one
- Remove obsolete series/data/helpers/config from the prior chart
- Do not leave behind stale code or duplicate widget logic
- Keep the app runnable after the replacement

### 4) Use the Provided Data Exactly

Use only the data the user provides unless they explicitly permit:
- Derived calculations
- Aggregations
- Ratios
- Percentages
- Rankings
- Bucketing
- Normalization
- Trend calculations
- Summaries beyond direct support of the data

Do not invent data fields.
Do not infer unsupported metrics as facts.

### 5) Build Smart Summary Chips/Cards

Always preserve a summary-chip/card area at the bottom of the widget.

The chip/card content should be intelligently matched to the provided data and chart type.

**Examples:**
- **Categorical distribution chart**: counts, shares, leader, total categories
- **Time series chart**: latest value, change, peak, range
- **Ranking chart**: top item, spread, median if directly supported, count of items
- **Scatter plot**: total points, x/y range, quadrant counts if explicitly allowed or directly represented
- **Stacked chart**: totals, leading segment, composition shares
- **Comparison chart**: leaders, delta, total compared groups

**Rules for summary chips:**
- They must fit the data actually provided
- They must fit the visual purpose of the chart
- They must not be filler
- They must not claim unsupported calculations
- They should be concise and visually balanced
- They should feel native to the widget design

If the data does not support strong summaries, keep the chips simple and truthful.

### 6) Keep Styling Polished

Unless told otherwise:
- Keep the result dark-mode friendly if the current widget is dark-mode styled
- Preserve the premium widget feel
- Keep spacing tidy
- Keep labels legible
- Keep tooltips clean
- Avoid clutter
- Avoid overbuilding

### 7) Respect Prompt-Specific Requirements

The user may specify:
- Chart type
- Colors
- Tooltip behavior
- Labels
- Axes
- Legend behavior
- Desktop/mobile differences
- Reference styling or behaviors

Follow those requirements exactly unless they conflict with the data or app structure.
If something cannot be implemented from the provided data, say so directly and avoid fabricating.

## Editing Guidance

### HTML
Only change the HTML shell when needed for the new chart behavior or layout.
Preserve the overall widget structure unless explicitly told otherwise.

### CSS
Preserve general footprint and layout feel.
Refactor or replace widget-specific styling as needed.
Remove stale CSS that no longer applies.

### JS
Replace old chart config, data mapping, summary-chip logic, tooltip logic, and helpers as needed.
Keep the new implementation self-contained and readable.

## Preferred Outcome

After the change:
- One clean active widget implementation
- One clean active data model for that chart
- One chart that matches the prompt
- One summary-chip section that fits the data
- No stale code from prior charts
