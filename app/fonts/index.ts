import localFont from "next/font/local";
import { Inter, Outfit } from "next/font/google";

export const sfPro = localFont({
  src: "./SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit", // This matches the variable name we'll use in Tailwind
});
