// services/review.service.ts
import { api } from "@/lib/api";
import { ApiResponse, PaginatedResponse, ReviewStats, ReviewSubmission, StatusFilter } from "@/types";

export interface ListParams {
  page: number;
  limit: number;
  status: StatusFilter;
}

export const reviewService = {
  async list({ page, limit, status }: ListParams) {
    const res = await api.get<PaginatedResponse<ReviewSubmission>>("/review/submissions", {
      // "ALL" হলে status পাঠানোই হয় না, filter backend-এ হয়
      params: { page, limit, ...(status !== "ALL" ? { status } : {}) },
    });
    return res.data;
  },

  async stats() {
    const res = await api.get<ApiResponse<ReviewStats>>("/review/stats");
    return res.data.data;
  },

  async review(id: string, status: "APPROVED" | "REJECTED") {
    const res = await api.patch<ApiResponse<ReviewSubmission>>(`/review/submissions/${id}/status`, {
      status,
    });
    return res.data.data;
  },
};