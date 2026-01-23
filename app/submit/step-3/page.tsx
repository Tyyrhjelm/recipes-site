import { requireAuth } from '@/lib/auth';
import { Step3Form } from '@/components/submit/step-3-form';

export default async function Step3Page() {
  await requireAuth();

  return (
      <Step3Form />
  );
}
