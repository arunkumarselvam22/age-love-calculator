import React, { useEffect } from 'react';
import { config } from './config.js';

const AdSenseAd = ({ 
  adSlot = config.adSlots.header,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = { display: 'block' },
  className = 'adsense-ad'
}) => {
  useEffect(() => {
    // Only load ads if AdSense is enabled and client ID is available
    if (config.features.enableAdsense && config.adsenseClientId) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.log('AdSense error:', err);
      }
    }
  }, []);

  // Don't render ad if AdSense is disabled or no client ID
  if (!config.features.enableAdsense || !config.adsenseClientId || !adSlot) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={config.adsenseClientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default AdSenseAd;