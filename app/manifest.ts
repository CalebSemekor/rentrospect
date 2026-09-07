import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rentrospect',
    short_name: 'Rentrospect',
    description: 'Rent Smarter. Track Better. Earn More.',
    start_url: '/renter',
    display: 'standalone',      // Emulates a standalone native mobile app
    background_color: '#232D34',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',   // Crucial for proper scaling on Android
      },
    ],
  };
}
