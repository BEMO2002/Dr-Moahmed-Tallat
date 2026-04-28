export default function manifest() {
  return {
    name: 'Dr. Mohamed Talaat',
    short_name: 'Mohamed Talaat',
    description: 'Dr. Mohamed Talaat Portfolio and Strategic Analyses',
    start_url: '/',
    display: 'standalone',
    background_color: '#FCFDFF',
    theme_color: '#C5A059',
    icons: [
      {
        src: '/Home/talaat-logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/Home/talaat-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
