
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN', // Overall authority
  ADMIN = 'ADMIN',             // Standard administrator
  MODERATOR = 'MODERATOR',     // Quality Assurance / IQA
  LEARNER = 'LEARNER',
  ASSESSOR = 'ASSESSOR',
  CREATOR = 'CREATOR'          // Content creator
}

export enum CourseType {
  FL = 'FL', // Flexi Learning
  SS = 'SS', // Super Series
  FT = 'FT'  // Fast Track
}

export enum FinancialStatus {
  CLEAR = 'CLEAR',
  ARREARS = 'ARREARS',
  ON_HOLD = 'ON_HOLD',
  DEBT_COLLECTORS = 'DEBT_COLLECTORS',
  SUSPENDED = 'SUSPENDED'
}

export interface LearnerSubmission {
  id: string;
  name: string; // e.g. "Case Study", "Exam"
  type: 'Exam' | 'Assignment' | 'Observation' | 'Portfolio';
  status: 'Passed' | 'Referral' | 'Pending' | 'Not Started';
  grade?: string;
  dateCompleted?: string;
}

export interface LearnerUnit {
  id: string;
  name: string; // e.g. "L3 Nutrition"
  status: 'Pass' | 'In Progress' | 'Not Started';
  completionDate?: string;
  submissions: LearnerSubmission[];
}

export interface Learner {
  id: string;
  // Personal
  firstName: string;
  middleName?: string;
  lastName: string;
  dob?: string;
  gender?: string;
  email: string;
  phone: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  
  // Location
  address?: string;
  city?: string;
  postcode?: string;
  country?: string;

  // Academic / Enrollment
  learnerNo: string; // Candidate Number
  assessor: string;
  assessorEmail?: string;
  addedBy?: string; // Who enrolled them
  enrollmentDate?: string;
  courseType: CourseType;
  learnerType?: string; // Full time, flexi etc
  region?: string;
  mainCourse: string; // e.g., L3 PT
  regAO: string; // NCFE, YMCA, etc.
  
  // Support
  supportEnabled?: boolean;
  supportNotes?: string;
  
  // Status
  iqaStatus: 'Pending' | 'Passed' | 'Referral';
  balance: number;
  paymentPlan?: string;
  financialStatus: FinancialStatus;
  
  // Financial Details
  arrearsMonths?: number;
  
  // Clear Details
  clearDate?: string;

  // On Hold Details
  onHoldDate?: string;
  resumeDate?: string;
  onHoldBy?: string;
  onHoldNotes?: string;

  // Debt Collector Details
  debtCollectorSentDate?: string; // Communication sent to learner
  debtCollectorClearDate?: string;
  debtCollectorNotes?: string;
  
  // Progress Data
  progressData?: LearnerUnit[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  description: string;
  type: 'CPD' | 'Submission' | 'Meeting' | 'Class' | 'Workshop';
  location: string;
  targetGroups: string[]; // IDs of groups or 'all'
}

export interface CourseItem {
  id: string;
  name: string;
  category: 'Level 2' | 'Level 3' | 'Level 4' | 'Courses';
}

export interface CourseDefinition {
  id: string;
  name: string;
  items: string[]; // Array of CourseItem IDs included in this package
}
