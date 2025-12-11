// jacobi.frag

precision highp float;

uniform sampler2D uPressure;    // 現在（または前回の反復）の圧力テクスチャ
uniform sampler2D uDivergence;  // 速度場の発散テクスチャ
uniform vec2      uResolution;  // テクスチャ解像度 (SIM_RESOLUTION)
uniform float     uAlpha;       // 定数: -dx^2 (ここでは -1.0 / (simResolution)^2 )
uniform float     uBeta;        // 定数: 1.0 / 4.0

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    
    // 隣接するピクセル（テクセル）の座標を取得
    // dx/dy はここでは 1.0 / uResolution.x (または y) となる
    float invDx = 1.0 / uResolution.x;
    float invDy = 1.0 / uResolution.y;

    // 隣接する圧力値を取得
    float pN = texture2D(uPressure, uv + vec2(0.0, invDy)).r; // 北 (上)
    float pS = texture2D(uPressure, uv - vec2(0.0, invDy)).r; // 南 (下)
    float pE = texture2D(uPressure, uv + vec2(invDx, 0.0)).r; // 東 (右)
    float pW = texture2D(uPressure, uv - vec2(invDx, 0.0)).r; // 西 (左)
    
    // 発散値を取得
    float div = texture2D(uDivergence, uv).r;

    // ヤコビ反復法の計算式:
    // P_new = (P_N + P_S + P_E + P_W + Div * alpha) * beta
    float p = (pN + pS + pE + pW + div * uAlpha) * uBeta;

    // 計算された新しい圧力値を出力
    gl_FragColor = vec4(p, p, p, 1.0);
}