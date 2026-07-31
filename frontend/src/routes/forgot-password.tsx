import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { AuthLayout, Field, inputClass, submitClass } from "@/components/layout/AuthLayout";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — AI Startup Simulator" },
      { name: "description", content: "Request a reset link for your AI Startup Simulator account." },
      { property: "og:title", content: "Reset password — AI Startup Simulator" },
      { property: "og:description", content: "Request a password reset link." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);
    setSent(true);
  }

  return (
    <AuthLayout
      title={sent ? "Check your inbox" : "Reset your password"}
      subtitle={
        sent
          ? "If an account exists for that address, a reset link is on its way."
          : "Enter the email you signed up with and we'll send a reset link."
      }
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-5">
          <MailCheck className="mt-0.5 size-5 shrink-0 text-success" />
          <p className="text-sm text-muted-foreground">
            Sent to <span className="text-foreground">{email}</span>. The link expires in 30 minutes.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email" error={error}>
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </Field>
          <button className={submitClass}>Send reset link</button>
        </form>
      )}
    </AuthLayout>
  );
}
