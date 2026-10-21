import { BiodataDocument } from '../types/biodata';

export const SAMPLE_PHOTO_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';

export const defaultBiodata: BiodataDocument = {
  id: 'doc-sample-1',
  title: 'Ananya Sharma — Matrimonial Biodata',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  photoUrl: SAMPLE_PHOTO_URL,
  styling: {
    templateId: 'classic-traditional',
    primaryColor: '#881337', // Rose 900 / Deep Maroon
    accentColor: '#D97706',  // Amber 600 / Royal Gold
    backgroundColor: '#FFFDF9', // Warm Ivory
    textColor: '#1E293B',
    subtextColor: '#64748B',
    backgroundPattern: 'damask',
    backgroundOpacity: 0.12,
    fontFamilyHeading: 'Playfair Display',
    fontFamilyBody: 'Inter',
    fontSize: 'normal',
    spacing: 'normal',
    columns: 2,
    borderStyle: 'ornate',
    photoShape: 'rounded',
    photoPosition: 'top-right',
    photoBorder: true,
    photoSize: 'medium',
    showPhoto: true,
    showWatermark: false,
    paperSize: 'a4',
  },
  sections: [
    {
      id: 'sec-personal',
      key: 'personal',
      title: 'Personal Details',
      isCustom: false,
      visible: true,
      description: 'Core personal vitals and cultural background',
      fields: [
        { id: 'f-name', label: 'Full Name', value: 'Ananya Sharma', type: 'text', visible: true, required: true },
        { id: 'f-dob', label: 'Date of Birth', value: '1997-06-18', type: 'date', visible: true, required: true },
        { id: 'f-tob', label: 'Time of Birth', value: '08:45 AM', type: 'text', visible: true },
        { id: 'f-pob', label: 'Place of Birth', value: 'Jaipur, Rajasthan', type: 'text', visible: true },
        { id: 'f-height', label: 'Height', value: "5' 6\" (168 cm)", type: 'text', visible: true },
        { id: 'f-weight', label: 'Weight', value: '58 kg', type: 'text', visible: true },
        { id: 'f-marital-status', label: 'Marital Status', value: 'Never Married', type: 'select', options: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'], visible: true },
        { id: 'f-religion', label: 'Religion / Caste', value: 'Hindu — Brahmin (Gour)', type: 'text', visible: true },
        { id: 'f-gotra', label: 'Gotra', value: 'Vashistha (Maternal: Kaushik)', type: 'text', visible: true },
        { id: 'f-mother-tongue', label: 'Mother Tongue', value: 'Hindi & English', type: 'text', visible: true },
        { id: 'f-blood-group', label: 'Blood Group', value: 'O Positive (O+)', type: 'text', visible: true },
        { id: 'f-manglik', label: 'Manglik Status', value: 'Non-Manglik', type: 'select', options: ['Non-Manglik', 'Manglik', 'Anshik Manglik', 'Don’t Know'], visible: true },
      ]
    },
    {
      id: 'sec-education-career',
      key: 'education_career',
      title: 'Education & Career',
      isCustom: false,
      visible: true,
      description: 'Academic background and current profession',
      fields: [
        { id: 'f-highest-qual', label: 'Highest Qualification', value: 'M.Tech in Computer Science', type: 'text', visible: true },
        { id: 'f-college', label: 'College / University', value: 'BITS Pilani (Campus 2019-2021)', type: 'text', visible: true },
        { id: 'f-ug-degree', label: 'Undergraduate Degree', value: 'B.Tech in Information Tech, NIT Jaipur', type: 'text', visible: true },
        { id: 'f-occupation', label: 'Occupation', value: 'Senior Product Software Engineer', type: 'text', visible: true },
        { id: 'f-company', label: 'Company / Employer', value: 'Microsoft India R&D Pvt Ltd', type: 'text', visible: true },
        { id: 'f-work-location', label: 'Work Location', value: 'Bengaluru (Hybrid)', type: 'text', visible: true },
        { id: 'f-income', label: 'Annual Package', value: '₹28 LPA', type: 'text', visible: true },
      ]
    },
    {
      id: 'sec-family',
      key: 'family',
      title: 'Family Background',
      isCustom: false,
      visible: true,
      description: 'Parents, siblings, and family values',
      fields: [
        { id: 'f-father-name', label: "Father's Name", value: 'Dr. Rameshwar Sharma', type: 'text', visible: true },
        { id: 'f-father-occ', label: "Father's Occupation", value: 'Chief Medical Officer (Retd. Govt. Hospital)', type: 'text', visible: true },
        { id: 'f-mother-name', label: "Mother's Name", value: 'Mrs. Sunita Sharma', type: 'text', visible: true },
        { id: 'f-mother-occ', label: "Mother's Occupation", value: 'Senior Lecturer, Kendriya Vidyalaya', type: 'text', visible: true },
        { id: 'f-siblings', label: 'Siblings', value: '1 Elder Brother (Married, Architect in London)', type: 'text', visible: true },
        { id: 'f-family-type', label: 'Family Type', value: 'Upper Middle Class, Joint Family Values', type: 'text', visible: true },
        { id: 'f-native-place', label: 'Native Place', value: 'Udaipur, Rajasthan', type: 'text', visible: true },
      ]
    },
    {
      id: 'sec-contact',
      key: 'contact',
      title: 'Contact Details',
      isCustom: false,
      visible: true,
      description: 'Communication addresses and telephone numbers',
      fields: [
        { id: 'f-contact-person', label: 'Contact Person', value: 'Dr. Rameshwar Sharma (Father)', type: 'text', visible: true },
        { id: 'f-phone', label: 'Contact Number', value: '+91 98290 12345 / +91 94140 67890', type: 'text', visible: true },
        { id: 'f-email', label: 'Email Address', value: 'rameshwar.sharma@example.com', type: 'text', visible: true },
        { id: 'f-residence', label: 'Residential Address', value: 'B-42, Royal Greens Enclave, Vaishali Nagar, Jaipur - 302021', type: 'textarea', visible: true },
      ]
    },
    {
      id: 'sec-additional',
      key: 'additional',
      title: 'Lifestyle & Preferences',
      isCustom: false,
      visible: true,
      description: 'Personal interests, diet, and partner expectations',
      fields: [
        { id: 'f-diet', label: 'Dietary Habits', value: 'Vegetarian (Teetotaler)', type: 'text', visible: true },
        { id: 'f-hobbies', label: 'Hobbies & Interests', value: 'Classical Hindustani music, hiking, photography, reading literature', type: 'textarea', visible: true },
        { id: 'f-languages', label: 'Languages Known', value: 'English, Hindi, Rajasthani, Conversational French', type: 'text', visible: true },
        { id: 'f-partner-pref', label: 'Partner Preferences', value: 'Looking for an educated, progressive, and family-oriented partner with good humor and shared cultural values.', type: 'textarea', visible: true },
      ]
    }
  ]
};
