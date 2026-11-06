---
name: ChickPence
description: Warm poultry records with rounded cream surfaces and clear financial data.
colors:
  bg: "#f7f7f4"
  card: "#ffffff"
  card-2: "#fafaf8"
  ink: "#2a2820"
  mut: "#7a7670"
  ln: "#e5e2d8"
  fill: "#eeebe3"
  acc: "#c98a00"
  acc-2: "#e8ad33"
  acc-soft: "rgba(201, 138, 0, 0.10)"
  bad: "#b3261e"
  ok: "#2e7d32"
  shell-cream: "#f6f4ee"
  overview-oat: "#d8d0bc"
  calendar-charcoal: "#292c2e"
  egg-sun: "#ffdf61"
  egg-peach: "#f1a886"
  egg-olive: "#383d35"
typography:
  headline:
    fontFamily: "Poppins, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
  body:
    fontFamily: "Poppins, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "14px"
    lineHeight: 1.45
  label:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "12px"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  dashboard-panel: "24px"
  calendar: "25px"
  shell: "30px"
spacing:
  compact: "8px"
  control: "12px"
  base: "16px"
  panel: "22px"
  large: "24px"
components:
  button-primary:
    backgroundColor: "{colors.acc}"
    textColor: "#1c1400"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  button-dashboard:
    backgroundColor: "#292b2c"
    textColor: "#fff8db"
    rounded: "{rounded.dashboard-panel}"
    padding: "12px 18px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-dashboard:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.dashboard-panel}"
    padding: "24px"
  input:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
---

# Design System: ChickPence

## Overview

The incumbent world is warm gold, cream, white and Poppins. The approved dashboard adaptation adds generous rounded panels, eggs and the existing chicken mascot to the fitness reference’s composition. This records the implementation; it does not establish an unconfirmed brand metaphor.

The shell and dashboard use broad tonal regions around compact operational records. Login remains governed by its preserved surface brief. Financial values and health states retain explicit labels alongside color.

**Key Characteristics:**
- Warm neutral backgrounds and gold accents.
- Rounded operational panels with poultry imagery.
- Compact Poppins labels and prominent tabular financial values.
- Small ambient and interactive movements with reduced-motion support.

## Colors

Primary gold (`acc`) supports established actions, chart lines and selection. Sunny gold (`acc-2`) is the companion accent. Dashboard eggs use sun for sales, peach for costs and olive for net profit; these are local visual roles, not universal accounting semantics.

Neutral ink, white cards, warm fill and subtle lines support the established forms and records. Shell cream and overview oat provide larger dashboard regions; calendar charcoal provides a contrasting financial calendar. Muted text is subordinate copy. Success and danger colors support operational statuses.

**The Labeled State Rule.** Keep financial signs, state labels and explanatory text alongside color.

## Typography

Poppins is the shared display and body family with system fallbacks. The frontmatter records the dashboard headline, panel title, base body and common label roles. Dashboard headlines become 22px on narrower screens. Dashboard support copy varies by context; small calendar annotations are a surface-specific density choice, not a recommended global type role.

Financial values use tabular numerals. Egg totals use responsive sizes; the month total is 27px on desktop and 28px on mobile. The preserved login brief records its distinct wordmark and field sizing.

## Layout

The dashboard shell is capped at 1640px, with a narrow sticky navigation rail and flexible content. Desktop top panels use a 1.3fr / minimum-370px split; the lower area pairs performance and growing-flock panels. Dashboard gaps are 22px, tightening at smaller widths. At 960px the main grids stack. At 820px shell and rail spacing reduce. At 600px the shell becomes a full-width page with 16px side gutters, a fixed 74px bottom navigation and reserved bottom space.

The daily calendar remains seven columns. Its detail dialog scrolls within the viewport; on mobile totals and cumulative metrics wrap into fewer columns. These compositions belong to the dashboard surface, not every app page.

## Elevation & Depth

Large dashboard regions separate primarily through background tones and rounded silhouettes. Established cards retain a subtle two-layer shadow. Eggs use inset highlights and soft contact shadows; previews and dialogs use deeper shadows to clarify their temporary layer. Mobile navigation has a light upward shadow. Exact shadow and motion values live in the sidecar.

## Shapes

Established controls and records retain the small, medium and large radius scale. Dashboard panels use larger corners, the shell is rounder still, and the main dashboard action is pill-like. Eggs use asymmetric elliptical corners rather than ordinary rounded rectangles. Do not transfer the egg silhouette to unrelated form controls.

## Components

Buttons: established primary actions are gold with dark text. The dashboard Manage batches action is charcoal with cream text; its arrow shifts diagonally on hover. Secondary actions use warm fills or transparent surfaces. Disabled established buttons use reduced opacity and a waiting cursor.

Cards: established cards have thin warm borders and subtle shadows. Dashboard containers mostly rely on white or oat fills; growing-flock cards use warm inset surfaces. Batch controls preserve individual and collective collapse behavior.

Inputs: existing fields use warm fills, thin neutral borders and the small radius. Gold focus outlines identify editing. Login’s pill fields remain a local variation.

Navigation: SVG icons and text sit in a white rounded rail; the selected dashboard shell item is charcoal with pale gold content. The same destinations move to the bottom bar on mobile.

Chips: established status pills use a neutral border and fill; Open uses gold border, text and translucent gold fill.

Profit calendar: signed day amounts and legend labels distinguish recorded profit, loss and empty dates. Hover or keyboard focus reveals a summary; activation opens a dedicated native dialog. Arrow keys move by day or week, including across month boundaries. Details include daily totals and cumulative batch performance through the chosen date. Today and Latest activity provide shortcuts.

Motion: the chicken gently rocks, decorative coop eggs bob, financial eggs lift on hover, day buttons lift or compress, the chart draws on entry and the dialog arrives with a small fade/translation. Reduced motion disables these animations and transforms; chart animation becomes zero duration.

## Do's and Don'ts

- **Do** preserve Poppins, warm neutrals and established gold actions when extending existing screens.
- **Do** keep daily recorded P&L visibly distinct from closed-batch profit.
- **Do** preserve visible keyboard focus and the reduced-motion behavior.
- **Don't** make color the sole carrier of financial or health state.
- **Don't** treat the dashboard’s small calendar annotations as the global body size.
- **Don't** replace the existing chicken image or its provenance as part of routine surface work.
