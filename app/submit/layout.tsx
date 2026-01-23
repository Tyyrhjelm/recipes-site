'use client'

import { RecipeFormProvider } from '@/components/submit/recipe-form-context';

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RecipeFormProvider>{children}</RecipeFormProvider>;
}