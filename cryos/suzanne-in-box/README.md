# Suzanne in Box - Cryo-Protocol Scene

This directory contains the "Suzanne in Box" test scene implemented using **cryo-protocol** (ECS-based game engine protocol).

## Scene Description

**Suzanne in Box** features:
- **Suzanne** - The classic Blender monkey head mesh
- **Cube** - A container box with UV grid texture
- **PBR Materials** - Physically-based rendering materials
- **Single GLTF file** - All geometry in one GLTF 2.0 file

## Directory Structure

```
suzanne-in-box/
├── README.md                       # This file
├── suzanne-in-box.cryo.pbtxt      # Authoring format (chevp.cryo.authoring.AuthoredScene)
├── models/
│   ├── SuzanneInBox.gltf          # GLTF scene file
│   ├── SuzanneInBox.bin           # GLTF binary buffer
│   └── UVGrid.png                 # UV grid texture (1024x1024)
```

## Scene Formats

### 1. Authoring Format: `suzanne-in-box.cryo.pbtxt`

**Package:** `chevp.cryo.authoring.AuthoredScene`

**Purpose:** Build-time scene format saved by editor

**Features:**
- ✅ High-level, symbolic entity definitions
- ✅ Material definitions (PBR params)
- ✅ Asset references (URIs like `asset://...`)
- ✅ Camera and lighting setup
- ✅ Human-readable .pbtxt format

**Usage:**
```bash
# Load authoring scene in editor
editor.loadScene("cryos/suzanne-in-box/suzanne-in-box.cryo.pbtxt");

# Compile to runtime format
cryo-compiler \
  --input suzanne-in-box.cryo.pbtxt \
  --output ../cryos-embedded/suzanne-in-box.cryo-embedded.pbtxt \
  --format runtime
```

### 2. Runtime Format: `../cryos-embedded/suzanne-in-box.cryo-embedded.pbtxt`

**Package:** `chevp.cryo.runtime.RuntimeScene`

**Purpose:** Optimized runtime scene for renderer

**Features:**
- ✅ Fully resolved references
- ✅ Compiled shaders (SPIR-V embedded)
- ✅ Optimized mesh data (vertex/index buffers)
- ✅ Cached materials and textures
- ✅ Bounding volumes for culling
- ✅ Performance metadata

**Usage:**
```bash
# Load runtime scene in renderer
renderer.loadScene("cryos-embedded/suzanne-in-box.cryo-embedded.pbtxt");

# Or compile to binary .cyb
protoc --encode=chevp.cryo.runtime.RuntimeScene \
  --proto_path=foundation/cryo-protocol/proto \
  cryo_runtime.proto \
  < suzanne-in-box.cryo-embedded.pbtxt \
  > suzanne-in-box.cyb
```

## Scene Entities

### Entity 1: Cube (Container Box)

**Properties:**
- **Mesh:** SuzanneInBox.gltf#meshes/0
- **Material:** GridMaterial (PBR)
  - Base color: White (1.0, 1.0, 1.0)
  - Metallic: 0.0 (non-metallic)
  - Roughness: 0.4 (semi-glossy)
  - Albedo texture: UVGrid.png (1024x1024)
- **Transform:** Identity (position: origin, scale: 1.0)
- **Vertices:** 24
- **Triangles:** 12
- **Bounds:** AABB(-1, -1, -1) to (1, 1, 1)

### Entity 2: Suzanne (Monkey Head)

**Properties:**
- **Mesh:** SuzanneInBox.gltf#meshes/1
- **Material:** MyMaterial (PBR)
  - Base color: Gray (0.8, 0.8, 0.8)
  - Metallic: 0.0 (non-metallic)
  - Roughness: 0.5 (medium roughness)
  - No textures (solid color)
- **Transform:** Scaled to 0.67 (fits inside cube)
- **Vertices:** 507
- **Triangles:** 968
- **Bounds:** AABB(-0.9, -0.75, -0.6) to (0.9, 0.75, 0.6)

## Materials

### Material 1: GridMaterial

**Type:** PBR Metallic-Roughness

**Parameters:**
- Base color factor: (1.0, 1.0, 1.0, 1.0)
- Metallic: 0.0
- Roughness: 0.4
- Ambient occlusion: 1.0

**Textures:**
- **Albedo:** `models/UVGrid.png`
  - Resolution: 1024x1024
  - Wrap mode: REPEAT
  - Filter: LINEAR

**Flags:**
- Double-sided: true
- Alpha mode: OPAQUE

### Material 2: MyMaterial

**Type:** PBR Metallic-Roughness

**Parameters:**
- Base color factor: (0.8, 0.8, 0.8, 1.0)
- Metallic: 0.0
- Roughness: 0.5
- Ambient occlusion: 1.0

**Textures:** None (solid color)

**Flags:**
- Double-sided: true
- Alpha mode: OPAQUE

## Camera Setup

**Type:** Perspective

**Position:** (3.0, 3.0, 5.0)

**Look-at target:** (0.0, 0.0, 0.0)

**Parameters:**
- FOV: 45 degrees
- Aspect ratio: 16:9 (1.77777778)
- Near plane: 0.1
- Far plane: 100.0

## Lighting

### Ambient Light
- Color: (0.2, 0.2, 0.2)
- Intensity: 0.3

