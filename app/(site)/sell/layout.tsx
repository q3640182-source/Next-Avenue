import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Your Property",
  description: "List your property with Next Avenue to get the best market value securely and quickly.",
};

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return children;
}
