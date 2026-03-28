export const metadata = {
  title: 'Botulinumtoxin-Behandlung | Anna Hryshchenko',
  description: 'Aufklärung und Anamnese für Ihre Botulinumtoxin-Behandlung bei Anna Hryshchenko - Ästhetische Medizin',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
