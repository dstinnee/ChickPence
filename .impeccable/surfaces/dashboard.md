# Dashboard and shell surface brief

## Authorization and authority

The supplied nine-section Markdown brief and HTML boards establish the new cream-and-gold world. The user confirmed a header with four links on Staff phones, centered striped Login and device-only previews that preserve existing saving, synchronization and calculations. This supersedes the earlier fitness/egg composition. Shared visual tokens live in DESIGN.md; PRODUCT.md remains the durable product truth.

## Actual composition

The latest user-supplied Home screenshot is the composition authority: maximize useful width and keep Home compact. A date sits above the greeting. The top row pairs horizontal supplied SVG art and copy with compact to-do rows; Staff retain the same companion sizing CSS and their task tracker. Companion KPIs show live birds and task completion, plus this month's recorded P&L for Owner/Admin. Home primary actions are charcoal; other pages keep gold.

Today's Questions follows as four article cards with real See answer buttons, checked states and progress dots. Flock health sits beside the cream Profit calendar in the lower row for Owner/Admin. Performance uses the full-width row below with five KPIs: all-time closed-batch net/sales/costs and last-five averages, followed by batch profit bars. Staff do not receive the default financial calendar/Performance content. Compact large KPI values show two decimals for millions and one for thousands, with full peso tooltips; formulas remain unchanged.

Desktop top/lower grids use a 1.35fr/1fr split, 22px gaps and compact 26px-corner panels. Art is capped at 240px; the 1280px capture has approximately 945px content width and 207px art, with the top region about 445px tall versus the former 806px. At 1100px and below top/lower grids stack; tablet Questions has two columns. At 719px and below all sections stack, the companion art caps at 220px, and Questions explicitly uses row flow with one column. Implementer browser checks found no overflow at 390px or 320px, including eight expanded questions. The calendar remains seven columns; five desktop Performance KPIs become two phone columns with the final KPI spanning both.

The shell uses the supplied SVG logo, faint footprints, a sticky rounded sidebar and top bar with breadcrumb, role preview, notifications, sync and profile. The sidebar becomes a drawer at 950px and below. Staff phones show Home, Batches, Logbook and Settings directly below the header at 719px and below. Owner/Admin have nine main destinations: Home, Batches, Sales & Buyers, Costs, Logbook, Team, Reports, User Management and Settings. Optional preview permissions can affect content; navigation does not establish server authorization. No mobile bottom tab bar is implemented.

## Companion and state

The selected eligible batch, or newest started eligible batch, supplies age and stage labels: Baby chick before the first third of the configured harvest target, Growing pullet before target and Ready for harvest at/after target. The supplied mood SVG changes expression; it does not render separate stage sprite columns. The old raster sheets and their provenance remain assets, but are not the current Home art.

Mood priority is alerted for mortality limit/spike or at least three urgent alerts; annoyed for overdue tasks; sad for negative recorded monthly P&L for non-Staff; happy for a nonempty completed daily task list; otherwise sleepy. A mortality spike means above the configured daily death limit, or at least three deaths and more than twice the preceding seven-day average. Staff do not receive the money-based sad state. Visible explanations and Why this mood? disclose the record basis. These are summaries, not diagnoses or forecasts.

Art uses `public/images/chickens/chicken-{happy,alerted,annoyed,sad,sleepy,hello}.svg`; the shell uses `logo-mark.svg`. Tap greeting briefly changes copy and runs a short CSS bounce. The stylesheet's reduced-motion rule disables CSS animation/transitions and welcome smooth scroll. Supplied SVG assets contain internal reduced-motion media overrides too; runtime preference behavior was not independently tested.

## Financial meaning and interaction

The unchanged ledger sums integer centavos: active sales on sale_date, chick cost on batch start_date, allocated feed/other cost on source expense entry_date. Voided entries are excluded. Daily/monthly recorded P&L is distinct from final closed-batch profit. Performance uses existing closed-batch calculations.

Hover/focus previews show date totals and contributing batches. Activating a date opens the retained native detail dialog with daily totals, cost categories, batch contributions and cumulative performance through that day, including birds sold, live birds and mortality. Batch links open management or closed-batch summary as appropriate. Labeled date buttons, arrow-day/week movement, cross-month navigation, Today, Latest activity, Escape, modal dismissal and focus return remain the existing interactions. Signs and labels accompany calendar colors.

## ChickCount

The feather remains available throughout signed-in routes. On Concerns it sits in normal flow after thread/status controls so Add reply stays clear; on other pages its fixed placement avoids visible controls while scrolling. Upload/drag-drop accepts JPG, PNG and WebP up to 10 MiB, previews locally and sends only on Count image when an endpoint is configured. Results support chicken/pullet/chick/egg categories, not-poultry and undetermined states, plus error/review guidance. Estimates never update flock records. Closing aborts a request and returns focus; Escape closes. Phone panels stay viewport bounded.

Only the launcher appearance changes in this redesign. The actual hosted endpoint and provider documentation are still pending; local preview and the frontend contract are implemented, and live counting is not claimed. Existing optional local AI remains separate. See `docs/chickcount-api.md`.

## Evidence and boundaries

Source authority is `src/redesign.css` together with the current UI components; older `src/style.css` rules are overridden where the redesign applies. The independent scoped finish review in `.impeccable/review/finish-review.md` returned SHIP for five fixes: Users wrapping/actions, age wording/bar semantics, Home questions/Performance, Team completion/missed counts, and Settings logo/default mortality previews. It was a screenshot/source review, not independent execution of save, approval, export, sync, keyboard or calculation workflows. Captures are `.impeccable/review/{desktop,mobile}.png` and `../outputs/redesign-*.png`.

Final implementing-agent verification after the compact Home/Concerns follow-up: 297 tests across 22 files pass, the production build passes, and the whitespace check passes. The documenter did not rerun those checks. Detector engine 0.1.5 was unavailable; no detector result is claimed. No dependencies were added. The user authorized publishing after local review. Device-only previews are not server-enforced account administration. See `docs/redesign-implementation.md` for the full connected/preview boundary table. This documentation pass changes no source, tests, assets, PRODUCT.md or git state.

The parent reports a fresh SHIP review for compact Home and Concern helper, with no material fixes or recapture requested. Fresh screenshots are `../outputs/compact-home-{desktop,mobile}.png` and `../outputs/concerns-{desktop,mobile}.png`. This visual/source disposition is separate from final automated validation.
