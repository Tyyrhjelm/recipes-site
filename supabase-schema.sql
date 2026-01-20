-- Special Olympics Cookbook Platform Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CONTRIBUTORS TABLE
-- People who submit recipes
-- =====================================================
CREATE TABLE contributors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  session_token TEXT
);

CREATE INDEX idx_contributors_email ON contributors(email);
CREATE INDEX idx_contributors_session ON contributors(session_token);

-- =====================================================
-- RECIPES TABLE
-- Core recipe content
-- =====================================================
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relationships
  contributor_id UUID REFERENCES contributors(id) ON DELETE SET NULL,
  
  -- Identity fields
  original_author TEXT,
  contributor_relationship TEXT,
  
  -- Recipe content
  title TEXT NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  tips_substitutions TEXT,
  
  -- Reflective/narrative fields
  what_you_love TEXT,
  when_you_make_it TEXT,
  story TEXT,
  
  -- Consent (granular)
  consent_publish BOOLEAN DEFAULT FALSE,
  consent_name_attribution BOOLEAN DEFAULT FALSE,
  consent_story_inclusion BOOLEAN DEFAULT FALSE,
  consent_photo_inclusion BOOLEAN DEFAULT FALSE,
  
  -- Editorial metadata
  editorial_status TEXT DEFAULT 'submitted',
  editorial_notes TEXT,
  cookbook_assignments TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(title, '') || ' ' || 
      coalesce(what_you_love, '') || ' ' ||
      coalesce(story, '') || ' ' ||
      coalesce(original_author, '')
    )
  ) STORED
);

-- Indexes for common queries
CREATE INDEX idx_recipes_contributor ON recipes(contributor_id);
CREATE INDEX idx_recipes_status ON recipes(editorial_status);
CREATE INDEX idx_recipes_consent_publish ON recipes(consent_publish);
CREATE INDEX idx_recipes_search ON recipes USING GIN(search_vector);

-- =====================================================
-- RECIPE_ATHLETES TABLE
-- Junction table: multiple athletes per recipe
-- =====================================================
CREATE TABLE recipe_athletes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  athlete_name TEXT NOT NULL,
  sports TEXT[] DEFAULT ARRAY[]::TEXT[],
  team_or_program TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recipe_athletes_recipe ON recipe_athletes(recipe_id);
CREATE INDEX idx_recipe_athletes_name ON recipe_athletes(athlete_name);

-- =====================================================
-- RECIPE_IMAGES TABLE
-- Multiple images per recipe, can be deleted anytime
-- =====================================================
CREATE TABLE recipe_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  contributor_id UUID REFERENCES contributors(id),
  
  -- Storage paths
  original_url TEXT NOT NULL,
  thumbnail_url TEXT,
  web_optimized_url TEXT,
  storage_path TEXT NOT NULL, -- For deletion
  
  -- Metadata
  caption TEXT,
  upload_order INTEGER DEFAULT 0,
  
  -- Privacy & consent
  consent_publish BOOLEAN DEFAULT FALSE,
  include_in_export BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recipe_images_recipe ON recipe_images(recipe_id);
CREATE INDEX idx_recipe_images_contributor ON recipe_images(contributor_id);

-- =====================================================
-- TAGS TABLE (Phase 2, but creating structure now)
-- =====================================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recipe_tags (
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, tag_id)
);

-- =====================================================
-- ADMIN_USERS TABLE
-- Separate from contributors
-- =====================================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);

-- =====================================================
-- EDITORIAL_CHANGES TABLE
-- Audit trail for all edits
-- =====================================================
CREATE TABLE editorial_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id),
  
  field_changed TEXT NOT NULL,
  original_value TEXT,
  edited_value TEXT,
  change_reason TEXT,
  
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_editorial_changes_recipe ON editorial_changes(recipe_id);
CREATE INDEX idx_editorial_changes_admin ON editorial_changes(admin_id);

-- =====================================================
-- IMAGE_DELETION_LOG TABLE
-- Track when images are deleted (for notifications)
-- =====================================================
CREATE TABLE image_deletion_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID,
  recipe_title TEXT,
  contributor_email TEXT,
  image_url TEXT,
  deleted_at TIMESTAMPTZ DEFAULT NOW(),
  recipe_was_approved BOOLEAN DEFAULT FALSE
);

-- =====================================================
-- MAGIC_LINK_TOKENS TABLE
-- For authentication
-- =====================================================
CREATE TABLE magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_magic_link_tokens_token ON magic_link_tokens(token);
CREATE INDEX idx_magic_link_tokens_email ON magic_link_tokens(email);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp on recipes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipes_updated_at 
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Log image deletions (for admin notification)
CREATE OR REPLACE FUNCTION log_image_deletion()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO image_deletion_log (
        recipe_id,
        recipe_title,
        contributor_email,
        image_url,
        recipe_was_approved
    )
    SELECT 
        OLD.recipe_id,
        r.title,
        c.email,
        OLD.original_url,
        (r.editorial_status = 'approved')
    FROM recipes r
    LEFT JOIN contributors c ON r.contributor_id = c.id
    WHERE r.id = OLD.recipe_id;
    
    RETURN OLD;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_log_image_deletion
    BEFORE DELETE ON recipe_images
    FOR EACH ROW
    EXECUTE FUNCTION log_image_deletion();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;

