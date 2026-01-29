import { requireAuth } from '@/lib/auth';
import { Step5Form } from '@/components/submit/step-5-form';

export default async function Step5Page() {
  await requireAuth();

  return <Step5Form />;
}
