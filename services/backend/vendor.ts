import type { VendorProfile, CatalogAsset, VendorLogistics, ReviewableAsset, AssetReview, ReviewReply } from '@/types/profile';
import { BASE_URL, apiFetch, type ApiResponse } from './base';

// Vendor Transaction History
export interface VendorTransaction {
  profilePic: string;
  name: string;
  startDate: string; // ISO timestamp — JSON has no Date type; parse with `new Date(date)` when displaying
  endDate: string; // ISO timestamp — JSON has no Date type; parse with `new Date(date)` when displaying
  amount: number;
  status: 'holding' | 'released' | 'refunded';
}

export async function getVendorTransactions(token: string): Promise<VendorTransaction[]> {
  const response = await apiFetch(`${BASE_URL}vendor/txsHist`, {
    method: 'GET',
    cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

// Vendor Dashboard Transactions — backing the "My rentals" table
export interface DashboardTransaction {
  renterName: string;
  earning: string; // Go's decimal.Decimal marshals as a quoted JSON string, not a number — parse before formatting
  status: string;
  profilePic: string;
  endDate?: string; // ISO timestamp — the backend omits this key entirely when the date is unset
  startDate?: string; // ISO timestamp — the backend omits this key entirely when the date is unset
  quantity: number;
  txId: string;
}

export async function getVendorDashboardTransactions(token: string): Promise<DashboardTransaction[]> {
  const response = await apiFetch(`${BASE_URL}vendor/getRentalTransactions`, {
    method: 'GET',
    cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

// Complete Vendor Onboarding — the vendor detail screens (national ID,
// identity confirmation, business identity, logistics) only accumulate their
// answers in localStorage (see services/onboardingStorage.ts); this is the
// single call that sends everything to the backend at once, fired from the
// last screen in the flow.
export interface VendorOnboardingPayload {
  nationalId: string;
  fullName: string;
  businessName: string;
  businessBio: string;
  businessLocation: string;
  startTime: string;
  endTime: string;
  offerDelivery: boolean;
  acceptInPerson: boolean;
  acceptInAppCalls: boolean;
}

export interface VendorOnboardingImages {
  coverPhoto: File | null;
  businessLogo: File | null;
}

export async function completeVendorOnboarding(
  clerkId: string,
  payload: VendorOnboardingPayload,
  images: VendorOnboardingImages
): Promise<ApiResponse<void>> {
  const vendorDetails = {
    clerk_id: clerkId,
    national_id: payload.nationalId,
    full_name: payload.fullName,
    business_name: payload.businessName,
    business_bio: payload.businessBio,
    business_location: payload.businessLocation,
    start_time: payload.startTime,
    end_time: payload.endTime,
    offer_delivery: payload.offerDelivery,
    accept_in_person: payload.acceptInPerson,
    accept_in_app_calls: payload.acceptInAppCalls,
  };

  const formData = new FormData();
  formData.append('vendorDetails', JSON.stringify(vendorDetails));
  if (images.coverPhoto) formData.append('cover_photo', images.coverPhoto);
  if (images.businessLogo) formData.append('business_logo', images.businessLogo);

  // No Content-Type header — the browser sets multipart/form-data with the
  // correct boundary itself when the body is a FormData instance.
  const response = await apiFetch(`${BASE_URL}vendor/updateDetails`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

// Upload Asset — `vendor` is the verified user_id from verifySession, not a
// client-trusted value. Up to 4 images ride under the repeated 'image' field;
// `primaryImage` is the index into that set (0 = first image).
export interface AssetUploadPayload {
  vendor: number;
  category: number;
  name: string;
  availability: string;
  description: string;
  rate: number;
  pricingUnit: string;
  location: string;
  condition: string;
  primaryImage: number;
  quantity: number;
}

export interface AssetUploadResponse {
  assetId: number;
}

export async function uploadAsset(
  token: string,
  assetDetails: AssetUploadPayload,
  images: File[]
): Promise<AssetUploadResponse> {
  const formData = new FormData();
  formData.append('assetDetails', JSON.stringify(assetDetails));
  images.forEach((file) => formData.append('image', file));

  // No Content-Type header — the browser sets multipart/form-data with the
  // correct boundary itself when the body is a FormData instance.
  const response = await apiFetch(`${BASE_URL}assets/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Upload failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

// Update Asset — assets/update/{id} accepts the same multipart shape as
// assets/upload, plus assetId in the body, and expects the *full* asset
// payload every time (not a partial patch) — used both for the preview
// page's availability toggle and the "Edit Post" resubmit flow, so callers
// must send every field, not just the one that changed.
export interface AssetUpdatePayload extends AssetUploadPayload {
  assetId: string;
}

export async function updateAsset(
  token: string,
  assetDetails: AssetUpdatePayload,
  images: File[] = []
): Promise<void> {
  const formData = new FormData();
  formData.append('assetDetails', JSON.stringify(assetDetails));
  images.forEach((file) => formData.append('image', file));

  // No Content-Type header — the browser sets multipart/form-data with the
  // correct boundary itself when the body is a FormData instance.
  const response = await apiFetch(`${BASE_URL}assets/update/${assetDetails.assetId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Update failed (${response.status}): ${errorBody}`);
  }
}

// Vendor's Own Assets — powers the vendor's asset management grid
export interface VendorAsset {
  assetId: string;
  rate: number;
  name: string;
  vendor: number;
  vendorSrc?: string;
  category: string;
  location: string;
  quantity: number;
  condition: string;
  pricingUnit: string;
  availability: 'available' | 'paused';
  primaryImage: string;
}

export async function getVendorAssets(token: string): Promise<VendorAsset[]> {
  const response = await apiFetch(`${BASE_URL}vendor/getAssets`, {
    method: 'GET',
    cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

// --- Vendor Profile (/profile) -------------------------------------------
// Most routes below (`vendor/profile*`) don't exist on the backend yet — they
// are DUMMY paths standing in until the real endpoints ship. Swap the path
// strings once they're built; the shapes here are what the frontend expects
// back. See the profile page's outline of needed routes for the full list.
// `vendor/profile/logistics` is wired up already — see getVendorLogistics.

export async function getVendorProfile(token: string): Promise<VendorProfile | null> {
  try {
    const response = await apiFetch(`${BASE_URL}vendor/profile`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vendor profile');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getVendorCatalog(token: string): Promise<CatalogAsset[]> {
  try {
    const response = await apiFetch(`${BASE_URL}vendor/profile/catalog`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vendor catalog');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Matches the Go handler's VendorLogistics struct — a single location plus one
// business-hours window (startTime/endTime are `types.ClockTime`, which
// marshals as a plain "HH:MM" 24-hour string, same as the onboarding flow
// above sends).
interface VendorLogisticsResponse {
  location: string;
  startTime: string;
  endTime: string;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const formatClockTime = (time: string): string => {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutesStr ? minutes.toString().padStart(2, '0') : '00'} ${period}`;
};

export async function getVendorLogistics(token: string): Promise<VendorLogistics | null> {
  try {
    const response = await apiFetch(`${BASE_URL}vendor/profile/logistics`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vendor logistics');
    }

    const data: VendorLogisticsResponse = await response.json();
    const hoursRange = `${formatClockTime(data.startTime)} - ${formatClockTime(data.endTime)}`;

    return {
      address: data.location,
      // The backend only exposes one business-hours window, not per-day
      // hours — repeat it across the weekdays until that's more granular.
      operatingHours: WEEKDAYS.map((day) => ({ day, hours: hoursRange })),
      // Same story for meeting slots — one generic slot standing in until
      // the backend supports distinct windows (morning/afternoon/etc).
      meetingSlots: [{ label: 'Anytime', hours: hoursRange }],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Assets a reviewer can pick between on the Reviews tab — the chip row at
// the top of the tab. Kept separate from getVendorCatalog since it may need
// to include paused/archived assets that still carry reviews.
export async function getVendorReviewableAssets(token: string): Promise<ReviewableAsset[]> {
  try {
    const response = await apiFetch(`${BASE_URL}vendor/profile/reviewableAssets`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviewable assets');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAssetReviews(token: string, assetId: string): Promise<AssetReview[]> {
  try {
    const response = await apiFetch(`${BASE_URL}vendor/profile/reviews/${assetId}`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch asset reviews');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function postReviewReply(token: string, reviewId: string, comment: string): Promise<ReviewReply | null> {
  try {
    const response = await apiFetch(`${BASE_URL}vendor/profile/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      throw new Error('Failed to post reply');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// --- Meetup QR Code (/messages) ---------------------------------------------
// Lets a vendor generate a one-time QR code from within a chat thread for the
// renter to scan at handoff/return. Unlike every other route in this file,
// the response body IS the image (Content-Type: image/png), not JSON — it's
// turned into an object URL for an <img> tag rather than parsed as JSON.
// Caller is responsible for revoking the returned URL when done with it.
// vendorId is deliberately not sent — the backend derives it from the Clerk
// token itself.

export async function getMeetupQrCode(token: string, transactionId: string): Promise<string | null> {
  try {
    const response = await apiFetch(`${BASE_URL}vendor/generateQrCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ transactionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate meetup QR code');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// There's no direct link yet between a chat contact and a specific rental
// transaction, so the transaction is found by matching the renter's display
// name against the vendor's transaction history. Ambiguous if a renter has
// more than one transaction with this vendor — the currently-held one
// (status "holding") wins since that's the one still awaiting a meetup;
// otherwise falls back to the first name match.
export function findTransactionIdForRenter(
  transactions: DashboardTransaction[],
  renterName: string
): string | null {
  const normalizedName = renterName.trim().toLowerCase();
  const matches = transactions.filter((tx) => tx.renterName.trim().toLowerCase() === normalizedName);

  if (matches.length === 0) return null;

  const holding = matches.find((tx) => tx.status === 'holding');
  return (holding ?? matches[0]).txId;
}
