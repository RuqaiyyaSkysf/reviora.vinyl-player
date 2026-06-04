import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Reviora',
    short_name: 'Reviora',
    description: 'A modern web-based vinyl music player with retro aesthetics. Play local MP3s with customizable themes.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    theme_color: '#000000',
    background_color: '#ffffff',
    icons: [
      {
        src: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    categories: ['music', 'entertainment', 'productivity'],
    screenshots: [],
    shortcuts: [],
    prefer_related_applications: false,
  }
}
