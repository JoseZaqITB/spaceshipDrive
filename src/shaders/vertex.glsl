uniform float uTime;
uniform float uVelocity;
uniform float uDepth;

void main() {
    vec3 newPosition = position;
    // move to z direction
    newPosition.z += uTime * uVelocity;
    
    // reset position when it passes z >= 3
    newPosition.z = mod(newPosition.z, uDepth) - uDepth * 0.7;

    //
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = 1.0;
}