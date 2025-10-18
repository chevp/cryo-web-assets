#version 300 es
precision highp float;

// ========================================
// Cryo Logo Fragment Shader - Ice Effects
// ========================================
// Enhanced shader with ice glow and shimmer effects
// for the Cryo ice cube logo - makes it look like actual ice!
//
// Features:
// - Animated frost shimmer
// - Cyan/blue ice glow
// - Edge highlights for 3D appearance
// - Customizable glow intensity and color
//
// Part of: Arctic Engine - Cryo Web Assets
// Repository: https://github.com/chevp/cryo-web-assets
// ========================================

// Input from vertex shader
in vec2 vUV;
in vec4 vColor;
in vec3 vWorldPos;

// Texture sampler
uniform sampler2D uCryoTexture;

// Uniforms for effects
uniform float uTime;
uniform float uGlowIntensity;
uniform float uIceOpacity;
uniform vec3 uGlowColor;
uniform float uShimmerSpeed;
uniform float uShimmerIntensity;

// Output color
out vec4 fragColor;

// ========================================
// Ice glow effect (simulates frozen appearance)
// ========================================
vec3 applyIceGlow(vec3 baseColor, vec2 uv, float alpha) {
    // Animated frost shimmer - dual sine wave pattern
    float shimmer = sin(uTime * uShimmerSpeed + uv.x * 10.0) * 0.5 + 0.5;
    shimmer *= sin(uTime * uShimmerSpeed * 0.75 + uv.y * 8.0) * 0.5 + 0.5;

    // Apply shimmer intensity control
    shimmer = mix(0.5, shimmer, uShimmerIntensity);

    // Add cyan/white glow around edges
    vec3 iceGlow = uGlowColor * shimmer * uGlowIntensity * alpha;

    return baseColor + iceGlow;
}

// ========================================
// Edge highlight (fresnel-like effect for 2D)
// ========================================
float getEdgeHighlight(vec2 uv) {
    // Distance from center
    vec2 center = vec2(0.5);
    float dist = length(uv - center);

    // Brighter at edges (simulates ice refraction)
    return smoothstep(0.3, 0.5, dist);
}

// ========================================
// Frost pattern overlay
// ========================================
float getFrostPattern(vec2 uv) {
    // Subtle noise-like pattern for ice crystals
    float pattern = fract(sin(dot(uv * 20.0, vec2(12.9898, 78.233))) * 43758.5453);

    // Animated movement
    vec2 offset = vec2(uTime * 0.02, uTime * 0.03);
    pattern += fract(sin(dot((uv + offset) * 15.0, vec2(41.2341, 67.891))) * 23421.6312);

    return pattern * 0.5;
}

void main() {
    // Sample the cryo.png texture
    vec4 texColor = texture(uCryoTexture, vUV);

    // Apply ice glow effect
    vec3 finalColor = applyIceGlow(texColor.rgb, vUV, texColor.a);

    // Add edge highlight for 3D appearance
    float edgeGlow = getEdgeHighlight(vUV);
    finalColor += vec3(0.2, 0.4, 0.5) * edgeGlow * texColor.a * 0.3;

    // Add subtle frost pattern overlay
    float frostPattern = getFrostPattern(vUV);
    finalColor += vec3(0.8, 0.9, 1.0) * frostPattern * texColor.a * 0.05;

    // Apply vertex color tint
    finalColor *= vColor.rgb;

    // Apply opacity control
    float finalAlpha = texColor.a * vColor.a * uIceOpacity;

    // Output final color
    fragColor = vec4(finalColor, finalAlpha);

    // Discard fully transparent pixels
    if (fragColor.a < 0.01) {
        discard;
    }
}
