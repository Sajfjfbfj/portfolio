precision highp float;

uniform sampler2D uTexture;     // 現在の速度または密度テクスチャ
uniform sampler2D uVelocity;    // 現在の速度テクスチャ
uniform vec2      uResolution;  // テクスチャ解像度
uniform float     uDt;          // タイムステップ

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    // 速度を使って前の位置を逆算
    vec2 velocity = texture2D(uVelocity, uv).xy;
    vec2 prevUV = uv - velocity * uDt;

    // 前の位置の色/密度/速度を現在の位置に転送
    gl_FragColor = texture2D(uTexture, prevUV);
}