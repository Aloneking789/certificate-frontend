export interface Certificate {
  id: string;
  registrationNumber: string;
  studentName: string;
  fatherName: string;
  courseName: string;
  collegeName: string;
  branch: string;
  semester: string;
  internshipDomain: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  performance: 'Excellent' | 'Very Good' | 'Good' | 'Average';
  issueDate: string;
  authorizedSignatory: string;
  status: 'valid' | 'invalid';
}

const certificates: Certificate[] = [
  {
    id: '1',
    registrationNumber: 'EUNOUS-REG-2026-0001',
    studentName: 'Aarav Sharma',
    fatherName: 'Rajesh Sharma',
    courseName: 'B.Tech',
    collegeName: 'IIT Delhi',
    branch: 'Computer Science',
    semester: '7th',
    internshipDomain: 'Software Development',
    startDate: '2026-01-15',
    endDate: '2026-03-15',
    totalHours: 320,
    performance: 'Excellent',
    issueDate: '2026-03-20',
    authorizedSignatory: 'Director, Eunous IT',
    status: 'valid'
  },
  {
    id: '2',
    registrationNumber: 'EUNOUS-REG-2026-0002',
    studentName: 'Priya Verma',
    fatherName: 'Amit Verma',
    courseName: 'MCA',
    collegeName: 'NIT Trichy',
    branch: 'Information Technology',
    semester: '4th',
    internshipDomain: 'Data Science',
    startDate: '2026-02-01',
    endDate: '2026-04-01',
    totalHours: 240,
    performance: 'Very Good',
    issueDate: '2026-04-05',
    authorizedSignatory: 'Director, Eunous IT',
    status: 'valid'
  }
];

export const getCertificateByReg = (reg: string) => {
  return certificates.find(c => c.registrationNumber.toUpperCase() === reg.toUpperCase());
};

export const getAllCertificates = () => {
  return certificates;
};

export const createCertificate = (data: Partial<Certificate>) => {
  const newCert = {
    ...data,
    id: String(certificates.length + 1),
    issueDate: new Date().toISOString().split('T')[0],
    status: 'valid'
  } as Certificate;
  certificates.push(newCert);
  return newCert;
};
