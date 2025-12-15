// SETTINGS
let progress = 0;
let loadingComplete = false;
let allowFire = false;
let particles = [];
const gravity = 0.35;

// ドロップダウンメニューの制御
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.work-dropdown');
  
  // 各ドロップダウンにイベントリスナーを追加
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // デスクトップ用のホバーイベント
    const handleMouseEnter = () => {
      if (window.innerWidth > 768) {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateX(-50%) translateY(0)';
        menu.classList.add('active');
      }
    };
    
    const handleMouseLeave = () => {
      if (window.innerWidth > 768) {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateX(-50%) translateY(10px)';
        menu.classList.remove('active');
      }
    };
    
    // モバイル用のクリックイベント
    const handleClick = (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = menu.classList.contains('active');
        
        // すべてのドロップダウンメニューを閉じる
        document.querySelectorAll('.dropdown-menu').forEach(m => {
          if (m !== menu) {
            m.style.opacity = '0';
            m.style.visibility = 'hidden';
            m.style.transform = 'translateX(-50%) translateY(10px)';
            m.classList.remove('active');
          }
        });
        
        // クリックしたメニューの表示/非表示を切り替え
        if (!isOpen) {
          menu.style.opacity = '1';
          menu.style.visibility = 'visible';
          menu.style.transform = 'translateX(-50%) translateY(0)';
          menu.classList.add('active');
        } else {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          menu.style.transform = 'translateX(-50%) translateY(10px)';
          menu.classList.remove('active');
        }
      }
    };
    
    // イベントリスナーの追加
    dropdown.addEventListener('mouseenter', handleMouseEnter);
    dropdown.addEventListener('mouseleave', handleMouseLeave);
    link.addEventListener('click', handleClick);
    
    // リサイズイベントで状態をリセット
    const handleResize = () => {
      if (window.innerWidth > 768) {
        // デスクトップ表示に切り替わったらモバイル用の状態をリセット
        menu.removeAttribute('style');
        menu.classList.remove('active');
      } else {
        // モバイル表示に切り替わったらデスクトップ用の状態をリセット
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateX(-50%) translateY(10px)';
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // 初期化時に一度実行
    handleResize();
  });
  
  // ドキュメント全体のクリックイベントでメニューを閉じる
  const handleDocumentClick = (e) => {
    if (window.innerWidth <= 768) {
      const isClickInsideDropdown = e.target.closest('.work-dropdown');
      if (!isClickInsideDropdown) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          menu.style.transform = 'translateX(-50%) translateY(10px)';
          menu.classList.remove('active');
        });
      }
    }
  };
  
  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('touchstart', handleDocumentClick);
  
  // クリーンアップ関数を返す
  return () => {
    document.removeEventListener('click', handleDocumentClick);
    document.removeEventListener('touchstart', handleDocumentClick);
  };
}

// DOMの読み込みが完了したら初期化
document.addEventListener('DOMContentLoaded', () => {
  // 既存のDOMContentLoadedイベントがある場合は、その中で実行
  if (typeof initDropdowns === 'function') {
    initDropdowns();
  }
});

// 他のイベントリスナーと競合しないように、既存のDOMContentLoadedイベントを取得
const existingOnLoad = window.onload;
window.onload = function() {
  if (existingOnLoad) existingOnLoad();
  if (typeof initDropdowns === 'function') {
    initDropdowns();
  }
};

// CANVAS SETUP
const canvas = document.getElementById("inkLiquidCanvas");
const ctx = canvas.getContext("2d");
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// HERO
const loadingScreen = document.getElementById("inkLoadingScreen");
const clickToBreak = document.getElementById("inkClickToBreak");
const hero = document.getElementById("hero");
const heroContent = document.getElementById("heroContent");


// FAKE LOADING PROGRESS
const fakeLoading = setInterval(() => {
  if(progress < 100){
    progress += 1.2; // loading speed
  } else {
    clearInterval(fakeLoading);
    loadingComplete = true;
    clickToBreak.style.opacity = 1;
    clickToBreak.style.pointerEvents = "auto";
    allowFire = true;
  }
}, 25);


// DRAW WAVES
function drawLiquid() {
  ctx.clearRect(0,0,canvas.width, canvas.height);

  let filledHeight = canvas.height - (progress/100 * canvas.height);

  const colors = ["#ff4de1","#ff8c22","#00c9ff"];
  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, filledHeight + Math.sin(Date.now()/700 + i*2) * 25);

    for(let x=0; x<canvas.width; x++){
      ctx.lineTo(
        x,
        filledHeight + Math.sin(x * 0.01 + Date.now()/500 + i) * 25
      );
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
  });
}


// EXPLOSION PARTICLES
function fireInk() {
  for(let i=0; i<180; i++){
    particles.push({
      x: canvas.width/2,
      y: canvas.height/2,
      vx: Math.cos(i) * (Math.random()*6),
      vy: Math.sin(i) * (Math.random()*6) - 5,
      radius: Math.random()*16 + 8,
      color: ["#ff4de1","#ff8c22","#00c9ff"][Math.floor(Math.random()*3)]
    });
  }
}


// RENDER PARTICLES
function renderParticles(){
  for(let i = particles.length-1; i>=0; i--){
    let p = particles[i];
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fill();

    p.x += p.vx;
    p.y += p.vy;
    p.vy += gravity;
    p.radius *= 0.97;

    if(p.radius < 1){
      particles.splice(i,1);
    }
  }
}


// MASTER LOOP
function animate(){
  if(!loadingComplete){
    drawLiquid();
  } else {
    if(particles.length > 0){
      ctx.clearRect(0,0,canvas.width, canvas.height);
      renderParticles();
      
      if(particles.length === 0){
        loadingScreen.style.display = "none";
        hero.style.opacity = 1;
        setTimeout(()=> heroContent.classList.add("visible"), 300);
      }

    }
  }
  requestAnimationFrame(animate);
}
animate();


// CLICK TO SPLASH
window.addEventListener("click", ()=>{
  if(allowFire){
    allowFire = false;
    fireInk();
    clickToBreak.style.display = "none";
  }
});
