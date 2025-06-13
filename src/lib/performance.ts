// Mobile-first performance optimization and Core Web Vitals tracking
export const optimizeImageLoading = () => {
  // Implement intersection observer for lazy loading
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  }, { rootMargin: '50px' });

  // Observe all images with data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
};

export const optimizeVideoLoading = () => {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) {
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('video').forEach(video => {
    videoObserver.observe(video);
  });
};

// Reduce Cumulative Layout Shift (CLS)
export const preventLayoutShift = () => {
  // Set explicit dimensions for images
  document.querySelectorAll('img').forEach(img => {
    if (!img.width || !img.height) {
      img.style.aspectRatio = '16/9';
      img.style.height = 'auto';
    }
  });

  // Reserve space for dynamic content
  const dynamicElements = document.querySelectorAll('.dynamic-content');
  dynamicElements.forEach(el => {
    const element = el as HTMLElement;
    element.style.minHeight = '200px';
  });
};

// Optimize Largest Contentful Paint (LCP)
export const optimizeLCP = () => {
  // Preload critical resources
  const criticalResources = [
    '/images/hero-optimized.webp',
    '/production-video.mp4'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.endsWith('.mp4') ? 'video' : 'image';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// First Input Delay (FID) optimization
export const optimizeFID = () => {
  // Break up long tasks
  const processLongTask = (callback: () => void) => {
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      (window as any).scheduler.postTask(callback);
    } else {
      setTimeout(callback, 0);
    }
  };

  // Defer non-critical JavaScript
  const deferredScripts = document.querySelectorAll('script[data-defer]');
  deferredScripts.forEach(script => {
    processLongTask(() => {
      const newScript = document.createElement('script');
      newScript.src = script.getAttribute('src') || '';
      document.head.appendChild(newScript);
    });
  });
};

// Mobile-specific optimizations
export const optimizeMobile = () => {
  // Reduce tap delay
  document.addEventListener('touchstart', () => {}, { passive: true });

  // Optimize scrolling
  const scrollElements = document.querySelectorAll('.scroll-container');
  scrollElements.forEach(el => {
    const element = el as HTMLElement;
    element.style.overflowScrolling = 'touch';
    element.style.WebkitOverflowScrolling = 'touch';
  });

  // Reduce memory usage on mobile
  if (window.innerWidth < 768) {
    // Remove non-essential animations on mobile
    document.querySelectorAll('.desktop-animation').forEach(el => {
      const element = el as HTMLElement;
      element.style.animation = 'none';
    });

    // Optimize video quality for mobile
    document.querySelectorAll('video').forEach(video => {
      video.preload = 'metadata';
    });
  }
};

// Resource loading optimization
export const optimizeResourceLoading = () => {
  // Implement service worker for caching
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://www.googletagmanager.com'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Initialize all performance optimizations
export const initPerformanceOptimizations = () => {
  // Run immediately
  optimizeLCP();
  preventLayoutShift();
  optimizeMobile();

  // Run after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    optimizeImageLoading();
    optimizeVideoLoading();
    optimizeResourceLoading();
  });

  // Run after page load
  window.addEventListener('load', () => {
    optimizeFID();
  });
};