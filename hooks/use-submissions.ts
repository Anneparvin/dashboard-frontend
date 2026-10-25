// hooks/use-submissions.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateSubmissionPayload, submissionService } from "@/services/submission.service";

const MY_SUBMISSIONS_KEY = ["submissions", "mine"] as const;

export function useMySubmissions() {
  return useQuery({
    queryKey: MY_SUBMISSIONS_KEY,
    queryFn: submissionService.getMine,
  });
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubmissionPayload) => submissionService.create(payload),
    onSuccess: () => {
      toast.success("Project submitted successfully!");
      queryClient.invalidateQueries({ queryKey: MY_SUBMISSIONS_KEY });
    },
    // error handling ফর্মে করা হয়েছে (duplicate হলে ফিল্ডের নিচে দেখানোর জন্য)
  });
}