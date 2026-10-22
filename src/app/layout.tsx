import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Habib Hasibuan — Portofolio Pribadi",
  description: "Portofolio pribadi Habib Hasibuan: biodata, minat, perjalanan pendidikan, dan informasi kontak.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><body>{children}</body></html>;
}