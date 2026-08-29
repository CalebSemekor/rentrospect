import type { LoneAsset } from '@/types/asset';
import type { ChatContact, ChatMessage, CallLogEntry, ContactProfile, SavedMessage } from '@/types/messages';
import { BASE_URL, type ApiResponse } from './base';

export * from './vendor';
export * from './client';

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

// --- Messages (/messages) --------------------------------------------------
// Routes are live on the Go backend (confirmed against its router table).
// Response field casing (camelCase vs snake_case) hasn't been confirmed yet —
// if fields come back undefined at runtime, that's almost certainly why; see
// the note left for the human. Shapes otherwise match the
// `messages`/`calls`/`message_saves` migration: unread is `read_at IS NULL`,
// saved messages come from the join table, and call direction is derived
// per-viewer server-side.
// Lives here (not vendor.ts/client.ts) because /messages is a shared,
// non-role-gated route used by both renters and vendors.

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
