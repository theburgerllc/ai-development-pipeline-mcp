import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Development Pipeline MCP Integration',
  description: 'Claude/VSCode/Augment AI pipeline with unified MCP, Vercel, Airtable, Square integration',
  keywords: ['MCP', 'Claude AI', 'TypeScript', 'Vercel', 'AI Development'],
  authors: [{ name: 'AI Development Pipeline' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
