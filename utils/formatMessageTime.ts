const pad = (n: number) => n.toString().padStart(2, '0')

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()

const dayDiffFrom = (iso: string, now: Date) => {
    const date = new Date(iso)
    return Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / 86400000)
}

// "Today", "Yesterday", a weekday name (within the last week), or a date
export const formatRelativeDay = (iso: string, now: Date = new Date()): string => {
    const date = new Date(iso)
    const dayDiff = dayDiffFrom(iso, now)

    if (dayDiff === 0) return 'Today'
    if (dayDiff === 1) return 'Yesterday'
    if (dayDiff > 1 && dayDiff < 7) return weekdayNames[date.getDay()]
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// For message thread dividers/timestamps: "Just now", or "Monday, 4:23pm"
export const formatMessageTimestamp = (iso: string, now: Date = new Date()): string => {
    const date = new Date(iso)
    const diffMs = now.getTime() - date.getTime()
    if (diffMs >= 0 && diffMs < 60000) return 'Just now'
    return `${formatRelativeDay(iso, now)}, ${formatTime(date)}`
}

// For chat list row previews — just the short label
export const formatListTimestamp = (iso: string, now: Date = new Date()): string => {
    const dayDiff = dayDiffFrom(iso, now)
    if (dayDiff === 0) return formatTime(new Date(iso))
    return formatRelativeDay(iso, now)
}

// For call log rows: "Yesterday, 15:03" (24h time, matches the mockup)
export const formatCallTimestamp = (iso: string, now: Date = new Date()): string => {
    const date = new Date(iso)
    const time24 = `${pad(date.getHours())}:${pad(date.getMinutes())}`
    return `${formatRelativeDay(iso, now)}, ${time24}`
}
