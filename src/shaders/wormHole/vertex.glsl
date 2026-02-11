uniform float uTime;
varying vec3 vP;
varying vec2 vUv;

void main() {
    vec3 newPosition = position;
    // distorsion
    float dynamicRadius = -sin(uTime * 0.6 + 0.1) * 2.3;
    float strength = distance(vec2(0.0), newPosition.xy) / 5.0;
    strength = max(0.0,1.0 - strength);
    newPosition.xy += strength * newPosition.xy * dynamicRadius;
    // set position
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    // temp
    vP = newPosition;
    vUv = uv;
}