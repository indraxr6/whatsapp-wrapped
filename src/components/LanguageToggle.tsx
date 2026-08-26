import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex border-2 border-black bg-white shrink-0">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 min-[415px]:px-3 py-0.5 min-[415px]:py-1 font-mono text-[10px] min-[415px]:text-xs font-bold transition-colors ${
          language === 'en' ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'
        }`}
      >
        EN
      </button>
      <div className="w-0.5 bg-black" />
      <button
        onClick={() => setLanguage('id')}
        className={`px-2 min-[415px]:px-3 py-0.5 min-[415px]:py-1 font-mono text-[10px] min-[415px]:text-xs font-bold transition-colors ${
          language === 'id' ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'
        }`}
      >
        ID
      </button>
    </div>
  );
}
