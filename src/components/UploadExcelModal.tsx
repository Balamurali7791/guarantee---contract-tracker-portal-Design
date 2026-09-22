import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  FileText
} from 'lucide-react';
import { parseExcelFile, downloadExcelTemplate } from '../utils/excelParser';
import { GuaranteeRecord, ExcelUploadParsedRow } from '../types';
import { formatCurrencyValue } from '../utils/dateUtils';

interface UploadExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (importedRecords: GuaranteeRecord[], mode: 'append' | 'replace') => void;
}

const REQUIRED_FIELDS_LIST = [
  { key: 'trackerRefNo', label: 'Tracker ref no' },
  { key: 'receivingDate', label: 'Receiveing date (calendar)' },
  { key: 'companyName', label: 'Company name (dropdown)' },
  { key: 'projectNumber', label: 'Project number' },
  { key: 'projectName', label: 'Project name' },
  { key: 'contractorType', label: 'Contracter type' },
  { key: 'contractorName', label: 'Contractor name' },
  { key: 'currency', label: 'Currency' },
  { key: 'guaranteeType', label: 'Guarantee type' },
  { key: 'issuingBank', label: 'Issuing bank' },
  { key: 'beneficiary', label: 'Beneficiary' },
  { key: 'guaranteeReferenceNumber', label: 'Guarantee ref number' },
  { key: 'guaranteeValue', label: 'Guarantee value' },
  { key: 'fd', label: 'FD (From Date)' },
  { key: 'td', label: 'TD (To Date)' },
  { key: 'guaranteeStatus', label: 'Guarantee status' },
  { key: 'custodia', label: 'Custodian' },
];

