import * as XLSX from 'xlsx';
import { GuaranteeRecord, GuaranteeStatus, ExcelUploadParsedRow } from '../types';

/**
 * Normalizes any date value from Excel (number, Date, or string) to YYYY-MM-DD
 */
export function normalizeExcelDate(val: unknown): string {
  if (!val) return '';

  if (val instanceof Date) {
    return val.toISOString().split('T')[0];
  }

  // If number (Excel serial date)
  if (typeof val === 'number') {
    const parsed = XLSX.SSF.parse_date_code(val);
    if (parsed) {
      const y = parsed.y;
      const m = String(parsed.m).padStart(2, '0');
      const d = String(parsed.d).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }

  const str = String(val).trim();
  if (!str) return '';

  // Check if standard YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Try DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  // Try MM/DD/YYYY
  const parsedDate = new Date(str);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split('T')[0];
  }

  return str;
}

/**
 * Normalizes numeric currency values from strings like "$1,250,000.50" or " 1250000 "
 */
export function normalizeNumericValue(val: unknown): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]+/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Maps spreadsheet headers to the 17 target fields
 */
function getNormalizedHeaderKey(rawHeader: string): keyof GuaranteeRecord | null {
  const norm = rawHeader.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Tracker ref no
  if (norm.includes('trackerref') || norm === 'trackerno' || norm === 'tracker' || norm === 'trackref' || norm === 'trackrefno') {
    return 'trackerRefNo';
  }
  // 2. Receiving date
  if (norm.includes('receiv') || norm.includes('receiptdate')) {
    return 'receivingDate';
  }
  // 3. Company name
  if (norm.includes('company') || norm === 'client' || norm === 'employer') {
    return 'companyName';
  }
  // 4. Project number
  if ((norm.includes('project') && (norm.includes('num') || norm.includes('no') || norm.includes('code'))) || norm === 'projno') {
    return 'projectNumber';
  }
  // 5. Project name
  if (norm.includes('project') && (norm.includes('name') || norm.includes('title') || norm.includes('desc'))) {
    return 'projectName';
  }
  // 6. Contractor type
  if (norm.includes('contract') && (norm.includes('type') || norm.includes('cat') || norm.includes('kind'))) {
    return 'contractorType';
  }
  // 7. Contractor name
  if (norm.includes('contract') && (norm.includes('name') || norm.includes('vendor') || norm.includes('supplier'))) {
    return 'contractorName';
  }
  // 8. Currency
  if (norm === 'currency' || norm === 'curr' || norm === 'ccy') {
    return 'currency';
  }
  // 9. Guarantee type
  if (norm.includes('guarantee') && norm.includes('type') || norm === 'bgtype' || norm === 'bondtype') {
    return 'guaranteeType';
  }
  // 10. Issuing bank
  if (norm.includes('bank') || norm.includes('issuing') || norm === 'issuer') {
    return 'issuingBank';
  }
  // 11. Beneficiary
  if (norm.includes('beneficiary') || norm.includes('bene')) {
    return 'beneficiary';
  }
  // 12. Guarantee reference number
  if (norm.includes('guaranteeref') || norm.includes('bgref') || norm.includes('bgnumber') || norm.includes('guaranteenumber') || (norm.includes('guarantee') && norm.includes('num'))) {
    return 'guaranteeReferenceNumber';
  }
  // 13. Guarantee value
  if (norm.includes('guaranteeval') || norm.includes('bgval') || norm.includes('bgamount') || norm.includes('guaranteeamount') || norm === 'value' || norm === 'amount') {
    return 'guaranteeValue';
  }
  // 14. FD (From Date)
  if (norm === 'fd' || norm.includes('fromdate') || norm.includes('startdate') || norm.includes('issuedate') || norm.includes('effectivedate')) {
    return 'fd';
  }
  // 15. TD (To Date)
  if (norm === 'td' || norm.includes('todate') || norm.includes('expirydate') || norm.includes('validitydate') || norm.includes('maturitydate') || norm.includes('expdate')) {
    return 'td';
  }
  // 16. Guarantee status
  if (norm.includes('guaranteestatus') || norm === 'status' || norm === 'bgstatus') {
    return 'guaranteeStatus';
  }
  // 17. Custodia
  if (norm.includes('custod') || norm.includes('vault') || norm.includes('storage') || norm === 'location' || norm === 'physicallocation') {
    return 'custodia';
  }

  return null;
}

/**
 * Parses an uploaded Excel (.xlsx, .xls) or CSV ArrayBuffer/Binary
 */
