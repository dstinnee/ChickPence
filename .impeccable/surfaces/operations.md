# Nine-section operations surface brief

## Scope and visual authority

This records the supplied nine-section Markdown brief and HTML bundle as implemented in the existing app. The user confirmed device-only previews while keeping existing saving, synchronization, allocation, exports and calculations. Global tokens and responsive rules are in DESIGN.md; Home/shell, Login/welcome and source records have their own briefs. No new design or product roadmap is established here.

## Section patterns

- **Batches:** choose an open batch, review record-based health/age/limits, and open shared entry drawers for existing feed/deaths/sales. Closed history and two-to-four batch comparison retain recorded totals. Green age means within target; red means past target. The close checklist is informational; the existing close confirmation/rules remain. Detailed tracing/version history is unavailable.
- **Sales & Buyers:** record a sale in the shared drawer; retain calculated totals and the existing price check. Searchable sales history uses current recorded costs and labels its price results provisional. Buyer directory and payment balances are Coming soon.
- **Costs:** daily expenses, category/date filters and allocation bars/totals share off-white panels. Recurring schedules save UI preview state only and never post expenses. Idle-cost amounts are unavailable. Backdated closed-batch warnings do not create approval requests.
- **Logbook:** daily task entry uses existing handlers, zero-death/no-receipt shortcuts, all/own entries and the real waiting-upload queue. Submit locks only this device's daily-entry screen. Preview attribution is separate; records with no known author are not assigned to the current Staff user.
- **Team:** assigned people and task-derived seven-day board expose completed and missed counts. Dated task actions open the shared entry drawer. Approvals retain the local review queue. Concerns now uses the supplied Team Concerns reference and the implemented local board described below. Activity history is unavailable; Payroll remains Coming soon.
- **Reports:** existing report calculations feed charts, live filters, date presets, detailed export and print styles. The profit-breakdown waterfall is explicitly illustrative, not a generated financial attribution.
- **User Management:** counters, filters, user drawers, role/assignment/optional permission controls and bulk actions edit account-keyed device preview users. Owner/Admin protections remain explicit; Owner has no row actions. No credentials, password resets or actual sign-in access changes are created.
- **Settings:** existing farm settings remain connected; profile and logo previews use local UI state. Logo/default-mortality preview controls reflect device state. Role-appropriate sections and Owner-only cloud/sync access remain UI controls. Profile edits do not change login credentials. Non-English languages, password/PIN changes and restore are unavailable or Coming soon.

## Concerns

The newly supplied `6b Team Concerns-html.zip` (extracted reference: `../work/concerns-reference/Concerns.dc.html`) supersedes the former Coming soon page. The board presents Open, In progress and Solved counts, status filters, concern cards and a thread with replies. Owner/Admin can change status. Staff access their own concerns through Logbook > My concerns while retaining four main navigation sections.

The create drawer collects category, batch or shared farm, Normal/Urgent choice, description and an optional JPG/PNG/WebP photo of at most 1 MB. Concern descriptions/replies are capped at 1,500 characters. Cards and threads use warm rounded surfaces and labeled status. Desktop list/detail columns collapse at 1050px; phone reply controls stack. The helper is in normal flow after thread/status controls, preserving Add reply.

This is an account-namespaced device-only UI preview: concerns, replies, photos and status changes do not enter Repository, synchronization or network requests. Labels explicitly say saved locally/not sent. Sample cases appear only in Demo with Sample data labeling; real accounts start empty. The implementing agent tested create/reply/solve and reload persistence on a separate 127.0.0.1 Demo origin; localhost sample data stayed clean. No shared server inbox or remote message delivery is claimed.

## Shared interaction and boundaries

Entry uses a 520px maximum right-hand native dialog/drawer with 28px left corners; phones use a viewport-bounded bottom sheet with 24px top corners and safe-area padding. Primary actions are gold pills and records become labeled stacked phone cards, except for the seven-day Team board. Dialogs retain existing handlers; the visual redesign does not replace calculation or persistence engines.

New concern/profile/logo/user permission/day-lock/recurring state is local UI preview state, separate from source records and synchronization. Existing approval records only the decision; an approved correction remains Approved · update pending until applied separately in Batches. Shared server membership/review/authorization is not implemented by these previews. ChickCount has no supplied live endpoint. Do not infer missing stock, payment balances, historical revisions or audit services from decorative charts or preview controls.

## Evidence and boundaries

Source authority is `src/redesign.css` together with the current UI components; older `src/style.css` rules are overridden where the redesign applies. The independent scoped finish review in `.impeccable/review/finish-review.md` returned SHIP for five fixes: Users wrapping/actions, age wording/bar semantics, Home questions/Performance, Team completion/missed counts, and Settings logo/default mortality previews. It was a screenshot/source review, not independent execution of save, approval, export, sync, keyboard or calculation workflows. Captures are `.impeccable/review/{desktop,mobile}.png` and `../outputs/redesign-*.png`.

The implementing agent previously reported 289 passing tests across 21 files, a passing production build and diff check. Those results predate the compact Home/Concerns follow-up; final validation is reported separately by the implementing agent. The documenter did not rerun those checks. Detector engine 0.1.5 was unavailable; no detector result is claimed. No dependencies or push were added. Device-only previews are not server-enforced account administration. See `docs/redesign-implementation.md` for the full connected/preview boundary table. This documentation pass changes no source, tests, assets, PRODUCT.md or git state.

The parent reports a fresh SHIP review for compact Home and Concern helper, with no material fixes or recapture requested. Fresh screenshots are `../outputs/compact-home-{desktop,mobile}.png` and `../outputs/concerns-{desktop,mobile}.png`. This visual/source disposition is separate from final automated validation.
