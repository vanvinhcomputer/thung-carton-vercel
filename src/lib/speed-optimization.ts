// Speed Index Optimization for sub-2 second loading
export const initSpeedOptimizations = () => {
  // Critical resource preloading
  const preloadCriticalResources = () => {
    const criticalResources = [
      { href: '/images/hero-optimized.webp', as: 'image', type: 'image/webp' },
      { href: '/images/hero-optimized.jpg', as: 'image', type: 'image/jpeg' },
      { href: '/hero-video-optimized.mp4', as: 'video', type: 'video/mp4' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  };

  // Eliminate render-blocking resources
  const optimizeRenderBlocking = () => {
    // Defer non-critical CSS
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    nonCriticalCSS.forEach(link => {
      const href = (link as HTMLLinkElement).href;
      link.remove();
      
      // Load asynchronously
      const asyncLink = document.createElement('link');
      asyncLink.rel = 'stylesheet';
      asyncLink.href = href;
      asyncLink.media = 'print';
      asyncLink.onload = () => { asyncLink.media = 'all'; };
      document.head.appendChild(asyncLink);
    });
  };

  // Optimize font loading
  const optimizeFonts = () => {
    // Use font-display: swap for web fonts
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: system-ui;
        font-display: swap;
      }
      * {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      }
    `;
    document.head.appendChild(style);
  };

  // Minimize main thread work
  const optimizeMainThread = () => {
    // Use scheduler API for non-urgent tasks
    const scheduleWork = (task: () => void, priority: string = 'background') => {
      if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
        (window as any).scheduler.postTask(task, { priority });
      } else {
        // Fallback to setTimeout
        setTimeout(task, 0);
      }
    };

    // Defer analytics initialization
    scheduleWork(() => {
      import('/src/lib/analytics.js').then(({ initAnalytics }) => initAnalytics());
    });

    // Defer tracking initialization
    scheduleWork(() => {
      import('/src/lib/tracking.js').then(({ initGlobalTracking }) => initGlobalTracking());
    });
  };

  // Optimize images for faster loading
  const optimizeImages = () => {
    // Implement progressive image loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const placeholder = img.src;
          
          // Create high-quality version
          const highQuality = new Image();
          highQuality.onload = () => {
            img.src = highQuality.src;
            img.classList.add('loaded');
          };
          highQuality.src = img.dataset.src!;
          
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));
  };

  // Service Worker for caching
  const initServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  };

  // Execute optimizations in order
  requestIdleCallback(() => {
    preloadCriticalResources();
    optimizeRenderBlocking();
    optimizeFonts();
    optimizeMainThread();
    optimizeImages();
    initServiceWorker();
  });
};

// Critical CSS injection for above-the-fold content
export const injectCriticalCSS = () => {
  const criticalCSS = `
    .hero-section{min-height:100vh;contain:layout style;position:relative}
    .hero-content-container{contain:layout;min-height:100vh;width:100%}
    .hero-title{min-height:5.5rem;line-height:1.1;contain:layout}
    video::-webkit-media-controls{display:none!important}
    video::-webkit-media-controls-enclosure{display:none!important}
    .hero-content-animate{opacity:0;transform:translateY(20px);animation:fadeInUp .8s ease-out .2s forwards}
    @keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}
    body{margin:0;font-family:system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectCriticalCSS();
    initSpeedOptimizations();
  });
} else {
  injectCriticalCSS();
  initSpeedOptimizations();
}