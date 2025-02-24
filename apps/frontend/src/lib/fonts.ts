import { Inter, Lexend_Deca } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const fontSans = GeistSans;
export const fontMono = GeistMono;
