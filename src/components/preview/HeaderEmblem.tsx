import { HeaderSymbol, Language } from '../../types/biodata';

interface HeaderEmblemProps {
  symbol?: HeaderSymbol;
  customSymbol?: string;
  customText?: string;
  showEmblem?: boolean;
  language?: Language;
  primaryColor: string;
  accentColor: string;
}

export const HeaderEmblem: React.FC<HeaderEmblemProps> = ({
  symbol = 'ganesha',
  customSymbol = '',
  customText = '',
  showEmblem = true,
  language = 'en',
  primaryColor,
  accentColor,
}) => {
  if (!showEmblem || (symbol === 'none' && !customText.trim() && !customSymbol.trim())) {
    return null;
  }

  // If user entered a custom symbol or selected 'custom'
  if (symbol === 'custom' || customSymbol.trim()) {
    return (
      <div className="text-center mb-3">
        {customSymbol.trim() && (
          <div
            className="text-2xl font-bold mb-0.5 select-none"
            style={{ color: primaryColor }}
          >
            {customSymbol.trim()}
          </div>
        )}
        {customText.trim() && (
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            {customText.trim()}
          </div>
        )}
      </div>
    );
  }

  const getMantra = (defaultMantra: string) => {
    return customText.trim() ? customText.trim() : defaultMantra;
  };

  switch (symbol) {
    case 'om':
      return (
        <div className="text-center mb-3">
          <div
            className="text-2xl font-bold mb-0.5 select-none"
            style={{ color: primaryColor }}
          >
            {language === 'gu' ? 'ૐ' : 'ॐ'}
          </div>
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            {getMantra(language === 'gu' ? '॥ ૐ નમઃ શિવાય ॥' : '॥ ॐ नमः शिवाय ॥')}
          </div>
        </div>
      );

    case 'swastik':
      return (
        <div className="text-center mb-3">
          <div
            className="text-2xl font-bold mb-0.5 select-none"
            style={{ color: primaryColor }}
          >
            卐
          </div>
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            {getMantra(language === 'gu' ? '॥ શુભ વિવાહ ॥' : '॥ शुभ विवाह ॥')}
          </div>
        </div>
      );

    case 'ek-onkar':
      return (
        <div className="text-center mb-3">
          <div
            className="text-2xl font-bold mb-0.5 select-none"
            style={{ color: primaryColor }}
          >
            ੴ
          </div>
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            || Ik Onkar Satnaam ||
          </div>
        </div>
      );

    case 'bismillah':
      return (
        <div className="text-center mb-3">
          <div
            className="text-lg font-serif mb-0.5 select-none"
            style={{ color: primaryColor }}
          >
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </div>
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            In the Name of Allah, the Most Gracious
          </div>
        </div>
      );

    case 'cross':
      return (
        <div className="text-center mb-3">
          <div
            className="text-xl font-bold mb-0.5 select-none"
            style={{ color: primaryColor }}
          >
            ✝
          </div>
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            Love is Patient, Love is Kind
          </div>
        </div>
      );

    case 'lotus':
      return (
        <div className="text-center mb-3">
          <div
            className="text-xl mb-0.5 select-none"
            style={{ color: primaryColor }}
          >
            🪷
          </div>
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: accentColor }}
          >
            Auspicious Union
          </div>
        </div>
      );

    case 'ganesha':
    default:
      return (
        <div className="text-center mb-3">
          {/* Stylized Lord Ganesha Silhouette / Icon */}
          <div className="flex justify-center mb-1">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="7" r="3" fill={primaryColor} />
              <path
                d="M12 10C9 10 7 12 7 15C7 18 9.5 20 12 20C14.5 20 17 18 17 15C17 12 15 10 12 10Z"
                fill={primaryColor}
                fillOpacity="0.85"
              />
              <path
                d="M12 13V17M12 17C11.5 17 10 17.5 10 18.5"
                stroke={accentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="5" r="1" fill={accentColor} />
            </svg>
          </div>
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: primaryColor }}
          >
            {getMantra(
              language === 'gu'
                ? '॥ શ્રી ગણેશાય નમઃ ॥'
                : language === 'en'
                ? '|| Shree Ganeshay Namah ||'
                : '॥ श्री गणेशाय नमः ॥'
            )}
          </div>
        </div>
      );
  }
};
