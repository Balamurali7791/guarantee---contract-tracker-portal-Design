export type GuaranteeStatus =
  | 'Active'
  | 'Expiring Soon'
  | 'Expired'
  | 'Claimed'
  | 'Released'
  | 'In Process'
  | 'Under Invocation';

export interface GuaranteeRecord {
  id: string;
  // Field 1: Tracker ref no
  trackerRefNo: string;
  // Field 2: Receiving date - calendar field
  receivingDate: string;
  // Field 3: Company name - Drop down field
  companyName: string;
  // Field 4: Project number
  projectNumber: string;
  // Field 5: Project name
  projectName: string;
  // Field 6: Contractor type
  contractorType: string;
  // Field 7: Contractor name
  contractorName: string;
  // Field 8: Currency
  currency: string;
  // Field 9: Guarantee type
  guaranteeType: string;
  // Field 10: Issuing bank
  issuingBank: string;
  // Field 11: Beneficiary
  beneficiary: string;
  // Field 12: Guarantee reference number
  guaranteeReferenceNumber: string;
  // Field 13: Guarantee value
  guaranteeValue: number;
  // Field 14: FD (From Date / Effective Date)
  fd: string;
  // Field 15: TD (To Date / Expiry Date)
  td: string;
  // Field 16: Guarantee status
  guaranteeStatus: GuaranteeStatus;
  // Field 17: Custodia (Physical Custody Location / Department)
  custodia: string;
  // Attachment
  attachmentName?: string;
  attachmentSize?: string;
  attachmentType?: string;
  attachmentData?: string;
  // Metadata
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_COMPANIES: string[] = [
  'Apex Infrastructure Ltd',
  'Gulf Horizon Contracting LLC',
  'Vertex Energy & Petrochem Co',
  'Metroline Rail & Transit Group',
  'Oasis Marine & Port Operations',
  'Atlas Power Generation Corp',
  'Pinnacle Civil Engineering Ltd',
  'Delta Tech Facilities Management',
];

export const CONTRACTOR_TYPES: string[] = [
  'Main Contractor',
  'Subcontractor',
  'EPC Contractor',
  'Joint Venture (JV) Partner',
  'Equipment / Material Supplier',
  'Specialist Consultant',
  'Service Provider',
];

export const GUARANTEE_TYPES: string[] = [
  'Performance Bond (PB)',
  'Advance Payment Guarantee (APG)',
  'Bid Bond / Tender Guarantee (BB)',
  'Retention Money Guarantee (RMG)',
  'Maintenance / Warranty Bond',
  'Financial Guarantee',
  'Customs & Clearance Guarantee',
  'Letter of Credit Guarantee (LCG)',
];

export const CURRENCIES: string[] = [
  'USD',
  'EUR',
  'GBP',
  'AED',
  'SAR',
  'QAR',
  'INR',
  'SGD',
  'CAD',
  'AUD',
  'KWD',
  'BHD',
  'OMR',
  'JPY',
  'CHF',
];

export const GUARANTEE_STATUSES: GuaranteeStatus[] = [
  'Active',
  'Expiring Soon',
  'Expired',
  'Released',
  'Claimed',
  'In Process',
  'Under Invocation',
];

export const DEFAULT_CUSTODIA_LOCATIONS: string[] = [
  'Central Treasury Safe Vault A',
  'Central Treasury Safe Vault B',
  'Finance Custody Locker #12',
  'Commercial Contracts Archive - Room 4',
  'HQ Document Control Safe',
  'Bank Custody - Escrow Locker',
  'Project Site Commercial Vault',
  'Legal Department Safe Deposit',
];

export const COMMON_BANKS: string[] = [
  'HSBC Bank Middle East',
  'Standard Chartered Bank',
  'Citibank N.A.',
  'First Abu Dhabi Bank (FAB)',
  'Emirates NBD',
  'BNP Paribas',
  'Barclays Corporate Banking',
  'JPMorgan Chase Bank',
  'Deutsche Bank AG',
  'Qatar National Bank (QNB)',
  'Saudi National Bank (SNB)',
  'State Bank of India',
  'Arab Bank PLC',
  'Mashreq Bank',
  'Abu Dhabi Commercial Bank (ADCB)',
];

export interface ExcelUploadParsedRow {
  isValid: boolean;
  errors: string[];
  data: Partial<GuaranteeRecord>;
  raw: Record<string, unknown>;
}
