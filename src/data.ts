export type Program = {
  id: string;
  name: string;
  summary: string;
};

/**
 * Where a requirement lives:
 * - "shared": one document that every university accepts, ticked once for all
 * - "school": something the applicant's high school has to prepare
 * - "university": asked for by this university only
 */
export type RequirementScope = "shared" | "school" | "university";

export type Requirement = {
  id: string;
  label: string;
  scope: RequirementScope;
};

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type Month = (typeof MONTHS)[number];

export type University = {
  id: string;
  shortName: string;
  name: string;
  test: string;
  applicationPeriod: Month;
  examDates: Month;
  releaseOfResults: Month;
  /** Where the application "parcel" lands: the campus admissions office. */
  hub: string;
  intro: string;
  feeNote: string;
  rankingNote?: string;
  programs: Program[];
  initialProgramId: string | null;
  requirements: Requirement[];
  /** University- and school-scoped requirements already done at the start of the demo. */
  initialDone: string[];
};

export const applicant = {
  name: "Jordan Santos",
  level: "Grade 12",
  school: "Philippine High School",
  gradeAverage: 94,
};

export const sharedRequirements: Requirement[] = [
  { id: "psa", label: "PSA birth certificate", scope: "shared" },
  { id: "photo", label: "ID photo (2×2 or passport size, white background)", scope: "shared" },
  { id: "school-id", label: "Grade 12 school ID", scope: "shared" },
  { id: "lrn", label: "Learner reference number (LRN)", scope: "shared" },
];

export const initialSharedDone = ["psa", "photo", "school-id", "lrn"];

type Extra = { id: string; label: string };

function requirements(
  recordLabel: string,
  extras: Extra[] = [],
  options: { photo?: Extra } = {},
): Requirement[] {
  const shared = options.photo
    ? sharedRequirements.map((item) =>
        item.id === "photo" ? { ...options.photo!, scope: "university" as const } : item,
      )
    : sharedRequirements;
  return [
    ...shared,
    { id: "record", label: recordLabel, scope: "school" },
    ...extras.map((item) => ({ ...item, scope: "university" as const })),
  ];
}

