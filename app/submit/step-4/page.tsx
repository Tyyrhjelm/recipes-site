import { requireAuth } from '@/lib/auth';
import { Step4Form } from '@/components/submit/step-4-form';

export default async function Step4Page() {
  await requireAuth();

  return <Step4Form />;
}
