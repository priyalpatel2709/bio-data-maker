import { Language, BiodataSection, CustomField } from '../types/biodata';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  openStudio: string;
  dashboard: string;
  templates: string;
  createBiodata: string;
  formAndFields: string;
  visualStyler: string;
  exportDownload: string;
  preview: string;
  edit: string;
  save: string;
  autoSaved: string;
  downloadPdf: string;
  downloadDocx: string;
  selectLanguage: string;
  translateBiodataNotice: string;
  translateButton: string;
  personalDetails: string;
  familyDetails: string;
  educationCareer: string;
  contactDetails: string;
  lifestylePreferences: string;
  addField: string;
  addSection: string;
  photoSettings: string;
  colorPalette: string;
  typography: string;
  borderAndSpacing: string;
  columns: string;
  twoColumns: string;
  singleColumn: string;
  documentTitle: string;
  mantra: string;
  years: string;
  blessings: string;
  attachedImages: string;
}

export const UI_TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'BiodataMaker',
    tagline: 'Craft professional, elegant marriage biodatas in seconds',
    openStudio: 'Open Studio',
    dashboard: 'Dashboard',
    templates: 'Templates',
    createBiodata: 'Create New Biodata',
    formAndFields: 'Form & Fields',
    visualStyler: 'Visual Styler',
    exportDownload: 'Export & Download',
    preview: 'Preview',
    edit: 'Edit',
    save: 'Save',
    autoSaved: 'Auto-saved',
    downloadPdf: 'Download PDF',
    downloadDocx: 'Download Word (.docx)',
    selectLanguage: 'Language',
    translateBiodataNotice: 'Switch language and translate all section titles & field labels automatically.',
    translateButton: 'Translate Biodata to',
    personalDetails: 'Personal Details',
    familyDetails: 'Family Background',
    educationCareer: 'Education & Career',
    contactDetails: 'Contact Details',
    lifestylePreferences: 'Lifestyle & Preferences',
    addField: 'Add Field',
    addSection: 'Add New Section',
    photoSettings: 'Profile Photo',
    colorPalette: 'Colors & Palette',
    typography: 'Typography',
    borderAndSpacing: 'Borders & Spacing',
    columns: 'Layout Columns',
    twoColumns: '2 Columns',
    singleColumn: '1 Column',
    documentTitle: 'BIO-DATA',
    mantra: '|| Shree Ganeshay Namah ||',
    years: 'Years',
    blessings: 'Blessings & Good Wishes',
    attachedImages: 'Photo Gallery / Attachments',
  },
  hi: {
    appName: 'बायोडाटा मेकर',
    tagline: 'सुंदर और आकर्षक वैवाहिक बायोडाटा मिनटों में बनाएं',
    openStudio: 'स्टूडियो खोलें',
    dashboard: 'डैशबोर्ड',
    templates: 'टेम्प्लेट्स',
    createBiodata: 'नया बायोडाटा बनाएं',
    formAndFields: 'फ़ॉर्म और विवरण',
    visualStyler: 'डिज़ाइन और रंग',
    exportDownload: 'डाउनलोड / एक्सपोर्ट',
    preview: 'पूर्वावलोकन',
    edit: 'संपादित करें',
    save: 'सुरक्षित करें',
    autoSaved: 'स्वतः सहेजा गया',
    downloadPdf: 'PDF डाउनलोड करें',
    downloadDocx: 'Word (.docx) डाउनलोड करें',
    selectLanguage: 'भाषा चुनें',
    translateBiodataNotice: 'भाषा बदलें और सभी अनुभागों और फ़ील्ड्स का तुरंत अनुवाद करें।',
    translateButton: 'बायोडाटा का अनुवाद करें:',
    personalDetails: 'व्यक्तिगत विवरण',
    familyDetails: 'पारिवारिक विवरण',
    educationCareer: 'शिक्षा एवं व्यवसाय',
    contactDetails: 'संपर्क विवरण',
    lifestylePreferences: 'जीवनशैली एवं प्राथमिकताएं',
    addField: 'नया फ़ील्ड जोड़ें',
    addSection: 'नया अनुभाग जोड़ें',
    photoSettings: 'प्रोफ़ाइल फ़ोटो',
    colorPalette: 'रंग और थीम',
    typography: 'फ़ॉन्ट और लिखावट',
    borderAndSpacing: 'बॉर्डर और स्पेसिंग',
    columns: 'कॉलम लेआउट',
    twoColumns: '2 कॉलम',
    singleColumn: '1 कॉलम',
    documentTitle: 'बायोडाटा',
    mantra: '॥ श्री गणेशाय नमः ॥',
    years: 'वर्ष',
    blessings: '॥ सदा सर्वदा मंगलम् ॥',
    attachedImages: 'फ़ोटो गैलरी / अतिरिक्त फ़ोटो',
  },
  gu: {
    appName: 'બાયોડેટા મેકર',
    tagline: 'આકર્ષક અને સુંદર લગ્ન બાયોડેટા સરળતાથી બનાવો',
    openStudio: 'સ્ટુડિયો ખોલો',
    dashboard: 'ડેશબોર્ડ',
    templates: 'ટેમ્પલેટ્સ',
    createBiodata: 'નવો બાયોડેટા બનાવો',
    formAndFields: 'ફોર્મ અને વિગતો',
    visualStyler: 'ડિઝાઇન અને રંગો',
    exportDownload: 'ડાઉનલોડ / એક્સપોર્ટ',
    preview: 'પૂર્વાવલોકન',
    edit: 'ફેરફાર કરો',
    save: 'સાચવો',
    autoSaved: 'ઓટો-સેવ થયેલ છે',
    downloadPdf: 'PDF ડાઉનલોડ કરો',
    downloadDocx: 'Word (.docx) ડાઉનલોડ કરો',
    selectLanguage: 'ભાષા પસંદ કરો',
    translateBiodataNotice: 'ભાષા બદલો અને તમામ વિભાગો તથા વિગતોનું આપમેળે ભાષાંતર કરો.',
    translateButton: 'બાયોડેટાનું ભાષાંતર કરો:',
    personalDetails: 'વ્યક્તિગત વિગત',
    familyDetails: 'કૌટુંબિક વિગત',
    educationCareer: 'શિક્ષણ અને વ્યવસાય',
    contactDetails: 'સંપર્ક વિગત',
    lifestylePreferences: 'જીવનશૈલી અને પસંદગીઓ',
    addField: 'નવી વિગત ઉમેરો',
    addSection: 'નવો વિભાગ ઉમેરો',
    photoSettings: 'પ્રોફાઇલ ફોટો',
    colorPalette: 'કલર અને થીમ',
    typography: 'ફોન્ટ શૈલી',
    borderAndSpacing: 'બોર્ડર અને સ્પેસિંગ',
    columns: 'કોલમ લેઆઉટ',
    twoColumns: '૨ કોલમ',
    singleColumn: '૧ કોલમ',
    documentTitle: 'બાયોડેટા',
    mantra: '॥ શ્રી ગણેશાય નમઃ ॥',
    years: 'વર્ષ',
    blessings: '॥ સદાય સુખી રહો ॥',
    attachedImages: 'ફોટો ગેલેરી / વધારાના ફોટા',
  },
};

