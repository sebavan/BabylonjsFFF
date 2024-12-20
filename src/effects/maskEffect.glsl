varying vec2 vUV;

uniform float rotation;

uniform sampler2D maskSampler;
uniform sampler2D circleSampler;

vec2 rotateUV(vec2 uv, float rot)
{
    float mid = 0.5;
    return vec2(
        cos(rot) * (uv.x - mid) + sin(rot) * (uv.y - mid) + mid,
        cos(rot) * (uv.y - mid) - sin(rot) * (uv.x - mid) + mid
    );
}

void main()
{
    vec2 uv = rotateUV(vUV, rotation);

    float mask = texture2D(maskSampler, uv).r;
    vec3 circle = texture2D(circleSampler, uv).rgb;

    gl_FragColor = vec4(circle * mask, 1.0);
}