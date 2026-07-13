"use client";

import { clsx } from "clsx";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({ className, variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <button
      className={clsx(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition",
        variant === "primary" && "bg-navy-800 text-white shadow-soft hover:bg-navy-700",
        variant === "secondary" && "border border-gold-400 bg-white text-navy-900 hover:bg-gold-400/10",
        variant === "ghost" && "text-navy-700 hover:bg-navy-50",
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <a
      className={clsx(
        "focus-ring inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition",
        variant === "primary" ? "bg-navy-800 text-white shadow-soft hover:bg-navy-700" : "border border-gold-400 bg-white text-navy-900 hover:bg-gold-400/10"
      )}
      href={href}
    >
      {children}
    </a>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-navy-800">
      <span>{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx("focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-navy-900 shadow-sm", props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={clsx("focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-navy-900 shadow-sm", props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx("focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-navy-900 shadow-sm", props.className)} />;
}

export function SectionTitle({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gold-500">{eyebrow}</p>}
      <h2 className="text-3xl font-bold text-navy-900 md:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-slate-600">{text}</p>}
    </div>
  );
}
