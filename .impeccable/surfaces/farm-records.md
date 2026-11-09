# Farm records surface brief

## Authorization and identity

The supplied nine-section brief and HTML boards now govern Logbook, Reports and Team > Approvals. They share the final cream/off-white/gold Poppins world, faint footprints and rounded surfaces in DESIGN.md. Prior underline tabs and horizontally scrolling phone record tables are superseded. PRODUCT.md's record/calculation truth is preserved.

## Shared composition and responsive behavior

Pages use titles, outlined pill tabs with pale-gold active fill, labeled filters, off-white record surfaces and pagination. Cards use warm borders and broad 24px corners; data headings use muted sentence case, and values retain tabular numerals. Gold links, text-labeled status chips and visible focus support review.

At 719px and below, filters are collapsed behind Filters; record tables become stacked 20px-corner cards with data-label names beside values. Table headers disappear and rows preserve field labels. Pagination centers in a column. Empty states keep factual copy. The Team seven-day board is the compact-table exception. Desktop tables keep their tabular structure; User Management has explicit column widths to preserve role/status words and fit 44px action targets.

Filters reject reversed dates. The existing shared record pagination offers previous/next, visible ranges and page sizes; CSV covers the filtered result and preserves existing quoting/formula protection. Report-specific charts and date presets are documented in the operations brief. Filter behavior varies by surface: report filters are live; existing log/request filter forms retain explicit Filter/Clear actions.

## Logbook

Farm entries combine active saved feed, mortality, sales and shared expenses. Source-record rows retain record dates, batch references, type, entry and available attribution/status, with correction actions. This view is read-only: the action opens the Correction requests form with the chosen source entry. Missing authors are labeled Not recorded rather than invented.

The read-only source-record views retain Farm entries, Sync queue and Record activity where routed. Logbook navigation now exposes Daily entry, Waiting to upload, All entries (My entries for Staff), and Correction requests. Daily entry uses existing saves and a separately stored device-only submit lock. Sync queue reads the actual `db.outbox`, including waiting uploads and recorded upload errors; successful uploads leave the queue. It is not permanent sync history. Record activity shows each record's latest saved value and change timestamp; previous versions and before/after changes are not stored. Staff receive assigned operational content without default money access; optional permissions are device previews.

Search covers batch, record, entry text and buyer; filters include batch or farm expenses, type and inclusive record-date bounds. Filter applies the form, Clear resets it, and CSV follows the selected section and applied filters.

## Reports

The four report sections share batch-name search, Open/Closed status and date filters, plus the existing Detailed export entry point. Rows link a batch to its applicable management or summary view.

- **Flock balance:** initial chicks minus recorded deaths and sold birds through the inclusive To date (today by default). It is a record balance, not physical stock. The From date narrows eligible batches; it does not reset cumulative bird balance.
- **Feed & mortality:** feed kilograms and deaths in the chosen period, with mortality percentage and configured threshold checks cumulative through To. A missing threshold remains explicit.
- **Sales & buyers:** actual active saved sales within the date range, grouped by buyer and batch, with sale count, heads, weight, weighted sales-per-kilogram and recorded sales total. Missing buyers are labeled; payment status and outstanding balances are not tracked.
- **Recorded P&L:** revenue and costs from the integer-centavo daily ledger, filtered by recorded sale, chick-purchase and expense dates. Open batches are provisional. A date-filtered result is not final whole-batch profit even when the batch is closed.

These reports do not create feed stock, unpaid buyer balances or unrecorded activity. Their footnotes keep the calculation basis visible.

## Correction requests and Approvals

The correction form selects a saved entry and requires proposed correction text and a reason. A request stores the source display value at submission, batch/record/type/date, proposal, reason, requester and request time. Details show that source snapshot alongside the proposal and reason; the snapshot is not a live version history.

Approvals and Correction requests offer Waiting for review and Recently reviewed sections, search/type/date filters, reviewed-decision filtering, CSV export, pagination and expandable request details. Correction requests shows the current user's own requests. The review form requires a note, permits approve/reject only for Owner/Admin, and rejects self-review even if the same account changes its preview role. Already-reviewed requests cannot be decided again.

Requests and decisions live in `db.app_state` under `review-requests:<account id>` on this device. Review records include reviewer, review timestamp and note. This is an account-local device preview, not a shared farm inbox. Shared membership, server review storage and server enforcement remain pending and are stated in the UI.

Approval never writes the proposed correction into a farm source record. The displayed approved status is **Approved · update pending**; a correction must be applied separately in Batches. Keeping the decision and source record separate is current behavior, not a promise of an automated followup workflow.

## Evidence and boundaries

Source authority is `src/redesign.css` together with the current UI components; older `src/style.css` rules are overridden where the redesign applies. The independent scoped finish review in `.impeccable/review/finish-review.md` returned SHIP for five fixes: Users wrapping/actions, age wording/bar semantics, Home questions/Performance, Team completion/missed counts, and Settings logo/default mortality previews. It was a screenshot/source review, not independent execution of save, approval, export, sync, keyboard or calculation workflows. Captures are `.impeccable/review/{desktop,mobile}.png` and `../outputs/redesign-*.png`.

The implementing agent previously reported 289 passing tests across 21 files, a passing production build and diff check. Those results predate the compact Home/Concerns follow-up; final validation is reported separately by the implementing agent. The documenter did not rerun those checks. Detector engine 0.1.5 was unavailable; no detector result is claimed. No dependencies or push were added. Device-only previews are not server-enforced account administration. See `docs/redesign-implementation.md` for the full connected/preview boundary table. This documentation pass changes no source, tests, assets, PRODUCT.md or git state.
