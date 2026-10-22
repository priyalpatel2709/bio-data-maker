export const RESUME_AI_SYSTEM_PROMPT = `You are an elite executive resume writer and Applicant Tracking System (ATS) optimization specialist.
Your mission is to craft clear, impactful, and truthful resume content that highlights measurable achievements using the STAR method (Situation, Task, Action, Result).
Always use strong action verbs (e.g., Spearheaded, Architected, Accelerated, Engineered, Orchestrated).
Never use passive phrasing ("responsible for", "helped with", "worked on").
Be concise, direct, and avoid buzzword fluff.`;

export const BULLET_IMPROVER_PROMPT = (bullet: string, position?: string, company?: string) => `
Context:
Position: ${position || 'Professional'}
Company: ${company || 'Organization'}
Original Bullet: "${bullet}"

Rewrite this resume bullet into 3 distinct, high-impact variations using active voice and quantifiable results where applicable:
1. Action-Oriented (Focused on leadership and rapid execution)
2. Metric-Driven (Focused on quantifiable outcomes, percentages, efficiency, or scale)
3. Concise Executive (Direct, high-level strategic impact)

Return ONLY a valid JSON array of 3 strings, with no markdown code blocks and no explanation. Example:
["Action variation...", "Metric variation...", "Executive variation..."]
`;

export const SUMMARY_GENERATOR_PROMPT = (candidateContext: {
  fullName?: string;
  jobTitle?: string;
  skills?: string[];
  topExperiences?: string[];
}) => `
Candidate Profile:
Name: ${candidateContext.fullName || 'Professional'}
Target Role: ${candidateContext.jobTitle || 'Specialist'}
Core Skills: ${candidateContext.skills?.join(', ') || 'Various'}
Key Highlights: ${candidateContext.topExperiences?.join('; ') || 'N/A'}

Write 3 compelling professional summary options (each 2-4 sentences long):
1. Impact & Achievement-Focused (High energy, emphasis on proven track record)
2. Technical & Domain Specialist (Deep skill focus and architectural/strategic mastery)
3. Leadership & Growth-Oriented (Team enablement, scale, and organizational value)

Return ONLY a valid JSON array of 3 strings, with no markdown code blocks and no explanation. Example:
["Summary option 1...", "Summary option 2...", "Summary option 3..."]
`;

export const ATS_JOB_MATCHER_PROMPT = (resumeContent: string, jobDescription: string) => `
Analyze how well this candidate's resume matches the provided Job Description (JD).
Perform an ATS keyword gap analysis.

RESUME CONTENT:
"""
${resumeContent}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

Evaluate:
1. matchScore: integer between 0 and 100 representing ATS match strength.
2. matchingKeywords: array of 4-8 important skills/terms found in both.
3. missingKeywords: array of 4-8 high-priority hard/soft skills found in the JD but missing or weak in the resume.
4. recommendations: array of 3 actionable advice bullets to tailor the resume for this role.

Return ONLY a valid JSON object matching this schema, with no markdown code blocks and no explanation:
{
  "matchScore": 78,
  "matchingKeywords": ["React", "TypeScript", "CI/CD"],
  "missingKeywords": ["Docker", "GraphQL", "AWS Lambda"],
  "recommendations": ["Incorporate Docker containerization experience into work history", "Highlight GraphQL API design under Skills"]
}
`;

export const JOB_TAILOR_AND_COVER_LETTER_PROMPT = (
  resumeText: string,
  jobDescription: string
) => `
You are an expert career strategist and executive resume writer.
Your task is to analyze the candidate's existing resume alongside the target Job Description (JD), and produce:
1. An ATS-optimized tailored resume configuration that highlights relevant skills and experiences.
2. A compelling, personalized, high-converting Cover Letter tailored directly to this role and company.

CANDIDATE'S EXISTING RESUME:
"""
${resumeText}
"""

TARGET JOB DESCRIPTION:
"""
${jobDescription}
"""

Generate a complete JSON response according to this EXACT schema:
{
  "targetJobTitle": "Extracted target job title (e.g. Senior Full-Stack Engineer)",
  "targetCompany": "Extracted company name or 'Hiring Team'",
  "atsScore": 85,
  "matchingKeywords": ["TypeScript", "React", "Next.js", "PostgreSQL"],
  "missingKeywords": ["Docker", "Kubernetes", "AWS"],
  "recommendations": [
    "Positioned React & Node.js architecture experience at the top of the summary",
    "Tailored bullet points to emphasize cloud deployment and system scalability"
  ],
  "tailoredJobTitle": "Candidate target title aligned with JD",
  "tailoredSummary": "2-4 compelling sentences summarizing candidate's direct fit, key strengths, and proven accomplishments relevant to this specific role and company.",
  "tailoredSkills": [
    {
      "categoryName": "Core Technologies",
      "skills": ["Skill1", "Skill2", "Skill3"]
    },
    {
      "categoryName": "Target Frameworks & Tools",
      "skills": ["Skill4", "Skill5", "Skill6"]
    }
  ],
  "experienceBulletImprovements": [
    {
      "company": "Company Name from resume",
      "bullets": [
        "Action-oriented bullet 1 incorporating relevant keywords and measurable metrics",
        "Action-oriented bullet 2 demonstrating problem-solving relevant to JD"
      ]
    }
  ],
  "coverLetter": {
    "recipientName": "Hiring Manager or extracted contact name",
    "recipientTitle": "Hiring Team / Talent Acquisition",
    "recipientCompany": "Target Company Name",
    "recipientLocation": "Company City/State or Remote",
    "date": "Current Date (e.g. October 2026)",
    "salutation": "Dear Hiring Team at [Target Company],",
    "openingParagraph": "Strong opening hook stating excitement for the [Target Job Title] role, referencing why the company's mission resonates and expressing clear enthusiasm.",
    "bodyParagraphs": [
      "First body paragraph detailing candidate's direct technical/functional background and how their specific experiences solve the key requirements outlined in the JD.",
      "Second body paragraph highlighting specific measurable achievements, metrics, and leadership or problem-solving capability relevant to the position."
    ],
    "closingParagraph": "Confident, gracious closing reiterating enthusiasm, expressing eager anticipation for an interview discussion, and thanking them for their consideration.",
    "signOff": "Sincerely,"
  }
}

Return ONLY valid JSON. No markdown code blocks, no preamble, and no explanation.
`;

