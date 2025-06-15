// Global event tracking functions for landing page optimization
declare global {
  interface Window {
    trackZaloContact: (source: string) => void;
    trackPhoneCall: (number: string) => void;
    trackProductOrder: (product: string) => void;
    trackQuoteRequest: (product: string) => void;
    trackVideoPlay: (video: string) => void;
    trackScrollToSection: (section: string) => void;
    trackFormSubmission: (form: string) => void;
  }
}

// Initialize tracking functions globally
export const initGlobalTracking = () => {
  // Zalo contact tracking
  window.trackZaloContact = (source: string) => {
    if (window.gtag) {
      window.gtag('event', 'zalo_contact', {
        event_category: 'communication',
        event_label: source,
        value: 1
      });
    }
    if (window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'Zalo Contact',
        source: source
      });
    }
  };

  // Phone call tracking
window.trackPhoneCall = (number: string) => {
  // Google Ads conversion tracking
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-16973275272/grdNCKXrprMaEIjBvp0_'
    });
  }
  
  // GA4 tracking  
  if (window.gtag) {
    window.gtag('event', 'phone_call', {
      event_category: 'communication',
      event_label: number,
      value: 1
    });
  }
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'Contact', {
      content_name: 'Phone Call',
      phone_number: number
    });
  }
}; // <-- Đảm bảo có dấu ; và }
    if (window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'Phone Call',
        phone_number: number
      });
    }
  };

  // Product order tracking
  window.trackProductOrder = (product: string) => {
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        event_category: 'ecommerce',
        event_label: product,
        currency: 'VND',
        value: getProductValue(product)
      });
    }
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: product,
        content_type: 'product',
        currency: 'VND',
        value: getProductValue(product)
      });
    }
  };

  // Quote request tracking
  window.trackQuoteRequest = (product: string) => {
    if (window.gtag) {
      window.gtag('event', 'generate_lead', {
        event_category: 'lead_generation',
        event_label: product,
        value: 1
      });
    }
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: `Quote Request - ${product}`,
        content_category: 'Carton Manufacturing'
      });
    }
  };

  // Video engagement tracking
  window.trackVideoPlay = (video: string) => {
    if (window.gtag) {
      window.gtag('event', 'video_start', {
        event_category: 'video_engagement',
        event_label: video,
        value: 1
      });
    }
  };

  // Scroll tracking
  window.trackScrollToSection = (section: string) => {
    if (window.gtag) {
      window.gtag('event', 'scroll_to_section', {
        event_category: 'navigation',
        event_label: section,
        value: 1
      });
    }
  };

  // Form submission tracking
  window.trackFormSubmission = (form: string) => {
    if (window.gtag) {
      window.gtag('event', 'form_submit', {
        event_category: 'conversion',
        event_label: form,
        value: 1
      });
    }
    if (window.fbq) {
      window.fbq('track', 'SubmitApplication', {
        content_name: form
      });
    }
  };
};

// Product value mapping for ecommerce tracking
const getProductValue = (product: string): number => {
  const values = {
    'thung_carton_3_lop': 2500,
    'thung_carton_5_lop': 4500,
    'thung_carton_7_lop': 7500,
    'hop_nap_gai': 3000,
    'hop_ship_cod': 2800
  };
  return values[product as keyof typeof values] || 3000;
};

// Auto-track video events
export const initVideoTracking = () => {
  document.querySelectorAll('video').forEach(video => {
    let hasPlayed = false;
    
    video.addEventListener('play', () => {
      if (!hasPlayed) {
        const videoName = video.id || video.getAttribute('data-video-name') || 'unknown';
        window.trackVideoPlay(videoName);
        hasPlayed = true;
      }
    });

    video.addEventListener('ended', () => {
      const videoName = video.id || video.getAttribute('data-video-name') || 'unknown';
      if (window.gtag) {
        window.gtag('event', 'video_complete', {
          event_category: 'video_engagement',
          event_label: videoName
        });
      }
    });
  });
};

// Auto-track scroll depth
export const initScrollTracking = () => {
  const scrollThresholds = [25, 50, 75, 90];
  const trackedThresholds = new Set<number>();

  const handleScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    scrollThresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
        trackedThresholds.add(threshold);
        if (window.gtag) {
          window.gtag('event', 'scroll_depth', {
            event_category: 'engagement',
            event_label: `${threshold}%`,
            value: threshold
          });
        }
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
};
