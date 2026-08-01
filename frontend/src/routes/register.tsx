import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout, Field, inputClass, submitClass } from "@/components/layout/AuthLayout";
import { loginUser, registerUser, requestOtp, verifyOtp } from "@/lib/api/auth";

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
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step === "form") {
      const next: Record<string, string> = {};
      if (form.name.trim().length < 2) next.name = "Tell us what to call you";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
      if (form.password.length < 8) next.password = "Use at least 8 characters";
      setErrors(next);
      if (Object.keys(next).length) return;
      setLoading(true);
      try {
        const result = await requestOtp(form.email);
        setStep("otp");
        setErrors({});
        toast.success(result.dev_mode ? "Dev OTP ready — check backend logs" : "Verification code sent to your email");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to send verification code";
        toast.error(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    const next: Record<string, string> = {};
    if (otpCode.trim().length < 4) next.otp = "Enter the code from your email";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await verifyOtp({ email: form.email, code: otpCode, name: form.name });
      await registerUser({ name: form.name, email: form.email, password: form.password });
      await loginUser({ email: form.email, password: form.password });
      toast.success("Account created — let's analyze something");
      window.location.assign("/dashboard");
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
      <form onSubmit={submit} className="space-y-4" autoComplete="off">
        {step === "form" && (
          <>
            <Field label="Full name" error={errors.name}>
              <input
                className={inputClass}
                name="name"
                value={form.name}
                onChange={set("name")}
                placeholder="Ada Lovelace"
                autoComplete="off"
              />
            </Field>
            <Field label="Work email" error={errors.email}>
              <input
                className={inputClass}
                type="email"
                name="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@company.com"
                autoComplete="off"
              />
            </Field>
            <Field label="Password" error={errors.password}>
              <input
                className={inputClass}
                type="password"
                name="password"
                value={form.password}
                onChange={set("password")}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </Field>
          </>
        )}

        {step === "otp" && (
          <Field label="Verification code" error={errors.otp}>
            <input
              className={inputClass}
              name="otp"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter the code from your email"
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </Field>
        )}

        <button className={submitClass} disabled={loading}>
          {loading ? (step === "otp" ? "Creating account…" : "Sending code…") : step === "otp" ? "Verify & create account" : "Send verification code"}
        </button>

        {step === "otp" && (
          <button
            type="button"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              setStep("form");
              setOtpCode("");
              setErrors({});
            }}
          >
            Use a different email
          </button>
        )}

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our terms and privacy policy.
        </p>
      </form>
    </AuthLayout>
  );
}
