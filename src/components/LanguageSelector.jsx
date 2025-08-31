import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
} from '@mui/icons-material'

const languages = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  { 
    code: 'hi', 
    name: 'Hindi', 
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    direction: 'ltr'
  },
  { 
    code: 'bn', 
    name: 'Bengali', 
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    direction: 'ltr'
  },
  { 
    code: 'ta', 
    name: 'Tamil', 
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    direction: 'ltr'
  },
  { 
    code: 'te', 
    name: 'Telugu', 
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    direction: 'ltr'
  },
  { 
    code: 'gu', 
    name: 'Gujarati', 
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    direction: 'ltr'
  },
  { 
    code: 'mr', 
    name: 'Marathi', 
    nativeName: 'मराठी',
    flag: '🇮🇳',
    direction: 'ltr'
  },
  { 
    code: 'pa', 
    name: 'Punjabi', 
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    direction: 'ltr'
  }
]

export default function LanguageSelector({ isOpen, onClose, isFullScreen = false }) {
  const { i18n, t } = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language)

  const handleLanguageChange = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode)
      setSelectedLanguage(languageCode)
      
      // Store preference in localStorage
      localStorage.setItem('preferredLanguage', languageCode)
      
      // Update document direction if needed
      const language = languages.find(lang => lang.code === languageCode)
      document.documentElement.dir = language?.direction || 'ltr'
      
      if (!isFullScreen) {
        onClose?.()
      }
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0]

  // Full screen version (for onboarding or settings)
  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🌐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('language.selectLanguage', 'Select Language')}
            </h2>
            <p className="text-gray-600">
              {t('language.choosePreferred', 'Choose your preferred language')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                  selectedLanguage === language.code
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">{language.flag}</div>
                <div className="text-sm font-medium text-gray-900">{language.nativeName}</div>
                <div className="text-xs text-gray-500">{language.name}</div>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={() => onClose?.()}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              {t('common.continue', 'Continue')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Dropdown version (for header)
  if (!isOpen) {
    return (
      <button
        onClick={() => onClose?.()}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-gray-700">{currentLanguage.code.toUpperCase()}</span>
        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('language.selectLanguage', 'Select Language')}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {t('language.choosePreferred', 'Choose your preferred language')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Language List */}
        <div className="p-6">
          <div className="space-y-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                  selectedLanguage === language.code
                    ? 'bg-primary-50 border-2 border-primary-200'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="text-2xl">{language.flag}</div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{language.nativeName}</div>
                  <div className="text-sm text-gray-500">{language.name}</div>
                </div>
                {selectedLanguage === language.code && (
                  <div className="text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t('language.currentLanguage', 'Current')}: {currentLanguage.nativeName}</span>
            <button
              onClick={onClose}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('common.done', 'Done')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mini language switcher for header
export function LanguageSwitcherMini() {
  const { i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode)
    handleClose()
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          color: 'inherit'
        }}
      >
        <Typography component="span" sx={{ fontSize: '1.2rem' }}>
          {currentLanguage.flag}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            display: { xs: 'none', sm: 'block' },
            fontWeight: 500
          }}
        >
          {currentLanguage.code.toUpperCase()}
        </Typography>
        <ExpandMoreIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n.language === language.code}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
          >
            <Typography component="span" sx={{ fontSize: '1.2rem' }}>
              {language.flag}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                {language.nativeName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {language.name}
              </Typography>
            </Box>
            {i18n.language === language.code && (
              <CheckIcon fontSize="small" color="primary" />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
