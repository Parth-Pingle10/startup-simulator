import { apiDelete, apiGet, apiPost } from "@/lib/api/client";

export type StartupAnalysisPayload = {
  startup_name: string;
  problem: string;
  solution: string;
  target_users: string;
};

export type AnalysisSummary = {
  analysis_id: string;
  startup_name: string;
  status: string;
  created_at?: string;
  completed_at?: string;
  total_runtime?: number | null;
};

export type AnalysisListResponse = {
  analysis: AnalysisSummary[];
};

export type AnalysisDetailResponse = Record<string, unknown>;

export type ProgressResponse = {
  status?: string;
  progress?: number;
  current_agent?: string | null;
  started_at?: string;
  completed_at?: string;
  total_runtime?: number | null;
};

export async function createStartupAnalysis(payload: StartupAnalysisPayload) {
  return apiPost<{ success: boolean; data: unknown; analysis_id?: string }>('/analyze', payload);
}

export async function getAnalysisHistory() {
  return apiGet<AnalysisListResponse>('/analysis');
}

export async function getAnalysisDetail(analysisId: string) {
  return apiGet<AnalysisDetailResponse>(`/analysis/${analysisId}`);
}

export async function getAnalysisProgress(analysisId: string) {
  return apiGet<ProgressResponse>(`/analysis/${analysisId}/progress`);
}

export async function deleteAnalysis(analysisId: string) {
  return apiDelete<{ message: string }>(`/analysis/${analysisId}`);
}
