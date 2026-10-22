export interface CoverLetterTemplateDef {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultOpening: string;
  defaultBody: string[];
  defaultClosing: string;
  defaultSignOff: string;
}

export const COVER_LETTER_TEMPLATES: CoverLetterTemplateDef[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech & Software Engineering',
    category: 'Engineering / Software',
    description: 'Impact-focused, highlights architecture, metrics, modern tech stack, and product ownership.',
    defaultOpening:
      'I am writing to express my strong enthusiasm for the [Target Role] role at [Target Company]. With a proven track record of architecting scalable applications and driving technical performance, I am excited about the opportunity to contribute directly to your engineering team and mission.',
    defaultBody: [
      'In my recent engineering work, I focused extensively on designing resilient systems and writing maintainable code using [Top Skills]. One of my key accomplishments was leading the development of [Key Achievement], which resulted in measurable gains in system reliability, performance, and user satisfaction.',
      'What specifically excites me about [Target Company] is your commitment to [Company Mission]. I thrive in agile, collaborative environments where engineers are empowered to take ownership from initial concept through production deployment and monitoring.',
    ],
    defaultClosing:
      'I would welcome the opportunity to discuss how my technical expertise in [Top Skills] and passion for high-impact software development can help [Target Company] achieve its upcoming roadmap milestones. Thank you for your time and consideration.',
    defaultSignOff: 'Sincerely,',
  },
  {
    id: 'executive-leadership',
    name: 'Executive & Strategic Leadership',
    category: 'Management / Leadership',
    description: 'Focuses on vision, organizational scaling, revenue acceleration, and cross-functional leadership.',
    defaultOpening:
      'It is with great interest that I submit my candidacy for the [Target Role] position at [Target Company]. Over the course of my career, I have dedicated myself to building high-performing teams, optimizing operational workflows, and driving sustained revenue growth.',
    defaultBody: [
      'Throughout my leadership journey, I have specialized in bridging high-level strategic vision with disciplined operational execution. At my previous organization, I championed [Key Achievement], aligning cross-functional departments and delivering exceptional bottom-line outcomes.',
      'My leadership philosophy centers on transparency, accountability, and empowering teams to innovate rapidly. Having closely followed [Target Company]\'s impressive expansion in [Industry / Market], I am confident that my experience steering [Top Skills] will provide immediate strategic value.',
    ],
    defaultClosing:
      'I look forward to discussing how my strategic leadership background can accelerate [Target Company]\'s growth trajectory. Thank you for your consideration.',
    defaultSignOff: 'Warm regards,',
  },
  {
    id: 'corporate-operations',
    name: 'Corporate & Business Operations',
    category: 'Operations / Business',
    description: 'Emphasizes process optimization, stakeholder management, reliability, and measurable execution.',
    defaultOpening:
      'Please accept this letter as an expression of my serious interest in the [Target Role] opening at [Target Company]. With extensive experience in optimizing business processes, managing key stakeholder relationships, and executing complex initiatives, I am eager to bring my skillset to your team.',
    defaultBody: [
      'In my professional career, I have consistently identified operational bottlenecks and introduced structured methodologies to eliminate inefficiencies. Most notably, I spearheaded [Key Achievement], which delivered substantial cost savings and elevated workflow productivity across departments.',
      'I pride myself on meticulous analytical rigor, proactive problem-solving, and clear cross-functional communication. [Target Company]\'s stellar reputation for operational excellence makes this role the ideal next step in my professional journey.',
    ],
    defaultClosing:
      'I am eager to explore how my operational capabilities in [Top Skills] can support [Target Company]\'s operational objectives. Thank you for reviewing my application.',
    defaultSignOff: 'Best regards,',
  },
  {
    id: 'product-creative',
    name: 'Product & Creative Design',
    category: 'Product / Design',
    description: 'Highlights design thinking, customer empathy, iterative prototyping, and aesthetic craft.',
    defaultOpening:
      'I am thrilled to apply for the [Target Role] position at [Target Company]. As a dedicated practitioner of user-centered design and strategic product thinking, I have spent my career transforming intricate problems into intuitive, delightful experiences.',
    defaultBody: [
      'My design process is anchored in deep customer research, rapid prototyping, and close collaboration with engineering and product partners. A highlight of my recent portfolio is [Key Achievement], where user engagement and customer satisfaction saw significant measurable uplift.',
      'I have long admired [Target Company]\'s thoughtful product craft and attention to detail. Leveraging my background in [Top Skills], I am excited to help elevate your design systems and deliver standout user experiences.',
    ],
    defaultClosing:
      'I would love to walk you through my portfolio and discuss how my design perspective can enrich the products at [Target Company]. Thank you for your time and consideration.',
    defaultSignOff: 'Kind regards,',
  },
  {
    id: 'early-career',
    name: 'Early Career & New Graduate',
    category: 'Entry-Level / Graduate',
    description: 'Showcases academic excellence, foundational projects, rapid adaptability, and infectious enthusiasm.',
    defaultOpening:
      'I am excited to submit my application for the [Target Role] opportunity at [Target Company]. As an ambitious and proactive professional with a strong foundation in [Top Skills], I am eager to apply my skills to real-world challenges with your team.',
    defaultBody: [
      'During my academic and practical project work, I demonstrated a strong aptitude for rapid learning, problem decomposition, and disciplined execution. For example, in [Key Achievement], I collaborated with a multidisciplinary team to deliver a functional, high-quality solution ahead of schedule.',
      'What draws me most to [Target Company] is your culture of continuous learning and mentorship. I bring relentless curiosity, a collaborative mindset, and an eagerness to take on new responsibilities and grow alongside your team.',
    ],
    defaultClosing:
      'I would be thrilled to discuss how my drive, foundational training in [Top Skills], and enthusiasm can contribute to [Target Company]. Thank you for considering my application.',
    defaultSignOff: 'Respectfully,',
  },
];
