# Cryo-Runtime Format - Optimized Binary Scene Format

This directory contains **runtime-optimized** scenes using `chevp.cryo.runtime.RuntimeScene` protocol.

## Key Differences from Authoring Format

### Authoring (`cryos/`) vs Runtime (`cryos-runtime/`)

| Feature | Authoring Format | Runtime Format |
|---------|------------------|----------------|
| **Package** | `chevp.cryo.authoring.AuthoredScene` | `chevp.cryo.runtime.RuntimeScene` |
| **String names** | Full string names (human-readable) | uint32 hashes (FNV-1a, CRC32) |
| **Asset references** | URIs (`asset://...`) | Cache handles (indices) |
| **Shaders** | Shader graph definitions (nodes, connections) | Compiled SPIR-V bytecode |
| **Meshes** | Asset URIs to GLTF files | Embedded vertex/index buffers |
| **Textures** | Asset URIs to PNG/KTX | Embedded image data (base64 or binary) |
| **Materials** | High-level parameters | Compiled uniform values |
| **File size** | Small (references only) | Large (all data embedded) |
| **Loading speed** | Slow (need to resolve refs) | Fast (ready to upload to GPU) |
| **Use case** | Editing, version control | Production deployment |

## Runtime Optimizations

### 1. String Hash System

**All string names are replaced with uint32 FNV-1a hashes:**

```cpp
// Instead of:
uniforms {
  name: "u_baseColorTexture"  // String (20 bytes)
  binding: 5
}

// Runtime uses:
uniforms {
  name_hash: 0x2A5BC9F1  // uint32 (4 bytes) - FNV-1a hash of "u_baseColorTexture"
  binding: 5
}
```

**Hash function (FNV-1a):**
```cpp
uint32_t fnv1a_hash(const char* str) {
    uint32_t hash = 0x811c9dc5;  // FNV offset basis
    while (*str) {
        hash ^= (uint8_t)*str++;
        hash *= 0x01000193;       // FNV prime
    }
    return hash;
}
```

**Common shader uniform hashes:**
```cpp
#define HASH_MODEL_MATRIX          0x8B3C4E2A  // "u_modelMatrix"
#define HASH_VIEW_MATRIX           0x9F4D5B1C  // "u_viewMatrix"
#define HASH_PROJECTION_MATRIX     0xA72E6C8D  // "u_projectionMatrix"
#define HASH_BASE_COLOR_FACTOR     0xB51F7D9E  // "u_baseColorFactor"
#define HASH_METALLIC_ROUGHNESS    0xC30A8EAF  // "u_metallicRoughnessFactor"
#define HASH_BASE_COLOR_TEXTURE    0x2A5BC9F1  // "u_baseColorTexture"
```

### 2. Cache Handle System

**References resolved to cache indices:**

```protobuf
// Authoring format:
entities {
  entity_id: "suzanne"
  mesh_asset {
    uri: "asset://suzanne-in-box/models/SuzanneInBox.gltf#meshes/1"
  }
  material_id: "mat_suzanne"
}

// Runtime format:
entities {
  entity_id_hash: 0xDEADBEEF  // FNV-1a("suzanne")
  mesh_handle: 1               // Index into mesh_cache
  material_handle: 1           // Index into material_cache
}
```

### 3. Embedded Binary Data

**All assets embedded as base64 or raw bytes:**

```protobuf
mesh_cache {
  meshes {
    mesh_id_hash: 0x12345678
    vertex_count: 9871

    // Embedded vertex data (base64 in .pbtxt, raw bytes in .cyb)
    binary_data: "AACAPwAAgD8AAIC/..."  # base64-encoded vertex/index buffers
  }
}

texture_cache {
  textures {
    texture_id_hash: 0x87654321
    width: 1024
    height: 1024

    // Embedded PNG/KTX data
    binary_data: "iVBORw0KGgoAAAANSUhEUgAABAAAAAQA..."  # base64-encoded PNG
  }
}
```

## File Formats

### .pbtxt (Text Format with Base64)

**Use for:**
- Debugging
- Inspecting runtime data
- Version control diffs
- Human review

**Size:** ~700 KB (base64-encoded binary data)

**Example:**
```bash
apps/cryo-web-assets/cryos-runtime/suzanne-in-box.cryo-runtime.pbtxt
```

### .cyb (Binary Format)

**Use for:**
- Production deployment
- Fastest loading
- Smallest file size
- Network transfer

**Size:** ~500 KB (compressed binary)

**Compilation:**
```bash
protoc --encode=chevp.cryo.runtime.RuntimeScene \
  --proto_path=foundation/cryo-protocol/proto \
  asset_management/cryo_runtime.proto \
  < suzanne-in-box.cryo-runtime.pbtxt \
  > suzanne-in-box.cyb
```

## Performance Metrics

