'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeForm } from './recipe-form-context';
import { FormLayout } from './form-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PhotoPreview {
  id: string;
  file: File;
  preview: string;
  caption: string;
}

export function Step5Form() {
  const router = useRouter();
  const { formData, updateFormData, setCurrentStep } = useRecipeForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For MVP, we'll store photos in memory/localStorage
  // In production, these would be uploaded to Supabase Storage
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const newPhotos: PhotoPreview[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        // Create preview URL
        const preview = URL.createObjectURL(file);

        newPhotos.push({
          id: `${Date.now()}-${i}`,
          file,
          preview,
          caption: '',
        });
      }

      setPhotos([...photos, ...newPhotos]);
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Failed to process some images. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (photo) {
      // Revoke the preview URL to free memory
      URL.revokeObjectURL(photo.preview);
    }
    setPhotos(photos.filter(p => p.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, caption } : p));
  };

  const handleNext = () => {
    // Photos are optional, so no validation needed
    // In production, this would upload photos to Supabase Storage
    // For MVP, we'll just save metadata to formData

    updateFormData({
      // Store photo metadata (in production, this would be URLs)
      // For MVP, we'll just track that photos exist
      photos_count: photos.length,
    });

    setCurrentStep(6);
    router.push('/submit/step-6-placeholder');
  };

  const handleBack = () => {
    // Save current state
    updateFormData({
      photos_count: photos.length,
    });

    setCurrentStep(4);
    router.push('/submit/step-4');
  };

  const handleSkip = () => {
    updateFormData({
      photos_count: 0,
    });

    setCurrentStep(6);
    router.push('/submit/step-6-placeholder');
  };

  return (
    <FormLayout
      currentStep={5}
      title="Add some photos?"
      description="Photos are completely optional, but they help tell your story"
    >
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
        {/* Upload Area */}
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary hover:bg-purple-50 transition-colors cursor-pointer"
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Click to upload photos
            </p>
            <p className="text-sm text-gray-500">
              Or drag and drop (coming soon)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG, HEIC up to 10MB each
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploading && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Processing images...</p>
            </div>
          )}
        </div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="space-y-4">
            <Label>Your Photos ({photos.length})</Label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={photo.preview}
                      alt="Recipe photo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <Input
                      placeholder="Add a caption (optional)"
                      value={photo.caption}
                      onChange={(e) => updateCaption(photo.id, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Helper Text */}
        {photos.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Photos can be of the finished dish, the cooking process, or anything that helps tell the story.
              You can always add or remove photos later.
            </p>
          </div>
        )}

        {photos.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900">
              Looking good! You can add more photos or continue to the next step.
            </p>
          </div>
        )}

        {/* Important Note */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900 font-medium mb-1">
            You're in control
          </p>
          <p className="text-sm text-purple-800">
            You can delete these photos anytime, even after your recipe is published.
            We'll ask for your permission before including them in the cookbook.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
          >
            Back
          </Button>

          <div className="flex gap-3">
            {photos.length === 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
              >
                Skip — No photos
              </Button>
            )}
            <Button type="submit" size="lg">
              Next
            </Button>
          </div>
        </div>
      </form>
    </FormLayout>
  );
}
