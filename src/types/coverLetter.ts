export interface CoverLetterRecipient {
  name: string;
  title?: string;
  company: string;
  location?: string;
}

export interface CoverLetterSender {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface CoverLetterDocument {
  id: string;
  title: string;
  targetRole: string;
  targetCompany: string;
  date: string;
  recipient: CoverLetterRecipient;
  sender: CoverLetterSender;
  salutation: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signOff: string;
  fullContentText: string;
}

export interface JobTailoredResult {
  targetJobTitle: string;
  targetCompany: string;
  atsScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  tailoredResume: any; // ResumeDocument
  coverLetter: CoverLetterDocument;
}