| Scene | Authoring Size | Runtime .pbtxt | Runtime .cyb | Load Time (pbtxt) | Load Time (cyb) |
|-------|---------------|----------------|--------------|-------------------|-----------------|
| suzanne-in-box | 8 KB | ~700 KB | ~500 KB | ~50 ms | ~10 ms |
| Empty scene | 2 KB | ~50 KB | ~10 KB | ~5 ms | ~1 ms |

## Loading Workflow

### C++ Runtime Loader

```cpp
#include "cryo_runtime.pb.h"

// Load binary .cyb (fastest)
chevp::cryo::runtime::RuntimeScene scene;
std::ifstream input("suzanne-in-box.cyb", std::ios::binary);
scene.ParseFromIstream(&input);

// Access caches
const auto& mesh_cache = scene.mesh_cache();
const auto& material_cache = scene.material_cache();
const auto& texture_cache = scene.texture_cache();

// Render entities
for (const auto& entity : scene.entities()) {
  // Get mesh from cache using handle
  const auto& mesh = mesh_cache.meshes(entity.mesh_handle());

  // Get material from cache using handle
  const auto& material = material_cache.materials(entity.material_handle());

  // Upload to GPU and render
  gpu.uploadMesh(mesh.binary_data());
  gpu.setMaterial(material);
  gpu.draw(mesh.vertex_count(), mesh.triangle_count());
}
```

### Java Runtime Loader

```java
import chevp.cryo.runtime.RuntimeScene;

// Load from file
RuntimeScene scene = RuntimeScene.parseFrom(new FileInputStream("suzanne-in-box.cyb"));

// Access via handles
for (RuntimeEntity entity : scene.getEntitiesList()) {
    RuntimeMesh mesh = scene.getMeshCache().getMeshes(entity.getMeshHandle());
    CompiledMaterial material = scene.getMaterialCache().getMaterials(entity.getMaterialHandle());

    // Render
    renderer.draw(mesh, material);
}
```

## String Hash Lookup Table

**For debugging, maintain a reverse lookup:**

```cpp
// hash_lookup.hpp
static const std::unordered_map<uint32_t, std::string> HASH_TO_NAME = {
    {0x8B3C4E2A, "u_modelMatrix"},
    {0x9F4D5B1C, "u_viewMatrix"},
    {0xA72E6C8D, "u_projectionMatrix"},
    {0xB51F7D9E, "u_baseColorFactor"},
    {0xC30A8EAF, "u_metallicRoughnessFactor"},
    {0x2A5BC9F1, "u_baseColorTexture"},
    {0xDEADBEEF, "suzanne"},
    {0xCAFEBABE, "cube"},
    // ... generated from authoring format
};

// Debug helper
std::string hashToName(uint32_t hash) {
    auto it = HASH_TO_NAME.find(hash);
    return it != HASH_TO_NAME.end() ? it->second : "<unknown>";
}
```

## Compilation Pipeline

```
┌─────────────────────┐
│ Authoring Scene     │
│ (.cryo.pbtxt)       │
│ - Full string names │
│ - Asset URIs        │
│ - Shader graphs     │
└──────────┬──────────┘
           │
           │ cryo-compiler
           │ --optimize
           │ --hash-strings
           │ --embed-assets
           ▼
┌─────────────────────┐
│ Runtime Scene       │
│ (.cryo-runtime.pbtxt│
│ - uint32 hashes     │
│ - Cache handles     │
│ - Embedded binaries │
└──────────┬──────────┘
           │
           │ protoc --encode
           │
           ▼
┌─────────────────────┐
│ Binary Pack (.cyb)  │
│ - Compressed        │
│ - Fastest loading   │
│ - Production ready  │
└─────────────────────┘
```

## Best Practices

### 1. Always Compile to Binary for Production
```bash
# DON'T ship .pbtxt to end users
# DO ship .cyb binary

protoc --encode=chevp.cryo.runtime.RuntimeScene \
  cryo_runtime.proto \
  < scene.cryo-runtime.pbtxt \
  > scene.cyb
```

### 2. Generate Hash Lookup Tables
```bash
# Extract all string names from authoring format
# Generate C++ header with hash→name mappings
# Use for debugging runtime scenes

cryo-hash-gen \
  --input cryos/suzanne-in-box/suzanne-in-box.cryo.pbtxt \
  --output generated/suzanne_in_box_hashes.hpp
```

### 3. Validate Runtime Scenes
```bash
# Check that all cache handles are valid
# Verify binary data integrity
# Test loading performance

cryo-validator \
  --input suzanne-in-box.cyb \
  --check-handles \
  --check-binary-data \
  --benchmark-loading
```

## Version History

- **1.0.0** (2025-10-18) - Initial runtime format implementation
  - String hashing with FNV-1a
  - Cache handle system
  - Base64-embedded binary data in .pbtxt
  - Binary .cyb support