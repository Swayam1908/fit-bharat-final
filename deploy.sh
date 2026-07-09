#!/bin/bash

echo "🚀 Deploying FitBharat..."

# Stage all changes
git add .

# Commit with timestamp or custom message
MSG=${1:-"update: $(date '+%Y-%m-%d %H:%M')"}
git commit -m "$MSG"

# Push to GitHub → triggers Vercel auto-deploy
git push

echo "✅ Pushed! Vercel is now redeploying automatically."
echo "🔗 Check: https://vercel.com/swayam1908s-projects/fit-bharat-final"
