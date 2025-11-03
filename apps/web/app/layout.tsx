import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { UserProvider } from "@/contexts/user-context"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "YouBet - Social Sports Betting Community",
  description: "Connect, share betting slips, track wins/losses, and discuss sports predictions in real time",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} font-sans antialiased`}>
        <UserProvider>
          {children}
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
