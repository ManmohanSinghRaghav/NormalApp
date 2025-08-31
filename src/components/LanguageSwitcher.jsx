import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher({ style = {} }) {
  const { i18n, t } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
  ]

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode)
    localStorage.setItem('user_language', languageCode)
  }

  return (
    <div style={{ ...style }}>
      <select
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        style={{
          padding: '6px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  )
}
