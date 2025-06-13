// Automatic event tracking for all interactive elements
export const initAutoTracking = () => {
  // Auto-track all Zalo CTA buttons
  document.querySelectorAll('a[href*="zalo.me"]').forEach((element, index) => {
    const link = element as HTMLAnchorElement;
    const section = getElementSection(link);
    const productType = getProductType(link);
    
    link.addEventListener('click', () => {
      if (window.trackZaloContact) {
        window.trackZaloContact(`${section}_${productType || 'general'}_${index}`);
      }
    });
  });

  // Auto-track all phone call buttons
  document.querySelectorAll('a[href^="tel:"]').forEach(element => {
    const link = element as HTMLAnchorElement;
    const phoneNumber = link.href.replace('tel:', '');
    
    link.addEventListener('click', () => {
      if (window.trackPhoneCall) {
        window.trackPhoneCall(phoneNumber);
      }
    });
  });

  // Auto-track all quote request forms
  document.querySelectorAll('form').forEach((form, index) => {
    form.addEventListener('submit', (e) => {
      const formType = form.id || `form_${index}`;
      if (window.trackFormSubmission) {
        window.trackFormSubmission(formType);
      }
    });
  });

  // Auto-track internal navigation
  document.querySelectorAll('a[href^="#"]').forEach(element => {
    const link = element as HTMLAnchorElement;
    const targetSection = link.href.split('#')[1];
    
    link.addEventListener('click', () => {
      if (window.trackScrollToSection) {
        window.trackScrollToSection(targetSection);
      }
    });
  });

  // Auto-track product card interactions
  document.querySelectorAll('.product-card').forEach((card, index) => {
    const productName = getProductNameFromCard(card);
    
    // Track product view when card comes into viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && window.gtag) {
          window.gtag('event', 'view_item', {
            event_category: 'ecommerce',
            event_label: productName,
            item_name: productName,
            item_category: 'Carton Products'
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(card);
  });
};

// Helper functions
const getElementSection = (element: Element): string => {
  const section = element.closest('section');
  if (section?.id) return section.id;
  
  const sectionClasses = ['hero', 'products', 'benefits', 'contact', 'ready-to-order'];
  for (const className of sectionClasses) {
    if (element.closest(`.${className}`) || element.closest(`#${className}`)) {
      return className;
    }
  }
  return 'unknown';
};

const getProductType = (element: Element): string | null => {
  const productCard = element.closest('.product-card');
  if (productCard) {
    const productName = productCard.querySelector('h3')?.textContent || '';
    if (productName.includes('3 lớp')) return 'thung_carton_3_lop';
    if (productName.includes('5 lớp')) return 'thung_carton_5_lop';
    if (productName.includes('7 lớp')) return 'thung_carton_7_lop';
    if (productName.includes('Nắp Gài')) return 'hop_nap_gai';
    if (productName.includes('Ship COD')) return 'hop_ship_cod';
  }
  return null;
};

const getProductNameFromCard = (card: Element): string => {
  const nameElement = card.querySelector('h3');
  return nameElement?.textContent?.trim() || 'Unknown Product';
};

// Advanced performance monitoring
export const initPerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('web-vital' in window || typeof window.webVitals !== 'undefined') {
    // CLS monitoring
    let cumulativeLayoutShift = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          cumulativeLayoutShift += (entry as any).value;
        }
      }
    });
    observer.observe({ entryTypes: ['layout-shift'] });

    // Report CLS after 5 seconds
    setTimeout(() => {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'performance',
          event_label: 'cls',
          value: Math.round(cumulativeLayoutShift * 1000)
        });
      }
    }, 5000);
  }

  // Monitor LCP
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    if (window.gtag && lastEntry) {
      window.gtag('event', 'web_vitals', {
        event_category: 'performance',
        event_label: 'lcp',
        value: Math.round(lastEntry.startTime)
      });
    }
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // Monitor FID
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'performance',
          event_label: 'fid',
          value: Math.round((entry as any).processingStart - entry.startTime)
        });
      }
    }
  });
  fidObserver.observe({ entryTypes: ['first-input'] });
};

// Mobile-specific optimizations
export const initMobileOptimizations = () => {
  if (window.innerWidth <= 768) {
    // Reduce animation complexity on mobile
    document.querySelectorAll('.animate-bounce, .animate-pulse').forEach(el => {
      (el as HTMLElement).style.animation = 'none';
    });

    // Optimize video loading for mobile
    document.querySelectorAll('video').forEach(video => {
      video.preload = 'none';
      video.poster = video.poster || '/images/hero-optimized.jpg';
    });

    // Add mobile-specific touch feedback
    document.querySelectorAll('button, a').forEach(el => {
      el.addEventListener('touchstart', () => {
        el.classList.add('touch-feedback');
      }, { passive: true });
      
      el.addEventListener('touchend', () => {
        setTimeout(() => el.classList.remove('touch-feedback'), 150);
      }, { passive: true });
    });
  }
};

// Lazy load non-critical resources
export const initLazyLoading = () => {
  // Lazy load images with IntersectionObserver
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      }
    });
  }, { rootMargin: '50px' });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
};