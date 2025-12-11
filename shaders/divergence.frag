precision highp float;

uniform sampler2D uVelocity;
uniform vec2      uResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // 左右と上下の速度の差分を計算
    float vx0 = texture2D(uVelocity, uv - vec2(1.0 / uResolution.x, 0.0)).x;
    float vx1 = texture2D(uVelocity, uv + vec2(1.0 / uResolution.x, 0.0)).x;
    float vy0 = texture2D(uVelocity, uv - vec2(0.0, 1.0 / uResolution.y)).y;
    float vy1 = texture2D(uVelocity, uv + vec2(0.0, 1.0 / uResolution.y)).y;

    // 中央差分法による発散計算 (dv_x/dx + dv_y/dy)
    float divergence = (vx1 - vx0) / (2.0 / uResolution.x) + (vy1 - vy0) / (2.0 / uResolution.y);

    gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0); // 発散はRチャンネルに格納
}