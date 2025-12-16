/**
 * lightbox.js
 * 画像ライトボックス機能
 * 作成日: 2025-12-16
 */

(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', () => {
    // Lightbox functionality
    const modal = document.getElementById('imageModal');
    if (!modal) return; // モーダルがなければ終了
    
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const modalTags = document.querySelector('.modal-tags');
    const loadingIndicator = document.querySelector('.modal-loading');
    const closeBtn = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.modal-nav.prev');
    const nextBtn = document.querySelector('.modal-nav.next');
    
    let currentImage = null;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // Open modal function
    function openModal(imgElement) {
      if (isAnimating || !imgElement) return;
      
      isAnimating = true;
      currentImage = imgElement;
      
      // Show modal
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Set modal content
      const title = imgElement.getAttribute('data-title') || imgElement.alt || '';
      const description = imgElement.getAttribute('data-description') || '';
      const tags = imgElement.getAttribute('data-tags') ? 
        imgElement.getAttribute('data-tags').split(',') : [];
      
      // Update text content
      if (modalTitle) modalTitle.textContent = title;
      if (modalDescription) modalDescription.textContent = description;
      
      // Update tags
      if (modalTags) {
        modalTags.innerHTML = tags.map(tag => 
          `<span class="tag">#${tag.trim()}</span>`
        ).join('');
      }
      
      // Reset loading indicator
      if (loadingIndicator) loadingIndicator.style.display = 'block';
      if (modalImg) modalImg.style.opacity = '0';
      
      // Force reflow to ensure animation runs
      void modal.offsetWidth;
      
      // Start animation
      modal.classList.add('show');
      
      // Preload image
      const img = new Image();
      img.onload = () => {
        if (modalImg) {
          modalImg.src = imgElement.src;
          modalImg.alt = imgElement.alt || title;
        }
        
        // Animate after image loads
        setTimeout(() => {
          if (modalImg) modalImg.style.opacity = '1';
          if (loadingIndicator) loadingIndicator.style.display = 'none';
          isAnimating = false;
        }, 50);
      };
      
      img.onerror = () => {
        if (modalImg) modalImg.alt = '画像の読み込みに失敗しました';
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        isAnimating = false;
      };
      
      img.src = imgElement.src;
    }

    // Close modal function
    function closeModal() {
      if (isAnimating || !modal.classList.contains('show')) return;
      isAnimating = true;
      
      modal.classList.remove('show');
      
      // Reset after animation
      setTimeout(() => {
        modal.style.display = 'none';
        if (modalImg) {
          modalImg.style.opacity = '0';
          modalImg.src = '';
        }
        currentImage = null;
        isAnimating = false;
        document.body.style.overflow = 'auto';
        
        // Reset loading indicator
        if (loadingIndicator) loadingIndicator.style.display = 'block';
      }, 250);
    }

    // Navigate between images
    function navigate(direction) {
      if (isAnimating) return;
      
      const images = Array.from(document.querySelectorAll('.lightbox-trigger'));
      if (images.length <= 1) return;
      
      let currentIndex = currentImage ? images.indexOf(currentImage) : -1;
      
      if (direction === 'next') {
        currentIndex = (currentIndex + 1) % images.length;
      } else {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
      }
      
      // Only navigate if different from current image
      if (currentIndex !== images.indexOf(currentImage)) {
        openModal(images[currentIndex]);
      }
    }

    // Touch event handlers for swipe
    function handleTouchStart(e) {
      touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      
      // Swipe threshold (pixels)
      const threshold = 50;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          navigate('next');
        } else {
          navigate('prev');
        }
      }
    }

    // Image click event
    document.querySelectorAll('.lightbox-trigger').forEach(img => {
      img.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(this);
      });
      
      // Add tabindex for keyboard navigation
      img.setAttribute('tabindex', '0');
      
      // Keyboard navigation (Enter/Space to open)
      img.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(this);
        }
      });
    });

    // Close button event
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    
    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate('prev');
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate('next');
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('show')) return;
      
      switch(e.key) {
        case 'Escape':
          e.preventDefault();
          closeModal();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigate('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigate('next');
          break;
      }
    });
    
    // Touch events
    modal.addEventListener('touchstart', handleTouchStart, { passive: true });
    modal.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    });
  });
  
})();