@echo off
echo 🚀 Deploying Sheheryar Abid Cybersecurity CV to GitHub...
echo.

cd "D:\sheheryara.bid"

echo Adding GitHub remote...
git remote add origin https://github.com/lillambnz/cybersecurity-cv.git

echo Setting main branch...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Successfully deployed to GitHub!
echo 🌐 Repository: https://github.com/lillambnz/cybersecurity-cv
echo.
echo Next steps:
echo 1. Go to Cloudflare Pages
echo 2. Connect this GitHub repository
echo 3. Deploy to sheheryara.bid
echo.
pause