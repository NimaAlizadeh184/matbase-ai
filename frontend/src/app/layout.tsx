import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MatBase AI — Polymer Materials Database',
  description: 'Search, filter, and compare polymer materials with AI-powered recommendations.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-brand-700 tracking-tight">
            MatBase <span className="text-brand-500">AI</span>
          </a>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <a href="/" className="hover:text-brand-600 transition-colors">Search</a>
            <a href="/compare" className="hover:text-brand-600 transition-colors">Compare</a>
            <a href="/chat" className="hover:text-brand-600 transition-colors">AI Chat</a>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  )
}
