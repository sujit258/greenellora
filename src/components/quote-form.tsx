"use client";

import { AlertCircle, Building2, CheckCircle2, ChevronDown, Clock, FileText, Globe, Loader2, Mail, Phone, Send, User } from "lucide-react";
import { useActionState, useCallback, useEffect, useRef, useState, type FormEvent } from "react";
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

const DIAL_CODES = [
  { code: "US", dial: "+1",   label: "US +1",   minDigits: 10, maxDigits: 10 },
  { code: "GB", dial: "+44",  label: "UK +44",  minDigits: 10, maxDigits: 10 },
  { code: "AU", dial: "+61",  label: "AU +61",  minDigits: 9,  maxDigits: 9 },
  { code: "CA", dial: "+1",   label: "CA +1",   minDigits: 10, maxDigits: 10 },
  { code: "DE", dial: "+49",  label: "DE +49",  minDigits: 6,  maxDigits: 11 },
  { code: "FR", dial: "+33",  label: "FR +33",  minDigits: 9,  maxDigits: 9 },
  { code: "NL", dial: "+31",  label: "NL +31",  minDigits: 9,  maxDigits: 9 },
  { code: "AE", dial: "+971", label: "UAE +971", minDigits: 9,  maxDigits: 9 },
  { code: "SA", dial: "+966", label: "SA +966", minDigits: 9,  maxDigits: 9 },
  { code: "KW", dial: "+965", label: "KW +965", minDigits: 8,  maxDigits: 8 },
  { code: "QA", dial: "+974", label: "QA +974", minDigits: 8,  maxDigits: 8 },
  { code: "SG", dial: "+65",  label: "SG +65",  minDigits: 8,  maxDigits: 8 },
  { code: "MY", dial: "+60",  label: "MY +60",  minDigits: 9,  maxDigits: 10 },
  { code: "JP", dial: "+81",  label: "JP +81",  minDigits: 10, maxDigits: 10 },
  { code: "KR", dial: "+82",  label: "KR +82",  minDigits: 9,  maxDigits: 10 },
  { code: "CN", dial: "+86",  label: "CN +86",  minDigits: 11, maxDigits: 11 },
  { code: "ZA", dial: "+27",  label: "ZA +27",  minDigits: 9,  maxDigits: 9 },
  { code: "NG", dial: "+234", label: "NG +234", minDigits: 8,  maxDigits: 11 },
  { code: "KE", dial: "+254", label: "KE +254", minDigits: 9,  maxDigits: 9 },
  { code: "BR", dial: "+55",  label: "BR +55",  minDigits: 10, maxDigits: 11 },
  { code: "MX", dial: "+52",  label: "MX +52",  minDigits: 10, maxDigits: 10 },
  { code: "NZ", dial: "+64",  label: "NZ +64",  minDigits: 8,  maxDigits: 8 },
  { code: "IT", dial: "+39",  label: "IT +39",  minDigits: 8,  maxDigits: 10 },
  { code: "ES", dial: "+34",  label: "ES +34",  minDigits: 9,  maxDigits: 9 },
  { code: "SE", dial: "+46",  label: "SE +46",  minDigits: 7,  maxDigits: 9 },
  { code: "NO", dial: "+47",  label: "NO +47",  minDigits: 8,  maxDigits: 8 },
  { code: "DK", dial: "+45",  label: "DK +45",  minDigits: 8,  maxDigits: 8 },
  { code: "CH", dial: "+41",  label: "CH +41",  minDigits: 9,  maxDigits: 9 },
  { code: "PL", dial: "+48",  label: "PL +48",  minDigits: 9,  maxDigits: 9 },
  { code: "IN", dial: "+91",  label: "IN +91",  minDigits: 10, maxDigits: 10 },
  { code: "OTHER", dial: "+", label: "Other",    minDigits: 7,  maxDigits: 15 },
];

const fieldClass = "input-field";

type FieldName = "name" | "email" | "phone" | "country" | "enquiryType" | "message";

type FieldErrors = Partial<Record<FieldName, string>>;

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

