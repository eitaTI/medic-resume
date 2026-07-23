import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BrandingProvider } from "@/components/providers/BrandingProvider";
import { getBranding } from "@/lib/branding";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Medic Resume",
  description: "Medic Resume - Next.js Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = getBranding()
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          id="favicon"
          rel="icon"
          href={branding.iconLight}
        />
        <link
          id="favicon-apple"
          rel="apple-touch-icon"
          href={branding.iconLight}
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
                  if (fav) fav.href = '${branding.iconDark}';
                  if (apple) apple.href = '${branding.iconDark}';
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        <BrandingProvider value={branding}>
          <ThemeProvider>{children}</ThemeProvider>
        </BrandingProvider>
      </body>
    </html>
  );
}