#version 300 es
precision mediump float;

// ========================================
// Cryo Logo Vertex Shader
// ========================================
// Vertex shader for displaying the Cryo ice cube logo
// Supports optional floating animation effect
//
// Part of: Arctic Engine - Cryo Web Assets
// Repository: https://github.com/chevp/cryo-web-assets
// ========================================

// Input attributes
in vec3 aPosition;
in vec2 aUV;
in vec4 aColor;

// Uniforms
uniform mat4 uModelViewProjection;
uniform float uTime;
uniform float uAnimationEnabled;  // 0.0 = disabled, 1.0 = enabled

// Output to fragment shader
out vec2 vUV;
out vec4 vColor;
out vec3 vWorldPos;

void main() {
    // Pass attributes to fragment shader
    vUV = aUV;
    vColor = aColor;
    vWorldPos = aPosition;

    // Optional: Add subtle vertex animation for floating effect
    vec3 animatedPos = aPosition;

    if (uAnimationEnabled > 0.5) {
        // Gentle floating motion (Y-axis)
        animatedPos.y += sin(uTime + aPosition.x * 2.0) * 0.02;

        // Subtle rotation effect
        animatedPos.x += cos(uTime * 0.5 + aPosition.y * 1.5) * 0.01;
    }

    // Transform vertex position
    gl_Position = uModelViewProjection * vec4(animatedPos, 1.0);
}
