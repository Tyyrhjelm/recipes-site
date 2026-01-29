import { requireAuth } from '@/lib/auth';
import { Step7Form } from '@/components/submit/step-7-form';

export default async function Step7Page() {
  const contributor = await requireAuth();

  return <Step7Form contributorEmail={contributor.email} contributorId={contributor.id} />;
}