// Section Title Translations Dictionary
export const SECTION_TRANSLATIONS: Record<string, { hi: string; gu: string; en: string }> = {
  personal: {
    en: 'Personal Details',
    hi: 'व्यक्तिगत विवरण',
    gu: 'વ્યક્તિગત વિગત',
  },
  'personal details': {
    en: 'Personal Details',
    hi: 'व्यक्तिगत विवरण',
    gu: 'વ્યક્તિગત વિગત',
  },
  'personal information': {
    en: 'Personal Information',
    hi: 'व्यक्तिगत विवरण',
    gu: 'વ્યક્તિગત માહિતી',
  },
  family: {
    en: 'Family Background',
    hi: 'पारिवारिक विवरण',
    gu: 'કૌટુંબિક વિગત',
  },
  'family background': {
    en: 'Family Background',
    hi: 'पारिवारिक विवरण',
    gu: 'કૌટુંબિક વિગત',
  },
  'family details': {
    en: 'Family Details',
    hi: 'पारिवारिक विवरण',
    gu: 'કૌટુંબિક વિગત',
  },
  education_career: {
    en: 'Education & Career',
    hi: 'शिक्षा एवं व्यवसाय',
    gu: 'શિક્ષણ અને વ્યવસાય',
  },
  'education & career': {
    en: 'Education & Career',
    hi: 'शिक्षा एवं व्यवसाय',
    gu: 'શિક્ષણ અને વ્યવસાય',
  },
  'education details': {
    en: 'Education Details',
    hi: 'शैक्षणिक योग्यता',
    gu: 'શૈક્ષણિક વિગત',
  },
  contact: {
    en: 'Contact Details',
    hi: 'संपर्क विवरण',
    gu: 'સંપર્ક વિગત',
  },
  'contact details': {
    en: 'Contact Details',
    hi: 'संपर्क विवरण',
    gu: 'સંપર્ક વિગત',
  },
  horoscope: {
    en: 'Horoscope Details',
    hi: 'कुंडली विवरण',
    gu: 'કુંડળી વિગત',
  },
  additional: {
    en: 'Lifestyle & Preferences',
    hi: 'जीवनशैली एवं प्राथमिकताएं',
    gu: 'જીવનશૈલી અને પસંદગીઓ',
  },
  'lifestyle & preferences': {
    en: 'Lifestyle & Preferences',
    hi: 'जीवनशैली एवं प्राथमिकताएं',
    gu: 'જીવનશૈલી અને પસંદગીઓ',
  },
  'lifestyle and preferences': {
    en: 'Lifestyle & Preferences',
    hi: 'जीवनशैली एवं प्राथमिकताएं',
    gu: 'જીવનશૈલી અને પસંદગીઓ',
  },
  'lifestyle preferences': {
    en: 'Lifestyle & Preferences',
    hi: 'जीवनशैली एवं प्राथमिकताएं',
    gu: 'જીવનશૈલી અને પસંદગીઓ',
  },
  lifestyle: {
    en: 'Lifestyle & Preferences',
    hi: 'जीवनशैली एवं प्राथमिकताएं',
    gu: 'જીવનશૈલી અને પસંદગીઓ',
  },
  'partner preferences': {
    en: 'Partner Preferences',
    hi: 'जीवनसाथी से अपेक्षाएं',
    gu: 'જીવનસાથીની અપેક્ષાઓ',
  },
  'partner preference': {
    en: 'Partner Preferences',
    hi: 'जीवनसाथी से अपेक्षाएं',
    gu: 'જીવનસાથીની અપેક્ષાઓ',
  },
  'partner expectations': {
    en: 'Partner Expectations',
    hi: 'जीवनसाथी से अपेक्षाएं',
    gu: 'જીવનસાથીની અપેક્ષાઓ',
  },
};

