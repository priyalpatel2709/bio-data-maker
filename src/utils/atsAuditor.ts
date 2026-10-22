import { ResumeDocument } from '../types/resume';

export interface AuditCheckItem {
  id: string;
  category: 'verbs' | 'metrics' | 'completeness' | 'formatting';
  title: string;
  status: 'passed' | 'warning' | 'failed';
  score: number;
  maxScore: number;
  details: string;
  suggestion?: string;
}

export interface ATSAuditReport {
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'Needs Work';
  categoryScores: {
    verbs: { score: number; max: 25 };
    metrics: { score: number; max: 25 };
    completeness: { score: number; max: 25 };
    formatting: { score: number; max: 25 };
  };
  totalBulletsCount: number;
  actionVerbsCount: number;
  quantifiedBulletsCount: number;
  weakVerbsCount: number;
  checks: AuditCheckItem[];
  detectedWeakBullets: { bullet: string; company: string; reason: string; replacement: string[] }[];
}

// 150+ Strong Power Action Verbs categorized
export const POWER_VERBS: Record<string, string[]> = {
  leadership: [
    'Spearheaded', 'Orchestrated', 'Championed', 'Founded', 'Directed',
    'Guided', 'Mentored', 'Supervised', 'Delegated', 'Mobilized',
    'Aligned', 'Steered', 'Empowered', 'Cultivated', 'Unified',
    'Pioneered', 'Recruited', 'Transformed', 'Chaired', 'Facilitated'
  ],
  technical: [
    'Architected', 'Engineered', 'Developed', 'Deployed', 'Automated',
    'Refactored', 'Scaled', 'Configured', 'Debugged', 'Containerized',
    'Integrated', 'Implemented', 'Programmed', 'Constructed', 'Decoupled',
    'Migrated', 'Instrumented', 'Prototyped', 'Provisioned', 'Synthesized'
  ],
  optimization: [
    'Accelerated', 'Streamlined', 'Overhauled', 'Maximized', 'Reduced',
    'Minimized', 'Amplified', 'Consolidated', 'Elevated', 'Optimized',
    'Standardized', 'Expedited', 'Restructured', 'Augmented', 'Boosted',
    'Enhanced', 'Cut', 'Eliminated', 'Upgraded', 'Modernized'
  ],
  collaboration_delivery: [
    'Delivered', 'Authored', 'Negotiated', 'Partnered', 'Presented',
    'Collaborated', 'Liaised', 'Resolved', 'Secured', 'Published',
    'Trained', 'Advocated', 'Coordinated', 'Dispatched', 'Organized',
    'Arbitrated', 'Brokered', 'Communicated', 'Consulted', 'Briefed'
  ],
  research_analysis: [
    'Analyzed', 'Benchmarked', 'Evaluated', 'Audited', 'Investigated',
    'Formulated', 'Forecasted', 'Diagnosed', 'Identified', 'Measured',
    'Calculated', 'Validated', 'Quantified', 'Discovered', 'Assessed',
    'Surveyed', 'Modeled', 'Mapped', 'Synthesized', 'Tracked'
  ],
};

const ALL_POWER_VERBS_SET = new Set(
  Object.values(POWER_VERBS)
    .flat()
    .map((v) => v.toLowerCase())
);

// Common weak / passive openings that ATS & recruiters dislike
export const WEAK_OPENINGS = [
  { phrase: 'responsible for', suggestion: ['Spearheaded', 'Owned', 'Directed', 'Managed'] },
  { phrase: 'worked on', suggestion: ['Architected', 'Developed', 'Engineered', 'Constructed'] },
  { phrase: 'helped with', suggestion: ['Collaborated to', 'Partnered on', 'Supported', 'Facilitated'] },
  { phrase: 'tasked with', suggestion: ['Led the execution of', 'Delivered', 'Spearheaded'] },
  { phrase: 'assisted in', suggestion: ['Partnered to build', 'Accelerated development of', 'Co-engineered'] },
  { phrase: 'duties included', suggestion: ['Oversaw', 'Administered', 'Executed'] },
  { phrase: 'handled', suggestion: ['Managed', 'Orchestrated', 'Resolved', 'Streamlined'] },
  { phrase: 'involved in', suggestion: ['Contributed to', 'Co-developed', 'Engineered'] },
];

