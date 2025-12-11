precision highp float;

uniform sampler2D uVelocity;
uniform sampler2D uPressure;
uniform vec2      uResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // 隣接する圧力値から圧力勾配を計算
    float pN = texture2D(uPressure, uv + vec2(0.0, 1.0 / uResolution.y)).r;
    float pS = texture2D(uPressure, uv - vec2(0.0, 1.0 / uResolution.y)).r;
    float pE = texture2D(uPressure, uv + vec2(1.0 / uResolution.x, 0.0)).r;
    float pW = texture2D(uPressure, uv - vec2(1.0 / uResolution.x, 0.0)).r;

    vec2 gradient = vec2(pE - pW, pN - pS) / (2.0 / uResolution.x); // XとYでスケールを統一

    // 速度場から圧力勾配を減算 (発散除去)
    vec2 currentVelocity = texture2D(uVelocity, uv).xy;
    gl_FragColor = vec4(currentVelocity - gradient, 0.0, 1.0);
}