import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastContainer } from "@/components/toast-notification"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BioSecure - Fingerprint Authentication",
  description: "Advanced biometric fingerprint authentication system",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
