/**
 * contact-form.js
 * コンタクトフォーム送信処理
 * 作成日: 2025-12-16
 */

(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Contact form submission -> Formspree integration
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return; // フォームがなければ終了
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const statusEl = document.getElementById('contactStatus');
      if (statusEl) {
        statusEl.style.color = '#cfc';
        statusEl.textContent = '送信中…';
      }

      const formData = new FormData(this);

      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          if (statusEl) {
            statusEl.style.color = '#a6f3a6';
            statusEl.textContent = '送信が完了しました。ありがとうございました。';
          }
          contactForm.reset();
        } else {
          response.json().then(data => {
            if (statusEl) {
              statusEl.style.color = '#f3a6a6';
              statusEl.textContent = data && data.error ? `送信に失敗しました: ${data.error}` : '送信に失敗しました。別の方法でご連絡ください。';
            }
          }).catch(() => {
            if (statusEl) {
              statusEl.style.color = '#f3a6a6';
              statusEl.textContent = '送信に失敗しました。';
            }
          });
        }
      }).catch(err => {
        console.error('Contact submit error:', err);
        if (statusEl) {
          statusEl.style.color = '#f3a6a6';
          statusEl.textContent = 'ネットワークエラーで送信できませんでした。';
        }
      });
    });
  });
  
})();