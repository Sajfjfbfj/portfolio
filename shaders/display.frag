precision highp float;

uniform sampler2D uDensity;     // 密度テクスチャ
uniform vec2      uResolution;  // 画面解像度
uniform vec3      uInkColor;    // インクの色
uniform float     uTime;        // 時間経過

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    
    // 密度テクスチャから値を取得
    float density = texture2D(uDensity, uv).r;
    
    // インクの境界を滑らかにするためのカーブ
    float alpha = smoothstep(0.0, 0.8, density * 5.0);
    
    // 背景色 (#f0f0f0)
    vec3 bgColor = vec3(0.94, 0.94, 0.94);
    
    // インク色と背景色を密度に応じて混ぜる
    vec3 finalColor = mix(bgColor, uInkColor, alpha);
    
    gl_FragColor = vec4(finalColor, 1.0);
}