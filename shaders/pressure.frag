precision highp float;

uniform sampler2D uPressure;    // 現在の圧力テクスチャ
uniform sampler2D uDivergence;  // 発散テクスチャ
uniform vec2      uResolution;
uniform float     uAlpha;       // 係数
uniform float     uBeta;        // 係数

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    float pN = texture2D(uPressure, uv + vec2(0.0, 1.0 / uResolution.y)).r;
    float pS = texture2D(uPressure, uv - vec2(0.0, 1.0 / uResolution.y)).r;
    float pE = texture2D(uPressure, uv + vec2(1.0 / uResolution.x, 0.0)).r;
    float pW = texture2D(uPressure, uv - vec2(1.0 / uResolution.x, 0.0)).r;
    float div = texture2D(uDivergence, uv).r;

    // ヤコビ反復法の一ステップ
    // 中央のピクセルの圧力を隣接ピクセルと発散に基づいて更新
    float p = (pN + pS + pE + pW + div * uAlpha) * uBeta;

    gl_FragColor = vec4(p, p, p, 1.0);
}