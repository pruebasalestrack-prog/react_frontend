import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Traducciones inline (más confiable que importar JSON)
const resources = {
  es: {
    translation: {
      "welcome": "Bienvenido",
      "home": "Inicio",
      "options": "Opciones",
      "notifications": "Notificaciones",
      "language": {
        "select": "Seleccionar idioma",
        "spanish": "Español",
        "english": "English",
        "portuguese": "Português",
        "french": "Français",
        "german": "Deutsch",
        "italian": "Italiano",
        "chinese": "中文",
        "japanese": "日本語"
      }
    }
  },
  en: {
    translation: {
      "welcome": "Welcome",
      "home": "Home",
      "options": "Options",
      "notifications": "Notifications",
      "language": {
        "select": "Select language",
        "spanish": "Spanish",
        "english": "English",
        "portuguese": "Portuguese",
        "french": "French",
        "german": "German",
        "italian": "Italian",
        "chinese": "Chinese",
        "japanese": "Japanese"
      }
    }
  },
  pt: {
    translation: {
      "welcome": "Bem-vindo",
      "home": "Início",
      "options": "Opções",
      "notifications": "Notificações",
      "language": {
        "select": "Selecionar idioma",
        "spanish": "Espanhol",
        "english": "Inglês",
        "portuguese": "Português",
        "french": "Francês",
        "german": "Alemão",
        "italian": "Italiano",
        "chinese": "Chinês",
        "japanese": "Japonês"
      }
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue",
      "home": "Accueil",
      "options": "Options",
      "notifications": "Notifications",
      "language": {
        "select": "Sélectionner la langue",
        "spanish": "Espagnol",
        "english": "Anglais",
        "portuguese": "Portugais",
        "french": "Français",
        "german": "Allemand",
        "italian": "Italien",
        "chinese": "Chinois",
        "japanese": "Japonais"
      }
    }
  },
  de: {
    translation: {
      "welcome": "Willkommen",
      "home": "Startseite",
      "options": "Optionen",
      "notifications": "Benachrichtigungen",
      "language": {
        "select": "Sprache auswählen",
        "spanish": "Spanisch",
        "english": "Englisch",
        "portuguese": "Portugiesisch",
        "french": "Französisch",
        "german": "Deutsch",
        "italian": "Italienisch",
        "chinese": "Chinesisch",
        "japanese": "Japanisch"
      }
    }
  },
  it: {
    translation: {
      "welcome": "Benvenuto",
      "home": "Home",
      "options": "Opzioni",
      "notifications": "Notifiche",
      "language": {
        "select": "Seleziona lingua",
        "spanish": "Spagnolo",
        "english": "Inglese",
        "portuguese": "Portoghese",
        "french": "Francese",
        "german": "Tedesco",
        "italian": "Italiano",
        "chinese": "Cinese",
        "japanese": "Giapponese"
      }
    }
  },
  zh: {
    translation: {
      "welcome": "欢迎",
      "home": "首页",
      "options": "选项",
      "notifications": "通知",
      "language": {
        "select": "选择语言",
        "spanish": "西班牙语",
        "english": "英语",
        "portuguese": "葡萄牙语",
        "french": "法语",
        "german": "德语",
        "italian": "意大利语",
        "chinese": "中文",
        "japanese": "日语"
      }
    }
  },
  ja: {
    translation: {
      "welcome": "ようこそ",
      "home": "ホーム",
      "options": "オプション",
      "notifications": "通知",
      "language": {
        "select": "言語を選択",
        "spanish": "スペイン語",
        "english": "英語",
        "portuguese": "ポルトガル語",
        "french": "フランス語",
        "german": "ドイツ語",
        "italian": "イタリア語",
        "chinese": "中国語",
        "japanese": "日本語"
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    lng: 'es',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  })

export default i18n