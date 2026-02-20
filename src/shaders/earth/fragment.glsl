uniform sampler2D uTDay;
uniform sampler2D uTEClouds;
uniform vec3 uSunPosition;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereNightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

/*contributors: [Stefan Gustavson, Ian McEwan]
https://github.com/patriciogonzalezvivo/lygia/blob/main/generative/snoise.glsl

also
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com
*/
vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(const in vec3 v) { return mod289(((v * 34.0) + 1.0) * v); }

float snoise(in vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    // First corner
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    // Other corners
    vec2 i1;
    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
    //i1.y = 1.0 - i1.x;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    // x0 = x0 - 0.0 + 0.0 * C.xx ;
    // x1 = x0 - i1 + 1.0 * C.xx ;
    // x2 = x0 - 1.0 + 2.0 * C.xx ;
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    // Compute final noise value at P
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .4;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * abs(snoise(st));
        st *= 2.;
        amplitude *= .5;
    }
    float offset = 1.0;
    value = abs(value);     // create creases
    value = offset - value; // invert so creases are at top
    value = value * value;      // sharpen creases
    return value;
}

void main()
{   
    // makemake color
    vec3 dayColor = texture(uTDay, vUv).rgb;

    // night color
    float strenght = fbm(vUv *50.0) * 1.0;
    strenght = smoothstep(0.4, 1.0, strenght);
    strenght *= smoothstep(0.5,1.0,snoise(vUv * 20.0)); 
    vec3 nightColor = mix(dayColor / 50.0, vec3(0.0,1.0,1.0), strenght);


    //
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