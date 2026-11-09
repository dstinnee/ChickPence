# Nine-section redesign — local review

Applied to the existing `ChickPence-dstinnee` working copy on 2026-11-09. Prepared locally and reviewed before the user authorized publishing this change set to dstinnee/ChickPence on 2026-11-09.

## Approved direction

The supplied nine-section Markdown brief governs the bundled HTML design boards. The user resolved the conflicting instructions as follows:

- Staff phones use a website header and four links underneath; no bottom tab bar.
- Login keeps its centered card and striped background.
- New submission and automatic approval workflows are device-only previews. Existing saving, syncing, calculations and correction application remain intact.

The cream/gold palette, faint footprint background, Poppins and supplied animated SVG chickens are applied throughout the existing app. The supplied SVG files are copied unchanged from `Desktop/uni/chickpence-chicken/svg`. Poppins Latin WOFF2 files were extracted from the supplied HTML bundle; its font license is preserved in `public/fonts/OFL.txt`. Existing raster wallpaper provenance remains in `public/images/companions/provenance.json`.

## Sections

| Section | Connected behavior | Preview or unavailable behavior |
| --- | --- | --- |
| Home | Compact horizontal companion beside Todo, date above greeting, real See answer buttons and checked dots, health beside calendar, full-width five-KPI Performance, existing record calculations and entry drawers | Staff assignments and optional access use local preview users. No server-enforced roles introduced. |
| Batches | Select one open batch, existing feed/deaths/sales, shared entry drawer, mortality thresholds, existing close confirmation, closed-batch history, 2–4-batch comparison | Close checklist is informational; it does not alter closing rules. Detailed cost tracing and change history remain unavailable. |
| Sales & Buyers | Existing sale form in drawer, live total and price check, latest sales, searchable history, existing exports | History price results use current recorded costs; they are explicitly provisional, not historical realized margins. Buyer directory/payment balances remain Coming soon. |
| Costs | Standalone section, existing daily expenses and allocation preview, date/category filtering, allocation totals and bars | Recurring schedules save only UI preview state and never post expenses. Idle-cost amount is unavailable. Backdated closed-batch warning does not create an automatic approval request. |
| Logbook | Daily task entry, existing save handlers, zero-death/no-receipt shortcuts, all/own entries, real waiting-upload queue, correction requests | Submit locks only the daily-entry screen on this device. Preview attribution is stored separately; older records without authors are not claimed as the current staff member's records. |
| Team | Assigned staff names, existing task-derived seven-day board, dated entry drawers, existing local review queue and decisions | Concerns now has local creation/replies/statuses from the newly supplied Team Concerns reference; Staff see My concerns under Logbook. Shared Activity history remains unavailable; Payroll is Coming soon. Approval does not automatically change source records. |
| Reports | Existing report data/calculations, charts, live filters and date presets, existing detailed export dialog, print styling | Profit breakdown is a clearly labelled illustrative waterfall, not generated financial attribution. |
| User Management | Local user counters/filters, drawers, roles, assignments, optional permissions, protected Owner/Admin actions, bulk device-preview actions | Does not create credentials, change actual sign-in access or reset passwords. |
| Settings | Existing farm settings storage; local profile/logo/default-mortality preview; role-appropriate sections; Owner-only cloud/sync access | Profile edits do not change login credentials. Non-English languages, password/PIN changes and restore remain unavailable/Coming soon. |

## Preserved boundaries

- No changes to Repository, allocation engine, report calculation service, P&L ledger or sync engine were needed for this redesign.
- Existing calculation functions and money formatting remain the source of financial numbers.
- The calendar day-details popup implementation and export contents are retained.
- ChickCount retains its existing hosted image-upload/count request behavior. Only its feather launcher styling changes. A live endpoint URL/contract still needs to be supplied before external counting can be verified.
- UI-only preview state, including concerns/photos/replies/status changes, is namespaced by signed-in account, separate from farm records and sync. Concerns explicitly says saved locally/not sent; no Repository or network write occurs. Demo-only sample concerns are labeled Sample data; real accounts start empty.
- Existing uncommitted work was kept. No dependencies added.

## Review evidence

Final verification after the compact Home and Concerns work: 297 tests pass across 22 files, the production build passes, and git diff --check passes. These results were not independently rerun by the documenter. Browser checks cover all nine Owner sections, staff assignment filtering/no default money, the shared drawer, report charts, stacked phone records, Login password-focus art and the first-sign-in Welcome. Screenshots are in `../outputs/redesign-*.png`. The scoped Impeccable finish review in `.impeccable/review/finish-review.md` returned SHIP for the five reviewed fixes. It was a screenshot/source review, not independent execution of save, approval, export, sync, keyboard or calculation workflows. Final review captures also live in `.impeccable/review/{desktop,mobile}.png`.

The Impeccable detector launcher was attempted but its engine 0.1.5 is unavailable in this environment; the finish review uses browser captures and source inspection.

## Compact Home and Concerns follow-up

The latest supplied Home screenshot supersedes the earlier tall Home composition. Home uses charcoal primary actions locally; other pages retain gold. Top/lower rows stack at 1100px, and phone Questions explicitly flows in rows at 719px and below. Large KPIs retain full peso tooltips, with two-decimal millions and one-decimal thousands; formulas are unchanged. The implementing agent checked no overflow at 390px and 320px with eight questions expanded.

The newly supplied Team Concerns HTML reference replaces its Coming soon page with a device-only concern board, create drawer, optional photo up to 1 MB, replies and Owner/Admin status controls. Staff access only their own concerns through Logbook. The implementing agent tested create/reply/solve plus reload persistence on a separate 127.0.0.1 Demo origin. The helper follows the thread/status controls in normal flow; other pages retain a fixed helper that avoids visible controls while scrolling. Hosted ChickCount behavior is unchanged.

Fresh captures are `../outputs/compact-home-{desktop,mobile}.png` and `../outputs/concerns-{desktop,mobile}.png`. The parent reports a fresh independent SHIP review for compact Home and Concern helper, with no material fixes or recapture requested. This remains a visual/source review. Final follow-up verification completed successfully: 297 tests across 22 files, production build and whitespace checks all pass. An isolated 127.0.0.1 demo also verified creating a concern, adding a reply, solving it and retaining those changes after reload. Supplied SVGs include internal reduced-motion media overrides; runtime preference behavior was not independently tested. No dependencies or backend changes were added. The user authorized publishing after local review.
