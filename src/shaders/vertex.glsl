uniform float uTime;
uniform float uVelocity;
uniform float uDepth;

attribute float size;

void main() {
    vec3 newPosition = position;
    // move to z direction
    newPosition.z += uTime * uVelocity;
    
    // reset position when it passes z >= 3
    newPosition.z = mod(newPosition.z, uDepth) - uDepth * 0.7;

    //
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    /**
    * sizes
    */
    gl_PointSize =  /**
    * sizes
    */
    gl_PointSize = size * 100.0;
    // perspective sizes
    gl_PointSize *= ( 1.0 / - viewPosition.z );
}