import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout, Field, inputClass, submitClass } from "@/components/layout/AuthLayout";
import { loginUser } from "@/lib/api/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AI Startup Simulator" },
      { name: "description", content: "Sign in to run and review your startup analyses." },
      { property: "og:title", content: "Sign in — AI Startup Simulator" },
      { property: "og:description", content: "Access your startup analyses and reports." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await loginUser({ email, password });
      toast.success("Welcome back");
      window.location.assign("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to pick up where your last analysis left off."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" autoComplete="on">
        <Field label="Email" error={errors.email}>
          <input
            className={inputClass}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Password" error={errors.password}>
          <input
            className={inputClass}
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
            Forgot password?
          </Link>
        </div>
        <button className={submitClass} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
