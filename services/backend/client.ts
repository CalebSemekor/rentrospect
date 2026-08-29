import { BASE_URL } from './base';
import type { RentalTileProps } from '@/components/RentalTile';
import type { NotificationSettings } from '@/types/notifications';
import type { AccountDetails, SecuritySettings } from '@/types/account';

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

// --- Rentals (/renter/rentals) ---------------------------------------------

// Matches the Go handler's RentalTile struct exactly, except `price`: Go's
// decimal.Decimal marshals as a quoted JSON string, not a number (same gotcha
// as DashboardTransaction.amount above) — parsed to a number below.
interface RentalTileResponse {
  id: string;
  name: string;
  price: string;
  pricingUnit: string;
  assetSrc: string;
  quantity: number;
  progress: number;
  status: string;
  statusDetail: string;
  startDate: string;
  endDate: string;
}

export async function getClientRentals(token: string): Promise<RentalTileProps[]> {
  try {
    const response = await fetch(`${BASE_URL}client/rentals`, {
      method: 'GET',
      cache: 'no-store', // per-user response — must never enter Next's shared fetch cache
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rentals');
    }

    const data: RentalTileResponse[] = await response.json();

    return data.map((item) => ({
      ...item,
      price: Number(item.price),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}
