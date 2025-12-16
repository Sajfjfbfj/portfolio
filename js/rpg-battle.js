/**
 * rpg-battle.js
 * RPGバトルインターフェース機能
 * 作成日: 2025-12-16
 */

(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // タッチデバイス用のハンドラー
    function handleFirstTouch() {
      document.body.classList.add('has-touch');
      document.removeEventListener('touchstart', handleFirstTouch);
    }
    
    // タッチイベントの検出
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      document.addEventListener('touchstart', handleFirstTouch, false);
    }
    
    // Project data for character info updates
    const projectData = {
      'RGSK-001': {
        name: '龍翔会 弓道部',
        level: 'Lv.99',
        status: 'COMPLETED',
        hp: 100,
        image: 'images/Postericon/龍翔会.png',
        logs: [
          { date: '[2024.11.23]', message: '大会・審査成績を更新しました' },
          { date: '[2024.11.23]', message: '大会・審査要項を更新しました' },
          { date: '[2024.10.20]', message: '大会・審査要項を更新しました' },
          { date: '[2024.10.20]', message: '大会・審査成績を更新しました' },
          { date: '[2024.09.21]', message: '大会・審査成績を更新しました' }
        ]
      },
      'ENTEKI-001': {
        name: 'MATOMA - 遠的',
        level: 'Lv.85',
        status: 'IN PROGRESS',
        hp: 85,
        image: 'images/Postericon/aikonmato.png',
        logs: [
          { date: '[2025.10.27]', message: '更新' },
          { date: '[2025.10.22]', message: '更新' },
          { date: '[2025.10.21]', message: '更新' },
          { date: '[2025.10.19]', message: '更新' },
          { date: '[2025.10.18]', message: '更新' },
          { date: '[2025.10.16]', message: '更新' },
          { date: '[2025.10.10]', message: '更新' },
          { date: '[2025.10.09]', message: '更新' },
          { date: '[2025.10.08]', message: '更新' },
          { date: '[2025.10.06]', message: '更新' },
          { date: '[2025.10.05]', message: '更新' },
          { date: '[2025.10.03]', message: '更新' },
          { date: '[2025.09.26]', message: '更新' },
          { date: '[2025.09.25]', message: '公開' }
        ]
      },
      'ZELDA-001': {
        name: '茨城県弓道連盟(模倣)',
        level: 'Lv.75',
        status: 'COMPLETED',
        hp: 75,
        image: 'images/Postericon/茨城県弓道連盟.png',
        logs: [
          { date: '[2025.11.06]', message: '完成' },
          { date: '[2025.11.01]', message: '企画、作成開始' }
        ]
      },
      'PKMN-2024': {
        name: 'ポケモン スカーレット',
        level: 'Lv.65',
        status: 'IN PROGRESS',
        hp: 65,
        image: 'https://via.placeholder.com/80/2d2424/0f3460?text=PKMN'
      }
    };

    // RPG Character Selection
    document.querySelectorAll('.character-thumbnail').forEach(thumb => {
      thumb.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const project = projectData[targetId];
        
        if (!project) return;
        
        // Update active character and main display
        const activeCharElement = document.querySelector('.rpg-character.active');
        if (!activeCharElement) return;
        
        // Update character name
        const charName = activeCharElement.querySelector('.character-name');
        if (charName) charName.textContent = project.name;
        
        // Update character level
        const charLevel = activeCharElement.querySelector('.character-level');
        if (charLevel) charLevel.textContent = project.level;
        
        // Update character status
        const charStatus = activeCharElement.querySelector('.character-status');
        if (charStatus) {
          charStatus.textContent = project.status;
          charStatus.style.background = project.status === 'COMPLETED' ? '#4caf50' : '#ff9800';
        }
        
        // Update character HP bar
        const hpFill = activeCharElement.querySelector('.hp-fill');
        if (hpFill) hpFill.style.width = `${project.hp}%`;
        
        // Update character image
        const charImage = activeCharElement.querySelector('.character-image');
        if (charImage && project.image) {
          charImage.src = project.image;
          charImage.alt = project.name;
        }
        
        // Update data-id on active character element
        activeCharElement.setAttribute('data-id', targetId);
        
        // Update log container if project has custom logs
        if (project.logs) {
          const logContainer = document.querySelector('.log-container');
          if (logContainer) {
            logContainer.innerHTML = ''; // Clear existing logs
            project.logs.forEach(log => {
              const logEntry = document.createElement('div');
              logEntry.className = 'log-entry';
              logEntry.innerHTML = `
                <span class="log-time">${log.date}</span>
                <span class="log-message">${log.message}</span>
              `;
              logContainer.appendChild(logEntry);
            });
          }
        }
        
        // Update project details
        document.querySelectorAll('.project-details').forEach(detail => {
          detail.classList.toggle('hidden', detail.getAttribute('data-project') !== targetId);
        });
      });
    });
    
    // Battle command buttons
    document.querySelectorAll('.battle-command').forEach(button => {
      button.addEventListener('click', function() {
        const command = this.getAttribute('data-command');
        const logContainer = document.querySelector('.log-container');
        let message = '';
        
        switch(command) {
          case 'details':
            message = 'プロジェクトの詳細情報を表示します...';
            break;
          case 'skills':
            message = '使用したスキルや技術を表示します...';
            break;
          case 'items':
            message = '使用したツールやリソースを表示します...';
            break;
          case 'flee':
            message = '前の画面に戻ります...';
            // Add navigation logic here if needed
            break;
        }
        
        if (message && logContainer) {
          const logEntry = document.createElement('div');
          logEntry.className = 'log-entry';
          logEntry.innerHTML = `
            <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
            <span class="log-message">${message}</span>
          `;
          logContainer.prepend(logEntry);
        }
      });
    });
  });
  
})();