import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Medic Resume",
  description: "Medic Resume - Next.js Application",
  icons: {
    icon: "/icons/zscan-icon-light.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          id="favicon"
          rel="icon"
          href="/icons/zscan-icon-light.png"
        />
        <link
          id="favicon-apple"
          rel="apple-touch-icon"
          href="/icons/zscan-icon-light.png"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('medic-resume-tema');
                if (theme === 'escuro' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
                var fav = document.getElementById('favicon');
                var apple = document.getElementById('favicon-apple');
                if (document.documentElement.classList.contains('dark')) {
                  if (fav) fav.href = '/icons/zscan-icon-dark.png';
                  if (apple) apple.href = '/icons/zscan-icon-dark.png';
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}