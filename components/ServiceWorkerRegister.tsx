'use client'

import { useEffect } from 'react'

// Registered only in production — in dev, a stale registered worker can
// silently serve old cached assets across restarts, which is exactly the
// kind of confusing bug this is meant to avoid. See public/sw.js.
const ServiceWorkerRegister = () => {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') return
        if (!('serviceWorker' in navigator)) return

        navigator.serviceWorker.register('/sw.js').catch((error) => {
            console.error('Service worker registration failed:', error)
        })
    }, [])

    return null
}

export default ServiceWorkerRegister