// Field Label Translations Dictionary (Bidirectional search)
export const FIELD_TRANSLATIONS: Record<string, { en: string; hi: string; gu: string }> = {
  'full name': { en: 'Full Name', hi: 'पूरा नाम', gu: 'પૂરું નામ' },
  name: { en: 'Full Name', hi: 'पूरा नाम', gu: 'પૂરું નામ' },
  'date of birth': { en: 'Date of Birth', hi: 'जन्म तारीख', gu: 'જન્મ તારીખ' },
  dob: { en: 'Date of Birth', hi: 'जन्म तारीख', gu: 'જન્મ તારીખ' },
  'time of birth': { en: 'Time of Birth', hi: 'जन्म समय', gu: 'જન્મ સમય' },
  'birth time': { en: 'Birth Time', hi: 'जन्म समय', gu: 'જન્મ સમય' },
  'place of birth': { en: 'Place of Birth', hi: 'जन्म स्थान', gu: 'જન્મ સ્થળ' },
  'birth place': { en: 'Birth Place', hi: 'जन्म स्थान', gu: 'જન્મ સ્થળ' },
  gender: { en: 'Gender', hi: 'लिंग', gu: 'જાતિ / લિંગ' },
  height: { en: 'Height', hi: 'ऊंचाई', gu: 'ઊંચાઈ' },
  weight: { en: 'Weight', hi: 'वजन', gu: 'વજન' },
  'marital status': { en: 'Marital Status', hi: 'वैवाहिक स्थिति', gu: 'વૈવાહિક સ્થિતિ' },
  'religion / caste': { en: 'Religion / Caste', hi: 'धर्म / जाति', gu: 'ધર્મ / જ્ઞાતિ' },
  religion: { en: 'Religion', hi: 'धर्म', gu: 'ધર્મ' },
  caste: { en: 'Caste', hi: 'जाति', gu: 'જ્ઞાતિ' },
  'sub-caste': { en: 'Sub-caste', hi: 'उपजाति', gu: 'પેટા જ્ઞાતિ' },
  gotra: { en: 'Gotra', hi: 'गोत्र', gu: 'ગોત્ર / શાખ' },
  'mother tongue': { en: 'Mother Tongue', hi: 'मातृभाषा', gu: 'માતૃભાષા' },
  'blood group': { en: 'Blood Group', hi: 'ब्लड ग्रुप', gu: 'બ્લડ ગ્રુપ' },
  'manglik status': { en: 'Manglik Status', hi: 'मांगलिक स्थिति', gu: 'માંગલિક સ્થિતિ' },
  manglik: { en: 'Manglik', hi: 'मांगलिक', gu: 'માંગલિક' },
  rashi: { en: 'Rashi (Zodiac)', hi: 'राशि', gu: 'રાશિ' },
  nakshatra: { en: 'Nakshatra', hi: 'नक्षत्र', gu: 'નક્ષત્ર' },
  complexion: { en: 'Complexion', hi: 'रंग / वर्ण', gu: 'રંગ / વાન' },
  colour: { en: 'Colour / Complexion', hi: 'रंग', gu: 'રંગ' },

  // Education & Career
  'highest qualification': { en: 'Highest Qualification', hi: 'उच्चतम योग्यता', gu: 'ઉચ્ચ અભ્યાસ' },
  qualification: { en: 'Qualification', hi: 'शैक्षणिक योग्यता', gu: 'શૈક્ષણિક લાયકાત' },
  'college / university': { en: 'College / University', hi: 'कॉलेज / विश्वविद्यालय', gu: 'કૉલેજ / યુનિવર્સિટી' },
  'undergraduate degree': { en: 'Undergraduate Degree', hi: 'स्नातक डिग्री', gu: 'ગ્રેજ્યુએશન' },
  degree: { en: 'Degree', hi: 'डिग्री', gu: 'ડિગ્રી' },
  occupation: { en: 'Occupation', hi: 'व्यवसाय / नौकरी', gu: 'વ્યવસાય / નોકરી' },
  'company / employer': { en: 'Company / Employer', hi: 'कंपनी का नाम', gu: 'કંપનીનું નામ' },
  'company name': { en: 'Company Name', hi: 'कंपनी का नाम', gu: 'કંપનીનું નામ' },
  'job title': { en: 'Job Title', hi: 'पद / पदनाम', gu: 'હોદ્દો' },
  'work location': { en: 'Work Location', hi: 'कार्य स्थान', gu: 'નોકરીનું સ્થળ' },
  'annual package': { en: 'Annual Package', hi: 'वार्षिक आय', gu: 'વાર્ષિક આવક' },
  'annual income': { en: 'Annual Income', hi: 'वार्षिक आय', gu: 'વાર્ષિક આવક' },

  // Family
  "father's name": { en: "Father's Name", hi: 'पिता का नाम', gu: 'પિતાનું નામ' },
  "father's occupation": { en: "Father's Occupation", hi: 'पिता का व्यवसाय', gu: 'પિતાનો વ્યવસાય' },
  "mother's name": { en: "Mother's Name", hi: 'माता का नाम', gu: 'માતાનું નામ' },
  "mother's occupation": { en: "Mother's Occupation", hi: 'माता का व्यवसाय', gu: 'માતાનો વ્યવસાય' },
  siblings: { en: 'Siblings', hi: 'भाई-बहन', gu: 'ભાઈ-બહેન' },
  brothers: { en: 'Brothers', hi: 'भाई', gu: 'ભાઈ' },
  sisters: { en: 'Sisters', hi: 'बहन', gu: 'બહેન' },
  'family type': { en: 'Family Type', hi: 'परिवार का प्रकार', gu: 'કુટુંબ પ્રકાર' },
  'family values': { en: 'Family Values', hi: 'पारिवारिक मूल्य', gu: 'કૌટુંબિક મૂલ્યો' },
  'native place': { en: 'Native Place', hi: 'मूल निवास', gu: 'મૂળ વતન' },
  'mosal / maternal uncle': { en: 'Mosal / Nanihaal', hi: 'ननिहाल', gu: 'મોસાળ પક્ષ' },

  // Contact
  'contact person': { en: 'Contact Person', hi: 'संपर्क व्यक्ति', gu: 'સંપર્ક વ્યક્તિ' },
  'contact number': { en: 'Contact Number', hi: 'फोन नंबर', gu: 'મોબાઈલ નંબર' },
  'phone number': { en: 'Phone Number', hi: 'फोन नंबर', gu: 'ફોન નંબર' },
  'email address': { en: 'Email Address', hi: 'ईमेल', gu: 'ઈમેલ' },
  email: { en: 'Email', hi: 'ईमेल', gu: 'ઈમેલ' },
  'residential address': { en: 'Residential Address', hi: 'निवास का पता', gu: 'રહેઠાણનું સરનામું' },
  'residence address': { en: 'Residence Address', hi: 'निवास का पता', gu: 'રહેઠાણનું સરનામું' },
  residence: { en: 'Residence', hi: 'निवास', gu: 'રહેઠાણ' },
  'current address': { en: 'Current Address', hi: 'वर्तमान पता', gu: 'હાલનું સરનામું' },
  'street address': { en: 'Street Address', hi: 'पता', gu: 'સરનામું' },
  'permanent address': { en: 'Permanent Address', hi: 'स्थायी पता', gu: 'કાયમી સરનામું' },
  city: { en: 'City', hi: 'शहर', gu: 'શહેર' },
  district: { en: 'District', hi: 'जिला', gu: 'જિલ્લો' },
  state: { en: 'State', hi: 'राज्य', gu: 'રાજ્ય' },
  pincode: { en: 'Pincode', hi: 'पिन कोड', gu: 'પીન કોડ' },
  country: { en: 'Country', hi: 'देश', gu: 'દેશ' },
  'about me': { en: 'About Me', hi: 'मेरे बारे में', gu: 'મારા વિશે' },
  'hobbies & interests': { en: 'Hobbies & Interests', hi: 'शौक एवं रुचियां', gu: 'શોખ અને રસ' },

  // Lifestyle & Preferences
  'lifestyle & preferences': { en: 'Lifestyle & Preferences', hi: 'जीवनशैली एवं प्राथमिकताएं', gu: 'જીવનશૈલી અને પસંદગીઓ' },
  'lifestyle and preferences': { en: 'Lifestyle & Preferences', hi: 'जीवनशैली एवं प्राथमिकताएं', gu: 'જીવનશૈલી અને પસંદગીઓ' },
  'lifestyle preferences': { en: 'Lifestyle & Preferences', hi: 'जीवनशैली एवं प्राथमिकताएं', gu: 'જીવનશૈલી અને પસંદગીઓ' },
  lifestyle: { en: 'Lifestyle', hi: 'जीवनशैली', gu: 'જીવનશૈલી' },
  'dietary habits': { en: 'Dietary Habits', hi: 'खान-पान / आहार', gu: 'આહાર પદ્ધતિ / ખાનપાન' },
  'dietary habit': { en: 'Dietary Habits', hi: 'खान-पान / आहार', gu: 'આહાર પદ્ધતિ / ખાનપાન' },
  diet: { en: 'Diet', hi: 'खान-पान / आहार', gu: 'આહાર પદ્ધતિ / ખાનપાન' },
  'food habits': { en: 'Food Habits', hi: 'खान-पान की आदतें', gu: 'ખાનપાનની આદતો' },
  'languages known': { en: 'Languages Known', hi: 'ज्ञात भाषाएं', gu: 'જાણીતી ભાષાઓ' },
  'language known': { en: 'Languages Known', hi: 'ज्ञात भाषाएं', gu: 'જાણીતી ભાષાઓ' },
  'languages spoken': { en: 'Languages Spoken', hi: 'बोली जाने वाली भाषाएं', gu: 'બોલાતી ભાષાઓ' },
  languages: { en: 'Languages', hi: 'भाषाएं', gu: 'ભાષાઓ' },
  language: { en: 'Language', hi: 'भाषा', gu: 'ભાષા' },
  'partner preferences': { en: 'Partner Preferences', hi: 'जीवनसाथी से अपेक्षाएं', gu: 'જીવનસાથીની અપેક્ષાઓ' },
  'partner preference': { en: 'Partner Preference', hi: 'जीवनसाथी से अपेक्षाएं', gu: 'જીવનસાથીની અપેક્ષાઓ' },
  'partner expectations': { en: 'Partner Expectations', hi: 'जीवनसाथी से अपेक्षाएं', gu: 'જીવનસાથીની અપેક્ષાઓ' },
  expectations: { en: 'Expectations', hi: 'अपेक्षाएं', gu: 'અપેક્ષાઓ' },
};

