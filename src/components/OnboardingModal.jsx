import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
]

const CITIES = [
  { code: 'mathura', name: 'Mathura', state: 'uttarPradesh' },
  { code: 'delhi', name: 'Delhi', state: 'delhi' },
  { code: 'agra', name: 'Agra', state: 'uttarPradesh' },
  { code: 'jaipur', name: 'Jaipur', state: 'rajasthan' }
]

export default function OnboardingModal({ isOpen, onComplete }) {
  const { t, i18n } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedCity, setSelectedCity] = useState('mathura')

  useEffect(() => {
    // Check if user has already completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed')
    const savedLanguage = localStorage.getItem('user_language')
    const savedCity = localStorage.getItem('user_city')

    if (hasCompletedOnboarding && savedLanguage && savedCity) {
      setSelectedLanguage(savedLanguage)
      setSelectedCity(savedCity)
      if (onComplete) {
        onComplete({ language: savedLanguage, city: savedCity })
      }
    }
  }, [onComplete])

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode)
    i18n.changeLanguage(languageCode)
  }

  const handleCitySelect = (cityCode) => {
    setSelectedCity(cityCode)
  }

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      handleComplete()
    }
  }

  const handleComplete = () => {
    // Save preferences to localStorage
    localStorage.setItem('user_language', selectedLanguage)
    localStorage.setItem('user_city', selectedCity)
    localStorage.setItem('onboarding_completed', 'true')

    // Call completion callback
    if (onComplete) {
      onComplete({ 
        language: selectedLanguage, 
        city: selectedCity 
      })
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚌</div>
          <h2 style={{ margin: 0, color: '#333' }}>{t('onboarding.welcome')}</h2>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            {currentStep === 1 ? t('onboarding.chooseLanguage') : t('onboarding.selectCity')}
          </p>
        </div>

        {/* Step 1: Language Selection */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ marginBottom: '16px', color: '#333' }}>{t('onboarding.language')} / भाषा</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  style={{
                    padding: '16px',
                    border: selectedLanguage === language.code ? '2px solid #4CAF50' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: selectedLanguage === language.code ? '#f8f9fa' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {language.nativeName}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {language.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: City Selection */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ marginBottom: '16px', color: '#333' }}>{t('onboarding.selectCity')}</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {CITIES.map((city) => (
                <button
                  key={city.code}
                  onClick={() => handleCitySelect(city.code)}
                  style={{
                    padding: '16px',
                    border: selectedCity === city.code ? '2px solid #4CAF50' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: selectedCity === city.code ? '#f8f9fa' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {t(`cities.${city.code}`)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {t(`states.${city.state}`)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '32px',
          gap: '16px'
        }}>
          {currentStep === 2 && (
            <button
              onClick={handleBack}
              style={{
                padding: '12px 24px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer',
                flex: 1
              }}
            >
              {t('common.back')}
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !selectedLanguage) ||
              (currentStep === 2 && !selectedCity)
            }
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              flex: currentStep === 1 ? 1 : 2,
              opacity: (currentStep === 1 && !selectedLanguage) || (currentStep === 2 && !selectedCity) ? 0.5 : 1
            }}
          >
            {currentStep === 1 ? t('common.next') : t('onboarding.getStarted')}
          </button>
        </div>

        {/* Progress Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '24px',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: currentStep >= 1 ? '#4CAF50' : '#e0e0e0'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: currentStep >= 2 ? '#4CAF50' : '#e0e0e0'
          }} />
        </div>
      </div>
    </div>
  )
}
