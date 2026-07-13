"use client";

import { AlertCircle, Building2, CheckCircle2, ChevronDown, Clock, FileText, Globe, Loader2, Mail, Phone, Send, User } from "lucide-react";
import { useActionState, useRef, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";

import { submitQuoteForm, type QuoteFormState } from "@/app/actions";

const COUNTRIES = [
  "United States", "United Kingdom", "Australia", "Canada", "Germany",
  "France", "Netherlands", "UAE", "Saudi Arabia", "Kuwait", "Qatar",
  "Singapore", "Malaysia", "Japan", "South Korea", "China", "South Africa",
  "Nigeria", "Kenya", "Brazil", "Mexico", "New Zealand", "Italy", "Spain",
  "Sweden", "Norway", "Denmark", "Switzerland", "Poland", "Other",
];

const ENQUIRY_TYPES = [
  "Sample Request",
  "Bulk Order Pricing",
  "Private Label / Custom Branding",
  "General Enquiry",
];

const fieldClass = "input-field";

type FieldErrors = Partial<Record<
  "name" | "email" | "phone" | "country" | "enquiryType" | "message",
  string
>>;

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
  submitLabel = "Send Inquiry",
  pendingLabel = "Sending...",
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
      className="qf-submit-btn"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          {submitLabel}
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
}: QuoteFormProps) {
  const [state, formAction] = useActionState(submitQuoteForm, initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [messageLength, setMessageLength] = useState(messageDefault?.length ?? 0);
  const MAX_MESSAGE_LENGTH = 1000;
  const formRef = useRef<HTMLFormElement>(null);

  function validateForm(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const enquiryType = String(formData.get("enquiryType") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const errors: FieldErrors = {};

    if (!name) errors.name = "Please enter your full name.";
    if (!email) {
      errors.email = "Please enter a valid email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!phone) errors.phone = "Please enter a valid phone number.";
    if (!country) errors.country = "Please select a destination country.";
    if (!enquiryType) errors.enquiryType = "Please select an enquiry type.";
    if (!message) errors.message = "Please enter your requirements.";

    const firstError = Object.keys(errors)[0] as keyof FieldErrors | undefined;
    if (firstError) {
      event.preventDefault();
      setFieldErrors(errors);
      const field = event.currentTarget.elements.namedItem(firstError) as HTMLElement | null;
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      field?.focus({ preventScroll: true });
      return;
    }

    setFieldErrors({});
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-0" noValidate onSubmit={validateForm}>
      {lockedProduct ? <input type="hidden" name="products" value={lockedProduct} /> : null}
      {productReference ? <input type="hidden" name="productReference" value={productReference} /> : null}
      {productPageUrl ? <input type="hidden" name="productPageUrl" value={productPageUrl} /> : null}

      {/* Form Header */}
      <div className="qf-header">
        <h3 className="qf-title">Send Your Inquiry</h3>
        <div className="qf-title-accent" />
      </div>

      {/* Success Banner */}
      {state.status === "success" && (
        <div className="qf-success-banner">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
          <p className="text-sm font-semibold text-green-800">
            Thank you! Your inquiry has been sent successfully.
          </p>
        </div>
      )}

      {/* Server Error Banner */}
      {state.status === "error" && (
        <div className="qf-error-banner">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-700">{state.message}</p>
        </div>
      )}

      {/* Row 1: Full Name + Company Name */}
      <div className="qf-grid">
        {/* Full Name */}
        <div className="qf-field">
          <label htmlFor="qf-name" className="qf-label">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="qf-field-icon" aria-hidden="true" />
            <input
              id="qf-name"
              name="name"
              type="text"
              required
              placeholder="Jane Smith"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "qf-name-error" : undefined}
              className={`${fieldClass} ${fieldErrors.name ? "qf-input-error" : ""}`}
            />
          </div>
          {fieldErrors.name && (
            <p id="qf-name-error" role="alert" className="qf-err-msg">
              <AlertCircle className="h-3.5 w-3.5" />
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Company Name */}
        <div className="qf-field">
          <label htmlFor="qf-company" className="qf-label">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="qf-field-icon" aria-hidden="true" />
            <input
              id="qf-company"
              name="company"
              type="text"
              placeholder="Acme Distributors"
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Email + Phone */}
      <div className="qf-grid">
        {/* Email Address */}
        <div className="qf-field">
          <label htmlFor="qf-email" className="qf-label">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="qf-field-icon" aria-hidden="true" />
            <input
              id="qf-email"
              name="email"
              type="email"
              required
              placeholder="jane@company.com"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "qf-email-error" : undefined}
              className={`${fieldClass} ${fieldErrors.email ? "qf-input-error" : ""}`}
            />
          </div>
          {fieldErrors.email && (
            <p id="qf-email-error" role="alert" className="qf-err-msg">
              <AlertCircle className="h-3.5 w-3.5" />
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Phone / WhatsApp */}
        <div className="qf-field">
          <label htmlFor="qf-phone" className="qf-label">
            Phone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="qf-field-icon" aria-hidden="true" />
            <input
              id="qf-phone"
              name="phone"
              type="tel"
              required
              placeholder="+1 (555) 000-0000"
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "qf-phone-error" : undefined}
              className={`${fieldClass} ${fieldErrors.phone ? "qf-input-error" : ""}`}
            />
          </div>
          {fieldErrors.phone && (
            <p id="qf-phone-error" role="alert" className="qf-err-msg">
              <AlertCircle className="h-3.5 w-3.5" />
              {fieldErrors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Row 3: Destination Country + Enquiry Type */}
      <div className="qf-grid">
        {/* Destination Country */}
        <div className="qf-field">
          <label htmlFor="qf-country" className="qf-label">
            Destination Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe className="qf-field-icon" aria-hidden="true" />
            <select
              id="qf-country"
              name="country"
              required
              defaultValue=""
              aria-invalid={Boolean(fieldErrors.country)}
              aria-describedby={fieldErrors.country ? "qf-country-error" : undefined}
              className={`${fieldClass} w-full cursor-pointer appearance-none pr-10 ${fieldErrors.country ? "qf-input-error" : ""}`}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          </div>
          {fieldErrors.country && (
            <p id="qf-country-error" role="alert" className="qf-err-msg">
              <AlertCircle className="h-3.5 w-3.5" />
              {fieldErrors.country}
            </p>
          )}
        </div>

        {/* Enquiry Type */}
        <div className="qf-field">
          <label htmlFor="qf-enquiryType" className="qf-label">
            Enquiry Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText className="qf-field-icon" aria-hidden="true" />
            <select
              id="qf-enquiryType"
              name="enquiryType"
              required
              defaultValue={enquiryTypeDefault ?? ""}
              aria-invalid={Boolean(fieldErrors.enquiryType)}
              aria-describedby={fieldErrors.enquiryType ? "qf-enquiry-error" : undefined}
              className={`${fieldClass} w-full cursor-pointer appearance-none pr-10 ${fieldErrors.enquiryType ? "qf-input-error" : ""}`}
            >
              <option value="">Select enquiry type</option>
              {ENQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          </div>
          {fieldErrors.enquiryType && (
            <p id="qf-enquiry-error" role="alert" className="qf-err-msg">
              <AlertCircle className="h-3.5 w-3.5" />
              {fieldErrors.enquiryType}
            </p>
          )}
        </div>
      </div>

      {/* Requirements / Message */}
      <div className="qf-field">
        <div className="flex items-center justify-between">
          <label htmlFor="qf-message" className="qf-label">
            Requirements / Message <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs ${messageLength > MAX_MESSAGE_LENGTH ? "text-red-500" : "text-muted"}`}>
            {messageLength}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
        <div className="relative">
          <textarea
            id="qf-message"
            name="message"
            required
            rows={4}
            defaultValue={messageDefault}
            placeholder="Please describe your requirements in detail..."
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? "qf-message-error" : undefined}
            className={`${fieldClass} resize-none ${fieldErrors.message ? "qf-input-error" : ""}`}
            style={{ paddingLeft: "1rem", paddingTop: "0.75rem" }}
            onChange={(e) => setMessageLength(e.target.value.length)}
            maxLength={MAX_MESSAGE_LENGTH}
          />
        </div>
        {fieldErrors.message && (
          <p id="qf-message-error" role="alert" className="qf-err-msg">
            <AlertCircle className="h-3.5 w-3.5" />
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="qf-action-bar">
        <div className="qf-response-badge">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>Our team will respond within one business day.</span>
        </div>
        <SubmitButton submitLabel={submitLabel} pendingLabel={pendingLabel} />
      </div>
    </form>
  );
}
