import { requireAuth } from '@/lib/auth';
import { Step1Form } from '@/components/submit/step-1-form';

export default async function Step1Page() {
  const contributor = await requireAuth();

  return (
      <Step1Form contributorEmail={contributor.email} />
  );
}
