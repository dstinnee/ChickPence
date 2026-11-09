# Login and welcome surface brief

## Authorization and composition

The user explicitly retained the centered Login card and painted vertical-stripe background from the supplied references. The final cream-and-gold palette, locally hosted Poppins and supplied SVG chicken replace the former mustard/sprite treatment. These layouts are local to Login and welcome, while signed-in pages use footprints.

Login presents the wordmark, “Log in to your flock.”, a hello chicken with greeting bubble, username/email and password fields, reveal control, Log in action and a brief product footer. Instant Demo Mode appears only in development or when VITE_DEMO_MODE is true. The previous Supabase configuration action is not rendered in the current Login markup, although its listener code remains; do not document it as a visible action.

## Appearance

The wallpaper is `public/images/companions/login-wallpaper.webp`, cover/center over pale cream. The off-white card uses a warm border, 28px corners and localized warm shadow. Desktop inherits a 410px maximum and 34px/36px/26px padding; at 719px and below it uses a 420px maximum with 28px/24px padding, subject to the viewport. The wordmark retains its 33px/700 local type role. The supplied hello SVG is 240px on desktop and 200px on phones. Warm inset pill fields retain 48px minimum containers, icon labels and the reveal control; primary action uses the new gold and dark text. Shared dark-gold outlines identify focus.

## Authentication and feedback

AuthService login remains the credential handler. Username is required; password is required when Supabase is configured. Password reveal updates input type, accessible label, pressed state and eye icon. Focusing password swaps the image to `chicken-sleepy.svg` with “I’m not peeking!”; blur restores hello and “Hi there!”. This is a friendly privacy cue, not a security mechanism.

Conditional Demo uses loginDemo. Pending authentication disables available primary/demo actions, updates their label and marks the form busy. Failures use role=alert and restore controls. Fields retain accessible labels and autocomplete. Existing saving and sync behavior are unchanged.

## Welcome

The personalized post-login welcome repeats the striped canvas and off-white card, greeting by available full name/name/email-derived name, with “there” as fallback. Chips show alert/task/question counts; the hello chicken is a button with a short greeting response. The entry button or scrolling leads into the signed-in dashboard, with focus transferred on activation. Navigation clears the welcome state.

The character is 240px; the card uses 28px corners and phone padding tightens to 28px/20px. Reduced motion keeps welcome opaque and uses immediate scroll, and disables CSS greeting/arrow animation. Supplied SVGs contain their own reduced-motion media overrides; runtime preference behavior was not independently tested.

## Assets

The new SVG art was supplied by the user and copied unchanged; Poppins Latin WOFF2 came from the supplied HTML bundle with `public/fonts/OFL.txt`. Existing raster wallpaper and prior companion provenance remain in `public/images/companions/provenance.json`; they do not establish provenance for the separately supplied SVGs. Original mascot assets remain untouched.

## Evidence and boundaries

Source authority is `src/redesign.css` together with the current UI components; older `src/style.css` rules are overridden where the redesign applies. The independent scoped finish review in `.impeccable/review/finish-review.md` returned SHIP for five fixes: Users wrapping/actions, age wording/bar semantics, Home questions/Performance, Team completion/missed counts, and Settings logo/default mortality previews. It was a screenshot/source review, not independent execution of save, approval, export, sync, keyboard or calculation workflows. Captures are `.impeccable/review/{desktop,mobile}.png` and `../outputs/redesign-*.png`.

The implementing agent previously reported 289 passing tests across 21 files, a passing production build and diff check. Those results predate the compact Home/Concerns follow-up; final validation is reported separately by the implementing agent. The documenter did not rerun those checks. Detector engine 0.1.5 was unavailable; no detector result is claimed. No dependencies or push were added. Device-only previews are not server-enforced account administration. See `docs/redesign-implementation.md` for the full connected/preview boundary table. This documentation pass changes no source, tests, assets, PRODUCT.md or git state.
