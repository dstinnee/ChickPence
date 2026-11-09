# ChickCount frontend contract

This describes the current frontend in `src/services/chickCount.js` and `src/ui/chickCountView.js`. The user has not supplied the actual hosted endpoint URL or provider documentation. It is an integration contract to reconcile with that service, not a claim that a provider is deployed or compatible.

Set `VITE_CHICKCOUNT_API_URL` to the supplied endpoint when available. Without it, upload and local preview work, but Count image displays the unconnected-service message. Other existing local AI features retain their own configuration and behavior.

## Request

The frontend validates a nonempty JPEG, PNG or WebP file no larger than 10 MiB (10 × 1024 × 1024 bytes). Only pressing Count image sends it: HTTP POST to the configured URL, multipart FormData with an `image` file field, no explicit Content-Type header and `credentials: omit`. No authentication header is currently added. The hosted service must support the app origin through CORS when used across origins; its actual authentication and deployment requirements remain to be confirmed.

The UI aborts after 60 seconds, when the panel closes, when another image is selected, or when the view is replaced. HTTP 429 receives a busy message; other non-success responses receive a generic processing error. Stale responses do not replace the current image's result.

## JSON response

```json
{
  "status": "counted",
  "counts": { "chickens": 5, "pullets": 2, "chicks": 8, "eggs": 6 },
  "explanation": "Visible poultry and eggs counted from the image.",
  "otherEntities": ["feeder"]
}
```

`status` must be `counted`, `not_poultry` or `undetermined`. A counted result requires all four counts to be safe integers between 0 and 1,000,000 inclusive, with at least one positive count. An all-zero counted result is rejected as unconfirmed. For not-poultry or undetermined outcomes, counts are normalized to null and the UI shows an explanation without a counts grid.

`explanation` is converted to a string and limited to 700 characters. `otherEntities` is optional; only string entries are kept, up to eight entries of at most 80 characters each. The frontend escapes displayed response text. This shape does not require a particular model, counting algorithm, confidence field or vendor.

## User-facing boundaries

The panel labels output as an AI estimate for review, and never writes counts into flock records. A non-poultry image and an image whose count cannot be determined have distinct outcomes. Preview uses a local object URL; choosing or dropping a photo alone does not send it. Live counting remains pending the actual hosted service and verification against its documentation.
