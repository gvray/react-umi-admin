import { Dropdown } from 'antd';
import React, { useState } from 'react';
import { getAllLocales, getLocale, setLocale } from 'umi';

interface LocalData {
  lang: string;
  label?: string;
  icon?: string;
  title?: string;
}

interface SelectLangProps {
  postLocalesData?: (locales: LocalData[]) => LocalData[];
  onItemClick?: (params: { key: string }) => void;
  reload?: boolean;
}

const defaultLangUConfigMap: Record<string, LocalData> = {
  'zh-CN': { lang: 'zh-CN', label: '简体中文', icon: '🇨🇳', title: '语言' },
  'zh-TW': { lang: 'zh-TW', label: '繁體中文', icon: '🇭🇰', title: '語言' },
  'en-US': { lang: 'en-US', label: 'English', icon: '🇺🇸', title: 'Language' },
  'en-GB': { lang: 'en-GB', label: 'English', icon: '🇬🇧', title: 'Language' },
  'ja-JP': { lang: 'ja-JP', label: '日本語', icon: '🇯🇵', title: '言語' },
  'ko-KR': { lang: 'ko-KR', label: '한국어', icon: '🇰🇷', title: '언어' },
  'de-DE': { lang: 'de-DE', label: 'Deutsch', icon: '🇩🇪', title: 'Sprache' },
  'fr-FR': { lang: 'fr-FR', label: 'Français', icon: '🇫🇷', title: 'Langue' },
  'es-ES': { lang: 'es-ES', label: 'Español', icon: '🇪🇸', title: 'Idioma' },
  'it-IT': {
    lang: 'it-IT',
    label: 'Italiano',
    icon: '🇮🇹',
    title: 'Linguaggio',
  },
  'ru-RU': { lang: 'ru-RU', label: 'Русский', icon: '🇷🇺', title: 'язык' },
  'pt-BR': { lang: 'pt-BR', label: 'Português', icon: '🇧🇷', title: 'Idiomas' },
  'pt-PT': { lang: 'pt-PT', label: 'Português', icon: '🇵🇹', title: 'Idiomas' },
  'nl-NL': { lang: 'nl-NL', label: 'Nederlands', icon: '🇳🇱', title: 'Taal' },
  'pl-PL': { lang: 'pl-PL', label: 'Polski', icon: '🇵🇱', title: 'Język' },
  'tr-TR': { lang: 'tr-TR', label: 'Türkçe', icon: '🇹🇷', title: 'Dil' },
  'th-TH': { lang: 'th-TH', label: 'ไทย', icon: '🇹🇭', title: 'ภาษา' },
  'vi-VN': {
    lang: 'vi-VN',
    label: 'Tiếng Việt',
    icon: '🇻🇳',
    title: 'Ngôn ngữ',
  },
  'id-ID': {
    lang: 'id-ID',
    label: 'Bahasa Indonesia',
    icon: '🇮🇩',
    title: 'Bahasa',
  },
  'ms-MY': { lang: 'ms-MY', label: 'بهاس ملايو‎', icon: '🇲🇾', title: 'Bahasa' },
  'ar-EG': { lang: 'ar-EG', label: 'العربية', icon: '🇪🇬', title: 'لغة' },
  'he-IL': { lang: 'he-IL', label: 'עברית', icon: '🇮🇱', title: 'שפה' },
  'fa-IR': { lang: 'fa-IR', label: 'فارسی', icon: '🇮🇷', title: 'زبان' },
  'hi-IN': { lang: 'hi-IN', label: 'हिन्दी', icon: '🇮🇳', title: 'भाषा' },
  'da-DK': { lang: 'da-DK', label: 'Dansk', icon: '🇩🇰', title: 'Sprog' },
  'sv-SE': { lang: 'sv-SE', label: 'Svenska', icon: '🇸🇪', title: 'Språk' },
  'nb-NO': { lang: 'nb-NO', label: 'Norsk', icon: '🇳🇴', title: 'Språk' },
  'fi-FI': { lang: 'fi-FI', label: 'Suomi', icon: '🇫🇮', title: 'Kieli' },
  'cs-CZ': { lang: 'cs-CZ', label: 'Čeština', icon: '🇨🇿', title: 'Jazyk' },
  'hu-HU': { lang: 'hu-HU', label: 'Magyar', icon: '🇭🇺', title: 'Nyelv' },
  'ro-RO': { lang: 'ro-RO', label: 'Română', icon: '🇷🇴', title: 'Limba' },
  'uk-UA': { lang: 'uk-UA', label: 'Українська', icon: '🇺🇦', title: 'Мова' },
  'bg-BG': { lang: 'bg-BG', label: 'Български', icon: '🇧🇬', title: 'език' },
  'el-GR': { lang: 'el-GR', label: 'Ελληνικά', icon: '🇬🇷', title: 'Γλώσσα' },
  'sk-SK': { lang: 'sk-SK', label: 'Slovenčina', icon: '🇸🇰', title: 'Jazyk' },
  'hr-HR': { lang: 'hr-HR', label: 'Hrvatski', icon: '🇭🇷', title: 'Jezik' },
  'sl-SI': { lang: 'sl-SI', label: 'Slovenščina', icon: '🇸🇮', title: 'Jezik' },
  'sr-RS': { lang: 'sr-RS', label: 'српски', icon: '🇷🇸', title: 'Језик' },
  'et-EE': { lang: 'et-EE', label: 'Eesti', icon: '🇪🇪', title: 'Keel' },
  'lv-LV': { lang: 'lv-LV', label: 'Latviešu', icon: '🇱🇻', title: 'Valoda' },
  'mk-MK': { lang: 'mk-MK', label: 'македонски', icon: '🇲🇰', title: 'Јазик' },
  'mn-MN': { lang: 'mn-MN', label: 'Монгол', icon: '🇲🇳', title: 'Хэл' },
  'ne-NP': { lang: 'ne-NP', label: 'नेपाली', icon: '🇳🇵', title: 'भाषा' },
  'bn-BD': { lang: 'bn-BD', label: 'বাংলা', icon: '🇧🇩', title: 'ভাষা' },
  'kn-IN': { lang: 'kn-IN', label: 'ಕನ್ನಡ', icon: '🇮🇳', title: 'ಭಾಷೆ' },
  'ta-IN': { lang: 'ta-IN', label: 'தமிழ்', icon: '🇮🇳', title: 'மொழி' },
  'ka-GE': { lang: 'ka-GE', label: 'ქართული', icon: '🇬🇪', title: 'ენა' },
  'az-AZ': { lang: 'az-AZ', label: 'Azərbaycan', icon: '🇦🇿', title: 'Dil' },
  'is-IS': { lang: 'is-IS', label: 'Íslenska', icon: '🇮🇸', title: 'Tungumál' },
  'ga-IE': { lang: 'ga-IE', label: 'Gaeilge', icon: '🇮🇪', title: 'Teanga' },
  'ca-ES': { lang: 'ca-ES', label: 'Català', icon: '🇪🇸', title: 'Llengua' },
  'fr-BE': { lang: 'fr-BE', label: 'Français', icon: '🇧🇪', title: 'Langue' },
  'nl-BE': { lang: 'nl-BE', label: 'Vlaams', icon: '🇧🇪', title: 'Taal' },
  'ku-IQ': { lang: 'ku-IQ', label: 'کوردی', icon: '🇮🇶', title: 'Ziman' },
};

const LangIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    focusable="false"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z " />
  </svg>
);

const SelectLang: React.FC<SelectLangProps> = (props) => {
  const { postLocalesData, onItemClick, reload = true } = props;
  const [selectedLang, setSelectedLang] = useState(() => getLocale());

  const changeLang = ({ key }: { key: string }): void => {
    setLocale(key, reload);
    setSelectedLang(getLocale());
  };

  const defaultLangUConfig = getAllLocales().map(
    (key) =>
      defaultLangUConfigMap[key] || {
        lang: key,
        label: key,
        icon: '🌐',
        title: key,
      },
  );

  const allLangUIConfig =
    postLocalesData?.(defaultLangUConfig) || defaultLangUConfig;

  const handleClick = onItemClick
    ? (params: { key: string }) => onItemClick(params)
    : changeLang;

  const items = allLangUIConfig.map((localeObj) => ({
    key: localeObj.lang,
    label: (
      <span>
        <span
          role="img"
          aria-label={localeObj?.label || 'en-US'}
          style={{ marginRight: 8 }}
        >
          {localeObj?.icon || '🌐'}
        </span>
        {localeObj?.label || 'en-US'}
      </span>
    ),
  }));

  return (
    <Dropdown
      menu={{ items, selectedKeys: [selectedLang], onClick: handleClick }}
      placement="bottomRight"
      trigger={['click']}
    >
      <span
        title={
          allLangUIConfig.find((item) => item.lang === selectedLang)?.title ||
          'Language'
        }
        style={{
          cursor: 'pointer',
          padding: '0 12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 48,
          width: 48,
          fontSize: 18,
          verticalAlign: 'middle',
        }}
      >
        <LangIcon />
      </span>
    </Dropdown>
  );
};

export default SelectLang;
