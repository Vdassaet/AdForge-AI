import { PublicForm } from "@/components/forms/public-form";


export const metadata = {
  title: "Get a Free Estimate",
  description: "Request a free estimate for your project.",
};

export default function PublicFormPage({ params }: { params: { formId: string } }) {
  // In a real app, validate that formId is a valid UUID and exists in DB
  // if (!isValid(params.formId)) return notFound();

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 flex items-center justify-center">
      <PublicForm formId={params.formId} />
    </div>
  );
}
