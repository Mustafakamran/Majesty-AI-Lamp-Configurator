# GitHub Pages Deployment Guide

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to [github.com](https://github.com)
2. Click **Sign up**
3. Follow the registration process

---

## Step 2: Create a New Repository

1. **Log in to GitHub**
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Fill in the details:
   - **Repository name:** `majesty-lamp-configurator` (or any name you prefer)
   - **Description:** "Luxury AI Lamp Configurator for Majesty"
   - **Visibility:** Choose **Public** (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (we'll add files manually)
5. Click **Create repository**

---

## Step 3: Initialize Git in Your Project (Using Command Line)

Open PowerShell in your project folder and run these commands:

```powershell
# Navigate to your project folder
cd D:\Websites\majesty-lamp

# Initialize Git repository
git init

# Add all files to Git
git add .

# Create your first commit
git commit -m "Initial commit: Majesty lamp configurator"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/majesty-lamp-configurator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` with your actual GitHub username!

---

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down and click **Pages** (left sidebar)
4. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment

---

## Step 5: Access Your Live Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/majesty-lamp-configurator/
```

**Note:** It may take a few minutes for the site to go live after enabling Pages.

---

## Alternative: Upload Files Manually (No Command Line)

If you prefer not to use Git commands:

1. **Create the repository** (Step 2 above)
2. On the repository page, click **uploading an existing file**
3. **Drag and drop** all your files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `renders/` folder (with all images)
   - `README.md` (optional)
4. Click **Commit changes**
5. Follow **Step 4** to enable GitHub Pages

---

## Step 6: Share with Your Client

Once deployed, share this URL with your client:
```
https://YOUR_USERNAME.github.io/majesty-lamp-configurator/
```

### Optional: Custom Domain

If you want a custom domain (e.g., `majesty.yourdomain.com`):

1. Buy a domain from a registrar (Namecheap, GoDaddy, etc.)
2. In GitHub Pages settings, add your custom domain
3. Configure DNS records at your domain registrar
4. GitHub provides detailed instructions in the Pages settings

---

## Updating Your Site

### Using Git (Command Line):
```powershell
cd D:\Websites\majesty-lamp
git add .
git commit -m "Update: description of changes"
git push
```

### Using GitHub Web Interface:
1. Go to your repository
2. Click on the file you want to edit
3. Click the pencil icon to edit
4. Make changes and commit

Changes will be live in 1-2 minutes!

---

## Troubleshooting

### Images not loading?
- Make sure the `renders/` folder structure is preserved
- Check that image paths in `script.js` are relative (not absolute)
- Verify all images were uploaded

### Site not showing?
- Wait 2-3 minutes after enabling Pages
- Check GitHub Actions tab for deployment status
- Ensure repository is public

### 404 Error?
- Verify the repository name matches the URL
- Check that `index.html` is in the root folder

---

## Need Help?

If you encounter any issues, let me know and I can help troubleshoot!
