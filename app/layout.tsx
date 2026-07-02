import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medic Resume",
  description: "Medic Resume - Next.js Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
