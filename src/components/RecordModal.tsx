import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  Calendar,
  Paperclip,
  Upload,
  FileText,
  Trash2,
  FileSpreadsheet,
  Building2,
  Briefcase,
  Landmark,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { 
  GuaranteeRecord, 
  GuaranteeStatus, 
  DEFAULT_COMPANIES, 
  CONTRACTOR_TYPES, 
  GUARANTEE_TYPES, 
  CURRENCIES, 
  GUARANTEE_STATUSES, 
  DEFAULT_CUSTODIA_LOCATIONS, 
  COMMON_BANKS 
} from '../types';
import { calculateDaysRemaining, formatCurrencyValue } from '../utils/dateUtils';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: GuaranteeRecord) => void;
  initialData?: GuaranteeRecord | null;
  existingCompanies: string[];
  existingCustodia: string[];
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingCompanies,
  existingCustodia,
}) => {
  const [formData, setFormData] = useState<Partial<GuaranteeRecord>>({
    trackerRefNo: '',
    receivingDate: new Date().toISOString().split('T')[0],
    companyName: DEFAULT_COMPANIES[0],
    projectNumber: '',
    projectName: '',
    contractorType: CONTRACTOR_TYPES[0],
    contractorName: '',
    currency: 'USD',
    guaranteeType: GUARANTEE_TYPES[0],
    issuingBank: COMMON_BANKS[0],
    beneficiary: DEFAULT_COMPANIES[0],
    guaranteeReferenceNumber: '',
    guaranteeValue: 1000000,
    fd: new Date().toISOString().split('T')[0],
    td: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    guaranteeStatus: 'Active',
    custodia: DEFAULT_CUSTODIA_LOCATIONS[0],
    attachmentName: '',
    attachmentSize: '',
    attachmentType: '',
    attachmentData: '',
    notes: '',
  });

  const [customCompanyMode, setCustomCompanyMode] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Merge unique companies and custodian locations
  const allCompanies = Array.from(new Set([...DEFAULT_COMPANIES, ...existingCompanies]));
  const allCustodia = Array.from(new Set([...DEFAULT_CUSTODIA_LOCATIONS, ...existingCustodia]));

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setCustomCompanyMode(false);
    } else {
      // New record defaults
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        trackerRefNo: `TRK-${new Date().getFullYear()}-${randomSuffix}`,
        receivingDate: new Date().toISOString().split('T')[0],
        companyName: allCompanies[0] || 'Apex Infrastructure Ltd',
        projectNumber: '',
        projectName: '',
        contractorType: CONTRACTOR_TYPES[0],
        contractorName: '',
        currency: 'USD',
        guaranteeType: GUARANTEE_TYPES[0],
        issuingBank: COMMON_BANKS[0],
        beneficiary: allCompanies[0] || 'Apex Infrastructure Ltd',
        guaranteeReferenceNumber: '',
        guaranteeValue: 500000,
        fd: new Date().toISOString().split('T')[0],
        td: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
        guaranteeStatus: 'Active',
        custodia: allCustodia[0] || 'Central Treasury Safe Vault A',
        attachmentName: '',
        attachmentSize: '',
        attachmentType: '',
        attachmentData: '',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof GuaranteeRecord, value: unknown) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Keep beneficiary synced with company name if matching initially
      if (field === 'companyName' && (!prev.beneficiary || prev.beneficiary === prev.companyName)) {
        updated.beneficiary = String(value);
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const generateTrackerRef = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    handleChange('trackerRefNo', `TRK-${new Date().getFullYear()}-${randomSuffix}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        attachmentName: file.name,
        attachmentSize: sizeStr,
        attachmentType: file.type || 'application/octet-stream',
        attachmentData: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setFormData((prev) => ({
      ...prev,
      attachmentName: '',
      attachmentSize: '',
      attachmentType: '',
      attachmentData: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.trackerRefNo?.trim()) {
      newErrors.trackerRefNo = 'Tracker ref no is required';
    }
    if (!formData.receivingDate) {
      newErrors.receivingDate = 'Receiving date calendar field is required';
    }
    if (!formData.companyName?.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.projectNumber?.trim()) {
      newErrors.projectNumber = 'Project number is required';
    }
    if (!formData.projectName?.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    if (!formData.contractorName?.trim()) {
      newErrors.contractorName = 'Contractor name is required';
    }
    if (!formData.guaranteeReferenceNumber?.trim()) {
      newErrors.guaranteeReferenceNumber = 'Guarantee reference number is required';
    }
    if (formData.guaranteeValue === undefined || formData.guaranteeValue === null || formData.guaranteeValue <= 0) {
      newErrors.guaranteeValue = 'Guarantee value must be greater than 0';
    }
    if (!formData.fd) {
      newErrors.fd = 'From Date (FD) calendar field is required';
    }
    if (!formData.td) {
      newErrors.td = 'To Date (TD) calendar field is required';
    }
    if (formData.fd && formData.td && formData.fd > formData.td) {
      newErrors.td = 'Expiry Date (TD) must be equal to or after From Date (FD)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const record: GuaranteeRecord = {
      id: initialData?.id || `BG-${Date.now()}`,
      trackerRefNo: formData.trackerRefNo!.trim(),
      receivingDate: formData.receivingDate!,
      companyName: formData.companyName!.trim(),
      projectNumber: formData.projectNumber!.trim(),
      projectName: formData.projectName!.trim(),
      contractorType: formData.contractorType || 'Main Contractor',
      contractorName: formData.contractorName!.trim(),
      currency: formData.currency || 'USD',
      guaranteeType: formData.guaranteeType || 'Performance Bond (PB)',
      issuingBank: formData.issuingBank!.trim() || 'Unspecified Bank',
      beneficiary: formData.beneficiary!.trim() || formData.companyName!.trim(),
      guaranteeReferenceNumber: formData.guaranteeReferenceNumber!.trim(),
      guaranteeValue: Number(formData.guaranteeValue) || 0,
      fd: formData.fd!,
      td: formData.td!,
      guaranteeStatus: (formData.guaranteeStatus as GuaranteeStatus) || 'Active',
      custodia: formData.custodia!.trim() || 'Central Treasury Safe Vault A',
      attachmentName: formData.attachmentName?.trim() || '',
      attachmentSize: formData.attachmentSize?.trim() || '',
      attachmentType: formData.attachmentType || '',
      attachmentData: formData.attachmentData || '',
      notes: formData.notes?.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(record);
    onClose();
  };

  const daysToExpiry = calculateDaysRemaining(formData.td || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="modal-record-form"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#162a42] flex items-center justify-between bg-[#0b1b2d] text-white">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-classic text-base sm:text-lg font-bold text-white tracking-wide">
                {initialData ? 'Edit Guarantee & Contract Record' : 'Lodgement of New Bank Guarantee'}
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Enter tracking, banking, project, custodian, and document attachment parameters
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Organized Section-Wise */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-1 text-xs text-slate-700 space-y-6">
          
          {/* SECTION 1: Registry & Tracking Identification */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#dfb275]" />
                <h3 className="font-bold text-slate-900 text-xs tracking-wide uppercase">
                  1. Registry &amp; Tracking Identification
                </h3>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tracker ref no */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Tracker Ref No <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-tracker-ref"
                  type="text"
                  value={formData.trackerRefNo || ''}
                  onChange={(e) => handleChange('trackerRefNo', e.target.value)}
                  placeholder="e.g. TRK-2026-1048"
                  className={`w-full px-3 py-2 bg-white border rounded-md font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#dfb275]/60 focus:border-[#dfb275] ${
                    errors.trackerRefNo ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.trackerRefNo && <p className="text-rose-600 text-2xs mt-1">{errors.trackerRefNo}</p>}
              </div>

              {/* Receiving date */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Receiving Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-receiving-date"
                    type="date"
                    value={formData.receivingDate || ''}
                    onChange={(e) => handleChange('receivingDate', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275]/60 focus:border-[#dfb275] ${
                      errors.receivingDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                {errors.receivingDate && <p className="text-rose-600 text-2xs mt-1">{errors.receivingDate}</p>}
              </div>

              {/* Company name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-800">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomCompanyMode(!customCompanyMode)}
                    className="text-[#9e6f2c] hover:text-[#78511a] text-2xs font-semibold underline"
                  >
                    {customCompanyMode ? 'Select existing' : '+ Add new'}
                  </button>
                </div>
                {customCompanyMode ? (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Type custom company..."
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCompanyName.trim()) {
                          handleChange('companyName', newCompanyName.trim());
                          setCustomCompanyMode(false);
                          setNewCompanyName('');
                        }
                      }}
                      className="px-2.5 py-1 text-xs bg-[#0b1b2d] text-white rounded font-medium"
                    >
                      Use
                    </button>
                  </div>
                ) : (
                  <select
                    id="select-company-name"
                    value={formData.companyName || ''}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275] ${
                      errors.companyName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  >
                    {allCompanies.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                )}
                {errors.companyName && <p className="text-rose-600 text-2xs mt-1">{errors.companyName}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: Project & Contractor Details */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#dfb275]" />
                <h3 className="font-bold text-slate-900 text-xs tracking-wide uppercase">
                  2. Project &amp; Contractor Details
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Project Number & Project Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Project Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-project-number"
                    type="text"
                    value={formData.projectNumber || ''}
                    onChange={(e) => handleChange('projectNumber', e.target.value)}
                    placeholder="e.g. PRJ-8820"
                    className={`w-full px-3 py-2 bg-white border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275] ${
                      errors.projectNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.projectNumber && <p className="text-rose-600 text-2xs mt-1">{errors.projectNumber}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Project Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-project-name"
                    type="text"
                    value={formData.projectName || ''}
                    onChange={(e) => handleChange('projectName', e.target.value)}
                    placeholder="e.g. Coastal Expressway Expansion Phase 2"
                    className={`w-full px-3 py-2 bg-white border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275] ${
                      errors.projectName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.projectName && <p className="text-rose-600 text-2xs mt-1">{errors.projectName}</p>}
                </div>
              </div>

              {/* Contractor Type & Contractor Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Contractor Type
                  </label>
                  <select
                    id="select-contractor-type"
                    value={formData.contractorType || ''}
                    onChange={(e) => handleChange('contractorType', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275]"
                  >
                    {CONTRACTOR_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Contractor Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-contractor-name"
                    type="text"
                    value={formData.contractorName || ''}
                    onChange={(e) => handleChange('contractorName', e.target.value)}
                    placeholder="e.g. Eastern Civil Engineering Corp"
                    className={`w-full px-3 py-2 bg-white border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275] ${
                      errors.contractorName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.contractorName && <p className="text-rose-600 text-2xs mt-1">{errors.contractorName}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Banking Instrument & Financial Value */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#dfb275]" />
                <h3 className="font-bold text-slate-900 text-xs tracking-wide uppercase">
                  3. Banking Instrument &amp; Financial Value
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Guarantee Type, Issuing Bank, Guarantee Ref Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Guarantee Type
                  </label>
                  <select
                    id="select-guarantee-type"
                    value={formData.guaranteeType || ''}
                    onChange={(e) => handleChange('guaranteeType', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275]"
                  >
                    {GUARANTEE_TYPES.map((gt) => (
                      <option key={gt} value={gt}>
                        {gt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Issuing Bank
                  </label>
                  <input
                    id="input-issuing-bank"
                    type="text"
                    list="issuing-banks-list"
                    value={formData.issuingBank || ''}
                    onChange={(e) => handleChange('issuingBank', e.target.value)}
                    placeholder="e.g. HSBC Bank Middle East"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275]"
                  />
                  <datalist id="issuing-banks-list">
                    {COMMON_BANKS.map((b) => (
                      <option key={b} value={b} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Guarantee Ref Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-guarantee-ref-num"
                    type="text"
                    value={formData.guaranteeReferenceNumber || ''}
                    onChange={(e) => handleChange('guaranteeReferenceNumber', e.target.value)}
                    placeholder="e.g. FAB-PB-2026-9041"
                    className={`w-full px-3 py-2 bg-white border rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275] ${
                      errors.guaranteeReferenceNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.guaranteeReferenceNumber && (
                    <p className="text-rose-600 text-2xs mt-1">{errors.guaranteeReferenceNumber}</p>
                  )}
                </div>
              </div>

              {/* Currency & Guarantee Value */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Currency
                  </label>
                  <select
                    id="select-currency"
                    value={formData.currency || 'USD'}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#dfb275]"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-800 block mb-1">
                    Guarantee Value <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-guarantee-value"
                    type="number"
                    step="any"
                    min="0"
                    value={formData.guaranteeValue ?? ''}
                    onChange={(e) => handleChange('guaranteeValue', parseFloat(e.target.value))}
                    placeholder="0.00"
                    className={`w-full px-3 py-2 bg-white border rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275] ${
                      errors.guaranteeValue ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.guaranteeValue && <p className="text-rose-600 text-2xs mt-1">{errors.guaranteeValue}</p>}
                  <span className="text-3xs text-slate-500 block mt-0.5">
                    {formData.currency} {formatCurrencyValue(formData.guaranteeValue || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Validity & Status */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#dfb275]" />
                <h3 className="font-bold text-slate-900 text-xs tracking-wide uppercase">
                  4. Validity Period &amp; Operational Status
                </h3>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* FD (From Date) */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  FD (From Date) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-fd-date"
                    type="date"
                    value={formData.fd || ''}
                    onChange={(e) => handleChange('fd', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275] ${
                      errors.fd ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.fd && <p className="text-rose-600 text-2xs mt-1">{errors.fd}</p>}
              </div>

              {/* TD (To Date) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-800">
                    TD (To Date) <span className="text-rose-500">*</span>
                  </label>
                  {formData.td && (
                    <span
                      className={`text-3xs font-semibold px-1 py-0.2 rounded ${
                        daysToExpiry < 0
                          ? 'bg-rose-100 text-rose-700'
                          : daysToExpiry <= 30
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {daysToExpiry < 0 ? `${Math.abs(daysToExpiry)}d overdue` : `${daysToExpiry}d left`}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="input-td-date"
                    type="date"
                    value={formData.td || ''}
                    onChange={(e) => handleChange('td', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275] ${
                      errors.td ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.td && <p className="text-rose-600 text-2xs mt-1">{errors.td}</p>}
              </div>

              {/* Guarantee status */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Guarantee Status
                </label>
                <select
                  id="select-guarantee-status"
                  value={formData.guaranteeStatus || 'Active'}
                  onChange={(e) => handleChange('guaranteeStatus', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#dfb275]"
                >
                  {GUARANTEE_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 5: Custody & Physical Custodian */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#dfb275]" />
                <h3 className="font-bold text-slate-900 text-xs tracking-wide uppercase">
                  5. Custody &amp; Beneficiary
                </h3>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Custodian */}
              <div>
                <label htmlFor="select-custodia" className="font-semibold text-slate-800 block mb-1">
                  Custodian / Physical Vault Location
                </label>
                <select
                  id="select-custodia"
                  value={formData.custodia || ''}
                  onChange={(e) => handleChange('custodia', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275]"
                >
                  {allCustodia.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Beneficiary */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Beneficiary (Obligee)
                </label>
                <input
                  id="input-beneficiary"
                  type="text"
                  value={formData.beneficiary || ''}
                  onChange={(e) => handleChange('beneficiary', e.target.value)}
                  placeholder="Entity entitled to claim guarantee"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 6: Attachment & Notes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#dfb275]" />
                <h3 className="font-bold text-slate-900 text-xs tracking-wide uppercase">
                  6. Documents &amp; Remarks
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Attachment Field */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[#9e6f2c]" />
                  <span>Guarantee Document Attachment (PDF, Image, Scanned Copy)</span>
                </label>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-attachment-input"
                />

                {formData.attachmentName ? (
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#0b1b2d] text-white flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-[#dfb275]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-xs truncate max-w-sm sm:max-w-md">
                          {formData.attachmentName}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {formData.attachmentSize || 'Attached document'} &bull; Ready for lodgement
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                        title="Remove attachment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#dfb275] bg-slate-50/50 hover:bg-amber-50/20 rounded-xl p-3.5 text-center cursor-pointer transition-colors flex items-center justify-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-slate-800 text-xs">
                        Click to upload guarantee bond document
                      </span>
                      <span className="text-slate-400 text-3xs block">
                        Supports PDF, PNG, JPG, or DOCX (scanned bank letter, sanction memo, copy)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes / Internal remarks */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Internal Notes &amp; Custody Remarks (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="e.g. Original physical bond received via DHL airway bill #8812. Inspected and deposited in vault."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb275]"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
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
            onClick={handleSubmit}
            className="inline-flex items-center px-5 py-2 text-xs font-bold text-[#1e293b] bg-[#dfb275] hover:bg-[#d4a566] active:bg-[#c99855] rounded-full border border-[#f3d39f] transition-all shadow-xs"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {initialData ? 'Update Guarantee' : 'Save & Lodgement'}
          </button>
        </div>
      </div>
    </div>
  );
};
