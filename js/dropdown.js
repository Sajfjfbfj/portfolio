// ドロップダウンの動作
document.addEventListener('DOMContentLoaded', () => {
  const dropdownBtn = document.getElementById('workDropdownBtn');
  const dropdownMenu = document.getElementById('workDropdown');
  const workDropdown = document.querySelector('.work-dropdown');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  
  if (!dropdownBtn || !dropdownMenu || !workDropdown) {
    console.error('Dropdown elements not found');
    return;
  }

  // ドロップダウンを開く
  function openDropdown() {
    dropdownMenu.classList.add('active');
    dropdownBtn.setAttribute('aria-expanded', 'true');
    
    // モバイルの場合は閉じるボタンを表示
    if (window.innerWidth <= 768 && closeMenuBtn) {
      closeMenuBtn.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
  }

  // ドロップダウンを閉じる
  function closeDropdown(callback) {
    if (dropdownMenu && dropdownBtn) {
      dropdownMenu.classList.remove('active');
      dropdownBtn.setAttribute('aria-expanded', 'false');
      
      // 閉じるボタンを非表示
      if (closeMenuBtn) {
        closeMenuBtn.classList.remove('visible');
      }
      
      // スクロールを有効化
      document.body.style.overflow = '';
      
      // アニメーションが完了してからコールバックを実行
      setTimeout(() => {
        if (typeof callback === 'function') {
          callback();
        }
      }, 300); // CSSのトランジション時間（0.3s）に合わせる
      
      return true;
    }
    return false;
  }

  // トグル
  function toggleDropdown(e) {
    // モバイルのみで動作
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      
      if (dropdownMenu.classList.contains('active')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }
  }

  // モバイルのみクリックイベントを有効化
  if (window.innerWidth <= 768) {
    dropdownBtn.addEventListener('click', toggleDropdown);
  }

  // 閉じるボタンのイベント（モバイル用）
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDropdown();
    });
  }

  // デスクトップ: ホバーで開閉
  if (window.innerWidth > 768) {
    workDropdown.addEventListener('mouseenter', openDropdown);
    workDropdown.addEventListener('mouseleave', closeDropdown);
  }

  // メニュー項目クリックで閉じる
  const menuItems = dropdownMenu.querySelectorAll('a');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // デフォルトの動作を防ぐ
      e.preventDefault();
      const targetUrl = item.getAttribute('href');
      
      // ドロップダウンを閉じてから遷移
      closeDropdown(() => {
        window.location.href = targetUrl;
      });
    });
  });

  // Escキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdownMenu.classList.contains('active')) {
      closeDropdown();
      dropdownBtn.focus();
    }
  });

  // リサイズ時の処理
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // メニューが開いていれば閉じる
      if (dropdownMenu.classList.contains('active')) {
        closeDropdown();
      }
      
      // イベントリスナーを再設定
      dropdownBtn.removeEventListener('click', toggleDropdown);
      workDropdown.removeEventListener('mouseenter', openDropdown);
      workDropdown.removeEventListener('mouseleave', closeDropdown);
      
      if (window.innerWidth <= 768) {
        // モバイル: クリックで開閉
        dropdownBtn.addEventListener('click', toggleDropdown);
      } else {
        // デスクトップ: ホバーで開閉
        workDropdown.addEventListener('mouseenter', openDropdown);
        workDropdown.addEventListener('mouseleave', closeDropdown);
      }
    }, 100);
  }

  // リサイズイベントを設定
  window.addEventListener('resize', handleResize);
});