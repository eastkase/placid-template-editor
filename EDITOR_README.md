# Template Editor - Visual Template Designer

A drag-and-drop visual template editor for creating media generation templates. Works seamlessly with the Media Generator API for automated image generation.

## Features

- **Visual Template Design**: Drag-and-drop interface for creating templates
- **Layer Types**: Text, Image, and Shape layers
- **Text Auto-Fitting**: Intelligent text shrinking to fit containers (matches API behavior)
- **Properties Panel**: Full control over layer properties
- **Layers Panel**: Manage layer hierarchy with drag-to-reorder
- **Export/Import**: JSON template export for API integration
- **Keyboard Shortcuts**: Productivity shortcuts for common operations
- **Undo/Redo**: Full history management
- **Grid & Snapping**: Precise alignment tools

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

## Usage

### Creating Templates

1. **Add Layers**: Click the layer type buttons in the toolbar (Text, Image, Shape)
2. **Edit Layers**: Select a layer on the canvas to edit its properties in the right panel
3. **Arrange Layers**: Drag layers in the Layers panel to reorder them
4. **Resize & Position**: Drag corners to resize, drag center to move

### Text Auto-Fit

Text layers support automatic font size adjustment:
1. Select a text layer
2. In Properties, enable "Auto-shrink text to fit"
3. Set min/max font sizes
4. Text will automatically resize to fit the container

### Dynamic Fields

Add dynamic fields that can be replaced via API:
1. Select any layer
2. In Properties, add a dynamic field name (e.g., `{{title}}`)
3. When rendering via API, provide values for these fields

### Export for API

1. Click "Export" in the toolbar
2. Copy or download the JSON template
3. Use with the Media Generator API:

```javascript
fetch('http://your-api/render', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    template: exportedTemplate,
    data: {
      title: 'Dynamic Title',
      image: 'https://example.com/image.jpg'
    }
  })
})
```

## Keyboard Shortcuts

- **Undo**: `Ctrl/Cmd + Z`
- **Redo**: `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y`
- **Delete Layer**: `Delete` or `Backspace`
- **Duplicate Layer**: `Ctrl/Cmd + D`
- **Hide/Show Layer**: `Ctrl/Cmd + H`
- **Lock/Unlock Layer**: `Ctrl/Cmd + L`
- **Navigate Layers**: `Arrow Up/Down`
- **Nudge Position**: `Shift + Arrow Keys`
- **Deselect**: `Escape`

## Template Structure

Templates are exported as JSON with the following structure:

```json
{
  "name": "Template Name",
  "width": 1080,
  "height": 1080,
  "backgroundColor": "#ffffff",
  "layers": [
    {
      "id": "layer-1",
      "type": "text",
      "name": "Title",
      "text": "Sample Text",
      "dynamicField": "{{title}}",
      "position": { "x": 100, "y": 100 },
      "size": { "width": 300, "height": 100 },
      "fontSize": 32,
      "color": "#000000",
      "textBox": {
        "autoShrink": true,
        "minFontSize": 16,
        "maxFontSize": 32
      }
    }
  ]
}
```

## API Integration

This editor is designed to work with the Media Generator API. Templates created here can be:

1. **Stored**: Save templates for reuse
2. **Rendered**: Generate images via API with dynamic data
3. **Automated**: Integrate with Make.com, Zapier, or custom workflows

## Development

Built with:
- React 18 + TypeScript
- Vite for fast builds
- Zustand for state management
- react-rnd for drag/resize
- Tailwind CSS for styling
- @dnd-kit for sortable layers

## License

MIT