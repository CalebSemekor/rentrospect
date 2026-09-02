// Client-side stand-in for a "get asset by id" backend endpoint, which
// doesn't exist yet. Persists what the vendor submitted on the upload form
// so the preview page — and a later "Edit Post" round-trip back to that
// form — can show it back to them. Keyed by the assetId the backend returns
// from uploadAsset.
const STORAGE_PREFIX = 'vendorAssetDraft:';

export interface AssetDraft {
    assetId: string;
    name: string;
    tags: string;
    category: string; // CategoryId, as the <select> string value
    description: string;
    returnPolicy: string;
    rate: string;
    securityDeposit: string;
    pricingUnit: string;
    location: string;
    condition: string;
    quantity: string;
    availability: 'available' | 'paused';
    // Object URLs (URL.createObjectURL) — valid only for this browser tab's
    // current session, not persisted image data. Enough to preview right
    // after submitting; gone after a hard refresh.
    imagePreviewUrls: string[];
}

export function saveAssetDraft(draft: AssetDraft) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${STORAGE_PREFIX}${draft.assetId}`, JSON.stringify(draft));
}

export function readAssetDraft(assetId: string): AssetDraft | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${assetId}`);
    return raw ? JSON.parse(raw) : null;
}
