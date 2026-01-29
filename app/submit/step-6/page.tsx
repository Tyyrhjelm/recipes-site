import { requireAuth } from '@/lib/auth';
import { Step6Form } from '@/components/submit/step-6-form';

export default async function Step6Page() {
  await requireAuth();

  return <Step6Form />;
}
