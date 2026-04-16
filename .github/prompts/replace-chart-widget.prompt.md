---
description: "Replace the current ECharts widget in this repo with a new one. Use when swapping chart types, updating data, or redesigning the visualization."
agent: "agent"
argument-hint: "Chart type, data, and requirements"
---
# TASK

Replace the current ECharts widget in this repo with a new one.

## Chart
- chart type: [insert chart type]
- chart goal / what it should communicate: [insert purpose]

## Data
[paste data here]

## Requirements
- colors: [insert]
- tooltip behavior: [insert if needed]
- labels / data labels: [insert]
- axes: [insert]
- legend: [insert]
- interactions: [insert if needed]
- desktop/mobile behavior: [insert if needed]
- reference behavior or styling: [insert if needed]

## Standing rules
- inspect the current repo files first before making changes
- preserve the general widget size, padding, margins, and layout
- preserve the summary-chip / summary-card area at the bottom of the widget
- intelligently redesign the summary chips/cards so they fit the provided data and chart
- do not preserve the previous chart implementation
- keep the app runnable
- keep the widget self-contained
- use only the provided data unless I explicitly allow derived calculations
- remove stale code from the previous chart implementation