# Pushing to GitHub - Instructions

Your code is now committed to git locally! Here's how to push it to your GitHub repository.

## Your Repository
**URL:** https://github.com/Tyyrhjelm/recipes-site

## ✅ What's Already Done
- ✓ Git repository initialized
- ✓ All files added and committed
- ✓ .gitignore configured (protects your .env files)
- ✓ Initial commit created with descriptive message

## 📤 Next Steps: Push to GitHub

You have **two options** for authentication:

---

### Option 1: HTTPS with Personal Access Token (Recommended)

**Step 1: Create a GitHub Personal Access Token**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "Special Olympics Cookbook"
4. Check the `repo` scope (gives full control of private repositories)
5. Click "Generate token" at the bottom
6. **COPY THE TOKEN** - you won't see it again!

**Step 2: Push to GitHub**
Run these commands in your terminal:

```bash
cd /path/to/your/cookbook-platform

# Add the remote repository
git remote add origin https://github.com/Tyyrhjelm/recipes-site.git

# Push your code
git push -u origin master
```

When prompted:
- **Username:** Tyyrhjelm
- **Password:** [paste your Personal Access Token]

---

### Option 2: SSH (If you have SSH keys set up)

```bash
cd /path/to/your/cookbook-platform

# Add the remote repository (SSH version)
git remote add origin git@github.com:Tyyrhjelm/recipes-site.git

# Push your code
git push -u origin master
```

---

## 🔄 Making Updates Later

After the initial push, whenever you want to save changes:

```bash
# See what's changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

---

## 🚨 Common Issues

**"Repository not found" or "Permission denied"**
- Check you're using the right username: Tyyrhjelm
- Make sure the repository exists at https://github.com/Tyyrhjelm/recipes-site
- If using HTTPS, make sure you're using a Personal Access Token, not your GitHub password

**"fatal: remote origin already exists"**
- This is fine! Just skip the `git remote add` command and go straight to `git push`

**"Updates were rejected"**
- Someone else pushed changes, or GitHub has content you don't have locally
- Run: `git pull origin master` then `git push` again

---

## 📦 Download the Project (On Another Computer)

To clone this repository on another machine:

```bash
git clone https://github.com/Tyyrhjelm/recipes-site.git
cd recipes-site
npm install
# Copy .env.example to .env.local and fill in your values
npm run dev
```

---

## ✨ You're Set!

Once pushed, your code will be:
- ✅ Backed up on GitHub
- ✅ Version controlled (you can see all changes)
- ✅ Shareable with collaborators
- ✅ Ready to deploy to Vercel (Vercel can pull directly from GitHub)

---

**Need help?** Let me know which option you're using and I can guide you through any issues!
