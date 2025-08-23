# TechBuddy App

## Deployment

This application uses GitHub Actions for continuous deployment. The deployment workflow builds and pushes a Docker image to the Vistara registry.

### Linear Integration

The deployment process integrates with Linear to update issue status when deployments are successful. This requires a Linear API key to be set up as follows:

1. Create a Personal API key in Linear:
   - Log in to Linear at https://linear.app
   - Go to Settings > API > Personal API keys
   - Click "Create key"
   - Give the key a descriptive name like "Deployment Integration"
   - Copy the generated API key (it will only be shown once)

2. Add the Linear API key as a GitHub Secret:
   - Go to the GitHub repository settings
   - Navigate to "Secrets and variables" > "Actions"
   - Click "New repository secret"
   - Name: `LINEAR_API_KEY`
   - Value: Paste the Linear API key
   - Click "Add secret"

3. Troubleshooting Linear Authentication Errors:
   - Verify that the LINEAR_API_KEY secret is set correctly in GitHub
   - Check that the Linear API key has not expired
   - Ensure the Linear API key has the necessary permissions
   - Check the GitHub Actions logs for specific error messages

### Environment Variables

The following environment variables are used in the deployment process:

- `LINEAR_API_KEY`: API key for Linear integration
- `NODE_ENV`: Environment mode (development, production, etc.)

See `.env.example` for a template of required environment variables.
