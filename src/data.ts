export type Program = {
  id: string;
  name: string;
  summary: string;
};

export type Requirement = {
  id: string;
  label: string;
};

export type University = {
  id: string;
  shortName: string;
  name: string;
  test: string;
  applicationPeriod: string;
  examDates: string;
  releaseOfResults: string;
  intro: string;
  feeNote: string;
  rankingNote?: string;
  programs: Program[];
  chosenProgramId: string | null;
  requirements: Requirement[];
  initialDone: string[];
};

export const applicant = {
  name: "Jordan Santos",
  level: "Grade 12",
  school: "Philippine High School",
  gradeAverage: 94,
};

const sharedDone = ["psa", "photo", "school-id", "lrn"];

function requirements(
  recordLabel: string,
  extras: Requirement[] = [],
  photoLabel = "ID photo (2×2 or passport size, white background)",
): Requirement[] {
  return [
    { id: "psa", label: "PSA birth certificate" },
    { id: "photo", label: photoLabel },
    { id: "school-id", label: "Grade 12 school ID" },
    { id: "lrn", label: "Learner reference number (LRN)" },
    { id: "record", label: recordLabel },
    ...extras,
  ];
}

export const universities: University[] = [
  {
    id: "up",
    shortName: "UP",
    name: "University of the Philippines",
    test: "UPCAT",
    applicationPeriod: "Mar–Apr",
    examDates: "Aug",
    releaseOfResults: "Apr–May",
    intro:
      "The national university. This page shows freshman admission through the UPCAT, with degree programs from UP Diliman.",
    feeNote: "Filipino applicants pay no UPCAT fee.",
    rankingNote:
      "The UPCAT asks for two campuses and up to four programs per campus. This application lists one: BS Computer Science at UP Diliman.",
    chosenProgramId: "cs",
    initialDone: sharedDone,
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
    applicationPeriod: "Jun–Sep",
    examDates: "Oct–Nov",
    releaseOfResults: "Apr–May",
    intro:
      "Ateneo de Manila in Quezon City. Freshman applicants take the Ateneo College Entrance Test.",
    feeNote:
      "The application fee is about ₱600–₱1,000, and is sometimes waived.",
    chosenProgramId: "me",
    initialDone: sharedDone,
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
    applicationPeriod: "Sep–Dec",
    examDates: "Jan–Feb",
    releaseOfResults: "Mar–Apr",
    intro:
      "De La Salle University on Taft Avenue, Manila. Freshman applicants take the DLSU College Admission Test.",
    feeNote:
      "The application fee is about ₱600–₱1,000, and is sometimes waived.",
    chosenProgramId: "accountancy",
    initialDone: ["psa", "photo", "school-id", "lrn", "record", "consent"],
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
    applicationPeriod: "Jul–Nov",
    examDates: "Oct–Jan",
    releaseOfResults: "Apr",
    intro:
      "The University of Santo Tomas on España Boulevard, Manila. Freshman applicants take the UST Entrance Test.",
    feeNote:
      "The application fee is about ₱600–₱1,000, and is sometimes waived.",
    chosenProgramId: null,
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
      "ID photo (2×2 or passport size, with a nameplate tag)",
    ),
  },
];

export function findUniversity(id: string): University | undefined {
  return universities.find((university) => university.id === id);
}

export function chosenProgramName(university: University): string {
  const program = university.programs.find(
    (item) => item.id === university.chosenProgramId,
  );
  return program?.name ?? "No program yet";
}
