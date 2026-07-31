import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Moon } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Pill, Surface } from "@/components/kit";
import { inputClass } from "@/components/layout/AuthLayout";
import { Switch } from "@/components/ui/switch";
import { useAuthSession } from "@/lib/hooks/use-auth";
import { logoutUser } from "@/lib/api/auth";
import { useAnalysisList } from "@/lib/services/analysis-service";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — AI Startup Simulator" },
      { name: "description", content: "Manage your profile, account settings and theme." },
      { property: "og:title", content: "Profile — AI Startup Simulator" },
      { property: "og:description", content: "Account settings and preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { session } = useAuthSession();
  const { items } = useAnalysisList();
  const navigate = useNavigate();
  const name = session?.name ?? "Guest founder";
  const email = session?.email ?? "guest@startupsimulator.app";

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold">Profile</h1>

        <Surface className="mt-8 flex flex-wrap items-center gap-5">
          <span className="grid size-16 place-items-center rounded-full bg-brand-gradient font-display text-lg font-semibold text-primary-foreground">
            {name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-xl font-semibold">{name}</p>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
          <div className="ml-auto">
            <Pill tone="primary">{items.length} analyses</Pill>
          </div>
        </Surface>

        <Surface className="mt-5">
          <h2 className="text-lg font-semibold">Account settings</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">Display name</span>
              <input className={inputClass} defaultValue={name} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">Email</span>
              <input className={inputClass} defaultValue={email} />
            </label>
          </div>
          <button
            onClick={() => toast.success("Profile updated")}
            className="mt-5 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Save changes
          </button>
        </Surface>

        <Surface className="mt-5">
          <h2 className="text-lg font-semibold">Theme</h2>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <Moon className="size-4 text-violet" />
              <div>
                <p className="text-sm font-medium">Midnight (dark)</p>
                <p className="text-xs text-muted-foreground">
                  The simulator is tuned for dark rooms and late nights.
                </p>
              </div>
            </div>
            <Switch checked disabled />
          </div>
        </Surface>

        <Surface className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Session</h2>
            <p className="text-sm text-muted-foreground">Sign out on this device.</p>
          </div>
          <button
            onClick={async () => {
              try {
                await logoutUser();
                toast.success("Signed out");
                navigate({ to: "/login" });
              } catch (error) {
                const message = error instanceof Error ? error.message : "Unable to sign out";
                toast.error(message);
              }
            }}
            className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-5 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </Surface>
      </div>
    </AppShell>
  );
}
