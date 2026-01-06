# Video Generation API Example

## Template with Typewriter Animation

This example shows how to create a video with animated text overlays using the template editor's export format.

### Step 1: Create Your Template

Use the Template Editor to create a template with text animations:
1. Add text layers
2. Set typewriter animations with specific timings
3. Export as JSON

### Step 2: Example Template JSON

```json
{
  "name": "Social Media Promo",
  "width": 1920,
  "height": 1080,
  "backgroundColor": "#1a1a1a",
  "outputFormat": "mp4",
  "fps": 30,
  "duration": 10,
  "layers": [
    {
      "id": "title-text",
      "type": "text",
      "name": "Main Title",
      "text": "Amazing Product Launch",
      "position": { "x": 100, "y": 400 },
      "size": { "width": 1720, "height": 200 },
      "font": {
        "family": "Arial",
        "size": 72,
        "weight": "bold"
      },
      "color": "#ffffff",
      "alignment": "center",
      "animation": {
        "type": "typewriter",
        "typewriter": {
          "enabled": true,
          "duration": 3,
          "startDelay": 0.5,
          "cursor": true,
          "cursorChar": "|"
        }
      }
    },
    {
      "id": "subtitle-text",
      "type": "text",
      "name": "Subtitle",
      "text": "Get 50% off this week only! Limited time offer for our valued customers.",
      "position": { "x": 200, "y": 600 },
      "size": { "width": 1520, "height": 100 },
      "font": {
        "family": "Arial",
        "size": 36,
        "weight": "normal"
      },
      "color": "#ffcc00",
      "alignment": "center",
      "animation": {
        "type": "typewriter",
        "typewriter": {
          "enabled": true,
          "duration": 5,
          "startDelay": 3.5,
          "cursor": false
        }
      }
    },
    {
      "id": "cta-text",
      "type": "text",
      "name": "Call to Action",
      "text": "Visit our website: example.com",
      "position": { "x": 600, "y": 800 },
      "size": { "width": 720, "height": 80 },
      "font": {
        "family": "Arial",
        "size": 28,
        "weight": "normal"
      },
      "color": "#00ff88",
      "alignment": "center",
      "animation": {
        "type": "fade",
        "fade": {
          "enabled": true,
          "duration": 1,
          "startDelay": 9
        }
      }
    }
  ]
}
```

### Step 3: Send to Video Generation API

```javascript
// Example using Node.js/fetch
async function generateVideo(template) {
  const response = await fetch('https://your-video-api.com/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      template: template,
      options: {
        quality: 'high',
        format: 'mp4',
        resolution: '1920x1080',
        fps: 30
      }
    })
  });
  
  const result = await response.json();
  return result.videoUrl;
}

// Using the template
const template = /* JSON from Step 2 */;
const videoUrl = await generateVideo(template);
console.log('Video generated:', videoUrl);
```

### Step 4: Animation Timeline

The animations will play as follows:
- **0.5s**: Main title starts typing
- **3.5s**: Main title completes, subtitle starts typing
- **8.5s**: Subtitle completes
- **9.0s**: Call-to-action fades in
- **10.0s**: Video ends

### Step 5: Python Example

```python
import requests
import json

def generate_video(template):
    url = "https://your-video-api.com/generate"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
    }
    
    payload = {
        "template": template,
        "options": {
            "quality": "high",
            "format": "mp4",
            "resolution": "1920x1080",
            "fps": 30
        }
    }
    
    response = requests.post(url, json=payload, headers=headers)
    result = response.json()
    return result["videoUrl"]

# Load template from file
with open("template.json", "r") as f:
    template = json.load(f)

# Generate video
video_url = generate_video(template)
print(f"Video generated: {video_url}")
```

### Step 6: CURL Example

```bash
curl -X POST https://your-video-api.com/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "template": {
      "name": "Quick Promo",
      "width": 1080,
      "height": 1920,
      "duration": 5,
      "layers": [
        {
          "type": "text",
          "text": "SALE NOW ON!",
          "position": {"x": 100, "y": 800},
          "animation": {
            "type": "typewriter",
            "typewriter": {
              "duration": 2,
              "startDelay": 0.5
            }
          }
        }
      ]
    },
    "options": {
      "format": "mp4",
      "quality": "high"
    }
  }'
```

## Animation Properties Reference

### Typewriter Animation
```json
{
  "type": "typewriter",
  "typewriter": {
    "enabled": true,
    "duration": 3,        // Total time in seconds for all text to appear
    "startDelay": 0.5,    // Delay before animation starts
    "charDelay": 50,      // Optional: milliseconds between characters
    "cursor": true,       // Show typing cursor
    "cursorChar": "|"     // Cursor character
  }
}
```

### Fade Animation
```json
{
  "type": "fade",
  "fade": {
    "enabled": true,
    "duration": 1,        // Fade duration in seconds
    "startDelay": 0       // Delay before fade starts
  }
}
```

### Slide Animation
```json
{
  "type": "slide",
  "slide": {
    "enabled": true,
    "duration": 1,        // Slide duration in seconds
    "startDelay": 0,      // Delay before slide starts
    "direction": "left"   // Options: "left", "right", "top", "bottom"
  }
}
```

## Tips for Video Creation

1. **Timing is Key**: Plan your animation timeline carefully. Text should appear when viewers are ready to read it.

2. **Duration Calculation**: 
   - Average reading speed: 200-250 words per minute
   - For typewriter effect: ~3-5 seconds for short headlines, 5-10 seconds for longer text

3. **Layer Order**: Layers with lower zIndex appear behind those with higher values

4. **Color Contrast**: Ensure text colors contrast well with background for readability

5. **Multiple Animations**: You can have multiple text layers with different animation timings to create complex sequences

## Export Format

The template editor exports clean JSON that can be sent directly to video generation APIs. The format includes:
- Canvas dimensions and background
- All layer properties and positions
- Complete animation configurations
- Font and styling information

This makes it easy to integrate with any video generation service that accepts JSON-based templates.