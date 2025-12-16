/**
 * filter.js
 * ワークフィルター機能
 * 作成日: 2025-12-16
 */

(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    if (filterBtns.length === 0 || workCards.length === 0) {
      return; // 要素がなければ終了
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        workCards.forEach(card => {
          if (filterValue === 'all') {
            card.style.display = 'block';
          } else {
            const category = card.getAttribute('data-category');
            if (category === filterValue) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  });
  
})();