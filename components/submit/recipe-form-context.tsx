'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RecipeFormData } from '@/lib/types';

interface RecipeFormContextType {
  formData: Partial<RecipeFormData>;
  updateFormData: (data: Partial<RecipeFormData>) => void;
  clearFormData: () => void;
  saveAsDraft: () => Promise<void>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const RecipeFormContext = createContext<RecipeFormContextType | undefined>(undefined);

const STORAGE_KEY = 'recipe_form_draft';

export function RecipeFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<Partial<RecipeFormData>>({});
  const [currentStep, setCurrentStep] = useState(1);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || {});
        setCurrentStep(parsed.currentStep || 1);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  // Save to localStorage whenever formData or currentStep changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
    }
  }, [formData, currentStep]);

  const updateFormData = (data: Partial<RecipeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const clearFormData = () => {
    setFormData({});
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
  };

  const saveAsDraft = async () => {
    // For now, just save to localStorage
    // In Phase 2, we could save to database
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
    return Promise.resolve();
  };

  return (
    <RecipeFormContext.Provider
      value={{
        formData,
        updateFormData,
        clearFormData,
        saveAsDraft,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </RecipeFormContext.Provider>
  );
}

export function useRecipeForm() {
  const context = useContext(RecipeFormContext);
  if (context === undefined) {
    throw new Error('useRecipeForm must be used within a RecipeFormProvider');
  }
  return context;
}
