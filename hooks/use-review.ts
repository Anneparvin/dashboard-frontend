// hooks/use-review.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import { ListParams, reviewService } from "@/services/review.service";

export function useReviewSubmissions(params: ListParams) {
  return useQuery({
    queryKey: ["review", "list", params],
    queryFn: () => reviewService.list(params),
    placeholderData: keepPreviousData, // পেজ বদলালে আগের data দেখাবে, ফাঁকা হবে না
  });
}

export function useReviewStats() {
  return useQuery({
    queryKey: ["review", "stats"],
    queryFn: reviewService.stats,
  });
}

export function useReviewSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      reviewService.review(id, status),
    onSuccess: (data) => {
      toast.success(`Project ${data.status.toLowerCase()}`);
      // list আর stats দুটোই নতুন করে আনবে
      queryClient.invalidateQueries({ queryKey: ["review"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}