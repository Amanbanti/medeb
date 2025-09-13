import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "Medeb - Ethiopian Lottery Pools",
  description: "Join lottery pools and win big with Medeb!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-background text-foreground`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
