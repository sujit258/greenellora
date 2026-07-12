"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/lib/site";

export function WhatsAppChat() {
  const pathname = usePathname();
  const phone = siteConfig.phone.replace(/\D/g, "");

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-chat"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      Chat With Us
    </a>
  );
}
