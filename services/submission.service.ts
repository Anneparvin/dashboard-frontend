// services/submission.service.ts
import { api } from "@/lib/api";
import { ApiResponse, Submission } from "@/types";
import { SubmissionValues } from "@/validations/submission";

export interface CreateSubmissionPayload extends Omit<SubmissionValues, "liveLink"> {
  liveLink?: string;
}

export const submissionService = {
  async create(payload: CreateSubmissionPayload) {
    const res = await api.post<ApiResponse<Submission>>("/submissions", payload);
    return res.data.data;
  },

  async getMine() {
    const res = await api.get<ApiResponse<Submission[]>>("/submissions/my");
    return res.data.data;
  },
};