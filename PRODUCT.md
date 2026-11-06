# ChickPence

ChickPence is an offline-first web app for broiler farms, developed as a BS Computer Science thesis at Pamantasan ng Lungsod ng Maynila. Its central record is a batch: farmers track chick counts and costs, feed, mortality, expenses and sales, then review cost and profitability.

Multiple batches can remain open together. Farm expenses are entered once and allocated by head count among batches alive on the expense date. Closed batches are read-only. Dashboard and batch summaries expose operational and financial results; history and exports support review. Reports export to Excel, PDF and CSV. File imports and locally scanned logbooks produce drafts for review before saving.

Data is stored in the browser using IndexedDB. Optional Supabase enables accounts and synchronization; without it, Demo Mode supplies eight sample batches. Optional Ollama supports logbook scanning and suggestions. Browser-based Whisper supports Filipino, Taglish and English voice entry after its initial model download. These capabilities depend on their configured services or downloaded models; they are not promises of always-available AI.

The dashboard also presents recorded daily P&L: sales minus chick purchases and allocated expenses on their relevant dates. It complements the existing closed-batch profitability view rather than changing that calculation.

Sources: README.md Features, optional setup and offline behavior; src/services/pnlCalendar.js and src/ui/dashboardView.js for the implemented daily calendar addition. This document records current product scope and makes no new roadmap or audience claims.

The confirmed calendar basis is daily recorded P&L, calculated in integer centavos: sales are booked on sale_date, chick purchases on the batch start_date, and allocated feed/other costs on the source expense's entry_date. Voided records are excluded. A day's figure is not the completed batch's final profit.

Hovering or focusing a date previews its totals and batch contributions. Clicking or tapping opens a dedicated date dialog with daily sales/costs/P&L, chick/feed/other costs, and cumulative batch performance through that date (P&L, live birds, sold birds and mortality). Batch links open the corresponding open-batch editor or closed-batch summary. Month arrows, Today and Latest activity support navigation; keyboard arrows move dates, Enter opens details and Escape dismisses them. The dashboard includes decorative passive and interactive motion with reduced-motion support.
