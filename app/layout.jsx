import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: "Diamond — Fantasy Baseball",
  description: "Your ESPN fantasy baseball command center",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" data-density="regular">
      <body className={`${interTight.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
