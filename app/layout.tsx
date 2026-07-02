import type { Metadata } from "next";
import { Newsreader, Libre_Franklin, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { DiagnosticoPopup } from "@/app/components/DiagnosticoPopup";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Faro de Negocios",
  description:
    "Diagnóstico gratuito para PyMEs argentinas. Descubrí cómo está tu negocio frente a los de tu rubro.",
  icons: {
    icon: "/logo/faro-avatar-cuadrado.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${newsreader.variable} ${libreFranklin.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <DiagnosticoPopup />
      </body>
    </html>
  );
}
