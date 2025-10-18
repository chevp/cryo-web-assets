// webgl-protocol.ts - TypeScript types for foundation/webgl-protocol
// Generated from webgl_scene.proto, webgl_shader.proto, webgl_material.proto, webgl_common.proto
// Part of: Arctic Engine - Cryo Web Assets

// ========== Common Types (webgl_common.proto) ==========

export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Matrix4 {
  elements: number[]; // 16 floats
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

// ========== Material Types (webgl_material.proto) ==========

export interface PBRMaterial {
  base_color_factor?: Vector3;
  metallic_factor?: number;
  roughness_factor?: number;
  base_color_texture_url?: string;
  metallic_roughness_texture_url?: string;
  normal_texture_url?: string;
  occlusion_texture_url?: string;
  emissive_texture_url?: string;
  emissive_factor?: Vector3;
  normal_scale?: number;
  occlusion_strength?: number;
  clearcoat?: number;
  clearcoat_roughness?: number;
  clearcoat_texture_url?: string;
  clearcoat_normal_texture_url?: string;
  transmission?: number;
  transmission_texture_url?: string;
  sheen_color?: Vector3;
  sheen_roughness?: number;
  ior?: number;
}

export interface Material {
  name?: string;
  pbr?: PBRMaterial;
  double_sided?: boolean;
  alpha_cutoff?: number;
  alpha_mode?: 'OPAQUE' | 'MASK' | 'BLEND';
  transparent?: boolean;
  opacity?: number;
  depth_test?: boolean;
  depth_write?: boolean;
  blend_mode?: 'normal' | 'additive' | 'multiply' | 'custom';
}

export interface TextureInfo {
  url: string;
  tex_coord?: number;
  scale?: Vector2;
  offset?: Vector2;
  rotation?: number;
}

// ========== Shader Types (webgl_shader.proto) ==========

export interface ShaderUniform {
  name: string;
  type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'mat4' | 'sampler2D';
  value_float?: number;
  value_vec2?: Vector2;
  value_vec3?: Vector3;
  value_vec4?: Vector4;
  value_mat4?: Matrix4;
  value_texture_url?: string;
  value_float_array?: number[];
  value_vec3_array?: Vector3[];
}

export interface ShaderAttribute {
  name: string;
  type: 'vec2' | 'vec3' | 'vec4';
  location: number;
}

export interface ShaderProgram {
  id: string;
  name?: string;
  vertex_shader: string;
  fragment_shader: string;
  uniforms?: ShaderUniform[];
  attributes?: ShaderAttribute[];
  defines?: Record<string, string>;
  extensions?: string[];
  shader_type?: 'standard' | 'pbr' | 'toon' | 'custom';
}

export interface ShaderMaterial {
  shader_id: string;
  uniform_overrides?: ShaderUniform[];
  transparent?: boolean;
  depth_test?: boolean;
  depth_write?: boolean;
  blend_mode?: 'normal' | 'additive' | 'multiply';
  side?: 'front' | 'back' | 'double';
}

// ========== Scene Types (webgl_scene.proto) ==========

export interface Transform {
  position?: Vector3;
  rotation?: Vector3; // Euler angles in degrees
  scale?: Vector3;
  quaternion?: Vector4;
}

export interface InlineGeometry {
  positions: number[];
  normals?: number[];
  uvs?: number[];
  indices?: number[];
  primitive_type?: 'triangles' | 'lines' | 'points';
}

export interface Mesh {
  gltf_url?: string;
  inline_geometry?: InlineGeometry;
}

export interface Entity {
  id: string;
  name?: string;
  transform?: Transform;
  mesh?: Mesh;
  material?: Material;
  shader_material?: ShaderMaterial;
  visible?: boolean;
  tags?: string[];
}

export interface Camera {
  type: 'perspective' | 'orthographic';
  position?: Vector3;
  target?: Vector3;
  fov?: number;
  near?: number;
  far?: number;
  aspect?: number;
}

export interface Light {
  id: string;
  type: 'directional' | 'point' | 'spot' | 'ambient';
  position?: Vector3;
  direction?: Vector3;
  color?: Vector3;
  intensity?: number;
  range?: number;
  inner_cone_angle?: number;
  outer_cone_angle?: number;
}

export interface Environment {
  ambient_color?: Vector3;
  ambient_intensity?: number;
  skybox_url?: string;
  background_color?: string;
  fog_enabled?: boolean;
  fog_near?: number;
  fog_far?: number;
  fog_color?: Vector3;
}

export interface Scene {
  id: string;
  version?: string;
  entities: Entity[];
  camera?: Camera;
  lights?: Light[];
  environment?: Environment;
  timestamp?: number;
  shaders?: ShaderProgram[];
}

export interface SceneDelta {
  since_timestamp: number;
  updated_entities?: Entity[];
  removed_entity_ids?: string[];
  camera?: Camera;
  updated_shaders?: ShaderProgram[];
}

// ========== API Response Types ==========

export interface WebGLProtocolResponse {
  scene?: Scene;
  delta?: SceneDelta;
  error?: string;
}
