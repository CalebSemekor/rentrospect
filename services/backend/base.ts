export const BASE_URL = process.env.NEXT_PUBLIC_MASTER || '';

// Set only when testing from a device that can't reach this machine's own
// localhost (e.g. a phone mocking a renter, on the same Wi-Fi) — an ngrok (or
// similar) tunnel pointed at the same backend BASE_URL is running against.
const FALLBACK_BASE_URL = process.env.NEXT_PUBLIC_MASTERv2 || '';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Drop-in replacement for `fetch` used everywhere in this folder. If `url`
// can't be reached at all (fetch() throws — a real network failure, not an
// HTTP error status), and it was pointed at BASE_URL, retries the same path
// against FALLBACK_BASE_URL instead. This only ever fires client-side: from
// this same machine BASE_URL (localhost) always resolves, but a phone on the
// network has no "localhost:4000" of its own to fail over from — the retry
// is what lets it reach the backend via the tunnel instead.
export async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (!FALLBACK_BASE_URL || !BASE_URL || !url.startsWith(BASE_URL)) throw error;

    const fallbackUrl = FALLBACK_BASE_URL + url.slice(BASE_URL.length);

    // A free-tier ngrok tunnel serves an HTML "you're about to visit..."
    // interstitial to any client it doesn't recognize as having clicked
    // through it in a real browser tab — which a plain fetch() never does.
    // Without this header every fallback call would get that HTML page back
    // instead of the API's JSON. Harmless to send to a non-ngrok host too.
    // `new Headers(...)` (rather than a plain spread) normalizes whichever
    // of the three HeadersInit shapes a caller passed in.
    const headers = new Headers(init?.headers);
    headers.set('ngrok-skip-browser-warning', 'true');

    return fetch(fallbackUrl, { ...init, headers });
  }
}

// For POST endpoints that return the {success, data, error} envelope
// directly rather than a raw resource — guards `response.json()` against a
// non-JSON error body (an HTML 404/500 page, or an ngrok interstitial that
// slipped through) crashing with a cryptic "Unexpected token '<' ... is not
// valid JSON" instead of a real, actionable error.
export async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const text = await response.text();

  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      error: response.ok
        ? 'Server returned a non-JSON response'
        : `Request failed (${response.status} ${response.statusText})`,
    };
  }
}
