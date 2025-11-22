# Deploy script for book_cover_bot
# Builds React app, commits all changes, and deploys to Heroku

Write-Host "Building React app..." -ForegroundColor Cyan
Set-Location bookbot-frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host "Staging changes..." -ForegroundColor Cyan
git add -A
git add -f bookbot-frontend/build/

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
