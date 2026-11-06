# Login surface brief

Mode: Operate. Scope: login only (`src/ui/loginView.js`, login rules in `src/style.css`, and `public/images/chicken-mascot.png`). This records shipped behavior, not a new global identity.

## Intent and composition

The user requested the reference’s white rounded login card, with a chicken replacing the bear and ChickPence’s color theme preserved. First viewport: wordmark and “Log in to your flock.”; waving chicken and “Hi there!”; credentials and Log in; Instant Demo Mode; Supabase connection; prototype/PWA context.

## Incumbent world comparison

Existing Poppins, mustard `--acc: #c98a00`, sunny `--acc-2: #e8ad33`, charcoal `--ink: #2a2820`, white `--card`, and warm neutral fills remain the visual authority. The cream login canvas, larger card corners, pill controls, and chicken express that world locally. No PRODUCT.md, DESIGN.md, global sidecar, or global identity rules were introduced.

## Actual appearance

Inherited Poppins/system stack and body 14px/1.45. Wordmark 33px/700, line-height 1.2, tracking -0.035em; subtitle 15px; fields/actions 13px; supporting copy 10–11px. Centered column with minimum 100svh, padding 48px 20px 28px, cream background #f5f1e8. White card max-width 410px, radius 30px, padding 34px 36px 26px, shadow `0 18px 38px -18px rgb(69 51 17 / 30%), 0 5px 14px rgb(69 51 17 / 5%)`. Transparent mascot renders 200×200px inside a 220px scene.

Fields: #f3f1ed fill, pill radius, minimum height 48px; form gap 12px. Primary button: incumbent mustard, #241b06 text, hover #d79911. Demo: #fff9eb fill, #e7d6ad border, hover #fff0cc. Field focus: #a77300 border/#fffdf8 fill; button focus: 2px #946400 outline offset 3px. Actions minimum height 47px; password reveal 40×40px; cloud action minimum height 44px.

At ≤480px: wrapper padding 24px 18px, card padding 30px 25px 23px/radius 26px, wordmark 31px, inputs 16px. Button and field state transitions use 160ms; reduced motion removes these transitions.

## Behavior and accessibility

Credential form retains AuthService login; username required, password required when cloud is configured. Password reveal updates input type, accessible label, pressed state, and eye icon. Demo calls loginDemo without credentials. Cloud action opens existing Supabase configuration and refreshes login after configuration. Pending authentication disables submit/demo/cloud, updates the active label, and sets aria-busy; failures display a role=alert and restore controls. Fields retain screen-reader labels and autocomplete. Decorative SVGs/greeting are hidden from assistive technology; chicken has descriptive alt text.

## Provenance and verification

Original transparent generated chicken; exact prompt and source recorded in `public/images/chicken-mascot.provenance.json`. Implementing agent reports production build and 222 tests passed; browser verified reveal, demo login/logout, cloud dialog, and no overflow at 1440×900, 390×844, and 826×866. Evidence: `.impeccable/review/desktop.png`, `mobile.png`, `user-826.png`. Independent finish reviewer returned ship with no material fixes. These are session results, not new checks by the documenter.

## Boundaries

Keep the requested white card, chicken, and incumbent warm palette together on this surface. Local composition and measurements are not application-wide rules. No defects or pre-existing drift were canonized or repaired; global documentation is outside scope.
