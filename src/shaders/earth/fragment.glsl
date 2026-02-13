uniform sampler2D uTDay;
uniform sampler2D uTNight;
uniform sampler2D uTEClouds;
uniform vec3 uSunPosition;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereNightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{   
    // earth color
    vec3 dayColor = texture(uTDay, vUv).rgb;
    vec3 nightColor = texture(uTNight, vUv).rgb;
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    // fresnel
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);
    // light and orientation
    float lightOrientation = dot(uSunPosition, normal);
    // mix texture and light orientation
    float dayMix = smoothstep(-0.25, 0.5,lightOrientation);
    vec3 color = mix(nightColor, dayColor, dayMix);
    // clouds
    vec2 specularCloudsMix = texture(uTEClouds, vUv).rg;
    float clouds = specularCloudsMix.g;
    clouds = smoothstep(0.3,1.0, clouds);
    clouds *= dayMix;
    color = mix(color, vec3(1.0), clouds);
    // atmosphere
    float atmosphereMix = smoothstep(-0.5,1.0, lightOrientation);
    vec3 atmosphereColor = mix(uAtmosphereNightColor, uAtmosphereDayColor, atmosphereMix);
    // mix atmosphere with color
    color = mix(color, atmosphereColor, fresnel * atmosphereMix);
    // specular
    vec3 reflection = reflect(- uSunPosition / 3.0, normal ); // in r3f must be / 3.0, dont know why
    float specular = - dot(reflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 32.0);

    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);

    color += specular * specularColor;
    // Final color
    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}