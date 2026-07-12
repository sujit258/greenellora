"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitQuoteForm, type QuoteFormState } from "@/app/actions";

const PRODUCTS = [
  "Spices & Condiments",
  "Organic Superfoods",
  "Cereals, Pulses & Grains",
  "Herbal & Wellness Products",
  "Handicraft Products",
  "Ayurvedic Products",
  "Export Services",
];

const ENQUIRY_TYPES = [
  "Sample Request",
  "Bulk Order Pricing",
  "Private Label / Custom Branding",
  "General Enquiry",
];

const fieldClass = "input-field";

type QuoteFormProps = {
  lockedProduct?: string;
  productReference?: string;
  productPageUrl?: string;
  enquiryTypeDefault?: string;
  messageDefault?: string;
  submitLabel?: string;
  pendingLabel?: string;
  successHref?: string;
  successLabel?: string;
};

function SubmitButton({
  submitLabel = "Send Enquiry",
  pendingLabel = "Sending enquiry...",
}: {
  submitLabel?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{ opacity: pending ? 0.75 : 1 }}
      className="button-primary w-full gap-2 text-sm font-semibold tracking-wide"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        <>
          {submitLabel}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

const initialState: QuoteFormState = { status: "idle", message: "" };

export function QuoteForm({
  lockedProduct,
  productReference,
  productPageUrl,
  enquiryTypeDefault,
  messageDefault,
  submitLabel,
  pendingLabel,
  successHref = "/#contact",
  successLabel = "Submit another enquiry",
}: QuoteFormProps) {
  const [state, formAction] = useActionState(submitQuoteForm, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-primary/10 bg-surface-muted/50 px-6 py-14 text-center animate-[fadeInUp_0.4s_ease]">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <p className="text-xl font-serif text-heading font-medium">Enquiry Received Successfully</p>
          <p className="mt-2 text-sm leading-relaxed text-muted max-w-sm">
            Thank you for reaching out. Our export coordination team will review your requirements and respond within 24 hours.
          </p>
        </div>
        <Link href={successHref} className="button-secondary text-sm">
          {successLabel}
        </Link>
        {state.whatsappUrl ? (
          <a
            href={state.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="button-primary gap-2 text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            Send enquiry on WhatsApp
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {lockedProduct ? <input type="hidden" name="products" value={lockedProduct} /> : null}
      {productReference ? <input type="hidden" name="productReference" value={productReference} /> : null}
      {productPageUrl ? <input type="hidden" name="productPageUrl" value={productPageUrl} /> : null}

      {state.status === "error" && (
        <div
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 animate-[fadeInUp_0.2s_ease]"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-700 font-medium">
            {state.message}
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="qf-name" className="text-xs font-semibold uppercase tracking-wider text-heading">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="qf-name"
            name="name"
            type="text"
            required
            placeholder="Jane Smith"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="qf-company" className="text-xs font-semibold uppercase tracking-wider text-heading">
            Company Name
          </label>
          <input
            id="qf-company"
            name="company"
            type="text"
            placeholder="Acme Distributors"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="qf-email" className="text-xs font-semibold uppercase tracking-wider text-heading">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="qf-email"
            name="email"
            type="email"
            required
            placeholder="jane@company.com"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="qf-phone" className="text-xs font-semibold uppercase tracking-wider text-heading">
            Phone / WhatsApp
          </label>
          <input
            id="qf-phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="qf-country" className="text-xs font-semibold uppercase tracking-wider text-heading">
            Destination Country
          </label>
          <input
            id="qf-country"
            name="country"
            type="text"
            placeholder="United States"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="qf-enquiryType" className="text-xs font-semibold uppercase tracking-wider text-heading">
            Enquiry Type
          </label>
          <select
            id="qf-enquiryType"
            name="enquiryType"
            defaultValue={enquiryTypeDefault ?? ""}
            className={`${fieldClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%23495447%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat`}
          >
            <option value="">Select enquiry type...</option>
            {ENQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {lockedProduct ? (
        <fieldset className="border border-border rounded-xl p-4 bg-surface-muted/30">
          <legend className="px-2 text-xs font-bold uppercase tracking-widest text-primary-strong">Selected Product</legend>
          <div className="pt-1">
            <p className="text-sm font-semibold text-heading">{lockedProduct}</p>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              This enquiry will be flagged as a priority product request.
            </p>
          </div>
        </fieldset>
      ) : (
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-wider text-heading mb-1">Products of Interest</legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {PRODUCTS.map((product) => (
              <label
                key={product}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-xs font-medium text-body transition-all duration-300 hover:border-primary/45 hover:bg-primary/5 select-none"
              >
                <input
                  type="checkbox"
                  name="products"
                  value={product}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span>{product}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="qf-message" className="text-xs font-semibold uppercase tracking-wider text-heading">
          Requirements / Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="qf-message"
          name="message"
          required
          rows={4}
          defaultValue={messageDefault}
          placeholder="Describe your target quantities, packaging requirements, private label expectations, or general shipping preferences..."
          className={`${fieldClass} resize-none`}
        />
      </div>

      <SubmitButton submitLabel={submitLabel} pendingLabel={pendingLabel} />

      <p className="text-center text-[10px] uppercase tracking-wider text-subtle/80">
        Confidentiality Guaranteed • Response Within 1 Business Day
      </p>
    </form>
  );
}