/**
 * Normalizes a label to search in our dictionaries
 */
function normalizeKey(str: string): string {
  return str.toLowerCase().trim().replace(/[:—\-_]/g, ' ').replace(/\s+/g, ' ');
}

/**
 * Translates a section title to target language
 */
export function translateSectionTitle(title: string, key: string, targetLang: Language): string {
  if (targetLang === 'en') {
    // Check if key or title matches
    const found = SECTION_TRANSLATIONS[key.toLowerCase()] || SECTION_TRANSLATIONS[normalizeKey(title)];
    if (found) return found.en;
    // Reverse search in hi / gu
    for (const val of Object.values(SECTION_TRANSLATIONS)) {
      if (val.hi === title || val.gu === title) return val.en;
    }
    return title;
  }

  // Target is hi or gu
  const norm = normalizeKey(title);
  const found = SECTION_TRANSLATIONS[key.toLowerCase()] || SECTION_TRANSLATIONS[norm];
  if (found) return found[targetLang];

  // Reverse match from any language
  for (const val of Object.values(SECTION_TRANSLATIONS)) {
    if (val.en === title || val.hi === title || val.gu === title) {
      return val[targetLang];
    }
  }

  return title;
}

/**
 * Translates a field label to target language
 */
export function translateFieldLabel(label: string, targetLang: Language): string {
  const norm = normalizeKey(label);

  // Direct lookup
  if (FIELD_TRANSLATIONS[norm]) {
    return FIELD_TRANSLATIONS[norm][targetLang];
  }

  // Reverse lookup (user might currently have Hindi or Gujarati and want English, or vice versa)
  for (const [_, trans] of Object.entries(FIELD_TRANSLATIONS)) {
    if (
      trans.en.toLowerCase() === norm ||
      trans.hi.toLowerCase() === norm ||
      trans.gu.toLowerCase() === norm ||
      normalizeKey(trans.en) === norm ||
      normalizeKey(trans.hi) === norm ||
      normalizeKey(trans.gu) === norm
    ) {
      return trans[targetLang];
    }
  }

  return label;
}

/**
 * Translates an entire array of sections (titles and field labels) to target language
 */
export function translateDocumentSections(
  sections: BiodataSection[],
  targetLang: Language
): BiodataSection[] {
  return sections.map((sec) => ({
    ...sec,
    title: translateSectionTitle(sec.title, sec.key, targetLang),
    fields: sec.fields.map((field) => ({
      ...field,
      label: translateFieldLabel(field.label, targetLang),
    })),
  }));
}

/**
 * Get localized mantra / header text
 */
export function getLocalizedDocText(
  key: 'documentTitle' | 'mantra' | 'years' | 'blessings',
  lang: Language = 'en'
): string {
  return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en[key];
}
