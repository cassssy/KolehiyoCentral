import type { Month } from "./data";

export type ScholarshipKind = "Merit" | "Need-based" | "Free tuition";

export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  /** University this applies to; null means any school that qualifies. */
  universityId: string | null;
  government: boolean;
  /** False when it is awarded automatically or by invitation. */
  needsApplication: boolean;
  kind: ScholarshipKind;
  covers: string;
  who: string[];
  howToApply: string;
  /** Months the application is usually open. */
  applyMonths: Month[];
  /** Shown instead of months: either no application exists, or the school hasn't published dates. */
  windowNote?: string;
  source: string;
};

/**
 * Demo data gathered November 2026 from official pages and news reports.
 * Dates move every cycle, so the page tells students to confirm on the source.
 */
export const scholarships: Scholarship[] = [
  {
    id: "dost-sei",
    needsApplication: true,
    government: true,
    name: "DOST-SEI Undergraduate Scholarship",
    provider: "DOST Science Education Institute",
    universityId: null,
    kind: "Merit",
    covers: "Tuition subsidy, monthly stipend, book allowance",
    who: ["Grade 12 students entering a priority science or engineering course", "Must pass the DOST-SEI qualifying exam"],
    howToApply: "Apply online, then take the nationwide exam in November.",
    applyMonths: ["August", "September"],
    source: "https://www.sei.dost.gov.ph/",
  },
  {
    id: "ched-merit",
    needsApplication: true,
    government: true,
    name: "CHED Merit Scholarship",
    provider: "Commission on Higher Education",
    universityId: null,
    kind: "Merit",
    covers: "Financial support while enrolled in a priority program",
    who: [
      "Top 5 of graduating class, or Grade 12 average of 95% or higher",
      "Family income of ₱2,000,000 a year or less",
      "Enrolled in a CHED priority program",
    ],
    howToApply: "Apply through your CHED regional office. Deadlines vary by region.",
    applyMonths: ["June", "July"],
    source: "https://ched.gov.ph/",
  },
  {
    id: "free-tuition",
    needsApplication: false,
    government: true,
    name: "Free Higher Education (RA 10931)",
    provider: "Government, through UniFAST",
    universityId: "up",
    kind: "Free tuition",
    covers: "Tuition and school fees at state universities",
    who: ["Filipino undergraduates at a state university such as UP", "First degree only"],
    howToApply: "No separate application. It applies when you enroll.",
    applyMonths: [],
    windowNote: "Automatic",
    source: "https://unifast.gov.ph/",
  },
  {
    id: "ateneo-merit",
    needsApplication: false,
    government: false,
    name: "Ateneo Freshman Merit Scholarship",
    provider: "Ateneo de Manila University",
    universityId: "ateneo",
    kind: "Merit",
    covers: "Full tuition and fees, plus ₱50,000 a year",
    who: ["Top 50 ACET applicants from local high schools and senior high schools abroad"],
    howToApply: "No application. Ateneo picks recipients from ACET results.",
    applyMonths: [],
    windowNote: "From ACET results",
    source: "https://www.ateneo.edu/college/scholarships/programs",
  },
  {
    id: "ateneo-aid",
    needsApplication: true,
    government: false,
    name: "Ateneo Financial Aid Scholarship",
    provider: "Ateneo de Manila University",
    universityId: "ateneo",
    kind: "Need-based",
    covers: "Partial to full tuition, based on need",
    who: ["Incoming freshmen with documented financial need"],
    howToApply:
      "Send the Scholarship/Financial Aid Questionnaire once you have your Ateneo Application Number. Don't wait for admission results.",
    applyMonths: ["August", "September", "October"],
    source: "https://www.ateneo.edu/college/scholarships/programs",
  },
  {
    id: "dlsu-archer",
    needsApplication: false,
    government: false,
    name: "Archer Achiever Scholarship",
    provider: "De La Salle University",
    universityId: "dlsu",
    kind: "Merit",
    covers: "Tuition and fees",
    who: ["Top scorers on the DLSU College Admission Test"],
    howToApply: "No application. DLSU sends a letter to students who qualify.",
    applyMonths: [],
    windowNote: "By invitation",
    source: "https://www.dlsu.edu.ph/i-viewbook/scholarships.php",
  },
  {
    id: "dlsu-slsfag",
    needsApplication: true,
    government: false,
    name: "St. La Salle Financial Assistance Grant",
    provider: "De La Salle University",
    universityId: "dlsu",
    kind: "Need-based",
    covers: "25%, 50%, 75% or 100% of tuition and fees",
    who: ["Admitted freshmen with financial need", "One grantee per family"],
    howToApply: "Apply after admission results come out.",
    applyMonths: ["April", "May"],
    source: "https://www.dlsu.edu.ph/i-viewbook/scholarships.php",
  },
  {
    id: "ust-academic",
    needsApplication: true,
    government: false,
    name: "UST Academic Scholarships",
    provider: "University of Santo Tomas, Office for Student Affairs",
    universityId: "ust",
    kind: "Merit",
    covers: "Tuition discounts, depending on the scholarship",
    who: [
      "Freshmen with excellent grades and USTET results",
      "Separate award for high school valedictorians and salutatorians",
    ],
    howToApply:
      "After USTET results, submit the OSA form with your USTET result and a good moral certificate from your principal or guidance counselor.",
    applyMonths: [],
    windowNote: "Ask OSA for dates",
    source: "https://www.ust.edu.ph/office-for-student-affairs/",
  },
];
