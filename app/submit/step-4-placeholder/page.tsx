import { requireAuth } from '@/lib/auth';
import { Step4PlaceholderContent } from '@/components/submit/step-4-placeholder-content';

export default async function Step4PlaceholderPage() {
  await requireAuth();

  return (
      <Step4PlaceholderContent />
  );
}