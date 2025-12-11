document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('headerCanvas');
    const header = document.getElementById('splatoonHeader');
    if (!canvas || !header) return;

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    let time = 0;
    const dpr = window.devicePixelRatio || 1;

    // カラーパレット
    const colors = [
        '#FF2D55', // ピンク
        '#00F7FF', // シアン
        '#FF5F1F', // オレンジ
        '#8A2BE2', // パープル
        '#1E90FF'  // ブルー
    ];

    // インクのしずくクラス
    class InkSplat {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.points = [];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.002;
            this.scale = 0.8 + Math.random() * 0.4;
            
            // 不規則な形状を作成
            const pointCount = 8 + Math.floor(Math.random() * 8);
            for (let i = 0; i < pointCount; i++) {
                const angle = (i / pointCount) * Math.PI * 2;
                const distance = 0.6 + Math.random() * 0.4;
                this.points.push({
                    angle: angle,
                    distance: distance,
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance
                });
            }
        }

        update() {
            this.rotation += this.rotationSpeed;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.scale, this.scale);
            
            // メインの形状を描画
            ctx.beginPath();
            this.points.forEach((point, i) => {
                const x = point.x * this.radius;
                const y = point.y * this.radius;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.closePath();
            
            // グラデーションを作成
            const gradient = ctx.createRadialGradient(
                0, 0, 0,
                0, 0, this.radius * 0.8
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, this.adjustColor(this.color, -40));
            
            // 影を付けて描画
            ctx.shadowColor = this.color + '80';
            ctx.shadowBlur = 20;
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // 内側のハイライトを描画
            ctx.beginPath();
            this.points.forEach((point, i) => {
                const x = point.x * this.radius * 0.6;
                const y = point.y * this.radius * 0.6;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fill();
            
            ctx.restore();
        }

        adjustColor(color, amount) {
            return '#' + color.replace(/^#/, '').replace(/../g, color => 
                ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16))
                .substr(-2)
            );
        }
    }

    // インクのしずくを生成
    const splats = [];
    function createSplats() {
        splats.length = 0;
        const count = 15 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 0.8;
            const x = width * (0.5 + Math.cos(angle) * distance * 0.5);
            const y = height * (0.5 + Math.sin(angle) * distance * 0.5);
            const radius = 50 + Math.random() * 150;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            splats.push(new InkSplat(x, y, radius, color));
        }
    }

    // リサイズ処理
    function resize() {
        width = header.clientWidth;
        height = header.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);
        createSplats();
    }

    // アニメーションループ
    function animate() {
        time += 0.01;
        ctx.clearRect(0, 0, width, height);
        
        // 背景を描画
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a0a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // しずくを描画・更新
        splats.forEach(splat => {
            splat.update();
            splat.draw(ctx);
        });
        
        requestAnimationFrame(animate);
    }

    // 初期化
    window.addEventListener('resize', resize);
    resize();
    animate();
});