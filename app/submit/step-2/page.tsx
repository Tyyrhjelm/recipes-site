import { requireAuth } from '@/lib/auth';
import { Step2Form } from '@/components/submit/step-2-form';

export default async function Step2Page() {
  await requireAuth();

  return (
      <Step2Form />
  );
}
