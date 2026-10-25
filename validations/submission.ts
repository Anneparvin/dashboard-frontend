// validations/submission.ts
import { z } from "zod";

const REPO_HOSTS = ["github.com", "gitlab.com", "bitbucket.org"];

const isRepoUrl = (value: string) => {
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    return (
      url.protocol === "https:" &&
      REPO_HOSTS.includes(url.hostname.replace(/^www\./, "")) &&
      segments.length >= 2
    );
  } catch {
    return false;
  }
};

export const submissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be at most 100 characters"),
  repoUrl: z
    .string()
    .trim()
    .min(1, "Repository URL is required")
    .refine(isRepoUrl, "Use a GitHub, GitLab or Bitbucket repository link (https://...)"),
  // খালি রাখা যাবে (optional), দিলে http/https হতে হবে
  liveLink: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Live link must start with http:// or https://"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be at most 1000 characters"),
});

export type SubmissionValues = z.infer<typeof submissionSchema>;