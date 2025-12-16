/**
 * loading.js
 * ローディング画面の制御
 * 作成日: 2025-12-16
 */

(function() {
  'use strict';
  
  // セッションストレージをチェックして初回アクセスかどうかを確認
  if (sessionStorage.getItem('hasShownLoading') === 'true') {
    // すでに表示済みの場合はローディング画面を非表示に
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
    document.body.classList.remove('loading');
    
    // ヘッダービデオを表示して再生
    const headerVideo = document.getElementById('headerVideo');
    if (headerVideo) {
      headerVideo.style.display = 'block';
      headerVideo.play().catch(e => console.log('Header video play failed:', e));
    }
  } else {
    // 初回アクセスの場合、セッションストレージにフラグを設定
    sessionStorage.setItem('hasShownLoading', 'true');
    
    // ローディング状態のクラスを削除
    document.body.classList.remove('loading');

    // ローディング動画の処理
    const loadingVideo = document.getElementById('loadingVideo');
    if (loadingVideo) {
      // 動画が終了したらフェードアウト
      function finishLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
          loadingScreen.style.opacity = '0';
          setTimeout(() => {
            loadingScreen.style.display = 'none';
            // ローディング完了後にヘッダービデオを表示して再生
            const headerVideo = document.getElementById('headerVideo');
            if (headerVideo) {
              headerVideo.style.display = 'block';
              headerVideo.play().catch(e => console.log('Header video play failed:', e));
            }
          }, 500);
        }
        document.body.classList.remove('loading');
      }
      
      // ローディング動画が終了したら
      loadingVideo.addEventListener('ended', finishLoading);
      
      // 念のため、動画が再生できない場合のフォールバック
      setTimeout(finishLoading, 5000);
    }
  }
  
})();