export const universities: University[] = [
  {
    id: "up",
    shortName: "UP",
    name: "University of the Philippines",
    test: "UPCAT",
    applicationPeriod: "March",
    examDates: "August",
    releaseOfResults: "April",
    hub: "Diliman Hub (UP Office of Admissions)",
    intro:
      "The national university. This page shows freshman admission through the UPCAT, with degree programs from UP Diliman.",
    feeNote: "Filipino applicants pay no UPCAT fee.",
    rankingNote:
      "The UPCAT asks for two campuses and up to four programs per campus. This demo tracks one program at UP Diliman.",
    initialProgramId: "cs",
    initialDone: [],
    programs: [
      {
        id: "cs",
        name: "BS Computer Science",
        summary:
          "A computing degree from UP Diliman covering software, theory, and mathematics.",
      },
      {
        id: "bio",
        name: "BS Biology",
        summary:
          "A science degree centered on living systems, with laboratory work across biology.",
      },
      {
        id: "ba",
        name: "BS Business Administration",
        summary:
          "A management degree covering the main functions of a business organization.",
      },
      {
        id: "journalism",
        name: "BA Journalism",
        summary:
          "A liberal arts degree focused on reporting, writing, and the news media.",
      },
    ],
    requirements: requirements(
      "UP Form 2, the school record of final grades from Grades 8–11, encoded by the registrar",
      [{ id: "form-1", label: "UP Form 1, the personal application form" }],
    ),
  },
  {
    id: "ateneo",
    shortName: "Ateneo",
    name: "Ateneo de Manila University",
    test: "ACET",
    applicationPeriod: "July",
    examDates: "October",
    releaseOfResults: "April",
    hub: "Katipunan Hub (Ateneo Office of Admission and Aid)",
    intro:
      "Ateneo de Manila in Quezon City. Freshman applicants take the Ateneo College Entrance Test.",
    feeNote:
      "The application fee is about ₱600–₱1,000, and is sometimes waived.",
    initialProgramId: "me",
    initialDone: [],
    programs: [
      {
        id: "me",
        name: "BS Management Engineering",
        summary:
          "A quantitative management degree. Admission is limited to applicants who score high on the ACET.",
      },
      {
        id: "cs",
        name: "BS Computer Science",
        summary:
          "A computing degree covering software systems, theory, and how computers are designed.",
      },
      {
        id: "bio",
        name: "BS Biology",
        summary:
          "A biology program that prepares students for research or further study, including medicine.",
      },
      {
        id: "mis",
        name: "BS Management Information Systems",
        summary:
          "A joint management and computing degree on using technology for business decisions.",
      },
    ],
    requirements: requirements(
      "High school record of final grades from Grades 9–11",
      [
        { id: "essay", label: "Personal essay drafted" },
        { id: "recommenders", label: "Two recommenders named" },
      ],
    ),
  },
  {
    id: "dlsu",
    shortName: "DLSU",
    name: "De La Salle University Manila",
    test: "DCAT",
    applicationPeriod: "October",
    examDates: "January",
    releaseOfResults: "April",
    hub: "Taft Hub (DLSU Office of Admissions)",
    intro:
      "De La Salle University on Taft Avenue, Manila. Freshman applicants take the DLSU College Admission Test.",
    feeNote:
      "The application fee is about ₱600–₱1,000, and is sometimes waived.",
    initialProgramId: "accountancy",
    initialDone: ["record", "consent"],
    programs: [
      {
        id: "cs",
        name: "BS Computer Science (Software Technology)",
        summary: "A computing degree specialized in building software.",
      },
      {
        id: "accountancy",
        name: "BS Accountancy",
        summary:
          "A professional accountancy degree on the path toward the CPA licensure exam.",
      },
      {
        id: "bio",
        name: "BS Biology",
        summary:
          "A biology degree from the College of Science, including a medical biology track.",
      },
      {
        id: "comm",
        name: "AB Communication Arts",
        summary:
          "A liberal arts degree in communication, media, and written expression.",
      },
    ],
    requirements: requirements(
      "DLSU secondary scholastic record and Grade 11 Form 138, signed by the registrar",
      [
        {
          id: "consent",
          label: "Parent or guardian consent (applicants under 18)",
        },
      ],
    ),
  },
  {
    id: "ust",
    shortName: "UST",
    name: "University of Santo Tomas",
    test: "USTET",
    applicationPeriod: "September",
    examDates: "November",
    releaseOfResults: "April",
    hub: "España Hub (UST Office for Admissions)",
    intro:
      "The University of Santo Tomas on España Boulevard, Manila. Freshman applicants take the UST Entrance Test.",
    feeNote:
      "The application fee is about ₱600–₱1,000, and is sometimes waived.",
    initialProgramId: null,
    initialDone: [],
    programs: [
      {
        id: "pharmacy",
        name: "BS Pharmacy",
        summary: "A four-year pharmacy degree from the Faculty of Pharmacy.",
      },
      {
        id: "medtech",
        name: "BS Medical Technology",
        summary:
          "A four-year laboratory medicine degree from the Faculty of Pharmacy.",
      },
      {
        id: "accountancy",
        name: "BS Accountancy",
        summary:
          "A four-year accountancy degree from the Alfredo M. Velayo College of Accountancy.",
      },
      {
        id: "comm",
        name: "BA Communication",
        summary:
          "A communication degree from the Faculty of Arts and Letters, covering media and research.",
      },
    ],
    requirements: requirements(
      "USTET grades form for Grades 9–11, signed by the principal or registrar",
      [],
      {
        photo: {
          id: "photo-nameplate",
          label: "ID photo (2×2 or passport size, with a nameplate tag)",
        },
      },
    ),
  },
];

export function findUniversity(id: string): University | undefined {
  return universities.find((university) => university.id === id);
}

export function programName(university: University, programId: string | null): string | null {
  return university.programs.find((item) => item.id === programId)?.name ?? null;
}
