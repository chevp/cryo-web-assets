// ========================================
// Cryo Logo Shader Integration Example
// ========================================
// TypeScript example for integrating Cryo logo shaders
// with the WebGL Protocol from Arctic Engine
//
// Part of: Arctic Engine - Cryo Web Assets
// Repository: https://github.com/chevp/cryo-web-assets
// ========================================

import type { ShaderProgram, ShaderUniform } from '../types/webgl-protocol';

// ========================================
// Simple Cryo Logo Shader Configuration
// ========================================
export const cryoLogoSimpleShader: ShaderProgram = {
  id: 'cryo-logo-simple',
  name: 'Cryo Logo - Simple',
  shader_type: 'custom',
  vertex_shader: `
    // Load from: shaders/cryo-logo/cryo-logo.vert
    // Or fetch from CDN: https://cdn.jsdelivr.net/gh/chevp/cryo-web-assets@main/shaders/cryo-logo/cryo-logo.vert
  `,
  fragment_shader: `
    // Load from: shaders/cryo-logo/cryo-logo-simple.frag
    // Or fetch from CDN: https://cdn.jsdelivr.net/gh/chevp/cryo-web-assets@main/shaders/cryo-logo/cryo-logo-simple.frag
  `,
  uniforms: [
    {
      name: 'uCryoTexture',
      type: 'sampler2D',
      value_texture_url: '/textures/cryo.png'
    },
    {
      name: 'uModelViewProjection',
      type: 'mat4',
      value_mat4: {
        elements: [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ]
      }
    },
    {
      name: 'uTime',
      type: 'float',
      value_float: 0.0
    },
    {
      name: 'uAnimationEnabled',
      type: 'float',
      value_float: 0.0  // Disabled by default
    }
  ],
  attributes: [
    { name: 'aPosition', type: 'vec3', location: 0 },
    { name: 'aUV', type: 'vec2', location: 1 },
    { name: 'aColor', type: 'vec4', location: 2 }
  ]
};

// ========================================
// Enhanced Cryo Logo Shader with Ice Effects
// ========================================
export const cryoLogoIceShader: ShaderProgram = {
  id: 'cryo-logo-ice',
  name: 'Cryo Logo - Ice Effects',
  shader_type: 'custom',
  vertex_shader: `
    // Load from: shaders/cryo-logo/cryo-logo.vert
    // Or fetch from CDN: https://cdn.jsdelivr.net/gh/chevp/cryo-web-assets@main/shaders/cryo-logo/cryo-logo.vert
  `,
  fragment_shader: `
    // Load from: shaders/cryo-logo/cryo-logo-ice.frag
    // Or fetch from CDN: https://cdn.jsdelivr.net/gh/chevp/cryo-web-assets@main/shaders/cryo-logo/cryo-logo-ice.frag
  `,
  uniforms: [
    {
      name: 'uCryoTexture',
      type: 'sampler2D',
      value_texture_url: '/textures/cryo.png'
    },
    {
      name: 'uModelViewProjection',
      type: 'mat4',
      value_mat4: {
        elements: [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ]
      }
    },
    {
      name: 'uTime',
      type: 'float',
      value_float: 0.0
    },
    {
      name: 'uAnimationEnabled',
      type: 'float',
      value_float: 1.0  // Enabled for ice effects
    },
    {
      name: 'uGlowIntensity',
      type: 'float',
      value_float: 0.3  // 0.0 - 1.0
    },
    {
      name: 'uIceOpacity',
      type: 'float',
      value_float: 1.0  // 0.0 - 1.0
    },
    {
      name: 'uGlowColor',
      type: 'vec3',
      value_vec3: { x: 0.4, y: 0.8, z: 1.0 }  // Cyan ice glow
    },
    {
      name: 'uShimmerSpeed',
      type: 'float',
      value_float: 2.0  // Animation speed multiplier
    },
    {
      name: 'uShimmerIntensity',
      type: 'float',
      value_float: 0.5  // 0.0 - 1.0
    }
  ],
  attributes: [
    { name: 'aPosition', type: 'vec3', location: 0 },
    { name: 'aUV', type: 'vec2', location: 1 },
    { name: 'aColor', type: 'vec4', location: 2 }
  ]
};

// ========================================
// Helper: Load shader source from file/URL
// ========================================
export async function loadShaderSource(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load shader from ${url}: ${response.statusText}`);
  }
  return response.text();
}

// ========================================
// Helper: Create shader with loaded sources
// ========================================
export async function createCryoLogoShader(
  type: 'simple' | 'ice' = 'simple',
  basePath = '/shaders/cryo-logo'
): Promise<ShaderProgram> {
  const baseShader = type === 'simple' ? cryoLogoSimpleShader : cryoLogoIceShader;

  // Load shader sources
  const vertexShader = await loadShaderSource(`${basePath}/cryo-logo.vert`);
  const fragmentShader = await loadShaderSource(
    `${basePath}/cryo-logo-${type === 'simple' ? 'simple' : 'ice'}.frag`
  );

  return {
    ...baseShader,
    vertex_shader: vertexShader,
    fragment_shader: fragmentShader
  };
}

// ========================================
// Helper: Update shader uniform at runtime
// ========================================
export function updateShaderUniform(
  shader: ShaderProgram,
  name: string,
  value: Partial<ShaderUniform>
): ShaderProgram {
  return {
    ...shader,
    uniforms: shader.uniforms?.map(uniform =>
      uniform.name === name ? { ...uniform, ...value } : uniform
    )
  };
}

// ========================================
// Usage Example
// ========================================
/*
// Simple usage
const simpleShader = await createCryoLogoShader('simple');

// Ice effects usage
const iceShader = await createCryoLogoShader('ice');

// Update glow intensity at runtime
const updatedShader = updateShaderUniform(iceShader, 'uGlowIntensity', {
  value_float: 0.7
});

// In animation loop
function animate(time: number) {
  const updatedShader = updateShaderUniform(iceShader, 'uTime', {
    value_float: time * 0.001  // Convert to seconds
  });

  // Render with updated shader
  requestAnimationFrame(animate);
}
*/
