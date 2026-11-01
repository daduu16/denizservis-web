"use client";

import { LocalizedInput, LocalizedTextarea } from "./LocalizedElements";
import { T } from "@/components/LanguageProvider";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { cloneElement, isValidElement, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { bookingSchema, type BookingInput } from "@/lib/validation";
import { DeviceTypeSelect } from "./DeviceTypeSelect";
import { trackAnalyticsEvent } from "../lib/analytics";
import { submitBooking } from "../lib/formsubmit";

type SubmitState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const inputClass = "form-control";

export function BookingForm({ compact = false }: { compact?: boolean; hideNote?: boolean }) {
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle" });
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { consent: false, website: "" },
  });

  const onSubmit = async (values: BookingInput) => {
    setSubmitState({ type: "idle" });
    try {
      const message = await submitBooking(values);
      setSubmitState({ type: "success", message });
      trackAnalyticsEvent("contact_form_submit");
      reset();
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "Gözlənilməz xəta baş verdi.",
      });
    }
  };

  return (
    <form className={`booking-form ${compact ? "booking-form--compact" : ""}`} onSubmit={handleSubmit(onSubmit, () => setSubmitState({ type: "idle" }))} onChange={() => {
      if (submitState.type !== "idle") setSubmitState({ type: "idle" });
    }} noValidate>
      <div className="form-grid">
        <Field label="Ad" error={errors.name?.message} required>
          <LocalizedInput {...register("name")} className={inputClass} autoComplete="name" placeholder="Adınızı daxil edin" aria-invalid={!!errors.name} />
        </Field>
        <Field label="Telefon" error={errors.phone?.message} required>
          <LocalizedInput {...register("phone")} className={inputClass} type="tel" inputMode="tel" autoComplete="tel" placeholder="050 123 45 67" aria-invalid={!!errors.phone} />
        </Field>
        <Controller name="deviceType" control={control} render={({ field }) => (
          <DeviceTypeSelect value={field.value} onChange={(value) => {
            if (submitState.type !== "idle") setSubmitState({ type: "idle" });
            field.onChange(value);
          }} onBlur={field.onBlur} inputRef={field.ref} error={errors.deviceType?.message} wide={compact} />
        )} />
        {!compact && (
          <Field label="Marka (istəyə görə)" error={errors.brand?.message}>
            <LocalizedInput {...register("brand")} className={inputClass} autoComplete="off" placeholder="Məsələn, Bosch" aria-invalid={!!errors.brand} />
          </Field>
        )}
        <Field label="Problem (istəyə görə)" error={errors.problem?.message} wide>
          <LocalizedTextarea {...register("problem")} className={inputClass} rows={compact ? 2 : 4} placeholder="Cihazda müşahidə etdiyiniz problemi qısa yazın" aria-invalid={!!errors.problem} />
        </Field>
        {!compact && (
          <Field label="Rayon / ünvan (istəyə görə)" error={errors.address?.message} wide>
            <LocalizedInput {...register("address")} className={inputClass} autoComplete="street-address" placeholder="Xidmət tələb olunan ərazi" aria-invalid={!!errors.address} />
          </Field>
        )}
      </div>

      {compact && (
        <details className="extra-fields">
          <summary><T>Marka və ünvan əlavə et</T></summary>
          <div className="extra-fields-grid">
            <Field label="Marka (istəyə görə)" error={errors.brand?.message}>
              <LocalizedInput {...register("brand")} className={inputClass} autoComplete="off" placeholder="Məsələn, Bosch" aria-invalid={!!errors.brand} />
            </Field>
            <Field label="Rayon / ünvan (istəyə görə)" error={errors.address?.message}>
              <LocalizedInput {...register("address")} className={inputClass} autoComplete="street-address" placeholder="Xidmət tələb olunan ərazi" aria-invalid={!!errors.address} />
            </Field>
          </div>
        </details>
      )}

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website"><T>Sayt</T></label>
        <LocalizedInput id="website" {...register("website")} tabIndex={-1} autoComplete="off" />
      </div>

      <label className="consent-row">
        <LocalizedInput type="checkbox" {...register("consent")} aria-invalid={!!errors.consent} />
        <span><T>
          Müraciətimə cavab verilməsi üçün məlumatlarımın işlənməsinə razıyam. </T><Link href="/mexfilik"><T>Məxfilik qeydi</T></Link>
        </span>
      </label>
      {errors.consent?.message && <p className="field-error" role="alert"><T>{errors.consent.message}</T></p>}

      {submitState.type !== "idle" && (
        <div className={`form-alert form-alert--${submitState.type}`} role="status" aria-live="polite">
          {submitState.type === "success" ? <CheckCircle2 aria-hidden="true" /> : <AlertCircle aria-hidden="true" />}
          <span><T>{submitState.message}</T></span>
        </div>
      )}

      <button className="button w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
        <T>{isSubmitting ? "Göndərilir..." : "Müraciəti göndər"}</T>
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  required = false,
  wide = false,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  const control = isValidElement<{ id?: string; "aria-describedby"?: string; "aria-required"?: boolean }>(children)
    ? cloneElement(children, { id, "aria-describedby": error ? `${id}-error` : undefined, "aria-required": required || undefined })
    : children;
  return (
    <div className={`field ${wide ? "field--wide" : ""}`}>
      <label className="field-label" htmlFor={id}><T>{label}</T>{required && <span aria-hidden="true"> *</span>}</label>
      {control}
      {error && <span id={`${id}-error`} className="field-error" role="alert"><T>{error}</T></span>}
    </div>
  );
}
