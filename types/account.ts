// Renter account settings (/renter/settings/account) — "Basic Information" card
export interface AccountDetails {
    fullName: string
    email: string
    deliveryLocation: string
    phoneNumber: string
    profilePic: string
}

// "Security" card toggles. Note: these are plain preference flags persisted
// on our own backend — they are NOT wired to Clerk's real multi-factor auth.
// Turning on "Enable 2FA" here does not enroll the user in Clerk MFA (that
// needs its own TOTP/QR enrollment flow); it just stores the user's stated
// preference until that flow exists.
export interface SecuritySettings {
    twoFactorEnabled: boolean
    analyticsEnabled: boolean
    personalizationEnabled: boolean
    thirdPartySharingEnabled: boolean
}
