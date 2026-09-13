
import { Learner, CourseType, FinancialStatus, CalendarEvent, CourseDefinition, CourseItem } from './types';

export const MOCK_LEARNERS: Learner[] = [
  {
    id: '1',
    firstName: 'Liam',
    lastName: 'Hunter',
    learnerNo: '000123456',
    assessor: 'Sarah Connor',
    addedBy: 'Sam Admin',
    enrollmentDate: '2023-09-16',
    learnerType: 'Flexi',
    region: 'South East',
    paymentPlan: 'Installment Plan',
    courseType: CourseType.FL,
    mainCourse: 'L3 PT',
    regAO: 'NCFE',
    iqaStatus: 'Passed',
    balance: 500,
    financialStatus: FinancialStatus.CLEAR,
    clearDate: '2023-11-01',
    email: 'liam.hunter@example.com',
    phone: '07700 900123',
    emergencyContactName: 'John Hunter',
    emergencyContactNumber: '07700 123456',
    address: '123 High Street',
    city: 'Birmingham',
    postcode: 'B1 1AA',
    country: 'United Kingdom',
    dob: '1995-05-15',
    gender: 'Male',
    supportEnabled: true,
    supportNotes: 'Requires 25% extra time on written exams due to dyslexia.',
    progressData: [
        {
            id: 'u1',
            name: 'L3 Anatomy & Physiology',
            status: 'Pass',
            completionDate: '2023-10-15',
            submissions: [
                { id: 'a1', name: 'Multiple Choice Exam', type: 'Exam', status: 'Passed', grade: '92%', dateCompleted: '2023-10-10' },
                { id: 'a2', name: 'Worksheet 1: Muscular System', type: 'Assignment', status: 'Passed', dateCompleted: '2023-10-12' }
            ]
        },
        {
            id: 'u2',
            name: 'L3 Nutrition',
            status: 'Pass',
            completionDate: '2023-10-20',
            submissions: [
                { id: 'a3', name: 'Food Diary Analysis', type: 'Assignment', status: 'Passed', dateCompleted: '2023-10-18' },
                { id: 'a4', name: 'Nutrition Case Study', type: 'Assignment', status: 'Passed', dateCompleted: '2023-10-20' }
            ]
        },
        {
            id: 'u3',
            name: 'L3 Programming',
            status: 'In Progress',
            submissions: [
                { id: 'a5', name: '12 Week Plan', type: 'Assignment', status: 'Pending' },
                { id: 'a6', name: 'Program Design Interview', type: 'Observation', status: 'Not Started' }
            ]
        }
    ]
  },
  {
    id: '2',
    firstName: 'Emma',
    lastName: 'Brooks',
    learnerNo: '000123457',
    assessor: 'Davos Seaworth',
    addedBy: 'Sam Admin',
    courseType: CourseType.SS,
    mainCourse: 'L2 Gym',
    enrollmentDate: '2023-10-01',
    regAO: 'YMCA',
    iqaStatus: 'Pending',
    balance: 0,
    financialStatus: FinancialStatus.ARREARS,
    arrearsMonths: 2,
    email: 'emma.brooks@example.com',
    phone: '07700 900456',
    address: '45 Station Rd',
    city: 'London',
    postcode: 'SW1 1AA',
    dob: '1998-11-20',
    gender: 'Female',
    progressData: [
        {
            id: 'u1',
            name: 'L2 Anatomy',
            status: 'Pass',
            completionDate: '2023-10-15',
            submissions: [
                { id: 'a1', name: 'Exam', type: 'Exam', status: 'Passed', grade: '85%' }
            ]
        }
    ]
  },
  {
    id: '3',
    firstName: 'Noah',
    lastName: 'Chen',
    learnerNo: '000123458',
    assessor: 'Elena Fisher',
    courseType: CourseType.FL,
    mainCourse: 'L3 Ex Referral',
    enrollmentDate: '2023-08-15',
    regAO: 'ActiveIQ',
    iqaStatus: 'Passed',
    balance: 1200,
    financialStatus: FinancialStatus.ON_HOLD,
    onHoldDate: '2023-10-01',
    resumeDate: '2024-01-01',
    onHoldBy: 'Sam Admin',
    onHoldNotes: 'Requested 3 month break due to work commitments abroad.',
    email: 'noah.chen@example.com',
    phone: '07700 900789',
    address: '89 Broad St',
    city: 'Manchester',
    postcode: 'M1 2AB',
    dob: '1990-03-10',
    gender: 'Male'
  },
  {
    id: '4',
    firstName: 'Olivia',
    lastName: 'Smith',
    learnerNo: '000123459',
    assessor: 'Sarah Connor',
    courseType: CourseType.FT,
    mainCourse: 'L4 Obesity',
    enrollmentDate: '2023-11-05',
    regAO: 'VTCT',
    iqaStatus: 'Referral',
    balance: 0,
    financialStatus: FinancialStatus.CLEAR,
    email: 'olivia.smith@example.com',
    phone: '07700 900111',
    address: '12 Leeds Rd',
    city: 'Leeds',
    postcode: 'LS1 4DD',
    dob: '1992-07-22',
    gender: 'Female'
  },
  {
    id: '5',
    firstName: 'James',
    lastName: 'Rodriguez',
    learnerNo: '000123460',
    assessor: 'Marcus Aurelius',
    courseType: CourseType.SS,
    mainCourse: 'L2 Gym',
    enrollmentDate: '2023-12-01',
    regAO: 'NCFE',
    iqaStatus: 'Pending',
    balance: 250,
    financialStatus: FinancialStatus.DEBT_COLLECTORS,
    debtCollectorSentDate: '2023-11-01',
    debtCollectorNotes: 'Case #4492. Final warning letter sent before handover.',
    email: 'j.rodriguez@example.com',
    phone: '07700 900999',
    address: '1 Boxing Way',
    city: 'London',
    postcode: 'E1 1AA',
    dob: '1985-06-30',
    gender: 'Male'
  }
];

