#!/bin/bash

# Git setup script for Special Olympics Cookbook Platform
# Repository: https://github.com/Tyyrhjelm/recipes-site

echo "Setting up git for Special Olympics Cookbook Platform..."
echo "Repository: https://github.com/Tyyrhjelm/recipes-site"
echo ""

# Navigate to project directory
cd /home/claude/cookbook-platform

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    echo "✓ Git initialized"
else
    echo "✓ Git already initialized"
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF
    echo "✓ .gitignore created"
else
    echo "✓ .gitignore exists"
fi

# Add all files
echo "Adding files to git..."
git add .
echo "✓ Files added"

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Complete foundation with database schema, types, and landing page"
echo "✓ Commit created"

# Add remote (this might fail if already exists, that's okay)
echo "Adding GitHub remote..."
git remote add origin https://github.com/Tyyrhjelm/recipes-site.git 2>/dev/null || echo "✓ Remote already exists"

# Get current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $BRANCH"

echo ""
echo "======================================"
echo "Git setup complete!"
echo "======================================"
echo ""
echo "To push to GitHub, run these commands:"
echo ""
echo "  cd /home/claude/cookbook-platform"
echo "  git push -u origin $BRANCH"
echo ""
echo "If this is your first push, you may need to authenticate with GitHub."
echo "GitHub now requires a Personal Access Token instead of password."
echo ""
echo "To create a token:"
echo "1. Go to https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Give it 'repo' scope"
echo "4. Use the token as your password when pushing"
echo ""
echo "Or use SSH instead:"
echo "  git remote set-url origin git@github.com:Tyyrhjelm/recipes-site.git"
echo ""