export function parseExcelFile(dataBuffer: ArrayBuffer): {
  rows: ExcelUploadParsedRow[];
  headers: string[];
  matchedFields: string[];
} {
  const workbook = XLSX.read(dataBuffer, { type: 'array', cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('The workbook contains no sheets.');
  }

  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    raw: false,
    defval: '',
  });

  if (!jsonData || jsonData.length === 0) {
    return { rows: [], headers: [], matchedFields: [] };
  }

  const rawHeaders = Object.keys(jsonData[0] || {});
  const headerMapping: Record<string, keyof GuaranteeRecord | null> = {};
  const matchedFieldSet = new Set<string>();

  rawHeaders.forEach((h) => {
    const mapped = getNormalizedHeaderKey(h);
    headerMapping[h] = mapped;
    if (mapped) matchedFieldSet.add(mapped);
  });

  const parsedRows: ExcelUploadParsedRow[] = jsonData.map((row, index) => {
    const partial: Partial<GuaranteeRecord> = {
      id: `BG-${Date.now()}-${index + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    rawHeaders.forEach((h) => {
      const key = headerMapping[h];
      const val = row[h];
      if (!key) return;

      if (key === 'receivingDate' || key === 'fd' || key === 'td') {
        partial[key] = normalizeExcelDate(val);
      } else if (key === 'guaranteeValue') {
        partial[key] = normalizeNumericValue(val);
      } else if (key === 'guaranteeStatus') {
        const rawStatus = String(val || '').trim();
        const validStatuses: GuaranteeStatus[] = [
          'Active',
          'Expiring Soon',
          'Expired',
          'Released',
          'Claimed',
          'In Process',
          'Under Invocation',
        ];
        const match = validStatuses.find((s) => s.toLowerCase() === rawStatus.toLowerCase());
        partial.guaranteeStatus = match || 'Active';
      } else {
        (partial[key] as unknown) = String(val || '').trim();
      }
    });

    // Provide default tracker ref if missing
    if (!partial.trackerRefNo) {
      partial.trackerRefNo = `TRK-${new Date().getFullYear()}-${String(index + 1).padStart(4, '0')}`;
    }
    if (!partial.currency) partial.currency = 'USD';
    if (!partial.guaranteeStatus) partial.guaranteeStatus = 'Active';
    if (!partial.contractorType) partial.contractorType = 'Main Contractor';
    if (!partial.guaranteeType) partial.guaranteeType = 'Performance Bond (PB)';
    if (!partial.custodia) partial.custodia = 'Central Treasury Safe Vault A';

    const errors: string[] = [];
    if (!partial.projectNumber && !partial.projectName) {
      errors.push('Missing Project info');
    }
    if (!partial.contractorName) {
      errors.push('Missing Contractor name');
    }
    if (!partial.guaranteeReferenceNumber) {
      errors.push('Missing Guarantee Ref No');
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: partial,
      raw: row,
    };
  });

  return {
    rows: parsedRows,
    headers: rawHeaders,
    matchedFields: Array.from(matchedFieldSet),
  };
}

/**
 * Downloads a pre-formatted Excel template (.xlsx) with the 17 requested columns
 */
export function downloadExcelTemplate(): void {
  const sampleTemplateData = [
    {
      'Tracker ref no': 'TRK-2026-0001',
      'Receiveing date': '2026-03-15',
      'Company name': 'Apex Infrastructure Ltd',
      'Project number': 'PRJ-1048',
      'Project name': 'Harbor Terminal Expansion Ph 2',
      'Contracter type': 'Main Contractor',
      'Contractor name': 'Gulf Marine Dredging & Works LLC',
      'currency': 'USD',
      'Guarantee type': 'Performance Bond (PB)',
      'issuing bank': 'HSBC Bank Middle East',
      'beneficiary': 'Apex Infrastructure Ltd',
      'guarantee reference number': 'HSBC-PB-99201',
      'guarantee value': 2500000,
      'FD': '2026-03-10',
      'TD': '2027-03-09',
      'Guarantee status': 'Active',
      'Custodia': 'Central Treasury Safe Vault A',
    },
    {
      'Tracker ref no': 'TRK-2026-0002',
      'Receiveing date': '2026-04-02',
      'Company name': 'Vertex Energy & Petrochem Co',
      'Project number': 'PRJ-2055',
      'Project name': 'Solar Desalination Plant',
      'Contracter type': 'EPC Contractor',
      'Contractor name': 'Solaria Energy Systems Inc',
      'currency': 'EUR',
      'Guarantee type': 'Advance Payment Guarantee (APG)',
      'issuing bank': 'BNP Paribas',
      'beneficiary': 'Vertex Energy & Petrochem Co',
      'guarantee reference number': 'BNP-APG-44810',
      'guarantee value': 1800000,
      'FD': '2026-04-01',
      'TD': '2026-10-01',
      'Guarantee status': 'Active',
      'Custodian': 'Finance Custody Locker #12',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleTemplateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Guarantee Tracker Template');
  XLSX.writeFile(wb, 'Guarantee_Tracker_Portal_Template.xlsx');
}

/**
 * Exports current records into an Excel file (.xlsx) with all 17 columns
 */
export function exportRecordsToExcel(records: GuaranteeRecord[], fileName = 'Guarantee_Register_Export.xlsx'): void {
  const exportData = records.map((r) => ({
    'Tracker ref no': r.trackerRefNo,
    'Receiveing date': r.receivingDate,
    'Company name': r.companyName,
    'Project number': r.projectNumber,
    'Project name': r.projectName,
    'Contracter type': r.contractorType,
    'Contractor name': r.contractorName,
    'currency': r.currency,
    'Guarantee type': r.guaranteeType,
    'issuing bank': r.issuingBank,
    'beneficiary': r.beneficiary,
    'guarantee reference number': r.guaranteeReferenceNumber,
    'guarantee value': r.guaranteeValue,
    'FD': r.fd,
    'TD': r.td,
    'Guarantee status': r.guaranteeStatus,
    'Custodian': r.custodia,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Guarantee Records');
  XLSX.writeFile(wb, fileName);
}

/**
 * Exports current records into a CSV file
 */
export function exportRecordsToCSV(records: GuaranteeRecord[], fileName = 'Guarantee_Register_Export.csv'): void {
  const exportData = records.map((r) => ({
    'Tracker ref no': r.trackerRefNo,
    'Receiveing date': r.receivingDate,
    'Company name': r.companyName,
    'Project number': r.projectNumber,
    'Project name': r.projectName,
    'Contracter type': r.contractorType,
    'Contractor name': r.contractorName,
    'currency': r.currency,
    'Guarantee type': r.guaranteeType,
    'issuing bank': r.issuingBank,
    'beneficiary': r.beneficiary,
    'guarantee reference number': r.guaranteeReferenceNumber,
    'guarantee value': r.guaranteeValue,
    'FD': r.fd,
    'TD': r.td,
    'Guarantee status': r.guaranteeStatus,
    'Custodian': r.custodia,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
