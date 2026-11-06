# Dashboard and shell surface brief

## Authorization and scope

The user approved adapting the rounded cream fitness reference to ChickPence’s existing gold, cream and Poppins world, using eggs and the existing chicken. The dashboard and shared shell redesign, daily P&L calendar, hover summaries, dedicated detail dialog, and passive plus interactive animations were explicitly requested. Daily P&L was confirmed by the user. This is an adaptation of the incumbent identity. Preserve `.impeccable/surfaces/login.md` and the generated `public/images/chicken-mascot.png` with its provenance JSON.

## Actual composition

The first viewport pairs an oat financial overview with three egg-shaped closed-batch all-time totals and a charcoal Profit calendar. A friendly greeting and Manage batches action lead the page. Below are live birds, the closed-batch profit trend and last-five averages, growing-flock cards with collapse controls, flock health warnings, and available local AI suggestions. Existing batch management, history, summary and sync destinations remain accessible through the redesigned shell.

The desktop shell has rounded cream framing, a compact white navigation rail and charcoal/pale-gold active items. Main grids stack at 960px; mobile switches to fixed bottom navigation at 600px. The calendar remains seven columns. The dialog adjusts totals and batch metrics to fewer columns and scrolls within viewport bounds.

## Financial meaning

`buildPnlLedger` sums integer centavos. Daily revenue uses active recorded sales on `sale_date`; chick cost is booked on batch `start_date`; allocated feed and other costs use the source expense `entry_date`. Deleted records are filtered. Net is revenue minus these costs. This is recorded daily P&L, not final batch profit. Month totals sum those day records. The overview and trend continue to use closed-batch metrics.

Hover/focus summaries show the date, daily net, sales, costs and up to four contributing batches, with an additional-batch count when needed. Clicking/tapping a date opens a dedicated native dialog with totals, cost categories, daily batch contributions, cumulative revenue-minus-cost performance, live birds, sold birds and mortality through that date. Relevant batches are those active on the date or posting financial activity that day. Open batch routes Closed batches to summary and other batches to management.

## Interaction and accessibility

Every date is a labeled button, including empty dates. Keyboard focus exposes the same summary as hover; arrow keys move one day horizontally or seven days vertically and cross month boundaries. Activation opens details. Previous/next month, Today and Latest activity controls support navigation. Current date has `aria-current`; the preview uses tooltip semantics and `aria-describedby` while visible. Escape hides the preview. The native modal has a labeled title, close button, backdrop close and return focus when its date trigger still exists. Touch users activate dates directly for full details.

Financial state uses signed amounts, words and color. Dashboard, rail and dialog controls have visible gold focus outlines. Mascot has alt text; decorative coop eggs and SVG icons are hidden from assistive technology.

## Motion

Chicken idle rocking runs over 6s; staggered coop eggs bob over 7s. Financial eggs lift on pointer hover, day buttons lift on hover/focus and compress on press, action arrows shift on hover, the chart enters over 700ms, and the dialog arrives over 240ms. Reduced-motion rules remove these animations/transforms and set chart animation to zero. Motion does not encode financial state.

## Evidence and boundaries

Source checked: src/style.css; src/ui/dashboardView.js; src/ui/shell.js; src/ui/pnlCalendarView.js; src/services/pnlCalendar.js; README.md. Desktop dashboard screenshot inspected at outputs/chickpence-dashboard-desktop.png in the session workspace. Implementing agent reports production build and 226 tests pass; these were not rerun by the documenter. Additional supplied captures: chickpence-dashboard-mobile.png, chickpence-pnl-detail.png and chickpence-pnl-mobile.png. Engine unavailable; no engine rerun or repair performed. Independent reviewer owns final craft verification.

The dense calendar annotations and existing textual arrow/status glyphs are implementation details, not new global design rules. No UI, tests, login brief or image assets changed during documentation.
