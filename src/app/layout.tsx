import type { Metadata } from "next";
import "./globals.css";

/**
 * Defines the application's default browser metadata.
 */
export const metadata: Metadata = {
  title: {
    default: "WeighIN — Your progress, your pace",
    template: "%s | WeighIN",
  },
  description:
    "A calm, personal space to track your weight, understand your progress and work towards your goals.",
};

/**
 * Wraps every application page in the shared HTML document.
 *
 * New pages inherit the document language and metadata
 * unless they explicitly override the defaults.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
