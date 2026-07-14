"use server";

import nodemailer from "nodemailer";

export type QuoteFormState = {
  status: "idle" | "success" | "error";
  message: string;
  whatsappUrl?: string;
};

export async function submitQuoteForm(
  _prevState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const name = (formData.get("name") as string)?.trim();
  const company = (formData.get("company") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const country = (formData.get("country") as string)?.trim();
  const products = formData.getAll("products") as string[];
  const enquiryType = (formData.get("enquiryType") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !phone || !message) {
    return { status: "error", message: "Please fill in all required fields (Name, Email, Phone, Message)." };
  }

  // Strict email validation matching client-side
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  // Check for suspicious repeated chars in TLD (e.g., "commm")
  const tld = email.split(".").pop() || "";
  const repeatedChar = /(.)\1{2,}/;
  if (repeatedChar.test(tld)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpSecure = process.env.SMTP_SECURE === "true";
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const quoteTo = process.env.QUOTE_TO_EMAIL ?? "hello@greenellora.com";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? smtpUser;
  const fromName = process.env.SMTP_FROM_NAME ?? "Green Ellora";
  const whatsappNumber = (process.env.WHATSAPP_BUSINESS_NUMBER ?? "").replace(/\D/g, "");
  const productList = products.length > 0 ? products.join(", ") : "Not specified";
  const whatsappMessage = [
    "*New Green Ellora Enquiry*",
    "",
    `*Name:* ${name}`,
    `*Company:* ${company || "Not provided"}`,
    `*Email:* ${email}`,
    `*Phone:* ${phone || "Not provided"}`,
    `*Country:* ${country || "Not provided"}`,
    `*Enquiry type:* ${enquiryType || "Not provided"}`,
    `*Products:* ${productList}`,
    "",
    "*Message:*",
    message,
  ].join("\n");
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : undefined;

  if (!smtpHost || !smtpUser || !smtpPass || !fromEmail) {
    if (whatsappUrl) {
      return {
        status: "success",
        message: "Your enquiry is ready to send on WhatsApp.",
        whatsappUrl,
      };
    }

    return {
      status: "error",
      message: "Quote service is not configured yet. Configure email or WhatsApp first.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subject = `New quote request from ${name}`;
  const text = [
    "New quote enquiry submitted:",
    "",
    `Name: ${name}`,
    `Company: ${company || "Not provided"}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Country: ${country || "Not provided"}`,
    `Enquiry Type: ${enquiryType || "Not provided"}`,
    `Products: ${productList}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <h2>New quote enquiry submitted</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Company:</strong> ${company || "Not provided"}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
    <p><strong>Country:</strong> ${country || "Not provided"}</p>
    <p><strong>Enquiry Type:</strong> ${enquiryType || "Not provided"}</p>
    <p><strong>Products:</strong> ${productList}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, "<br />")}</p>
  `;

  try {
    await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: quoteTo,
      replyTo: email,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("[Green Ellora] Failed to send quote email", error);
    if (whatsappUrl) {
      return {
        status: "success",
        message: "Email is unavailable, but your enquiry is ready to send on WhatsApp.",
        whatsappUrl,
      };
    }

    return {
      status: "error",
      message: "Unable to submit enquiry right now. Please try again shortly.",
    };
  }

  return {
    status: "success",
    message: "Thank you! We will review your enquiry and respond within 24 hours.",
    whatsappUrl,
  };
}
