import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LogOut, Menu, Plus, Sparkles, User, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { logoutUser } from "@/lib/api/auth";
import { useAuthSession } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative grid size-8 shrink-0 place-items-center rounded-xl bg-brand-gradient">
        <Sparkles className="size-4 text-primary-foreground" strokeWidth={2.5} />
        <span className="absolute inset-0 rounded-xl bg-brand-gradient opacity-50 blur-md transition-opacity group-hover:opacity-80" />
      </span>
      {!compact && (
        <span className="font-display text-[15px] font-semibold tracking-tight">
          Startup<span className="text-muted-foreground">Simulator</span>
        </span>
      )}
    </Link>
  );
}

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/profile", label: "Profile" },
] as const;

export function AppShell({
  children,
  bleed = false,
}: {
  children: ReactNode;
  bleed?: boolean;
}) {
  const { session } = useAuthSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent)]" />
      <header className="sticky top-0 z-50 border-b border-border/60 glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
          <Logo />
          <nav className="ml-4 hidden items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 md:flex">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-elevated"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/analysis/new"
              className="hidden items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] sm:inline-flex"
            >
              <Plus className="size-4" /> New analysis
            </Link>
            <Link
              to="/profile"
              className="grid size-9 place-items-center rounded-full border border-border bg-card text-xs font-semibold"
            >
              {session ? session.name.slice(0, 2).toUpperCase() : <User className="size-4" />}
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full border border-border bg-card md:hidden"
              aria-label="Menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border/60 px-5 py-3 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={async () => {
                await logoutUser();
                navigate({ to: "/login" });
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        )}
      </header>

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn("relative", bleed ? "" : "mx-auto max-w-6xl px-5 pb-24 pt-10")}
      >
        {children}
      </motion.main>
    </div>
  );
}
