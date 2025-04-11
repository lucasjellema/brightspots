# Publishing Guide: GitHub and GitHub Pages

This guide will walk you through the process of publishing your Bright Spots Survey Visualization application on GitHub and deploying it using GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Your Bright Spots Survey Visualization project files

## Step 1: Create a GitHub Repository

1. Log in to your GitHub account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., "bright-spots-visualization")
4. Add a description (optional)
5. Choose whether to make it public or private
6. Do not initialize with README, .gitignore, or license (we'll push our existing files)
7. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show instructions for pushing an existing repository. Follow these steps in your terminal:

```bash
# Navigate to your project directory if you're not already there
cd path/to/windsurf-project

# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Add all files to git
git add .

# Commit the files
git commit -m "Initial commit"

# Push to GitHub
git push -u origin main
```

Note: If your default branch is named "master" instead of "main", use that in the command above.

## Step 3: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section (or click on "Pages" in the left sidebar)
4. Under "Source", select "GitHub Actions" as the deployment method
5. GitHub will detect the workflow file (.github/workflows/deploy.yml) that's already in your repository

## Step 4: Wait for Deployment

1. GitHub Actions will automatically start the deployment process
2. You can monitor the progress by clicking on the "Actions" tab in your repository
3. Once the deployment is complete, you'll see a green checkmark next to the workflow run
4. Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

## Step 5: Test Your Deployed Application

1. Visit your GitHub Pages URL
2. Verify that all features work correctly:
   - Data loading
   - Visualizations
   - Navigation between pages
   - Word cloud functionality

## Using External Data with GitHub Pages

To use the `datafilePAR` parameter with your GitHub Pages deployment:

1. Host your CSV data file on a server that supports CORS (Cross-Origin Resource Sharing)
2. Access your application with the parameter:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/?datafilePAR=https://example.com/your-data.csv
   ```

## Troubleshooting

If your deployment fails or the application doesn't work correctly:

1. Check the GitHub Actions logs for errors
2. Verify that all file paths in your code are relative, not absolute
3. Make sure your CSV file is properly formatted and accessible
4. Check the browser console for JavaScript errors

## Updating Your Application

To update your application after making changes:

```bash
# Add your changes
git add .

# Commit your changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

GitHub Actions will automatically deploy the updated version.

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Git Documentation](https://git-scm.com/doc)
