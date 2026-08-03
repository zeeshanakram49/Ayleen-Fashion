"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactSchema } from "@/lib/validation/schemas";
import { siteConfig } from "@/config/site";

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });
  function submit(values: ContactInput) {
    const subject = encodeURIComponent(`[Aylee website] ${values.subject}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone || "Not provided"}\n\n${values.message}`,
    );
    setMessage(
      "Opening your email app. Your message is not stored by this website.",
    );
    window.location.assign(
      `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`,
    );
  }
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm">
          Name
          <input
            {...register("name")}
            className="field mt-2"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? (
            <span className="mt-1 block text-xs text-[#a82020]">
              {errors.name.message}
            </span>
          ) : null}
        </label>
        <label className="text-sm">
          Email
          <input
            {...register("email")}
            type="email"
            className="field mt-2"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? (
            <span className="mt-1 block text-xs text-[#a82020]">
              {errors.email.message}
            </span>
          ) : null}
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm">
          Phone <span className="text-[#6c6961]">(optional)</span>
          <input {...register("phone")} className="field mt-2" />
        </label>
        <label className="text-sm">
          Subject
          <input
            {...register("subject")}
            className="field mt-2"
            aria-invalid={Boolean(errors.subject)}
          />
          {errors.subject ? (
            <span className="mt-1 block text-xs text-[#a82020]">
              {errors.subject.message}
            </span>
          ) : null}
        </label>
      </div>
      <label className="block text-sm">
        Message
        <textarea
          {...register("message")}
          className="field mt-2 min-h-40 resize-y"
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? (
          <span className="mt-1 block text-xs text-[#a82020]">
            {errors.message.message}
          </span>
        ) : null}
      </label>
      <button className="button-primary">Prepare email</button>
      {message ? (
        <p className="text-sm text-[#6c6961]" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
