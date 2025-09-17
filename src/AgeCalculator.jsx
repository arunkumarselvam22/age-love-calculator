import React, { useState, useRef, useEffect } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { config } from './config.js';
import { trackCalculatorUsage, trackDownload, trackSocialShare } from './GoogleAnalytics.js';

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]); // Default to current date
  const [calculateToDate, setCalculateToDate] = useState(new Date().toISOString().split('T')[0]);
  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [currentSecond, setCurrentSecond] = useState(new Date().getSeconds());
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [showVideoAd, setShowVideoAd] = useState(false);
  const resultRef = useRef(null);

  // Relationship options
  const relationshipOptions = [
    { value: '', label: 'Select relationship (optional)' },
    { value: 'friend', label: 'Friend' },
    { value: 'wife', label: 'Wife' },
    { value: 'husband', label: 'Husband' },
    { value: 'brother', label: 'Brother' },
    { value: 'sister', label: 'Sister' },
    { value: 'mother', label: 'Mother' },
    { value: 'father', label: 'Father' },
    { value: 'son', label: 'Son' },
    { value: 'daughter', label: 'Daughter' },
    { value: 'girlfriend', label: 'Girlfriend' },
    { value: 'boyfriend', label: 'Boyfriend' },
    { value: 'partner', label: 'Partner' }
  ];

  // Generate dynamic title and quote based on name and relationship
  const generateTitleAndQuote = () => {
    if (!personName.trim()) {
      return {
        title: '✨ Your Life\'s Journey ✨',
        subtitle: 'Every second is a new milestone'
      };
    }

    const name = personName.trim();
    const rel = relationship;
    
    let title, subtitle;
    
    if (rel) {
      switch (rel) {
        case 'friend':
          title = `🤝 ${name}'s Friendship Journey`;
          subtitle = 'A bond that grows stronger with every passing day';
          break;
        case 'wife':
          title = `💖 ${name}'s Beautiful Life`;
          subtitle = 'My beloved wife, my eternal companion';
          break;
        case 'husband':
          title = `💙 ${name}'s Amazing Journey`;
          subtitle = 'My loving husband, my life partner';
          break;
        case 'brother':
          title = `👨‍👦 ${name}'s Brotherly Bond`;
          subtitle = 'A brother is a friend given by nature';
          break;
        case 'sister':
          title = `👩‍👧 ${name}'s Sisterly Love`;
          subtitle = 'A sister is a gift to the heart';
          break;
        case 'mother':
          title = `🤱 ${name}'s Motherly Grace`;
          subtitle = 'A mother\'s love knows no bounds';
          break;
        case 'father':
          title = `👨‍👧‍👦 ${name}'s Fatherly Strength`;
          subtitle = 'A father is a daughter\'s first hero';
          break;
        case 'son':
          title = `👦 ${name}'s Growing Years`;
          subtitle = 'A son is a mother\'s pride and joy';
          break;
        case 'daughter':
          title = `👧 ${name}'s Precious Life`;
          subtitle = 'A daughter is a little girl who grows up to be your best friend';
          break;
        case 'girlfriend':
          title = `💕 ${name}'s Sweet Journey`;
          subtitle = 'My girlfriend, my happiness';
          break;
        case 'boyfriend':
          title = `💙 ${name}'s Special Path`;
          subtitle = 'My boyfriend, my joy';
          break;
        case 'partner':
          title = `💫 ${name}'s Life Partnership`;
          subtitle = 'Together we create beautiful memories';
          break;
        default:
          title = `✨ ${name}'s Life Details`;
          subtitle = 'Every moment counts in this beautiful journey';
      }
    } else {
      title = `✨ ${name}'s Life Details`;
      subtitle = 'Every moment counts in this beautiful journey';
    }
    
    return { title, subtitle };
  };

  // Real-time current second counter
  useEffect(() => {
    const updateCurrentSecond = () => {
      setCurrentSecond(new Date().getSeconds());
    };
    
    updateCurrentSecond();
    const secondInterval = setInterval(updateCurrentSecond, 1000);
    
    return () => clearInterval(secondInterval);
  }, []);

  // Enhanced live seconds counter with better precision
  useEffect(() => {
    if (result && result.birthTime) {
      const updateCounter = () => {
        const now = new Date().getTime();
        const secondsLived = Math.floor((now - result.birthTime) / 1000);
        setLiveSeconds(secondsLived);
      };
      
      updateCounter();
      const interval = setInterval(updateCounter, 1000);
      
      return () => clearInterval(interval);
    }
  }, [result]);

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeMB = config.features.maxImageSize;
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Please select an image smaller than ${maxSizeMB}MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImageUrl(event.target.result);
        setProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile image
  const removeImage = () => {
    setProfileImage(null);
    setProfileImageUrl(null);
  };

  const calculateAge = () => {
    if (!birthDate) {
      alert('Please enter your birth date');
      return;
    }

    const today = calculateToDate ? new Date(calculateToDate) : new Date();
    const birth = new Date(birthDate);
    
    if (birth > today) {
      alert('Birth date cannot be after the target date');
      return;
    }

    let ageYears = today.getFullYear() - birth.getFullYear();
    let ageMonths = today.getMonth() - birth.getMonth();
    let ageDays = today.getDate() - birth.getDate();

    if (ageDays < 0) {
      ageMonths--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      ageDays += lastMonth.getDate();
    }

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }

    const diffTime = today.getTime() - birth.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffTime / (1000 * 60));

    let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    const nextBirthdayAge = nextBirthday.getFullYear() - birth.getFullYear();
    const nextBirthdayDate = nextBirthday.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    setResult({
      years: ageYears,
      months: ageMonths,
      days: ageDays,
      totalDays,
      totalHours,
      totalMinutes,
      daysToNextBirthday,
      nextBirthdayAge,
      nextBirthdayDate,
      birthTime: birth.getTime(),
      targetDate: today.toLocaleDateString(),
      personName: personName.trim() || 'Friend',
      relationship: relationship
    });
    
    // Track calculator usage
    trackCalculatorUsage('age', !!profileImageUrl);
  };

  const clearResult = () => {
    setBirthDate('');
    setCalculateToDate(new Date().toISOString().split('T')[0]);
    setPersonName('');
    setRelationship('');
    setProfileImage(null);
    setProfileImageUrl(null);
    setResult(null);
    setLiveSeconds(0);
  };

  const generateShareableLink = () => {
    if (!result) return '';
    
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      type: 'age',
      name: personName || 'Friend',
      relationship: relationship || '',
      years: result.years,
      months: result.months,
      days: result.days,
      totalDays: result.totalDays,
      nextBirthday: result.daysToNextBirthday
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  const shareResult = async (platform) => {
    const shareUrl = generateShareableLink();
    const titleData = generateTitleAndQuote();
    const shareText = `🎂 ${titleData.title}

✨ Age: ${result.years} years, ${result.months} months, ${result.days} days
📅 Total days lived: ${result.totalDays.toLocaleString()}
🎉 Next birthday in ${result.daysToNextBirthday} days!

Calculated with Age & Love Calculator`;
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n🔗 ${shareUrl}`);
        alert('✅ Share link copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = `${shareText}\n\n🔗 ${shareUrl}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ Share link copied to clipboard!');
      }
    } else if (platform === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n🔗 ${shareUrl}`)}`;
      window.open(whatsappUrl, '_blank');
      trackSocialShare('whatsapp', 'age');
    } else if (platform === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(facebookUrl, '_blank');
      trackSocialShare('facebook', 'age');
    } else if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank');
      trackSocialShare('twitter', 'age');
    }
  };

  const downloadResult = async () => {
    
    setTimeout(async () => {
      setShowVideoAd(false);
      
      if (resultRef.current) {
        try {
          const downloadBtn = resultRef.current.querySelector('.download-btn');
          const shareButtons = resultRef.current.querySelector('.share-buttons');
          if (downloadBtn) {
            downloadBtn.style.display = 'none';
          }
          if (shareButtons) {
            shareButtons.style.display = 'none';
          }
          
          const canvas = await html2canvas(resultRef.current, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            x: -20,
            y: -20,
            width: resultRef.current.scrollWidth + 40,
            height: resultRef.current.scrollHeight + 40,
            scrollX: 0,
            scrollY: 0
          });
          
          if (downloadBtn) {
            downloadBtn.style.display = '';
          }
          if (shareButtons) {
            shareButtons.style.display = '';
          }
          
          const link = document.createElement('a');
          const titleData = generateTitleAndQuote();
          const fileName = `${result.personName}-age-card-${new Date().toISOString().split('T')[0]}.png`;
          link.download = fileName;
          link.href = canvas.toDataURL('image/png', 1.0);
          link.click();
          
          // Track download
          trackDownload('age', fileName);
        } catch (error) {
          console.error('Error generating image:', error);
          alert('Error generating download. Please try again.');
        }
      }
    }, 5000);
  };

  return (
    <div className="calculator-card">
      <div className="calculator-header">
        <h2>🎂 Age Calculator</h2>
        <p>Calculate your exact age and get interesting statistics</p>
      </div>
      
      <div className="input-group">
        <label htmlFor="personName">👤 Person's Name (Optional)</label>
        <input
          type="text"
          id="personName"
          name="personName"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Enter name for personalized card"
          maxLength="30"
          autoComplete="off"
          autoCapitalize="words"
        />
      </div>

      <div className="input-group image-upload-group">
        <label htmlFor="profileImage">📷 Profile Picture (Optional)</label>
        <div className="image-upload-container">
          {profileImageUrl ? (
            <div className="image-preview">
              <img src={profileImageUrl} alt="Profile" className="preview-image" />
              <button type="button" className="remove-image-btn" onClick={removeImage}>
                ❌ Remove
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="profileImage" className="upload-label">
                📸 Choose Photo
              </label>
              <p className="upload-hint">Max 5MB • JPG, PNG, GIF</p>
            </div>
          )}
        </div>
      </div>

      {personName.trim() && (
        <div className="input-group">
          <label htmlFor="relationship">👥 Relationship (Optional)</label>
          <select
            id="relationship"
            name="relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="relationship-select"
          >
            {relationshipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="input-group">
        <label htmlFor="birthDate">📅 Date of Birth *</label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'textfield',
            appearance: 'none'
          }}
        />
      </div>

      <div className="input-group">
        <label htmlFor="calculateToDate">🎯 Calculate Age To (Optional - defaults to now)</label>
        <input
          type="date"
          id="calculateToDate"
          name="calculateToDate"
          value={calculateToDate}
          onChange={(e) => setCalculateToDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          placeholder={new Date().toLocaleDateString()}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'textfield',
            appearance: 'none'
          }}
        />
      </div>

      <div className="button-group">
        <button className="calculate-btn age-gradient-btn" onClick={calculateAge}>
          🎂 Calculate Age Details
        </button>
        <button className="clear-btn" onClick={clearResult}>
          Clear
        </button>
      </div>

      {showVideoAd && (
        <div className="video-ad-modal">
          <div className="video-ad-content">
            <h3>🎥 Loading your download...</h3>
            <div className="video-placeholder">
              <p>Video Advertisement</p>
              <div className="ad-timer">5s</div>
            </div>
            <p>Your download will start automatically after the ad</p>
          </div>
        </div>
      )}

      {result && (
        <div className="result-container age-result new-age-design" ref={resultRef} style={{padding: '2rem', margin: '1rem 0'}}>
          {(() => {
            const titleData = generateTitleAndQuote();
            return (
              <div className="new-result-header">
                {profileImageUrl && (
                  <div className="profile-image-section">
                    <img src={profileImageUrl} alt="Profile" className="result-profile-image" />
                  </div>
                )}
                <h3 className="dynamic-title">{titleData.title}</h3>
                <p className="dynamic-subtitle">{titleData.subtitle}</p>
                <p className="calculation-date">Calculated on: {result.targetDate}</p>
                <div className="download-share-section">
                  <button className="download-btn new-download-btn" onClick={downloadResult}>
                    🎁 Download Life Card
                  </button>
                  <div className="share-buttons">
                    <h4 className="share-title">📤 Share Your Results</h4>
                    <div className="share-button-group">
                      <button className="share-btn copy-btn" onClick={() => shareResult('copy')}>
                        📋 Copy Link
                      </button>
                      <button className="share-btn whatsapp-btn" onClick={() => shareResult('whatsapp')}>
                        💬 WhatsApp
                      </button>
                      <button className="share-btn facebook-btn" onClick={() => shareResult('facebook')}>
                        📘 Facebook
                      </button>
                      <button className="share-btn twitter-btn" onClick={() => shareResult('twitter')}>
                        🐦 Twitter
                      </button>
                    </div>
                  </div>
                </div>
                <div className="website-watermark">
                  <p>🌟 {config.app.name}</p>
                </div>
              </div>
            );
          })()}
          
          <div className="new-colorful-grid">
            <div className="new-colorful-item gradient-purple">
              <div className="icon">🎂</div>
              <div className="value">{result.years}</div>
              <div className="label">Years</div>
            </div>
            <div className="new-colorful-item gradient-blue">
              <div className="icon">📅</div>
              <div className="value">{result.months}</div>
              <div className="label">Months</div>
            </div>
            <div className="new-colorful-item gradient-green">
              <div className="icon">📊</div>
              <div className="value">{result.days}</div>
              <div className="label">Days</div>
            </div>
            <div className="new-colorful-item gradient-orange">
              <div className="icon">🕐</div>
              <div className="value">{Math.floor(result.totalHours % 24)}</div>
              <div className="label">Hours</div>
            </div>
            <div className="new-colorful-item gradient-pink">
              <div className="icon">⏰</div>
              <div className="value">{Math.floor(result.totalMinutes % 60)}</div>
              <div className="label">Minutes</div>
            </div>
            <div className="new-colorful-item gradient-teal">
              <div className="icon">⚡</div>
              <div className="value">{currentSecond}</div>
              <div className="label">Second</div>
            </div>
          </div>
          
          <div className="new-professional-stats">
            <div className="new-stat-card gradient-red">
              <div className="stat-icon">📅</div>
              <div className="stat-number">{result.totalDays.toLocaleString()}</div>
              <div className="stat-text">Days Lived</div>
            </div>
            <div className="new-stat-card gradient-violet">
              <div className="stat-icon">⏱️</div>
              <div className="stat-number">{result.totalHours.toLocaleString()}</div>
              <div className="stat-text">Hours Experienced</div>
            </div>
            <div className="new-stat-card gradient-cyan">
              <div className="stat-icon">🎂</div>
              <div className="stat-number">{result.daysToNextBirthday}</div>
              <div className="stat-text">Days to Next Birthday</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;