### Directional Light (Sun)
- Direction: (-0.5, -1.0, -0.5) - normalized
- Color: (1.0, 1.0, 1.0) - white
- Intensity: 1.5
- Shadows: Enabled
- Shadow map resolution: 2048x2048 (runtime)
- Shadow cascades: 4 (runtime)

### Background
- Type: Solid color
- Color: (0.05, 0.05, 0.05) - very dark gray

## Asset URIs

The authoring format uses symbolic asset URIs:

```
# GLTF meshes
asset://suzanne-in-box/models/SuzanneInBox.gltf#meshes/0  # Cube mesh
asset://suzanne-in-box/models/SuzanneInBox.gltf#meshes/1  # Suzanne mesh

# Textures
asset://suzanne-in-box/textures/UVGrid.png  # UV grid texture
```

These are resolved at compile-time and embedded in the runtime format.

## Performance Metrics

**Total scene statistics (runtime):**
- **Total vertices:** 531 (24 cube + 507 suzanne)
- **Total triangles:** 980 (12 cube + 968 suzanne)
- **Draw calls:** 2 (one per entity)
- **Memory usage:** ~1.4 MB (embedded textures + meshes)
- **Texture memory:** ~1.3 MB (UVGrid.png compressed)
- **Mesh memory:** ~54 KB (vertex + index buffers)

## Rendering Pipeline

1. **Load scene** (authoring or runtime format)
2. **Compile shaders** (GLSL → SPIR-V) if not pre-compiled
3. **Upload meshes** to GPU (vertex/index buffers)
4. **Upload textures** to GPU (with mipmaps)
5. **Setup materials** (uniform buffers, texture bindings)
6. **Culling** (frustum culling using bounding volumes)
7. **Shadow pass** (render shadow maps for directional light)
8. **Main pass** (render entities with PBR shading)
9. **Post-processing** (tonemapping, gamma correction)

## Compilation Workflow

### Step 1: Edit Authoring Scene
```bash
# Edit suzanne-in-box.cryo.pbtxt manually or via editor
editor suzanne-in-box.cryo.pbtxt
```

### Step 2: Compile to Runtime
```bash
# Compile authoring → runtime
cryo-compiler \
  --input suzanne-in-box.cryo.pbtxt \
  --output ../cryos-embedded/suzanne-in-box.cryo-embedded.pbtxt \
  --optimize-meshes \
  --compile-shaders \
  --compress-textures \
  --generate-mipmaps
```

### Step 3: Create Binary Pack
```bash
# Compile runtime .pbtxt → binary .cyb
protoc --encode=chevp.cryo.runtime.RuntimeScene \
  --proto_path=foundation/cryo-protocol/proto \
  asset_management/cryo_runtime.proto \
  < ../cryos-embedded/suzanne-in-box.cryo-embedded.pbtxt \
  > ../cryos-embedded/suzanne-in-box.cyb
```

### Step 4: Load in Renderer
```cpp
// Example: Load binary runtime scene in C++
#include "cryo_runtime.pb.h"

chevp::cryo::runtime::RuntimeScene scene;
std::ifstream input("suzanne-in-box.cyb", std::ios::binary);
scene.ParseFromIstream(&input);

// Access entities
for (const auto& entity : scene.entities()) {
  // Get mesh from cache
  const auto& mesh = scene.mesh_cache().meshes(entity.mesh_handle());

  // Get material from cache
  const auto& material = scene.material_cache().materials(entity.material_handle());

  // Upload to GPU and render
  renderer.renderEntity(entity, mesh, material);
}
```

## GLTF Source File

**File:** `models/SuzanneInBox.gltf`

**Generator:** Khronos glTF Blender I/O v1.8.19

**Version:** GLTF 2.0

**Contents:**
- 2 meshes (Cube, Suzanne)
- 2 materials (GridMaterial, MyMaterial)
- 1 texture (UVGrid.png)
- 1 buffer (SuzanneInBox.bin)

**Exported from Blender:**
```python
# Blender export settings
bpy.ops.export_scene.gltf(
    filepath="SuzanneInBox.gltf",
    export_format='GLTF_SEPARATE',
    export_materials='EXPORT',
    export_apply=True
)
```

## Testing and Validation

### Visual Validation
```bash
# Render scene and take screenshot
renderer \
  --scene suzanne-in-box.cryo-embedded.pbtxt \
  --screenshot suzanne-in-box-test.png \
  --camera-pos 3 3 5
```

### Protocol Validation
```bash
# Validate authoring scene
protoc --decode=chevp.cryo.authoring.AuthoredScene \
  --proto_path=foundation/cryo-protocol/proto \
  asset_management/cryo_authoring.proto \
  < suzanne-in-box.cryo.pbtxt

# Validate runtime scene
protoc --decode=chevp.cryo.runtime.RuntimeScene \
  --proto_path=foundation/cryo-protocol/proto \
  asset_management/cryo_runtime.proto \
  < ../cryos-embedded/suzanne-in-box.cryo-embedded.pbtxt
```

## License

- **Scene/Assets:** Public Domain
- **Suzanne model:** Blender Foundation (bundled with Blender)
- **UV Grid texture:** Public Domain

## Version History

- **1.0.0** (2025-10-18) - Initial cryo-protocol implementation
  - Created authoring format (.cryo.pbtxt)
  - Created runtime format (.cryo-embedded.pbtxt)
  - Added PBR materials with textures
  - Added camera and lighting setup