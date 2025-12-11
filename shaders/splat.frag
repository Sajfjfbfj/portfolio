precision highp float;

uniform sampler2D uTarget;      // ターゲットテクスチャ（密度または速度）
uniform vec2      uResolution;  // テクスチャ解像度
uniform vec2      uPoint;       // 注入の中心座標 (テクセル単位)
uniform float     uRadius;      // 注入の半径 (テクセル単位)
uniform vec4      uColor;       // 注入する値 (色、速度ベクトルなど)

void main() {
    vec2 uv = gl_FragCoord.xy;
    float dist = distance(uv, uPoint);
    
    // ガウシアン的な影響でスムーズに注入
    float strength = smoothstep(uRadius, 0.0, dist);
    
    vec4 currentColor = texture2D(uTarget, uv / uResolution);
    gl_FragColor = currentColor + uColor * strength;
}