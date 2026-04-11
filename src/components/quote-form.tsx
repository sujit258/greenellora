"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { submitQuoteForm, type QuoteFormState } from "@/app/actions";

const PRODUCTS = [
  "Spices & Condiments",
  "Organic Superfoods",
  "Cereals, Pulses & Grains",
  "Herbal & Wellness Products",
];

const ENQUIRY_TYPES = [
  "Sample Request",
  "Bulk Order Pricing",
  "Private Label / Custom Branding",
  "General Enquiry",
];

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10 transition";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{ opacity: pending ? 0.65 : 1 }}
      className="button-primary w-full gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending enquiry…
        </>
      ) : (
        <>
          Send Enquiry
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

const initialState: QuoteFormState = { status: "idle", message: "" };

export function QuoteForm() {
  const [state, formAction] = useActionState(submitQuoteForm, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-primary/10 bg-primary/4 px-6 py-14 text-center">
        <div
          style={{ background: "rgba(15,77,60,0.08)" }}
          className="flex h-16 w-16 items-center justify-center rounded-full text-primary"
        >
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-950">Enquiry received!</p>
          <p className="mt-2 text-sm leading-7 text-muted">
            Our team will review your requirements and respond within 24 hours.
          </p>
        </div>
        <a href="#contact" className="button-secondary text-sm">
          Submit another enquiry
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && (
        <div
          style={{ background: "#fef2f2", borderColor: "#fecaca" }}
          className="flex items-start gap-3 rounded-2xl border px-4 py-3"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: "#ef4444" }} />
          <p className="text-sm" style={{ color: "#b91c1c" }}>{state.message}</p>
        </div>
      )}

      {/* Row 1: Name + Company */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="qf-name" className="text-sm font-medium text-slate-900">
            Full Name <span style={{ color: "#ef4444" }}>*</span>
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="qf-company" className="text-sm font-medium text-slate-900">
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

      {/* Row 2: Email + Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="qf-email" className="text-sm font-medium text-slate-900">
            Email Address <span style={{ color: "#ef4444" }}>*</span>
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="qf-phone" className="text-sm font-medium text-slate-900">
            Phone / WhatsApp
          </label>
          <input
            id="qf-phone"
            name="phone"
            type="tel"
            placeholder="+1 555 000 0000"
            className={fieldClass}
          />
        </div>
      </div>

      {/* Row 3: Country + Enquiry Type */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="qf-country" className="text-sm font-medium text-slate-900">
            Country
          </label>
          <input
            id="qf-country"
            name="country"
            type="text"
            placeholder="United States"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="qf-enquiryType" className="text-sm font-medium text-slate-900">
            Enquiry Type
          </label>
          <select id="qf-enquiryType" name="enquiryType" className={fieldClass}>
            <option value="">Select type…</option>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-slate-900">Products of Interest</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PRODUCTS.map((product) => (
            <label
              key={product}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-primary/30"
              style={{ "--tw-bg-opacity": "1" } as React.CSSProperties}
            >
              <input
                type="checkbox"
                name="products"
                value={product}
                className="h-4 w-4 rounded"
                style={{ accentColor: "var(--primary)" }}
              />
              {product}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="qf-message" className="text-sm font-medium text-slate-900">
          Requirements / Message <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <textarea
          id="qf-message"
          name="message"
          required
          rows={4}
          placeholder="Describe your product requirements, estimated quantities, destination country, and any specific quality or packaging preferences…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <SubmitButton />

      <p className="text-center text-xs text-muted">
        We respond within 24 hours. Your information is kept strictly confidential.
      </p>
    </form>
  );
}
