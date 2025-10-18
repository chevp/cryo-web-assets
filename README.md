# Cryo Web Assets

Web-deployable assets for the Arctic Engine ecosystem, including shaders, textures, and integration examples for WebGL-based applications.

## Overview

This repository contains optimized web assets for displaying Arctic Engine branding and components in browser-based applications. All assets are designed to work with the WebGL Protocol from the Arctic Engine ecosystem.

## Repository Structure

```
cryo-web-assets/
├── shaders/
│   └── cryo-logo/
│       ├── cryo-logo.vert              # Vertex shader with optional animation
│       ├── cryo-logo-simple.frag       # Simple texture display
│       └── cryo-logo-ice.frag          # Enhanced ice effects
├── textures/
│   └── cryo.png                        # Cryo ice cube logo (1.4MB)
├── examples/
│   └── cryo-logo-shader.ts             # TypeScript integration example
└── README.md
```

## Assets

### Textures

- **cryo.png** (1430663 bytes)
  - Cryo ice cube logo
  - High-resolution PNG with transparency
  - Optimized for web display

### Shaders

All shaders are written in GLSL ES 3.00 (WebGL 2.0 compatible).

#### 1. Vertex Shader: `cryo-logo.vert`

**Features:**
- Standard vertex transformation
- Optional floating animation effect
- Configurable via `uAnimationEnabled` uniform

**Uniforms:**
- `uModelViewProjection` (mat4) - Model-view-projection matrix
- `uTime` (float) - Animation time in seconds
- `uAnimationEnabled` (float) - Toggle animation (0.0 or 1.0)

#### 2. Fragment Shader - Simple: `cryo-logo-simple.frag`

**Features:**
- Basic texture sampling
- Vertex color tinting
- Alpha transparency
- Performance-optimized alpha discard

**Uniforms:**
- `uCryoTexture` (sampler2D) - Texture sampler for cryo.png

**Use case:** Minimal overhead, static logo display

#### 3. Fragment Shader - Ice Effects: `cryo-logo-ice.frag`

**Features:**
- Animated frost shimmer effect
- Cyan/blue ice glow
- Edge highlights for 3D appearance
- Customizable frost pattern overlay
- Full parameter control

**Uniforms:**
- `uCryoTexture` (sampler2D) - Texture sampler
- `uTime` (float) - Animation time
- `uGlowIntensity` (float) - Glow strength (0.0 - 1.0)
- `uIceOpacity` (float) - Overall opacity (0.0 - 1.0)
- `uGlowColor` (vec3) - Glow color (default: cyan)
- `uShimmerSpeed` (float) - Animation speed multiplier
- `uShimmerIntensity` (float) - Shimmer strength (0.0 - 1.0)

**Use case:** Branded ice cube logo with realistic frozen appearance

## Usage

### CDN Links (jsDelivr)

```typescript
// Vertex shader
const vertUrl = 'https://cdn.jsdelivr.net/gh/chevp/cryo-web-assets@main/shaders/cryo-logo/cryo-logo.vert';

// Simple fragment shader
const fragSimpleUrl = 'https://cdn.jsdelivr.net/gh/chevp/cryo-web-assets@main/shaders/cryo-logo/cryo-logo-simple.frag';

// Ice effects fragment shader
const fragIceUrl = 'https://cdn.jsdelivr.net/gh/chevp/cryo-web-assets@main/shaders/cryo-logo/cryo-logo-ice.frag';

// Texture
const textureUrl = 'https://cdn.jsdelivr.net/gh/chevp/cryo-web-assets@main/textures/cryo.png';
```

### TypeScript Integration (Arctic Engine WebGL Protocol)

```typescript
import { createCryoLogoShader, updateShaderUniform } from './examples/cryo-logo-shader';

// Load simple shader
const simpleShader = await createCryoLogoShader('simple');

// Load ice effects shader
const iceShader = await createCryoLogoShader('ice');

// Customize ice glow color
const customShader = updateShaderUniform(iceShader, 'uGlowColor', {
  value_vec3: { x: 1.0, y: 0.5, z: 0.0 }  // Orange glow
});

// Animation loop
function animate(time: number) {
  const updated = updateShaderUniform(iceShader, 'uTime', {
    value_float: time * 0.001
  });

  // Render with updated shader
  requestAnimationFrame(animate);
}
```

### Raw WebGL Usage

```javascript
// Load shader sources
const vertSource = await fetch('shaders/cryo-logo/cryo-logo.vert').then(r => r.text());
const fragSource = await fetch('shaders/cryo-logo/cryo-logo-ice.frag').then(r => r.text());

// Compile shaders
const vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertSource);
gl.compileShader(vertShader);

const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragSource);
gl.compileShader(fragShader);

// Create program
const program = gl.createProgram();
gl.attachShader(program, vertShader);
gl.attachShader(program, fragShader);
gl.linkProgram(program);
gl.useProgram(program);

// Set uniforms
const timeLocation = gl.getUniformLocation(program, 'uTime');
gl.uniform1f(timeLocation, performance.now() * 0.001);

const glowColorLocation = gl.getUniformLocation(program, 'uGlowColor');
gl.uniform3f(glowColorLocation, 0.4, 0.8, 1.0);
```

## Shader Parameters

### Recommended Settings

**Simple Shader (Static Logo):**
```typescript
{
  uAnimationEnabled: 0.0,  // No animation
  uTime: 0.0
}
```

**Ice Shader (Subtle Effect):**
```typescript
{
  uAnimationEnabled: 1.0,
  uGlowIntensity: 0.2,
  uIceOpacity: 1.0,
  uGlowColor: { x: 0.4, y: 0.8, z: 1.0 },  // Cyan
  uShimmerSpeed: 1.0,
  uShimmerIntensity: 0.3
}
```

**Ice Shader (Dramatic Effect):**
```typescript
{
  uAnimationEnabled: 1.0,
  uGlowIntensity: 0.6,
  uIceOpacity: 0.9,
  uGlowColor: { x: 0.3, y: 0.7, z: 1.0 },  // Bright cyan
  uShimmerSpeed: 2.5,
  uShimmerIntensity: 0.8
}
```

## Performance Considerations

- **Simple shader**: ~0.1ms GPU time (recommended for mobile)
- **Ice shader**: ~0.3ms GPU time (desktop/modern mobile)
- **Texture size**: 1.4MB (consider compression for production)
- **Alpha discard**: Both shaders use early discard for transparent pixels

## Arctic Engine Integration

These assets are designed to integrate with the Arctic Engine WebGL Protocol:

- **Protocol**: `foundation/webgl-protocol` (125 lines)
- **WebGL Component**: `apps/webgl-component`
- **C++ Adapter**: `agents/webgl-protocol-adapter`
- **Java Adapter**: `domain/webgl-adapter-java`

See [Arctic Engine Ecosystem Documentation](https://github.com/chevp/arctic-engine/blob/main/docs/ARCTIC_ENGINE_ECOSYSTEM.md) for complete details.

## License

Part of the Arctic Engine ecosystem.

## Repository

- **GitHub**: https://github.com/chevp/cryo-web-assets
- **Parent Project**: [Arctic Engine](https://github.com/chevp/arctic-engine)

## Contributing

This repository is maintained as part of the Arctic Engine project. For contributions, please refer to the main Arctic Engine repository.

---

**Generated with Arctic Engine tooling**
