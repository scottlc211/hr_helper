# Quick Deploy Script for HR Helper
# This script helps you quickly deploy to GitHub Pages

Write-Host "🚀 HR Helper - Quick Deploy to GitHub Pages" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if there are uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "📝 Found uncommitted changes. Committing..." -ForegroundColor Yellow
    git add .
    
    $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    git commit -m $commitMsg
    Write-Host "✅ Changes committed!" -ForegroundColor Green
} else {
    Write-Host "✅ No uncommitted changes found." -ForegroundColor Green
}

Write-Host ""
Write-Host "🔨 Building production version..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  You may need to authenticate with GitHub." -ForegroundColor Yellow
    Write-Host "   If you haven't set up authentication, please see DEPLOYMENT.md" -ForegroundColor Yellow
    Write-Host ""
    
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Go to https://github.com/scottlc211/hr_helper/actions" -ForegroundColor White
        Write-Host "   2. Watch the deployment progress" -ForegroundColor White
        Write-Host "   3. Once complete, visit: https://scottlc211.github.io/hr_helper/" -ForegroundColor White
        Write-Host ""
        Write-Host "   If this is your first deployment, make sure to:" -ForegroundColor Yellow
        Write-Host "   - Enable GitHub Pages in repository Settings → Pages" -ForegroundColor Yellow
        Write-Host "   - Select 'GitHub Actions' as the source" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "❌ Failed to push to GitHub." -ForegroundColor Red
        Write-Host "   Please check DEPLOYMENT.md for authentication setup." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Build failed! Please check the errors above." -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
