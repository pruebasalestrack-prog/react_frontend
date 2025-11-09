import { useState } from 'react'
import { Globe, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from "react-i18next"
import './LanguageSelector.css'

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

const LanguageSelector = () => {
  const { i18n, t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  const currentLanguage = i18n.language || 'es'

  const changeLanguage = async (langCode) => {
    if (langCode === currentLanguage) {
      setIsModalOpen(false)
      return
    }

    setIsChanging(true)
    
    try {
      await i18n.changeLanguage(langCode)
      localStorage.setItem('selectedLanguage', langCode)
      console.log(`✅ Idioma cambiado a: ${langCode}`)
      
      setTimeout(() => {
        setIsModalOpen(false)
        setIsChanging(false)
      }, 500)
      
    } catch (error) {
      console.error('❌ Error al cambiar idioma:', error)
      setIsChanging(false)
    }
  }

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage)
    return lang ? lang.name : 'Español'
  }

  const getCurrentLanguageFlag = () => {
    const lang = languages.find(l => l.code === currentLanguage)
    return lang ? lang.flag : '🇪🇸'
  }

  return (
    <>
      <motion.button
        className="language-trigger-button"
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={t('language')}
      >
        <Globe size={20} />
        <span className="language-label">
          {getCurrentLanguageFlag()} {getCurrentLanguageName()}
        </span>
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="language-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="language-modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="language-modal-header">
                <div className="language-modal-title">
                  <Globe size={24} />
                  <h3>{t('select_language')}</h3>
                </div>
                <button
                  className="language-modal-close"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="language-modal-body">
                {isChanging && (
                  <div className="language-translating">
                    <div className="language-spinner"></div>
                    <p>Cambiando idioma...</p>
                  </div>
                )}

                <div className="language-grid">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(lang.code)}
                      disabled={isChanging}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="language-flag">{lang.flag}</span>
                      <span className="language-name">{lang.name}</span>
                      {currentLanguage === lang.code && (
                        <motion.div
                          className="language-check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Check size={16} />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="language-modal-footer">
                  <p className="language-note">
                    ℹ️ {t('translation_note')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LanguageSelector