import { requireAuth } from '@/lib/auth';
import { Step6PlaceholderContent } from '@/components/submit/step-6-placeholder-content';

export default async function Step6PlaceholderPage() {
  await requireAuth();

  return <Step6PlaceholderContent />;
}
