# GitHub Pages 部署指南

## 📋 部署前准备

已完成的配置:

- ✅ GitHub Actions 工作流文件 (`.github/workflows/deploy.yml`)
- ✅ Vite 配置更新 (添加了 base path)
- ✅ README 文档更新
- ✅ 代码已提交到本地仓库

## 🚀 部署步骤

### 1. 推送代码到 GitHub

由于需要 GitHub 认证,请选择以下方法之一:

#### 方法 A: 使用 GitHub CLI (推荐)

```powershell
# 如果还没有安装 GitHub CLI,先安装
# https://cli.github.com/

# 登录 GitHub
gh auth login

# 推送代码
git push origin main
```

#### 方法 B: 使用 Personal Access Token

```powershell
# 1. 创建 Personal Access Token
#    访问: https://github.com/settings/tokens
#    点击 "Generate new token (classic)"
#    勾选 "repo" 权限
#    复制生成的 token

# 2. 配置 Git 凭据并推送
git config credential.helper store
git push origin main
# 输入用户名: scottlc211
# 输入密码: 粘贴你的 Personal Access Token
```

#### 方法 C: 使用 SSH

```powershell
# 如果已配置 SSH 密钥
git remote set-url origin git@github.com:scottlc211/hr_helper.git
git push origin main
```

### 2. 在 GitHub 上启用 Pages

1. 访问仓库: https://github.com/scottlc211/hr_helper
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 下拉菜单中选择 **GitHub Actions**
5. 保存设置

### 3. (可选) 配置 Gemini API Key

如果想在生产环境使用 AI 生成团队名称功能:

1. 访问仓库的 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加密钥:
   - Name: `GEMINI_API_KEY`
   - Secret: 你的 Gemini API Key (从 https://aistudio.google.com/app/apikey 获取)
4. 点击 **Add secret**

### 4. 触发部署

推送代码后,GitHub Actions 会自动:

1. 检测到 main 分支的推送
2. 运行构建流程
3. 部署到 GitHub Pages

你可以在仓库的 **Actions** 标签页查看部署进度。

### 5. 访问部署的应用

部署成功后,应用将在以下地址可用:

```
https://scottlc211.github.io/hr_helper/
```

## 🔍 故障排查

### 问题: Actions 标签页没有看到工作流运行

**解决方案:**

- 确保代码已成功推送到 GitHub
- 检查 `.github/workflows/deploy.yml` 文件是否存在
- 确认推送到的是 `main` 分支

### 问题: 部署失败

**解决方案:**

1. 查看 Actions 标签页的错误日志
2. 确保在 Settings → Pages 中选择了 "GitHub Actions" 作为源
3. 检查仓库是否有 Pages 权限

### 问题: 页面显示 404

**解决方案:**

- 等待几分钟,GitHub Pages 可能需要时间来传播
- 确认访问的 URL 是 `https://scottlc211.github.io/hr_helper/` (注意末尾的斜杠)
- 检查 `vite.config.ts` 中的 base 路径是否正确设置为 `/hr_helper/`

## 📝 后续更新

每次你想更新部署的应用时:

```powershell
# 1. 做出代码更改
# 2. 提交更改
git add .
git commit -m "你的提交信息"

# 3. 推送到 GitHub
git push origin main

# 4. GitHub Actions 会自动重新部署
```

## 🎉 完成!

一旦部署成功,你的 HR Events Pro 应用就可以在线访问了!
