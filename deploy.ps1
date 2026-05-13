# Deploy script for book_cover_bot
# Builds React app, commits all changes, and deploys to Heroku

Write-Host "Building React app..." -ForegroundColor Cyan
Set-Location bookbot-frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "Copying build to Rails public directory..." -ForegroundColor Cyan
# Remove old frontend files from public
if (Test-Path "../bookbot-api/public/index.html") { Remove-Item "../bookbot-api/public/index.html" -Force }
if (Test-Path "../bookbot-api/public/manifest.json") { Remove-Item "../bookbot-api/public/manifest.json" -Force }
if (Test-Path "../bookbot-api/public/assets") { Remove-Item "../bookbot-api/public/assets" -Recurse -Force }

# Copy new build
Copy-Item -Path "build/*" -Destination "../bookbot-api/public/" -Recurse -Force

Set-Location ..

Write-Host "Staging changes..." -ForegroundColor Cyan
git add -A
git add -f bookbot-frontend/build/
git add -f bookbot-api/public/index.html
git add -f bookbot-api/public/manifest.json
git add -f bookbot-api/public/assets/

$status = git status --short
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes to deploy" -ForegroundColor Yellow
    exit 0
}

Write-Host "Changes to commit:" -ForegroundColor Cyan
git status --short

$message = Read-Host "Commit message (or press Enter to cancel)"
if ([string]::IsNullOrWhiteSpace($message)) {
    Write-Host "Deploy cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host "Committing..." -ForegroundColor Cyan
git commit -m $message

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "Deploying to Heroku..." -ForegroundColor Cyan
git push heroku main

Write-Host "Deploy complete!" -ForegroundColor Green
