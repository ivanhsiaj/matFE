import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function LangToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <Button onClick={toggleLanguage} variant="outline" size="sm">
      {i18n.language === 'en' ? 'ES' : 'EN'}
    </Button>
  );
}
