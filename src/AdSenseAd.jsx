import React, { useEffect } from 'react';

const AdSenseAd = ({ 
  slot = "YOUR_AD_SLOT_ID", 
  style = { display: 'block', textAlign: 'center', minHeight: '250px' },
  className = "adsbygoogle",
  responsive = true
}) => {
  useEffect(() => {
    try {
      // Load AdSense ads when component mounts
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="ad-container" style={{ margin: '2rem 0', padding: '1rem' }}>
      {/* Development placeholder - replace with actual AdSense code */}
      <div 
        className="ad-placeholder"
        style={{
          background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '2rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem',
          minHeight: '250px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <div>📢 Advertisement Space</div>
        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
          Replace this with your AdSense code
        </div>
      </div>
      
      {/* Uncomment and configure for production */}
      {/*
      <ins 
        className={className}
        style={style}
        data-ad-client="ca-pub-YOUR_ADSENSE_ID"
        data-ad-slot={slot}
        data-ad-format={responsive ? "auto" : ""}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
      */}
    </div>
  );
};

export default AdSenseAd;