#version 300 es
precision mediump float;

// ========================================
// Cryo Logo Fragment Shader - Simple
// ========================================
// Simple texture display for the Cryo ice cube logo
// Minimal shader for basic rendering needs
//
// Part of: Arctic Engine - Cryo Web Assets
// Repository: https://github.com/chevp/cryo-web-assets
// ========================================

// Input from vertex shader
in vec2 vUV;
in vec4 vColor;

// Texture sampler
uniform sampler2D uCryoTexture;

// Output color
out vec4 fragColor;

void main() {
    // Sample the cryo.png texture
    vec4 texColor = texture(uCryoTexture, vUV);

    // Apply vertex color tint (optional)
    fragColor = texColor * vColor;

    // Discard fully transparent pixels for performance
    if (fragColor.a < 0.01) {
        discard;
    }
}
