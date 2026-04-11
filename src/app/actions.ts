"use server";

export type QuoteFormState = {
  status: "idle" | "success" | "error";
  message: string;
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

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in all required fields (Name, Email, Message)." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  // -----------------------------------------------------------------------
  // TODO: Wire up your preferred email / CRM service here, for example:
  //
  // Resend (https://resend.com):
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "Green Ellora <noreply@greenellora.com>",
  //     to: ["hello@greenellora.com"],
  //     subject: `New quote request from ${name}`,
  //     html: `<p>${message}</p>`,
  //   });
  //
  // Nodemailer, SendGrid, Postmark, etc. work the same way.
  // -----------------------------------------------------------------------

  console.log("[Green Ellora] Quote enquiry received:", {
    name, company, email, phone, country, products, enquiryType, message,
  });

  return {
    status: "success",
    message: "Thank you! We will review your enquiry and respond within 24 hours.",
  };
}