/**
 * Checks if a string contains quantifiable metrics:
 * e.g. 50%, $1.2M, €40k, 10,000 users, 2x faster, 30 days, 15+ engineers
 */
export function hasQuantifiableMetric(text: string): boolean {
  const metricRegex = /(?:\b\d+[\d,.]*\s*(?:%|percent|k|M|B|x|X|\+)\b)|(?:[\$€£₹]\s*\d+[\d,.]*)|(?:\b\d+\s*(?:users|clients|customers|teams|services|engineers|projects|days|hours|minutes|ms|seconds|nodes|transactions)\b)|\b(?:doubled|tripled|halved|quadrupled)\b/i;
  return metricRegex.test(text);
}

/**
 * Extract the first word (cleaned of punctuation)
 */
function getFirstWord(sentence: string): string {
  const trimmed = sentence.trim().replace(/^[^a-zA-Z]+/, '');
  const match = trimmed.match(/^([a-zA-Z]+)/);
  return match ? match[1] : '';
}

/**
 * Comprehensive Rule-Based ATS Resume Auditor
 */
export function auditResume(resume: ResumeDocument): ATSAuditReport {
  const checks: AuditCheckItem[] = [];
  const detectedWeakBullets: ATSAuditReport['detectedWeakBullets'] = [];

  // Flatten all bullets from experience
  const allBullets: { bullet: string; company: string }[] = [];
  resume.experience.forEach((exp) => {
    exp.bullets.forEach((b) => {
      if (b.trim()) {
        allBullets.push({ bullet: b.trim(), company: exp.company || 'Experience' });
      }
    });
  });

  const totalBullets = allBullets.length;

  // ----------------------------------------------------
  // 1. ACTION VERBS & TONE AUDIT (Max 25 pts)
  // ----------------------------------------------------
  let powerVerbMatches = 0;
  let weakBulletsCount = 0;

  allBullets.forEach(({ bullet, company }) => {
    const lower = bullet.toLowerCase();

    // Check for weak openings
    for (const weak of WEAK_OPENINGS) {
      if (lower.startsWith(weak.phrase)) {
        weakBulletsCount++;
        detectedWeakBullets.push({
          bullet,
          company,
          reason: `Opens with passive phrase "${weak.phrase}"`,
          replacement: weak.suggestion,
        });
        return;
      }
    }

    // Check first word against power verbs dictionary
    const firstWord = getFirstWord(bullet).toLowerCase();
    if (ALL_POWER_VERBS_SET.has(firstWord)) {
      powerVerbMatches++;
    }
  });

  // Calculate verbs score
  let verbsScore = 0;
  if (totalBullets === 0) {
    checks.push({
      id: 'verbs-empty',
      category: 'verbs',
      title: 'Action Verbs in Experience Bullets',
      status: 'failed',
      score: 0,
      maxScore: 25,
      details: 'No experience bullets found. Add your job responsibilities with strong action verbs.',
      suggestion: 'Begin every bullet point with an impactful past-tense verb like "Architected" or "Spearheaded".',
    });
  } else {
    const powerRatio = powerVerbMatches / totalBullets;
    const rawVerbsScore = Math.min(25, Math.round(powerRatio * 25) - weakBulletsCount * 3);
    verbsScore = Math.max(0, rawVerbsScore);

    checks.push({
      id: 'power-verbs',
      category: 'verbs',
      title: 'Strong Action Verbs Opening',
      status: powerRatio >= 0.7 ? 'passed' : powerRatio >= 0.4 ? 'warning' : 'failed',
      score: verbsScore,
      maxScore: 25,
      details: `${powerVerbMatches} of ${totalBullets} bullets start with high-impact power verbs. ${weakBulletsCount} passive phrases detected.`,
      suggestion:
        weakBulletsCount > 0
          ? `Replace passive phrases like "Responsible for" with direct action verbs.`
          : powerRatio < 0.7
          ? 'Aim to start at least 70% of bullets with strong past-tense action verbs.'
          : 'Outstanding tone! Your bullets read assertively and authoritatively.',
    });
  }

  // ----------------------------------------------------
  // 2. QUANTIFIED ACHIEVEMENTS & METRICS (Max 25 pts)
  // ----------------------------------------------------
  let quantifiedCount = 0;
  allBullets.forEach(({ bullet }) => {
    if (hasQuantifiableMetric(bullet)) {
      quantifiedCount++;
    }
  });

  let metricsScore = 0;
  if (totalBullets === 0) {
    checks.push({
      id: 'metrics-empty',
      category: 'metrics',
      title: 'Quantified Results & Metrics',
      status: 'failed',
      score: 0,
      maxScore: 25,
      details: 'No experience bullet points available to audit for metrics.',
    });
  } else {
    const metricRatio = quantifiedCount / totalBullets;
    // Ideal is 40% or more bullets having metrics
    metricsScore = Math.min(25, Math.round((metricRatio / 0.4) * 25));

    checks.push({
      id: 'quantified-metrics',
      category: 'metrics',
      title: 'Measurable Metrics (%, $, Numbers, Scale)',
      status: metricRatio >= 0.4 ? 'passed' : metricRatio >= 0.2 ? 'warning' : 'failed',
      score: metricsScore,
      maxScore: 25,
      details: `${quantifiedCount} of ${totalBullets} bullets contain quantifiable data points (%, $, team size, performance gains).`,
      suggestion:
        metricRatio < 0.4
          ? 'Add specific numbers to your achievements (e.g. "reduced latency by 35%", "managed $200k budget", "led team of 6").'
          : 'Great use of metrics! Quantified evidence makes your accomplishments credible to recruiters.',
    });
  }

  // ----------------------------------------------------
  // 3. CONTACT INFO & ESSENTIAL SECTIONS (Max 25 pts)
  // ----------------------------------------------------
  let completenessScore = 0;
  const missingFields: string[] = [];

  const { contact, summary, experience, education, skillCategories } = resume;

  if (contact.fullName?.trim()) completenessScore += 4;
  else missingFields.push('Full Name');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (contact.email && emailRegex.test(contact.email.trim())) completenessScore += 4;
  else missingFields.push('Valid Email Address');

  if (contact.phone?.trim() && contact.phone.replace(/\D/g, '').length >= 7) completenessScore += 4;
  else missingFields.push('Phone Number');

  if (contact.location?.trim()) completenessScore += 3;
  else missingFields.push('City/Location');

  if (contact.jobTitle?.trim()) completenessScore += 3;
  else missingFields.push('Target Job Title');

  const hasSummary = summary?.trim().length >= 40;
  if (hasSummary) completenessScore += 3;
  else missingFields.push('Professional Summary (min 40 characters)');

  const hasEdu = education.length > 0 && education.some((e) => e.institution.trim() && e.degree.trim());
  if (hasEdu) completenessScore += 2;
  else missingFields.push('Education Credential');

  const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  if (totalSkills >= 5) completenessScore += 2;
  else missingFields.push('At least 5 Technical/Core Skills');

  checks.push({
    id: 'essential-completeness',
    category: 'completeness',
    title: 'Essential ATS Fields & Contact Info',
    status: completenessScore >= 22 ? 'passed' : completenessScore >= 16 ? 'warning' : 'failed',
    score: completenessScore,
    maxScore: 25,
    details:
      missingFields.length === 0
        ? 'All required recruiter and ATS contact sections are present and valid.'
        : `Missing or incomplete items: ${missingFields.join(', ')}.`,
    suggestion:
      missingFields.length > 0
        ? `Ensure all foundational sections are filled out to pass basic ATS parser filters.`
        : undefined,
  });

  // ----------------------------------------------------
  // 4. FORMATTING, LENGTH & READABILITY HEALTH (Max 25 pts)
  // ----------------------------------------------------
  let formattingScore = 25;
  const formattingNotes: string[] = [];

  // Check 1: Summary length (optimal: 40 - 500 chars)
  if (summary && summary.trim().length > 550) {
    formattingScore -= 5;
    formattingNotes.push('Executive summary is too long (> 500 chars). Keep it to 3-4 punchy sentences.');
  }

  // Check 2: Bullet counts per role (ideal: 2 - 6)
  experience.forEach((exp) => {
    if (exp.bullets.length > 7) {
      formattingScore -= 3;
      formattingNotes.push(`Too many bullets (${exp.bullets.length}) for "${exp.position || exp.company}". Max 5-6 bullets per job.`);
    } else if (exp.bullets.length === 1) {
      formattingScore -= 2;
      formattingNotes.push(`Only 1 bullet for "${exp.position || exp.company}". Add at least 2-3 bullets to show depth.`);
    }
  });

  // Check 3: Run-on bullets (> 45 words) or too short (< 6 words)
  let runOnCount = 0;
  let tooShortCount = 0;
  allBullets.forEach(({ bullet }) => {
    const wordCount = bullet.split(/\s+/).filter(Boolean).length;
    if (wordCount > 45) runOnCount++;
    if (wordCount < 6) tooShortCount++;
  });

  if (runOnCount > 0) {
    formattingScore -= Math.min(6, runOnCount * 2);
    formattingNotes.push(`${runOnCount} bullets are run-on sentences (> 45 words). Break them up for ATS readability.`);
  }
  if (tooShortCount > 0) {
    formattingScore -= Math.min(4, tooShortCount * 2);
    formattingNotes.push(`${tooShortCount} bullets are too brief (< 6 words). Elaborate on what you built or achieved.`);
  }

  formattingScore = Math.max(5, formattingScore);

  checks.push({
    id: 'formatting-health',
    category: 'formatting',
    title: 'Bullet Word Counts & Role Balance',
    status: formattingScore >= 20 ? 'passed' : formattingScore >= 14 ? 'warning' : 'failed',
    score: formattingScore,
    maxScore: 25,
    details:
      formattingNotes.length === 0
        ? 'Well-balanced role structure. Bullet lengths (10-35 words) are optimal for human skimming and ATS.'
        : formattingNotes.join(' '),
    suggestion:
      formattingNotes.length > 0 ? 'Follow the Action Verb + Context + Result formula for ideal length.' : undefined,
  });

  // ----------------------------------------------------
  // TOTAL SCORE & LETTER GRADE
  // ----------------------------------------------------
  const overallScore = Math.min(100, Math.max(0, verbsScore + metricsScore + completenessScore + formattingScore));

  let grade: ATSAuditReport['grade'] = 'Needs Work';
  if (overallScore >= 90) grade = 'A+';
  else if (overallScore >= 80) grade = 'A';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 55) grade = 'C';

  return {
    overallScore,
    grade,
    categoryScores: {
      verbs: { score: verbsScore, max: 25 },
      metrics: { score: metricsScore, max: 25 },
      completeness: { score: completenessScore, max: 25 },
      formatting: { score: formattingScore, max: 25 },
    },
    totalBulletsCount: totalBullets,
    actionVerbsCount: powerVerbMatches,
    quantifiedBulletsCount: quantifiedCount,
    weakVerbsCount: weakBulletsCount,
    checks,
    detectedWeakBullets,
  };
}
