// src/types/index.ts
export type Role = "STUDENT" | "MENTOR" | "ADMIN";
export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type StatusFilter = SubmissionStatus | "ALL";


export interface Submission {
  id: string;
  projectName: string;
  repoUrl: string;
  liveLink: string | null;
  description: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface ReviewSubmission extends Submission {
  student: { id: string; name: string; email: string };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}