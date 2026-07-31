export { useAnalysisList as useAnalyses, removeAnalysis as removeAnalysis } from "./services/analysis-service";
export { useAnalysisDetail as useAnalysis, useAnalysisProgress } from "./services/analysis-service";
export { useAuthSession as useSession, type useAuthSession as SessionHook } from "./hooks/use-auth";
export { loginUser, registerUser, fetchCurrentUser, logoutUser, getStoredAuth } from "./api/auth";
export type { SessionUser } from "./types";

export function signIn(session: { name: string; email: string }) {
  return session;
}

export function signOut() {
  return null;
}

export function createAnalysis(_input: { name: string; problem: string; solution: string; targetUsers: string }) {
  return "";
}

export function completeAnalysis(_id: string) {
  return null;
}

export function getAnalysis(_id: string) {
  return null;
}
