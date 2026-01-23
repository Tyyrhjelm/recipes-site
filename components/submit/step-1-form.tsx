'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeForm } from './recipe-form-context';
import { FormLayout } from './form-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface Athlete {
  name: string;
  sports: string;
  team_or_program?: string;
}

interface Step1FormProps {
  contributorEmail: string;
}

export function Step1Form({ contributorEmail }: Step1FormProps) {
  const router = useRouter();
  const { formData, updateFormData, setCurrentStep } = useRecipeForm();

  // Initialize with existing data or defaults
  const [athletes, setAthletes] = useState<Athlete[]>(
    formData.athletes?.map(a => ({
      ...a,
      sports: a.sports.join(', ')
    })) || [{ name: '', sports: '', team_or_program: '' }]
  );
  
  const [contributorName, setContributorName] = useState(
    formData.contributor_name || ''
  );
  
  const [contributorRelationship, setContributorRelationship] = useState(
    formData.contributor_relationship || ''
  );

  const addAthlete = () => {
    setAthletes([...athletes, { name: '', sports: '', team_or_program: '' }]);
  };

  const removeAthlete = (index: number) => {
    if (athletes.length > 1) {
      setAthletes(athletes.filter((_, i) => i !== index));
    }
  };

  const updateAthlete = (index: number, field: keyof Athlete, value: string) => {
    const updated = [...athletes];
    updated[index] = { ...updated[index], [field]: value };
    setAthletes(updated);
  };

  const handleNext = () => {
    // Validate
    const hasValidAthlete = athletes.some(a => a.name.trim() && a.sports.trim());
    if (!hasValidAthlete || !contributorName.trim()) {
      alert('Please fill in at least one athlete name and sport, and your name.');
      return;
    }

    // Convert sports string to array
    const athletesData = athletes
      .filter(a => a.name.trim() && a.sports.trim())
      .map(a => ({
        name: a.name.trim(),
        sports: a.sports.split(',').map(s => s.trim()).filter(Boolean),
        team_or_program: a.team_or_program?.trim() || undefined,
      }));

    // Save to form context
    updateFormData({
      athletes: athletesData,
      contributor_name: contributorName.trim(),
      contributor_relationship: contributorRelationship.trim() || undefined,
    });

    setCurrentStep(2);
    router.push('/submit/step-2');
  };

  return (
    <FormLayout
      currentStep={1}
      title="Let's start with you"
      description="Tell us about the athlete(s) this recipe celebrates"
    >
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
        {/* Athletes Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Athlete(s)</h2>
          
          {athletes.map((athlete, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Athlete {index + 1}
                </span>
                {athletes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAthlete(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`athlete-name-${index}`}>
                  Athlete's name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`athlete-name-${index}`}
                  placeholder="The athlete this recipe celebrates"
                  value={athlete.name}
                  onChange={(e) => updateAthlete(index, 'name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`athlete-sports-${index}`}>
                  What sport(s) do they play? <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`athlete-sports-${index}`}
                  placeholder="Basketball, swimming, track & field..."
                  value={athlete.sports}
                  onChange={(e) => updateAthlete(index, 'sports', e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Separate multiple sports with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`athlete-team-${index}`}>
                  Team or program (optional)
                </Label>
                <Input
                  id={`athlete-team-${index}`}
                  placeholder="Greater Boston Special Olympics"
                  value={athlete.team_or_program || ''}
                  onChange={(e) => updateAthlete(index, 'team_or_program', e.target.value)}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addAthlete}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Athlete
          </Button>
        </div>

        {/* Contributor Section */}
        <div className="space-y-4 pt-6 border-t">
          <h2 className="text-lg font-semibold text-gray-900">About You</h2>

          <div className="space-y-2">
            <Label htmlFor="contributor-name">
              Your name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contributor-name"
              placeholder="Who's sharing this recipe?"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Signed in as: {contributorEmail}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contributor-relationship">
              Your relationship to the athlete (optional)
            </Label>
            <select
              id="contributor-relationship"
              value={contributorRelationship}
              onChange={(e) => setContributorRelationship(e.target.value)}
              className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a relationship</option>
              <option value="I am the athlete">I am the athlete</option>
              <option value="Parent/Guardian">Parent/Guardian</option>
              <option value="Sibling">Sibling</option>
              <option value="Coach">Coach</option>
              <option value="Friend">Friend</option>
              <option value="Family member">Family member</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end pt-6">
          <Button type="submit" size="lg">
            Next
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}