export const LEARNER_GROUPS = [
    { id: 'g1', name: 'Level 3 PT, September', count: 12 },
    { id: 'g2', name: 'Level 2, Jim instructor', count: 8 },
    { id: 'g3', name: 'Level 2, Fast Track', count: 5 },
    { id: 'g4', name: 'Business Skills Workshop', count: 20 },
    { id: 'staff', name: 'Staff & Assessors', count: 10 },
];

export const MOCK_EVENTS: CalendarEvent[] = [
  { 
    id: '1', 
    title: 'Boxing CPD', 
    date: '2023-11-15', 
    startTime: '09:00',
    endTime: '16:00',
    type: 'CPD', 
    location: 'Birmingham',
    description: 'Advanced boxing techniques for PTs.',
    targetGroups: ['g1', 'g2'] 
  },
  { 
    id: '2', 
    title: 'Business Skills CPD', 
    date: '2023-11-18', 
    startTime: '10:00',
    endTime: '13:00',
    type: 'CPD', 
    location: 'London',
    description: 'Sales and retention strategies.',
    targetGroups: ['g4'] 
  },
  { 
    id: '3', 
    title: 'Kettlebells CPD', 
    date: '2023-11-20', 
    startTime: '09:00',
    endTime: '17:00',
    type: 'CPD', 
    location: 'Glasgow',
    description: 'Mastering the swing, snatch and clean.',
    targetGroups: ['g1'] 
  },
  { 
    id: '4', 
    title: 'L3 Submission Day', 
    date: '2023-11-25', 
    startTime: '09:00',
    endTime: '17:00',
    type: 'Submission', 
    location: 'Manchester',
    description: 'Practical submissions for L3 PT cohort.',
    targetGroups: ['g1'] 
  },
  { 
    id: '5', 
    title: 'Staff Meeting', 
    date: '2023-11-27', 
    startTime: '14:00',
    endTime: '15:30',
    type: 'Meeting', 
    location: 'Online (Zoom)',
    description: 'Monthly standardization meeting.',
    targetGroups: ['staff'] 
  },
];

export const AVAILABLE_ITEMS: CourseItem[] = [
  { id: 'gym', name: 'Gym', category: 'Level 2' },
  { id: 'pt', name: 'PT', category: 'Level 3' },
  { id: 'exref', name: 'Ex. Ref', category: 'Level 3' },
  { id: 'obesity', name: 'Obesity', category: 'Level 4' },
  { id: 'lbp', name: 'LBP', category: 'Level 4' },
  { id: 'sc', name: 'S&C', category: 'Level 4' },
  { id: 'kb', name: 'Kettlebells', category: 'Courses' },
  { id: 'st', name: 'Suspension', category: 'Courses' },
  { id: 'boxing', name: 'Boxing', category: 'Courses' },
  { id: 'circuit', name: 'Circuit', category: 'Courses' },
  { id: 'business', name: 'Business', category: 'Courses' },
];

export const COURSE_DEFINITIONS: CourseDefinition[] = [
  { id: '1', name: 'Platinum Flexi', items: ['gym', 'pt', 'kb', 'st'] },
  { id: '2', name: 'Master', items: ['gym', 'pt', 'exref', 'business', 'boxing', 'circuit'] },
  { id: '3', name: 'Gold', items: ['gym'] },
  { id: '4', name: 'Black Label', items: ['gym', 'pt', 'obesity', 'lbp', 'sc', 'boxing', 'business', 'kb', 'st'] },
];
