import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import authArt from "@/assets/auth-art.jpg";
import { Logo } from "@/components/layout/AppShell";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
      <div className="relative flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12"
        >
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </motion.div>
        <Link to="/" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
          ← Back to home
        </Link>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border lg:block">
        <img
          src={authArt}
          width={1024}
          height={1536}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-sm font-display text-2xl font-medium leading-snug">
            "We killed two ideas and doubled down on the third — all in one afternoon."
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Ana Duarte · Founder, Reframe</p>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-input bg-card/60 px-4 py-3 text-[15px] outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-4 focus:ring-primary/15";

export const submitClass =
  "w-full rounded-xl bg-brand-gradient px-4 py-3 text-[15px] font-medium text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60";
