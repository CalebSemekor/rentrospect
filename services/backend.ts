import type { LoneAsset } from '@/types/asset';
import type { VendorProfile, CatalogAsset, VendorLogistics, ReviewableAsset, AssetReview, ReviewReply } from '@/types/profile';
import type { AccountDetails, SecuritySettings } from '@/types/account';
import type { NotificationSettings } from '@/types/notifications';
import type { ChatContact, ChatMessage, CallLogEntry, ContactProfile, SavedMessage } from '@/types/messages';

const BASE_URL = process.env.NEXT_PUBLIC_MASTER || '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Single Asset Detail — public endpoint (no auth token), used by both the
// renter-facing asset page and the vendor's own listing preview. `images`
// carries an `isPrimary` flag per image — the primary one is the hero image.
export async function getAssetById(id: string): Promise<LoneAsset | null> {
  try {
    const response = await fetch(`${BASE_URL}assets/getAsset/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch asset details');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Verify a Clerk session token server-side and get back who the user is.
// `role` is null for a user who hasn't finished /accountType yet.
export interface VerifiedSession {
  user_id: string;
  role: 'renter' | 'vendor' | null;
}

export async function verifySession(token: string): Promise<VerifiedSession> {
  const response = await fetch(`${BASE_URL}auth/verifySession`, {
    method: 'GET',
    cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

// Wallet Balance — works for both a renter and a vendor; the backend
// determines which based on who the verified token belongs to.
export interface WalletBalance {
  totalBalance: number;
  escrowBalance: number;
  availableBalance: number;
}

export async function getUserBalance(token: string): Promise<WalletBalance> {
  const response = await fetch(`${BASE_URL}client/userBalances`, {
    method: 'GET',
    cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

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
  const response = await fetch(`${BASE_URL}vendor/txsHist`, {
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
  name: string;
  amount: string; // Go's decimal.Decimal marshals as a quoted JSON string, not a number — parse before formatting
  status: string;
  profilePic: string;
  endDate?: string; // ISO timestamp — the backend omits this key entirely when the date is unset
  startDate?: string; // ISO timestamp — the backend omits this key entirely when the date is unset
  quantity: number;
  transactionId: string;
}

export async function getVendorDashboardTransactions(token: string): Promise<DashboardTransaction[]> {
  const response = await fetch(`${BASE_URL}vendor/transactions`, {
    method: 'GET',
    cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

// Phone Verification
export async function sendPhoneNumber(clerkId: string, phoneNumber: string): Promise<ApiResponse<void>> {
  const response = await fetch(`${BASE_URL}webhooks/client/sendPhoneNumber`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clerk_id: clerkId, phone_number: phoneNumber }),
  });
  return response.json();
}

// SMS Code Verification
export async function verifySmsCode(clerkId: string, code: string): Promise<ApiResponse<void>> {
  const response = await fetch(`${BASE_URL}client/verifySmsCode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clerk_id: clerkId, code }),
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
  const response = await fetch(`${BASE_URL}vendor/updateDetails`, {
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
  const response = await fetch(`${BASE_URL}assets/upload`, {
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
  const response = await fetch(`${BASE_URL}assets/update/${assetDetails.assetId}`, {
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
  const response = await fetch(`${BASE_URL}vendor/getAssets`, {
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
    const response = await fetch(`${BASE_URL}vendor/profile`, {
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
    const response = await fetch(`${BASE_URL}vendor/profile/catalog`, {
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
    const response = await fetch(`${BASE_URL}vendor/profile/logistics`, {
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
    const response = await fetch(`${BASE_URL}vendor/profile/reviewableAssets`, {
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
    const response = await fetch(`${BASE_URL}vendor/profile/reviews/${assetId}`, {
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
    const response = await fetch(`${BASE_URL}vendor/profile/reviews/${reviewId}/reply`, {
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

// --- Renter Account Settings (/renter/settings/account) -------------------
// DUMMY routes (`client/account*`) — swap once the backend ships them.
// Password changes deliberately do NOT go through here — Clerk owns
// credentials, so PasswordSection calls `user.updatePassword()` directly.

export async function getAccountDetails(token: string): Promise<AccountDetails | null> {
  try {
    const response = await fetch(`${BASE_URL}client/account`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch account details');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateAccountDetails(
  token: string,
  details: AccountDetails,
  profilePic?: File | null
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('accountDetails', JSON.stringify(details));
    if (profilePic) formData.append('profile_pic', profilePic);

    // No Content-Type header — the browser sets multipart/form-data with the
    // correct boundary itself when the body is a FormData instance.
    const response = await fetch(`${BASE_URL}client/account`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getSecuritySettings(token: string): Promise<SecuritySettings | null> {
  try {
    const response = await fetch(`${BASE_URL}client/account/security`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch security settings');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateSecuritySettings(token: string, settings: SecuritySettings): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}client/account/security`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deactivateAccount(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}client/account/deactivate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// --- Renter Notification Settings (/renter/settings/notifications) --------
// DUMMY route — swap once the backend ships it.

export async function getNotificationSettings(token: string): Promise<NotificationSettings | null> {
  try {
    const response = await fetch(`${BASE_URL}client/notifications`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notification settings');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateNotificationSettings(token: string, settings: NotificationSettings): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}client/notifications`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// --- Messages (/messages) --------------------------------------------------
// Routes are live on the Go backend (confirmed against its router table).
// Response field casing (camelCase vs snake_case) hasn't been confirmed yet —
// if fields come back undefined at runtime, that's almost certainly why; see
// the note left for the human. Shapes otherwise match the
// `messages`/`calls`/`message_saves` migration: unread is `read_at IS NULL`,
// saved messages come from the join table, and call direction is derived
// per-viewer server-side.

export async function getChatList(token: string): Promise<ChatContact[]> {
  try {
    const response = await fetch(`${BASE_URL}client/messages/contacts`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat list');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getConversationMessages(token: string, contactId: string): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`${BASE_URL}client/messagesThread/${contactId}`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function sendMessage(token: string, contactId: string, text: string): Promise<ChatMessage | null> {
  try {
    const response = await fetch(`${BASE_URL}client/messagesThread/${contactId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function sendMessageAttachment(token: string, contactId: string, file: File): Promise<ChatMessage | null> {
  try {
    const formData = new FormData();
    formData.append('attachment', file);

    // No Content-Type header — the browser sets multipart/form-data with the
    // correct boundary itself when the body is a FormData instance.
    const response = await fetch(`${BASE_URL}client/messages/thread/${contactId}/attachment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to send attachment');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Toggles a message in/out of the viewer's `message_saves`. Assumed POST with
// a `saved` flag rather than separate save/unsave verbs — confirm with the
// backend if that's wrong.
export async function toggleSavedMessage(token: string, messageId: string, saved: boolean): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}client/messages/${messageId}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ saved }),
    });

    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function markConversationRead(token: string, contactId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}client/messages/thread/${contactId}/read`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCallLog(token: string): Promise<CallLogEntry[]> {
  try {
    const response = await fetch(`${BASE_URL}client/calls`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch call log');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSavedMessages(token: string): Promise<SavedMessage[]> {
  try {
    const response = await fetch(`${BASE_URL}client/messages/saved`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saved messages');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getContactProfile(token: string, contactId: string): Promise<ContactProfile | null> {
  try {
    const response = await fetch(`${BASE_URL}client/messages/contacts/${contactId}/profile`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contact profile');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
