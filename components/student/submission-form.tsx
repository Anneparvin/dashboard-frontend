// components/student/submission-form.tsx
"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormField } from "@/components/forms/form-field";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateSubmission } from "@/hooks/use-submissions";
import { getErrorMessage } from "@/lib/api";
import { SubmissionValues, submissionSchema } from "@/validations/submission";

export function SubmissionForm() {
  const createSubmission = useCreateSubmission();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: { projectName: "", repoUrl: "", liveLink: "", description: "" },
  });

  const onSubmit = async (values: SubmissionValues) => {
    try {
      await createSubmission.mutateAsync({
        ...values,
        liveLink: values.liveLink || undefined,
      });
      reset();
    } catch (error) {
      // duplicate repo হলে (409) সরাসরি Repo URL ফিল্ডের নিচে দেখাবে
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError("repoUrl", { message: getErrorMessage(error) });
        return;
      }
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a project</CardTitle>
        <CardDescription>Share your repository and live link for review.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            label="Project name"
            placeholder="My Awesome Project"
            error={errors.projectName?.message}
            {...register("projectName")}
          />
          <FormField
            label="Repository URL"
            placeholder="https://github.com/username/repo"
            error={errors.repoUrl?.message}
            {...register("repoUrl")}
          />
          <FormField
            label="Live link (optional)"
            placeholder="https://my-project.vercel.app"
            error={errors.liveLink?.message}
            {...register("liveLink")}
          />
          <FormTextarea
            label="Description"
            rows={5}
            placeholder="What does your project do? Which technologies did you use?"
            error={errors.description?.message}
            {...register("description")}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}