export const UploadExcelModal: React.FC<UploadExcelModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<ExcelUploadParsedRow[]>([]);
  const [matchedFields, setMatchedFields] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setErrorMsg('');
    setIsProcessing(true);
    try {
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + ' KB');

      const buffer = await file.arrayBuffer();
      const result = parseExcelFile(buffer);

      if (result.rows.length === 0) {
        setErrorMsg('The uploaded spreadsheet contains no data rows.');
        setParsedRows([]);
        setMatchedFields([]);
      } else {
        setParsedRows(result.rows);
        setMatchedFields(result.matchedFields);
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(
        err instanceof Error ? err.message : 'Failed to parse Excel file. Please ensure it is a valid .xlsx or .csv.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleCommitImport = () => {
    if (parsedRows.length === 0) return;
    const recordsToImport: GuaranteeRecord[] = parsedRows.map((r, idx) => ({
      id: r.data.id || `BG-IMP-${Date.now()}-${idx + 1}`,
      trackerRefNo: r.data.trackerRefNo || `TRK-${new Date().getFullYear()}-${String(idx + 1).padStart(4, '0')}`,
      receivingDate: r.data.receivingDate || new Date().toISOString().split('T')[0],
      companyName: r.data.companyName || 'General Enterprise',
      projectNumber: r.data.projectNumber || 'PRJ-TBD',
      projectName: r.data.projectName || 'Project Untitled',
      contractorType: r.data.contractorType || 'Main Contractor',
      contractorName: r.data.contractorName || 'Contractor Unspecified',
      currency: r.data.currency || 'USD',
      guaranteeType: r.data.guaranteeType || 'Performance Bond (PB)',
      issuingBank: r.data.issuingBank || 'Bank Unspecified',
      beneficiary: r.data.beneficiary || r.data.companyName || 'Company Beneficiary',
      guaranteeReferenceNumber: r.data.guaranteeReferenceNumber || `REF-${Date.now()}`,
      guaranteeValue: Number(r.data.guaranteeValue) || 0,
      fd: r.data.fd || new Date().toISOString().split('T')[0],
      td: r.data.td || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      guaranteeStatus: r.data.guaranteeStatus || 'Active',
      custodia: r.data.custodia || 'Central Treasury Safe Vault A',
      notes: r.data.notes || `Imported via Excel on ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    onImportComplete(recordsToImport, importMode);
    onClose();
  };

  const validRowsCount = parsedRows.filter((r) => r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="modal-upload-excel"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#162a42] flex items-center justify-between bg-[#0b1b2d] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0f243d] text-white border border-[#1e395c] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-[#dfb275]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-classic text-base sm:text-lg font-bold text-white tracking-wide">
                  Upload Guarantee &amp; Contract Data from Excel
                </h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Transition your spreadsheet data directly into the official tracker portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* File Upload Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-amber-500 bg-amber-50/70'
                : 'border-slate-300 hover:border-amber-500 bg-slate-50/50 hover:bg-amber-50/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-900 text-base">
                Drag and drop your Excel spreadsheet here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports <span className="font-semibold text-slate-800">.xlsx, .xls, or .csv</span> files
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-md shadow-2xs">
                  Browse Files
                </span>
                <span className="text-xs text-slate-400">or</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadExcelTemplate();
                  }}
                  className="inline-flex items-center text-xs font-semibold text-amber-800 hover:text-amber-950 underline"
                >
                  <Download className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  Download sample template (.xlsx)
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Processing Spinner */}
          {isProcessing && (
            <div className="p-4 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Parsing spreadsheet records and mapping columns...</span>
            </div>
          )}

          {/* Parsed Results Overview */}
          {parsedRows.length > 0 && !isProcessing && (
            <div className="space-y-4">
              {/* File Info Bar */}
              <div className="flex flex-wrap items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <span className="font-semibold text-slate-900 text-xs block">{fileName}</span>
                    <span className="text-2xs text-slate-500">{fileSize} &bull; {parsedRows.length} total rows detected</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {validRowsCount} valid rows ready
                  </span>
                  {parsedRows.length - validRowsCount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium bg-amber-100 text-amber-800">
                      {parsedRows.length - validRowsCount} with auto-defaults
                    </span>
                  )}
                </div>
              </div>

              {/* Matched Fields Inspection Pill Matrix */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Detected Columns Mapping ({matchedFields.length} / 17 Fields)
                  </span>
                  <span className="text-2xs text-slate-500">
                    Matched automatically based on column names
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 p-3 bg-slate-50/70 border border-slate-200 rounded-lg max-h-36 overflow-y-auto">
                  {REQUIRED_FIELDS_LIST.map((field) => {
                    const isMatched = matchedFields.includes(field.key);
                    return (
                      <div
                        key={field.key}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-2xs font-medium ${
                          isMatched
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {isMatched ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="w-3 h-3 rounded-full bg-slate-300 shrink-0" />
                        )}
                        <span className="truncate">{field.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Data Preview Table */}
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Data Preview (Showing first {Math.min(5, parsedRows.length)} rows)
                </span>
                <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-56 shadow-xs">
                  <table className="min-w-[1100px] w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-[#0b1528] text-amber-200 sticky top-0 border-b border-amber-500/20">
                      <tr>
                        <th className="w-32 min-w-[120px] px-3 py-2 text-left font-semibold">Tracker Ref</th>
                        <th className="w-28 min-w-[100px] px-3 py-2 text-left font-semibold">Recv Date</th>
                        <th className="w-40 min-w-[140px] px-3 py-2 text-left font-semibold">Company</th>
                        <th className="w-44 min-w-[150px] px-3 py-2 text-left font-semibold">Project</th>
                        <th className="w-40 min-w-[140px] px-3 py-2 text-left font-semibold">Contractor</th>
                        <th className="w-52 min-w-[180px] px-3 py-2 text-left font-semibold">Type</th>
                        <th className="w-36 min-w-[120px] px-3 py-2 text-right font-semibold">Value</th>
                        <th className="w-40 min-w-[140px] px-3 py-2 text-left font-semibold">FD &rarr; TD</th>
                        <th className="w-40 min-w-[130px] px-3 py-2 text-left font-semibold">Custodia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {parsedRows.slice(0, 5).map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="w-32 min-w-[120px] px-3 py-2 font-mono font-medium text-slate-900 whitespace-nowrap">{row.data.trackerRefNo || 'Auto'}</td>
                          <td className="w-28 min-w-[100px] px-3 py-2 text-slate-600 whitespace-nowrap">{row.data.receivingDate || '—'}</td>
                          <td className="w-40 min-w-[140px] px-3 py-2 whitespace-nowrap">
                            <div className="truncate max-w-[135px] text-slate-800 font-medium" title={row.data.companyName}>
                              {row.data.companyName || '—'}
                            </div>
                          </td>
                          <td className="w-44 min-w-[150px] px-3 py-2 whitespace-nowrap">
                            <div className="truncate max-w-[145px] text-slate-600" title={row.data.projectName || row.data.projectNumber}>
                              {row.data.projectName || row.data.projectNumber || '—'}
                            </div>
                          </td>
                          <td className="w-40 min-w-[140px] px-3 py-2 whitespace-nowrap">
                            <div className="truncate max-w-[135px] text-slate-600" title={row.data.contractorName}>
                              {row.data.contractorName || '—'}
                            </div>
                          </td>
                          <td className="w-52 min-w-[180px] px-3 py-2 whitespace-nowrap">
                            <div className="truncate max-w-[175px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium inline-block" title={row.data.guaranteeType}>
                              {row.data.guaranteeType || '—'}
                            </div>
                          </td>
                          <td className="w-36 min-w-[120px] px-3 py-2 text-right font-mono font-medium text-slate-900 whitespace-nowrap">
                            {row.data.currency} {formatCurrencyValue(row.data.guaranteeValue || 0)}
                          </td>
                          <td className="w-40 min-w-[140px] px-3 py-2 text-slate-600 text-[11px] whitespace-nowrap">
                            {row.data.fd} to {row.data.td}
                          </td>
                          <td className="w-40 min-w-[130px] px-3 py-2 whitespace-nowrap">
                            <div className="truncate max-w-[125px] text-slate-600" title={row.data.custodia}>
                              {row.data.custodia || '—'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Import Mode Selection */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-700 block mb-2">Import Strategy:</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span><strong>Append</strong> ({parsedRows.length} new records added to current register)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-rose-700"><strong>Replace all</strong> (Clears current records and loads this file)</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={parsedRows.length === 0 || isProcessing}
            onClick={handleCommitImport}
            className={`px-5 py-2 text-xs font-bold rounded-full transition-all shadow-xs ${
              parsedRows.length === 0 || isProcessing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'bg-[#dfb275] hover:bg-[#d4a566] text-[#1e293b] active:bg-[#c99855] border border-[#f3d39f]'
            }`}
          >
            Import {parsedRows.length > 0 ? `${parsedRows.length} Records` : 'File'}
          </button>
        </div>
      </div>
    </div>
  );
};
