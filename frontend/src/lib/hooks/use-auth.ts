import { useEffect, useState } from "react";
import { fetchCurrentUser, getStoredAuth } from "@/lib/api/auth";
import type { SessionUser } from "@/lib/types";

export function useAuthSession() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const stored = getStoredAuth();
      if (!stored) {
        if (active) {
          setSession(null);
          setHydrated(true);
          setLoading(false);
        }
        return;
      }

      try {
        const user = await fetchCurrentUser();
        if (active) {
          setSession({ name: user.name, email: user.email });
        }
      } catch {
        if (active) {
          setSession(null);
        }
      } finally {
        if (active) {
          setHydrated(true);
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  return { session, hydrated, loading, setSession };
}
