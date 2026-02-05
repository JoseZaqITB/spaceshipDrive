void main() {
    // get a circle shape
    float strenght = distance(gl_PointCoord, vec2(0.5));
    strenght *= 2.0;
    strenght = 1.0 - strenght;
    //
    gl_FragColor = vec4(strenght,strenght,strenght,1.0);
}