"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-soft">
      {items.map((item, index) => (
        <div key={item.question}>
          <button
            className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy-900"
            onClick={() => setOpen(open === index ? -1 : index)}
            aria-expanded={open === index}
          >
            {item.question}
            <ChevronDown className={open === index ? "rotate-180 transition" : "transition"} aria-hidden />
          </button>
          {open === index && <p className="px-5 pb-5 text-sm leading-6 text-slate-600">{item.answer}</p>}
        </div>
      ))}
    </div>
  );
}

