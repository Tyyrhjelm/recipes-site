# Special Olympics Community Cookbook Platform

A dignified, accessible recipe collection platform designed to honor the stories and traditions of the Special Olympics community.

## 🎯 Purpose

This platform collects recipes from athletes, families, coaches, and supporters—not just as data, but as stories of pride, joy, belonging, and resilience. Each recipe is anchored in a person and their lived experience.

## ✨ Key Features

### For Contributors
- **Magic link authentication** - No passwords to remember
- **7-step guided submission** - People before food, meaning before mechanics
- **Multiple athletes per recipe** - Celebrate siblings, teams, families
- **Rich storytelling** - Optional prompts that invite authentic sharing
- **Full image control** - Upload, caption, and delete photos anytime (even after publication)
- **Granular consent** - Control what gets published: recipe, story, photos, name
- **Persistent sessions** - Save progress and return anytime
- **Contributor dashboard** - View and edit your submissions

### For Admins
- **Complete recipe management** - View, filter, search all submissions
- **Editorial workflow** - Status tracking, notes, cookbook assignments
- **Multiple export formats** - CSV, JSON (Markdown & DOCX coming in Phase 2)
- **Audit trail** - Track all editorial changes
- **Image deletion notifications** - Email alerts when approved recipes lose images
- **Respectful editing tools** - Edit while preserving contributor voice

## 🏗️ Built With

- **Next.js 14** (App Router, Server Components)
- **TypeScript** (Type-safe throughout)
- **Supabase** (PostgreSQL database, authentication, storage)
- **Tailwind CSS** (Mobile-first, accessible design)
- **Radix UI** (Accessible component primitives)
- **React Hook Form + Zod** (Form handling and validation)

## 🚀 Getting Started

See [SETUP.md](./SETUP.md) for complete setup instructions.

**Quick Start:**
```bash
# 1. Set up Supabase project and run supabase-schema.sql
# 2. Copy .env.example to .env.local and fill in your values
# 3. Install and run
npm install
npm run dev
```

## 📐 Design Principles

1. **Dignity First** - Every contributor's voice has value exactly as it is
2. **Consent is Continuous** - Contributors maintain control over their content
3. **Authenticity Over Polish** - Real stories matter more than perfect grammar
4. **Accessibility by Default** - Large fonts, clear labels, mobile-first
5. **People Before Food** - Identity and pride come before ingredients

## 🗄️ Database Schema

- `contributors` - People who submit recipes
- `recipes` - Core recipe content and metadata
- `recipe_athletes` - Athletes associated with recipes (many-to-many)
- `recipe_images` - Photos (deletable anytime by contributor)
- `admin_users` - Admin access control
- `editorial_changes` - Audit log of all edits
- `image_deletion_log` - Track deleted images for notifications

Full schema with indexes and RLS policies: `supabase-schema.sql`

## 🎨 User Flows

### Contributor Journey
1. Landing page → Warm welcome and purpose
2. Email authentication → Magic link (no password)
3. **Step 1:** Identity - Athletes, sports, contributor relationship
4. **Step 2:** Meaning - What you love, when you make it
5. **Step 3:** Story - Optional narrative prompt
6. **Step 4:** Recipe - Title, ingredients, instructions, tips
7. **Step 5:** Photos - Upload, caption, reorder
8. **Step 6:** Consent - Granular publishing permissions
9. **Step 7:** Thank you - Submit another or view dashboard

### Admin Journey
1. Admin login → Same magic link system
2. Dashboard → View all recipes, filter, search
3. Recipe detail → Full content + editorial controls
4. Edit/curate → Status updates, cookbook assignments, notes
5. Export → CSV/JSON of selected recipes

## 📊 Data Model Highlights

### Ingredients & Instructions
```json
// Simple, easy-to-type format
{
  "ingredients": [
    {"amount": "2 cups", "item": "flour"},
    {"amount": "1 tsp", "item": "salt"}
  ],
  "instructions": [
    {"step": 1, "text": "Mix dry ingredients"},
    {"step": 2, "text": "Add wet ingredients"}
  ]
}
```

### Multiple Athletes
```javascript
// Recipe can celebrate multiple people
recipe_athletes: [
  {name: "Abe FirstMan", sports: ["basketball"], ...},
  {name: "Cain FirstMan", sports: ["swimming"], ...}
]
```

### Draft vs. Published
```javascript
// consent_publish controls visibility
consent_publish: false  // Draft - only contributor sees it
consent_publish: true   // Submitted - admins can see it
```

## 🔐 Security & Privacy

- **Row Level Security (RLS)** - Contributors only see their own data
- **Magic link authentication** - Tokens expire in 15 minutes, single-use
- **EXIF stripping** - Remove location data from uploaded photos
- **Granular consent** - Separate permissions for recipe/story/photos/name
- **Image deletion** - Contributors can delete anytime (hard delete from storage)
- **Admin notifications** - Email when images deleted from approved recipes

## 📈 MVP vs. Phase 2

### ✅ MVP (Complete)
- Magic link auth
- 7-step submission flow
- Multiple athletes per recipe
- Image upload/delete
- Contributor dashboard
- Admin dashboard
- Basic search/filter
- CSV/JSON export
- Email notifications for image deletion

### 🔮 Phase 2 (Future)
- Email notifications (recipe approved, etc.)
- Tag system (dietary, meal type, occasion)
- Advanced search (ingredient-based)
- Markdown & DOCX export
- Editorial change history UI
- Multi-cookbook management UI
- Saved filter sets
- Analytics dashboard

## 🎯 Editorial Guidelines

Located in the main design document, these rules ensure:
- Light edits for clarity, never changing meaning
- Original versions always preserved
- Contributor voice respected
- Sensitive content handled with care
- Consent honored at all times

## 📱 Accessibility Features

- Large, readable fonts (minimum 16px base)
- High contrast ratios
- Keyboard navigation
- Screen reader friendly (ARIA labels via Radix UI)
- Mobile-first responsive design
- Touch targets minimum 44px
- Clear, plain language throughout
- Optional fields never penalized

## 🤝 Contributing

This is a custom platform built for a specific community need. While not open source, the design principles and approach may be useful for similar dignity-centered data collection projects.

## 📄 License

Proprietary - Special Olympics Cookbook Project

## 🙏 Acknowledgments

Built with care to honor every recipe, every story, and every person who shares.

---

**Remember:** This is not a recipe database. This is a community archive, designed with love.
