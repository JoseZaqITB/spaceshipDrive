uniform vec3 uSunPosition;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereNightColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main()
{   
    // earth color
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);
    // light and orientation
    float lightOrientation = dot(uSunPosition, normal);
    // atmosphere
    float atmosphereMix = smoothstep(-0.5,1.0, lightOrientation);
    vec3 atmosphereColor = mix(uAtmosphereNightColor, uAtmosphereDayColor, atmosphereMix);
    // mix atmosphere with color
    color += atmosphereColor;
    // fading and stay dark on dark side
    float edgeAlpha = dot(viewDirection, normal);
    edgeAlpha = smoothstep(0.0,0.5, edgeAlpha);
    float dayAlpha = smoothstep(-0.5,0.0, lightOrientation);

    float alpha = edgeAlpha * dayAlpha;

    // Final color
    gl_FragColor = vec4(color, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}