// Database types matching our schema

export interface Contributor {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_active: string;
  session_token: string | null;
}

export interface Recipe {
  id: string;
  contributor_id: string | null;
  original_author: string | null;
  contributor_relationship: string | null;
  title: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tips_substitutions: string | null;
  what_you_love: string | null;
  when_you_make_it: string | null;
  story: string | null;
  consent_publish: boolean;
  consent_name_attribution: boolean;
  consent_story_inclusion: boolean;
  consent_photo_inclusion: boolean;
  editorial_status: EditorialStatus;
  editorial_notes: string | null;
  cookbook_assignments: string[];
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  amount: string;
  item: string;
}

export interface Instruction {
  step: number;
  text: string;
}

export type EditorialStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'needs_followup' 
  | 'excerpt_only'
  | 'do_not_publish';

export interface RecipeAthlete {
  id: string;
  recipe_id: string;
  athlete_name: string;
  sports: string[];
  team_or_program: string | null;
  display_order: number;
  created_at: string;
}

export interface RecipeImage {
  id: string;
  recipe_id: string;
  contributor_id: string | null;
  original_url: string;
  thumbnail_url: string | null;
  web_optimized_url: string | null;
  storage_path: string;
  caption: string | null;
  upload_order: number;
  consent_publish: boolean;
  include_in_export: boolean;
  uploaded_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface EditorialChange {
  id: string;
  recipe_id: string;
  admin_id: string | null;
  field_changed: string;
  original_value: string | null;
  edited_value: string | null;
  change_reason: string | null;
  changed_at: string;
}

export interface ImageDeletionLog {
  id: string;
  recipe_id: string | null;
  recipe_title: string | null;
  contributor_email: string | null;
  image_url: string | null;
  deleted_at: string;
  recipe_was_approved: boolean;
}

export interface MagicLinkToken {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

// Form data types for recipe submission
export interface RecipeFormData {
  // Step 1: Athletes
  athletes: {
    name: string;
    sports: string[];
    team_or_program?: string;
  }[];
  
  // Step 1: Contributor
  contributor_name: string;
  contributor_relationship?: string;
  
  // Step 2: Meaning
  what_you_love?: string;
  when_you_make_it?: string;
  
  // Step 3: Story
  story?: string;
  
  // Step 4: Recipe
  title: string;
  original_author?: string;
  ingredients: Ingredient[];
  instructions: string[]; // Will be converted to Instruction[]
  tips_substitutions?: string;
  
  // Step 5: Images (handled separately)
  
  // Step 6: Consent
  consent_publish: boolean;
  consent_name_attribution: boolean;
  consent_story_inclusion: boolean;
  consent_photo_inclusion: boolean;
}

// View types
export interface RecipeListView {
  id: string;
  title: string;
  created_at: string;
  editorial_status: EditorialStatus;
  consent_publish: boolean;
  contributor_email: string | null;
  contributor_name: string | null;
  athlete_names: string[];
  all_sports: string[];
  image_count: number;
  has_story: boolean;
}

// Full recipe with relations for display
export interface RecipeWithRelations extends Recipe {
  contributor?: Contributor;
  athletes: RecipeAthlete[];
  images: RecipeImage[];
}
