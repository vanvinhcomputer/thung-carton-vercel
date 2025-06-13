// Advanced analytics and event tracking for landing page optimization
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

// Initialize Google Analytics with enhanced ecommerce tracking
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-324832008';
  if (!measurementId) return;

  // Enhanced ecommerce and conversion tracking
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) { window.dataLayer.push(arguments); }
  
  gtag('js', new Date());
  gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true
  });

  window.gtag = gtag;
};

// Facebook Pixel for retargeting
export const initFacebookPixel = () => {
  const pixelId = import.meta.env.VITE_FB_PIXEL_ID || '1237858117897758';
  if (!pixelId) return;

  !function(f: any,b: any,e: any,v: any,n?: any,t?: any,s?: any) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};

// Enhanced event tracking functions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      custom_parameter: {
        timestamp: Date.now(),
        page_url: window.location.href
      }
    });
  }
  
  if (window.fbq) {
    window.fbq('track', 'CustomEvent', {
      action,
      category,
      label,
      value
    });
  }
};

// Specific tracking functions for carton manufacturing business
export const trackQuoteRequest = (productType: string) => {
  trackEvent('quote_request', 'lead_generation', productType);
  
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: `Báo giá ${productType}`,
      content_category: 'Carton Manufacturing'
    });
  }
};

export const trackZaloContact = (source: string) => {
  trackEvent('zalo_contact', 'communication', source);
  
  if (window.fbq) {
    window.fbq('track', 'Contact', {
      content_name: 'Zalo Contact',
      source: source
    });
  }
};

export const trackVideoEngagement = (videoName: string, action: string) => {
  trackEvent(action, 'video_engagement', videoName);
};

export const trackScrollDepth = () => {
  const scrollPositions = [25, 50, 75, 90];
  let trackedPositions: number[] = [];

  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    scrollPositions.forEach(position => {
      if (scrollPercent >= position && !trackedPositions.includes(position)) {
        trackedPositions.push(position);
        trackEvent('scroll_depth', 'engagement', `${position}%`, position);
      }
    });
  });
};

export const trackFormSubmission = (formType: string) => {
  trackEvent('form_submission', 'conversion', formType);
  
  if (window.fbq) {
    window.fbq('track', 'SubmitApplication', {
      content_name: formType
    });
  }
};

export const trackProductView = (productName: string, productPrice?: number) => {
  trackEvent('view_item', 'ecommerce', productName, productPrice);
  
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: productName,
      content_type: 'product',
      value: productPrice,
      currency: 'VND'
    });
  }
};

// Performance tracking for Google Ads optimization
export const trackPagePerformance = () => {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData && window.gtag) {
        const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
        const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;
        
        window.gtag('event', 'page_timing', {
          custom_parameter: {
            load_time: loadTime,
            fcp: firstContentfulPaint ? Math.round(firstContentfulPaint) : 0
          }
        });
      }
    }, 1000);
  });
};

// Initialize all analytics
export const initAnalytics = () => {
  initGA();
  initFacebookPixel();
  trackPagePerformance();
  trackScrollDepth();
};