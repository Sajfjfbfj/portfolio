class TypingAnimation {
    constructor(element, options = {}) {
        this.element = element;
        this.text = element.textContent;
        this.speed = options.speed || 50; // タイピング速度（ミリ秒）
        this.delay = options.delay || 0; // アニメーション開始までの遅延（ミリ秒）
        this.cursor = options.cursor !== undefined ? options.cursor : true; // カーソルを表示するか
        this.cursorChar = options.cursorChar || '|'; // カーソルの文字
        this.cursorSpeed = options.cursorSpeed || 530; // カーソルの点滅速度（ミリ秒）
        
        this.init();
    }
    
    init() {
        this.element.textContent = ''; // テキストを空にする
        this.charIndex = 0;
        this.isAnimating = false;
        this.cursorVisible = true;
        
        // オブザーバーを設定
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimating) {
                    this.startAnimation();
                }
            });
        }, {
            threshold: 0.5 // 要素が50%見えたら発動
        });
        
        this.observer.observe(this.element);
        
        // カーソルを追加
        if (this.cursor) {
            this.cursorElement = document.createElement('span');
            this.cursorElement.className = 'typing-cursor';
            this.cursorElement.textContent = this.cursorChar;
            this.cursorElement.style.animation = `blink ${this.cursorSpeed}ms infinite`;
            this.element.appendChild(this.cursorElement);
            
            // アニメーションを定義
            const style = document.createElement('style');
            style.textContent = `
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .typing-cursor {
                    display: inline-block;
                    margin-left: 2px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.charIndex = 0;
        
        // 遅延を設定
        setTimeout(() => {
            this.type();
        }, this.delay);
    }
    
    type() {
        if (this.charIndex < this.text.length) {
            // カーソルがある場合は一時的に非表示にする
            if (this.cursorElement) {
                this.cursorElement.style.visibility = 'hidden';
            }
            
            // 1文字ずつ表示
            this.element.textContent = this.text.substring(0, this.charIndex + 1);
            
            // カーソルを再表示
            if (this.cursorElement) {
                this.element.appendChild(this.cursorElement);
                this.cursorElement.style.visibility = 'visible';
            }
            
            this.charIndex++;
            
            // 次の文字を表示
            setTimeout(() => this.type(), this.speed);
        } else {
            // アニメーション完了
            if (this.cursorElement) {
                // カーソルを点滅させる
                this.cursorElement.style.animation = 'none';
                setTimeout(() => {
                    this.cursorElement.style.animation = `blink ${this.cursorSpeed}ms infinite`;
                }, 10);
            }
        }
    }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    // タイピングアニメーションを適用する要素を取得
    const typingElements = document.querySelectorAll('.typing-animation');
    
    // 各要素にアニメーションを適用
    typingElements.forEach((element, index) => {
        new TypingAnimation(element, {
            speed: 80, // タイピング速度（ミリ秒）
            delay: index * 300, // 要素ごとに遅延を設定
            cursor: true, // カーソルを表示
            cursorChar: '|', // カーソルの文字
            cursorSpeed: 530 // カーソルの点滅速度（ミリ秒）
        });
    });
    
    // サブタイトル（cipher-text）にもアニメーションを適用
    const subTitles = document.querySelectorAll('.cipher-text.typing-animation');
    subTitles.forEach((element, index) => {
        new TypingAnimation(element, {
            speed: 30, // 少し速く
            delay: index * 300 + 300, // メインタイトルの後に表示
            cursor: false // カーソルは非表示
        });
    });
});