-- Contributors can read/update their own data
CREATE POLICY "Contributors can view own data"
    ON contributors FOR SELECT
    USING (auth.uid()::text = id::text OR email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Contributors can update own data"
    ON contributors FOR UPDATE
    USING (auth.uid()::text = id::text OR email = current_setting('request.jwt.claims', true)::json->>'email');

-- Contributors can view their own recipes (published or drafts)
CREATE POLICY "Contributors can view own recipes"
    ON recipes FOR SELECT
    USING (
        contributor_id IN (
            SELECT id FROM contributors 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Contributors can insert their own recipes
CREATE POLICY "Contributors can insert recipes"
    ON recipes FOR INSERT
    WITH CHECK (
        contributor_id IN (
            SELECT id FROM contributors 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Contributors can update their own recipes
CREATE POLICY "Contributors can update own recipes"
    ON recipes FOR UPDATE
    USING (
        contributor_id IN (
            SELECT id FROM contributors 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Contributors can delete their own recipes
CREATE POLICY "Contributors can delete own recipes"
    ON recipes FOR DELETE
    USING (
        contributor_id IN (
            SELECT id FROM contributors 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Similar policies for recipe_athletes
CREATE POLICY "Contributors can manage recipe athletes"
    ON recipe_athletes FOR ALL
    USING (
        recipe_id IN (
            SELECT id FROM recipes 
            WHERE contributor_id IN (
                SELECT id FROM contributors 
                WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            )
        )
    );

-- Contributors can manage their own images (including delete anytime)
CREATE POLICY "Contributors can view own images"
    ON recipe_images FOR SELECT
    USING (
        contributor_id IN (
            SELECT id FROM contributors 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

CREATE POLICY "Contributors can insert images"
    ON recipe_images FOR INSERT
    WITH CHECK (
        contributor_id IN (
            SELECT id FROM contributors 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

CREATE POLICY "Contributors can delete own images"
    ON recipe_images FOR DELETE
    USING (
        contributor_id IN (
            SELECT id FROM contributors 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Admins can do everything (bypass RLS with service role key)
-- These policies allow admin users full access
CREATE POLICY "Admins can view all recipes"
    ON recipes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

CREATE POLICY "Admins can update all recipes"
    ON recipes FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert yourself as the first admin
-- REPLACE 'your-email@example.com' with your actual email
INSERT INTO admin_users (email, name) 
VALUES ('your-email@example.com', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- STORAGE BUCKETS (Run in Supabase Storage UI)
-- =====================================================

-- You'll need to create these buckets in Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create bucket: "recipe-images" (public)
-- 3. Create bucket: "recipe-images-thumbnails" (public)

-- Or run this SQL to create buckets programmatically:
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('recipe-images', 'recipe-images', true),
  ('recipe-images-thumbnails', 'recipe-images-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for image uploads
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('recipe-images', 'recipe-images-thumbnails') );

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK ( 
    bucket_id IN ('recipe-images', 'recipe-images-thumbnails') 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING ( 
    bucket_id IN ('recipe-images', 'recipe-images-thumbnails')
    AND auth.role() = 'authenticated'
);

-- =====================================================
-- HELPFUL VIEWS FOR ADMIN DASHBOARD
-- =====================================================

-- View for easy recipe listing with athlete info
CREATE OR REPLACE VIEW recipe_list AS
SELECT 
    r.id,
    r.title,
    r.created_at,
    r.editorial_status,
    r.consent_publish,
    c.email as contributor_email,
    c.display_name as contributor_name,
    ARRAY_AGG(DISTINCT ra.athlete_name) as athlete_names,
    ARRAY_AGG(DISTINCT unnest(ra.sports)) as all_sports,
    COUNT(DISTINCT ri.id) as image_count,
    r.story IS NOT NULL as has_story
FROM recipes r
LEFT JOIN contributors c ON r.contributor_id = c.id
LEFT JOIN recipe_athletes ra ON r.id = ra.recipe_id
LEFT JOIN recipe_images ri ON r.id = ri.recipe_id
GROUP BY r.id, c.email, c.display_name;

COMMENT ON TABLE contributors IS 'People who submit recipes';
COMMENT ON TABLE recipes IS 'Core recipe content and metadata';
COMMENT ON TABLE recipe_athletes IS 'Athletes associated with each recipe (many-to-many)';
COMMENT ON TABLE recipe_images IS 'Images for recipes - can be deleted anytime by contributor';
COMMENT ON TABLE admin_users IS 'Admin users with full access';
COMMENT ON TABLE editorial_changes IS 'Audit log of all editorial changes';
COMMENT ON TABLE image_deletion_log IS 'Track deleted images for admin notifications';
