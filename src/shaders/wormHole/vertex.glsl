uniform float uTime;
varying vec3 vP;
varying vec2 vUv;

void main() {
    vec3 newPosition = position;
    // distorsion
    float dynamicRadius = uTime * 3.0 - 9.0;
    dynamicRadius = min(dynamicRadius, 20.0);
    newPosition.xy += 0.1 * newPosition.xy * dynamicRadius;
    // set position
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    // temp
    vP = newPosition;
    vUv = uv;
}