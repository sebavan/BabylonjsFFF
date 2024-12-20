varying vec2 vUV;

uniform float radius;

const float border = 0.2;
const vec2 center = vec2(0.5);
const vec3 color = vec3(0., 0.8, 0.9);

float circle(vec2 uv, vec2 pos, float rad) {
	float d = length(pos - uv) - rad;
	float t = smoothstep(0.0, border, abs(rad-d));
	return (1.0 - t);
}

void main() 
{
	vec3 mainColor = circle(vUV, center, radius) * color;
    gl_FragColor = vec4(mainColor, 1.);
}