import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout, Field, inputClass, submitClass } from "@/components/layout/AuthLayout";
import { registerUser } from "@/lib/api/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — AI Startup Simulator" },
      { name: "description", content: "Create a free account and run your first startup analysis." },
      { property: "og:title", content: "Create account — AI Startup Simulator" },
      { property: "og:description", content: "Run your first AI startup analysis free." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Tell us what to call you";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.password.length < 8) next.password = "Use at least 8 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      toast.success("Account created — let's analyze something");
      navigate({ to: "/login" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free to start. Your first analysis takes about a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name" error={errors.name}>
          <input className={inputClass} value={form.name} onChange={set("name")} placeholder="Ada Lovelace" />
        </Field>
        <Field label="Work email" error={errors.email}>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@company.com"
          />
        </Field>
        <Field label="Password" error={errors.password}>
          <input
            className={inputClass}
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="At least 8 characters"
          />
        </Field>
        <button className={submitClass} disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our terms and privacy policy.
        </p>
      </form>
    </AuthLayout>
  );
}
