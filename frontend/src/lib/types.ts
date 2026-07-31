export type AnalysisStatus = "running" | "completed" | "failed";

export type AnalysisItem = {
  analysis_id: string;
  startup_name: string;
  status: AnalysisStatus;
  created_at?: string;
  completed_at?: string;
  total_runtime?: number | null;
};

export type SessionUser = {
  name: string;
  email: string;
};
