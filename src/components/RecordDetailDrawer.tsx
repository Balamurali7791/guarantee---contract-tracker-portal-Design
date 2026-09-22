import React from 'react';
import { 
  X, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  Vault, 
  Calendar, 
  Copy, 
  Edit3, 
  ExternalLink,
  Clock,
  Paperclip,
  Download,
  FileText
} from 'lucide-react';
import { GuaranteeRecord, GuaranteeStatus } from '../types';
import { calculateDaysRemaining, formatDateDisplay, formatCurrencyValue, getComputedStatus } from '../utils/dateUtils';

interface RecordDetailDrawerProps {
  record: GuaranteeRecord | null;
  onClose: () => void;
  onEdit: (record: GuaranteeRecord) => void;
  onUpdateStatus: (id: string, newStatus: GuaranteeStatus) => void;
}

export const RecordDetailDrawer: React.FC<RecordDetailDrawerProps> = ({
  record,
  onClose,
  onEdit,
  onUpdateStatus,
}) => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!record) return null;

  const daysRemaining = calculateDaysRemaining(record.td);
  const statusInfo = getComputedStatus(record.guaranteeStatus, record.td);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs">
      <div 
        id="drawer-record-detail"
        className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#162a42] flex items-center justify-between bg-[#0b1b2d] text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#dfb275] text-sm sm:text-base">
                {record.trackerRefNo}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${statusInfo.badgeColor}`}>
                {statusInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Official Lodgement &bull; Received {formatDateDisplay(record.receivingDate)}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(record)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              title="Edit record"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 print:p-2">
          {/* Main Guarantee Amount Banner */}
          <div className="bg-gradient-to-br from-[#0b1528] via-[#112444] to-[#0b1528] border border-white/20 text-white rounded-xl p-5 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-white text-2xs uppercase tracking-widest font-bold">
                  Guarantee Value
                </span>
                <div className="text-2xl font-bold font-mono mt-1 text-white flex items-baseline gap-2">
                  <span className="text-white text-base">{record.currency}</span>
                  <span className="text-white">{formatCurrencyValue(record.guaranteeValue, record.currency)}</span>
                </div>
                <div className="text-xs text-white font-medium mt-1">
                  {record.guaranteeType}
                </div>
              </div>
              <div className="text-right">
                <span className="text-white text-2xs uppercase tracking-widest font-bold block">
                  Validity Period
                </span>
                <div className="text-xs font-semibold text-white mt-1">
                  {formatDateDisplay(record.fd)} &rarr; {formatDateDisplay(record.td)}
                </div>
                <div className="text-2xs text-white mt-1 flex items-center justify-end gap-1 font-medium">
                  <Clock className="w-3 h-3 text-white" />
                  <span>
                    {daysRemaining < 0
                      ? `Overdue by ${Math.abs(daysRemaining)} days`
                      : `${daysRemaining} days until expiry`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Custody Banner (Custodian) */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 text-amber-800 flex items-center justify-center shrink-0">
                <Vault className="w-5 h-5 text-[#9e6f2c]" />
              </div>
              <div>
                <span className="text-2xs font-bold text-amber-800 uppercase tracking-wider block">
                  Custodian
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {record.custodia}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(record.custodia, 'custodia')}
              className="text-slate-500 hover:text-slate-800 p-1 text-2xs flex items-center gap-1 font-medium"
            >
              <Copy className="w-3 h-3" />
              {copiedField === 'custodia' ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Attachment Document Section */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-2.5 bg-white shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
              <Paperclip className="w-4 h-4 text-[#9e6f2c]" />
              <span>Guarantee Document Attachment</span>
            </div>

            {record.attachmentName ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#0b1b2d] text-white flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#dfb275]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-xs truncate max-w-xs sm:max-w-sm">
                      {record.attachmentName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {record.attachmentSize || 'Attached File'} &bull; Attached to record
                    </p>
                  </div>
                </div>

                {record.attachmentData ? (
                  <a
                    href={record.attachmentData}
                    download={record.attachmentName}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#0b1b2d] text-[#dfb275] hover:bg-[#162a42] rounded-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                ) : (
                  <span className="text-2xs text-slate-500 font-medium">Attached</span>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-1">
                No document attached yet. You can attach a scanned copy or PDF by clicking &quot;Edit Full Record&quot;.
              </div>
            )}
          </div>

          {/* Banking & Instrument Identification */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Banking &amp; Instrument Identifiers</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-2xs block">Guarantee Ref Number</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-bold text-slate-900">{record.guaranteeReferenceNumber}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(record.guaranteeReferenceNumber, 'ref')}
                    className="text-slate-400 hover:text-slate-700"
                    title="Copy guarantee reference"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-2xs block">Issuing Bank</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{record.issuingBank}</span>
              </div>

              <div>
                <span className="text-slate-500 text-2xs block">Beneficiary</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{record.beneficiary}</span>
              </div>

              <div>
                <span className="text-slate-500 text-2xs block">Company Name</span>
                <span className="font-semibold text-indigo-700 block mt-0.5">{record.companyName}</span>
              </div>
            </div>
          </div>

          {/* Project & Contractor Scope */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Project &amp; Contractor Contract</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-2xs block">Project Number</span>
                <span className="font-mono font-bold text-slate-900 block mt-0.5">{record.projectNumber}</span>
              </div>

              <div>
                <span className="text-slate-500 text-2xs block">Project Name</span>
                <span className="font-medium text-slate-900 block mt-0.5">{record.projectName}</span>
              </div>

              <div>
                <span className="text-slate-500 text-2xs block">Contractor Type</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-2xs">
                  {record.contractorType}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-2xs block">Contractor Name</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{record.contractorName}</span>
              </div>
            </div>
          </div>

          {/* Timeline & Important Dates */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Key Timeline Dates</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-md">
                <span className="text-slate-500 text-2xs block">Receiving Date</span>
                <span className="font-semibold text-slate-900 block mt-1">
                  {formatDateDisplay(record.receivingDate)}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-md">
                <span className="text-slate-500 text-2xs block">FD (From Date)</span>
                <span className="font-semibold text-slate-900 block mt-1">
                  {formatDateDisplay(record.fd)}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-md">
                <span className="text-slate-500 text-2xs block">TD (To Date)</span>
                <span className="font-semibold text-slate-900 block mt-1">
                  {formatDateDisplay(record.td)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Remarks */}
          {record.notes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="font-semibold text-slate-800 block mb-1">Custody &amp; Internal Notes:</span>
              <p className="text-slate-600 whitespace-pre-wrap">{record.notes}</p>
            </div>
          )}

          {/* Quick Status Action Controls */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              Quick Update Guarantee Status:
            </span>
            <div className="flex flex-wrap gap-2">
              {(['Active', 'Released', 'Claimed', 'Expired', 'In Process', 'Under Invocation'] as GuaranteeStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onUpdateStatus(record.id, st)}
                    className={`px-2.5 py-1 text-2xs font-semibold rounded-md border transition-colors ${
                      record.guaranteeStatus === st
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit(record)}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Edit Full Record
          </button>
        </div>
      </div>
    </div>
  );
};