/* ─── Individual field validators ─── */
function validateField(name: FieldName, value: string, dialCode?: string): string | null {
  const trimmed = value.trim();
  switch (name) {
    case "name":
      return trimmed ? null : "Please enter your full name.";
    case "email": {
      if (!trimmed) return "Please enter a valid email address.";
      // Strict email validation: proper domain structure, no consecutive dots, TLD 2-6 chars
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
      // Catch suspicious patterns like "commm" (3+ identical consecutive chars in TLD)
      const tld = trimmed.split(".").pop() || "";
      const repeatedChar = /(.)\1{2,}/;
      if (repeatedChar.test(tld)) return "Please enter a valid email address.";
      return null;
    }
    case "phone": {
      if (!trimmed) return "Please enter a valid phone number.";
      const dialEntry = DIAL_CODES.find((d) => d.dial === dialCode);
      if (!dialEntry) return "Please enter a valid phone number.";
      const expected = dialEntry.minDigits === dialEntry.maxDigits
        ? `exactly ${dialEntry.minDigits} digits`
        : `${dialEntry.minDigits}-${dialEntry.maxDigits} digits`;
      const regex = new RegExp(`^\\d{${dialEntry.minDigits},${dialEntry.maxDigits}}$`);
      return regex.test(trimmed) ? null : `Please enter a valid phone number (${expected}) for ${dialEntry.label}.`;
    }
    case "country":
      return trimmed ? null : "Please select a destination country.";
    case "enquiryType":
      return trimmed ? null : "Please select an enquiry type.";
    case "message":
      return trimmed ? null : "Please enter your requirements.";
    default:
      return null;
  }
}

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
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const MAX_MESSAGE_LENGTH = 1000;
  const formRef = useRef<HTMLFormElement>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dialCode, setDialCode] = useState("+91");
  const [phoneValue, setPhoneValue] = useState("");
  const dialCodeRef = useRef(dialCode);
  dialCodeRef.current = dialCode;

  /* ─── Show overlay then fade everything after timeout ─── */
  const clearServerBanners = useCallback(() => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => {
      setShowSuccessOverlay(false);
      setShowSuccessBanner(true);
      successTimerRef.current = setTimeout(() => {
        setShowSuccessBanner(false);
      }, 2000);
    }, 4000);
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      setShowSuccessOverlay(true);
      setShowSuccessBanner(false);
      setPhoneValue("");
      setMessageLength(0);
      clearServerBanners();
    }
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, [state.status, clearServerBanners]);

  /* ─── Validate a single field and update errors ─── */
  const validateAndSetError = useCallback((field: FieldName, value: string, currentDial: string) => {
    const error = field === "phone"
      ? validateField(field, value, currentDial)
      : validateField(field, value);
    setFieldErrors((prev) => {
      if (error) {
        return { ...prev, [field]: error };
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /* ─── Clear error when field becomes valid (on change) ─── */
  const handleFieldChange = useCallback((field: FieldName, value: string) => {
    const error = field === "phone"
      ? validateField(field, value, dialCodeRef.current)
      : validateField(field, value);
    if (error === null) {
      setFieldErrors((prev) => {
        if (prev[field] !== undefined) {
          const next = { ...prev };
          delete next[field];
          return next;
        }
        return prev;
      });
    }
  }, []);

  /* ─── Validate on blur for immediate feedback ─── */
  const handleFieldBlur = useCallback((field: FieldName, value: string) => {
    const error = field === "phone"
      ? validateField(field, value, dialCodeRef.current)
      : validateField(field, value);
    setFieldErrors((prev) => {
      if (error) {
        return { ...prev, [field]: error };
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /* ─── When dial code changes, re-validate phone immediately ─── */
  const handleDialCodeChange = useCallback((newDial: string) => {
    setDialCode(newDial);
    dialCodeRef.current = newDial;
    // Immediately re-validate the current phone value against new dial code
    if (phoneValue) {
      const error = validateField("phone", phoneValue, newDial);
      setFieldErrors((prev) => {
        if (error) {
          return { ...prev, phone: error };
        }
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }
  }, [phoneValue]);

  /* ─── Full form validation on submit ─── */
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
    } else {
      // Strict email validation (matching client-side)
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address.";
      } else {
        // Check for suspicious repeated chars in TLD (e.g., "commm")
        const tld = email.split(".").pop() || "";
        const repeatedChar = /(.)\1{2,}/;
        if (repeatedChar.test(tld)) {
          errors.email = "Please enter a valid email address.";
        }
      }
    }
    if (!phone) errors.phone = "Please enter a valid phone number.";
    if (!country) errors.country = "Please select a destination country.";
    if (!enquiryType) errors.enquiryType = "Please select an enquiry type.";
    if (!message) errors.message = "Please enter your requirements.";

    const firstError = Object.keys(errors)[0] as FieldName | undefined;
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

  /* ─── Phone number: only digits allowed ─── */
  function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const allowed = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (allowed.includes(e.key)) return;
    if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) return;
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    setPhoneValue(digits);
    // Use ref to get latest dial code (avoids stale closure)
    const error = validateField("phone", digits, dialCodeRef.current);
    if (error === null) {
      setFieldErrors((prev) => {
        if (prev.phone !== undefined) {
          const next = { ...prev };
          delete next.phone;
          return next;
        }
        return prev;
      });
    }
  }

  return (
    <div className="relative">
      {/* ── Success Overlay (covers the entire form) ── */}
      {showSuccessOverlay && (
        <div className="qf-success-overlay">
          <div className="qf-success-overlay-inner">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
            <p className="qf-success-overlay-title">Inquiry Sent Successfully!</p>
            <p className="qf-success-overlay-text">
              Thank you for reaching out! Our team will review your inquiry and respond within one business day.
            </p>
          </div>
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-0" noValidate onSubmit={validateForm}>
        {lockedProduct ? <input type="hidden" name="products" value={lockedProduct} /> : null}
        {productReference ? <input type="hidden" name="productReference" value={productReference} /> : null}
        {productPageUrl ? <input type="hidden" name="productPageUrl" value={productPageUrl} /> : null}

        {/* Form Header */}
        <div className="qf-header">
          <h3 className="qf-title">Send Your Inquiry</h3>
          <div className="qf-title-accent" />
        </div>

        {/* Success Banner (briefly shown after overlay fades) */}
        {showSuccessBanner && (
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
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={(e) => handleFieldBlur("name", e.target.value)}
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
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={(e) => handleFieldBlur("email", e.target.value)}
              />
            </div>
            {fieldErrors.email && (
              <p id="qf-email-error" role="alert" className="qf-err-msg">
                <AlertCircle className="h-3.5 w-3.5" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Phone / WhatsApp - no Phone icon */}
          <div className="qf-field">
            <label htmlFor="qf-phone" className="qf-label">
              Phone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className={`qf-phone-wrap ${fieldErrors.phone ? "qf-input-error" : ""}`}>
                <div className="qf-dial-wrap">
                  <select
                    className="qf-dial-select"
                    value={dialCode}
                    onChange={(e) => handleDialCodeChange(e.target.value)}
                    aria-label="Country code"
                  >
                    {DIAL_CODES.map((dc) => (
                      <option key={dc.code} value={dc.dial}>{dc.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="qf-dial-chevron" aria-hidden="true" />
                </div>
                <div className="qf-phone-divider" aria-hidden="true" />
                <div className="qf-phone-input-wrap">
                  <input
                    id="qf-phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phoneValue}
                    placeholder="Enter phone number"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? "qf-phone-error" : undefined}
                    className="qf-phone-input"
                    onChange={handlePhoneChange}
                    onKeyDown={handlePhoneKeyDown}
                    onBlur={() => validateAndSetError("phone", phoneValue, dialCodeRef.current)}
                  />
                </div>
                {/* Hidden field to submit dial code + number (only if digits entered) */}
                {phoneValue && <input type="hidden" name="phone" value={`${dialCode}${phoneValue}`} />}
              </div>
              {fieldErrors.phone && (
                <p id="qf-phone-error" role="alert" className="qf-err-msg">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {fieldErrors.phone}
                </p>
              )}
            </div>
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
                onChange={(e) => handleFieldChange("country", e.target.value)}
                onBlur={(e) => handleFieldBlur("country", e.target.value)}
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
                onChange={(e) => handleFieldChange("enquiryType", e.target.value)}
                onBlur={(e) => handleFieldBlur("enquiryType", e.target.value)}
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
              onChange={(e) => {
                setMessageLength(e.target.value.length);
                handleFieldChange("message", e.target.value);
              }}
              onBlur={(e) => handleFieldBlur("message", e.target.value)}
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
    </div>
  );
}