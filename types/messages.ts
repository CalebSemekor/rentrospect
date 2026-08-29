// Mirrors the `messages` table (+ attachment columns, `read_at`) from the migration.
export interface ChatMessageAttachment {
    url: string
    name: string
    sizeBytes: number
}

export interface ChatMessage {
    id: string
    fromMe: boolean
    author: string
    text?: string
    attachment?: ChatMessageAttachment
    sentAt: string // ISO — messages.created_at
    readAt?: string | null // ISO — messages.read_at; null/undefined means unread
    isSaved?: boolean // whether the viewer has this in their `message_saves`
}

// One row per counterpart — derived server-side from `messages`, not a stored table.
export interface ChatContact {
    id: string
    name: string
    avatar: string
    phoneNumber?: string
    lastMessage: string
    lastMessageAt: string // ISO
    unreadCount: number
}

export type CallDirection = 'incoming' | 'outgoing' | 'missed'

// `direction` is derived per-viewer from `calls.caller_id`/`callee_id`/`status` — see
// the migration notes; it isn't a stored column.
export interface CallLogEntry {
    id: string
    contactId: string
    name: string
    avatar: string
    direction: CallDirection
    occurredAt: string // ISO — calls.started_at
    durationSecs?: number | null
}

// Sourced from `users` (+ `vendors` when the contact is a vendor). Fields with no
// backing column (handle, website, tag) were dropped — `handle` here is just a
// client-side slug of the name for display, not a stored identifier.
export interface ContactProfile {
    id: string
    name: string
    handle: string
    verified: boolean // vendors.verification_status === 'verified'
    bio?: string // vendors.about
    coverPhoto?: string // vendors.cover_photo
    avatar: string // users.profile_pic
    location?: string // vendors.location
    email?: string
    phoneNumber?: string
    joinedAt: string // ISO — users.date_joined
}

// One row per `message_saves` entry, joined against the saved message itself.
export interface SavedMessage {
    id: string // message_saves.message_id
    author: string
    authorAvatar: string
    savedAt: string // ISO — message_saves.saved_at
    preview: string
}
