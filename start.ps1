#!/usr/bin/env pwsh

Write-Host "🚀 启动 Astro + React + TailwindCSS 应用..." -ForegroundColor Green
Write-Host ""

# 检查是否安装了依赖
if (!(Test-Path "node_modules")) {
    Write-Host "📦 安装依赖..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}

Write-Host "🔧 启动开发服务器..." -ForegroundColor Blue
Write-Host "应用将在 http://localhost:4321 启动" -ForegroundColor Cyan
Write-Host ""

npm run dev 