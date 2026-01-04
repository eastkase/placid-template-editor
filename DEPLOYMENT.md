# Deployment Guide - Template Editor & Media Generator

This guide explains how to deploy both the Template Editor and Media Generator API to Railway.

## Overview

The complete system consists of:
1. **Media Generator API** - Backend service for rendering templates
2. **Template Editor** - Visual interface for creating templates

Both services are deployed on Railway and work together.

## Current Deployments

- **API**: https://placid-replace-media-generator-production.up.railway.app
- **Editor**: Will be deployed to Railway
- **GitHub Repos**:
  - API: https://github.com/eastkase/placid-replace-media-generator
  - Editor: https://github.com/eastkase/placid-template-editor

## Deploying the Template Editor to Railway

### Step 1: Create New Railway Service

1. Go to your Railway dashboard
2. Click "New Service"
3. Select "Deploy from GitHub repo"
4. Choose the `placid-template-editor` repository
5. Railway will automatically detect the Dockerfile

### Step 2: Configure Environment Variables

In Railway, add these environment variables:

```env
VITE_API_URL=https://placid-replace-media-generator-production.up.railway.app
VITE_API_KEY=your-api-key-here
```

**Note**: Leave `VITE_API_KEY` empty if your API doesn't require authentication.

### Step 3: Deploy

1. Railway will automatically build and deploy using the Dockerfile
2. Once deployed, you'll get a public URL like: `https://your-editor.railway.app`
3. The editor will connect to your API automatically

## Using the System

### Creating Templates

1. Open the Template Editor URL
2. Design your template visually:
   - Add text, image, and shape layers
   - Configure auto-shrink for text
   - Set dynamic fields (e.g., `{{title}}`)
3. Save template to the API using the Templates button

### Rendering Images via API

Use the saved template with dynamic data:

```javascript
// Example API call
fetch('https://your-api.railway.app/render', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-api-key'
  },
  body: JSON.stringify({
    template: templateJson,
    data: {
      title: 'Dynamic Title',
      subtitle: 'Dynamic Subtitle',
      image: 'https://example.com/image.jpg'
    }
  })
})
```

### Integration with Make.com

1. Create a new HTTP module in Make.com
2. Configure:
   - URL: `https://your-api.railway.app/render`
   - Method: POST
   - Headers: Add API key if configured
   - Body: Template JSON + dynamic data
3. The API returns the generated image URL

## Template Storage

Templates are automatically stored in the API's database. You can:
- Save templates from the editor
- List all templates via API
- Load templates for editing
- Duplicate and modify existing templates

### API Endpoints

- `GET /api/templates` - List all templates
- `POST /api/templates` - Create new template
- `GET /api/templates/:id` - Get specific template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/templates/:id/duplicate` - Duplicate template

## Security

### API Key Configuration

1. In the API Railway service, set:
   ```env
   API_KEY=your-secure-key-here
   ```

2. In the Editor Railway service, set:
   ```env
   VITE_API_KEY=your-secure-key-here
   ```

3. All API calls will require the `Authorization: Bearer your-secure-key-here` header

## Monitoring

### Health Checks

- API: `https://your-api.railway.app/health`
- Editor: The root path `/` serves as health check

### Logs

View logs in Railway dashboard for both services to monitor:
- Template creation/updates
- Rendering requests
- Error messages

## Updating Services

To update either service:

1. Push changes to the respective GitHub repository
2. Railway automatically rebuilds and deploys
3. Zero-downtime deployment ensures continuous availability

## Troubleshooting

### Editor can't connect to API

1. Check VITE_API_URL is set correctly
2. Verify API is running (check `/health` endpoint)
3. Check CORS settings if seeing errors

### Templates not saving

1. Verify API_KEY matches between services
2. Check API logs for error messages
3. Ensure database is properly initialized

### Images not rendering

1. Check template JSON format
2. Verify fonts are available in API
3. Check API logs for rendering errors

## Complete Workflow Example

1. **Design Phase**:
   - Open Template Editor
   - Create template with layers
   - Add dynamic fields
   - Save to API

2. **Automation Phase**:
   - Get template ID from editor
   - Configure Make.com/Zapier webhook
   - Send dynamic data to API

3. **Generation Phase**:
   - API receives request
   - Renders template with data
   - Returns image URL

4. **Usage Phase**:
   - Use generated images in emails
   - Post to social media
   - Save to cloud storage

## Support

For issues or questions:
- Check Railway logs for errors
- Review API documentation at `/docs`
- Check GitHub issues for known problems