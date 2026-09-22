import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Edit, 
  Trash2, 
  Vault, 
  Clock, 
  Building, 
  XCircle,
  FileText,
  Plus,
  Paperclip
} from 'lucide-react';
import { GuaranteeRecord, GuaranteeStatus, DEFAULT_COMPANIES, GUARANTEE_TYPES, GUARANTEE_STATUSES } from '../types';
import { calculateDaysRemaining, formatDateDisplay, formatCurrencyValue, getComputedStatus } from '../utils/dateUtils';

interface RecordsTableProps {
  records: GuaranteeRecord[];
  onViewRecord: (record: GuaranteeRecord) => void;
  onEditRecord: (record: GuaranteeRecord) => void;
  onDuplicateRecord?: (record: GuaranteeRecord) => void;
  onDeleteRecord: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  filterStatusOverride?: string;
  onClearFilterStatusOverride?: () => void;
  onOpenNewModal: () => void;
  onOpenUploadModal?: () => void;
}

type SortField = 
  | 'trackerRefNo' 
  | 'receivingDate' 
  | 'companyName' 
  | 'projectNumber' 
  | 'contractorName' 
  | 'guaranteeValue' 
  | 'fd' 
  | 'td' 
  | 'guaranteeStatus'
  | 'custodia';

export const RecordsTable: React.FC<RecordsTableProps> = ({
  records,
  onViewRecord,
  onEditRecord,
  onDuplicateRecord,
  onDeleteRecord,
  onBulkDelete,
  filterStatusOverride,
  onClearFilterStatusOverride,
  onOpenNewModal,
  onOpenUploadModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [custodiaFilter, setCustodiaFilter] = useState('ALL');

  const [sortField, setSortField] = useState<SortField>('receivingDate');
  const [sortAsc, setSortAsc] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sync with card filter override if provided
  React.useEffect(() => {
    if (filterStatusOverride) {
      setStatusFilter(filterStatusOverride);
    }
  }, [filterStatusOverride]);

  // Extract unique companies & custodia
  const companiesList = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.companyName).filter(Boolean))).sort();
  }, [records]);

  const custodiaList = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.custodia).filter(Boolean))).sort();
  }, [records]);

  // Filtering
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches = 
          r.trackerRefNo.toLowerCase().includes(query) ||
          r.projectNumber.toLowerCase().includes(query) ||
          r.projectName.toLowerCase().includes(query) ||
          r.contractorName.toLowerCase().includes(query) ||
          r.issuingBank.toLowerCase().includes(query) ||
          r.guaranteeReferenceNumber.toLowerCase().includes(query) ||
          r.custodia.toLowerCase().includes(query) ||
          r.companyName.toLowerCase().includes(query) ||
          r.beneficiary.toLowerCase().includes(query);

        if (!matches) return false;
      }

      // Company
      if (companyFilter !== 'ALL' && r.companyName !== companyFilter) {
        return false;
      }

      // Status
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'EXPIRING_SOON') {
          const days = calculateDaysRemaining(r.td);
          if (r.guaranteeStatus === 'Released' || r.guaranteeStatus === 'Claimed') return false;
          if (days < 0 || days > 30) return false;
        } else if (statusFilter === 'Expired') {
          const days = calculateDaysRemaining(r.td);
          if (r.guaranteeStatus !== 'Expired' && days >= 0) return false;
        } else if (r.guaranteeStatus !== statusFilter) {
          return false;
        }
      }

      // Guarantee Type
      if (typeFilter !== 'ALL' && r.guaranteeType !== typeFilter) {
        return false;
      }

      // Custodia
      if (custodiaFilter !== 'ALL' && r.custodia !== custodiaFilter) {
        return false;
      }

      return true;
    });
  }, [records, searchTerm, companyFilter, statusFilter, typeFilter, custodiaFilter]);

  // Sorting
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'guaranteeValue') {
        aVal = a.guaranteeValue || 0;
        bVal = b.guaranteeValue || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setCompanyFilter('ALL');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setCustodiaFilter('ALL');
    if (onClearFilterStatusOverride) onClearFilterStatusOverride();
  };

  const isFiltered = searchTerm || companyFilter !== 'ALL' || statusFilter !== 'ALL' || typeFilter !== 'ALL' || custodiaFilter !== 'ALL';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
      {/* Controls Bar - All in a single clean line */}
      <div className="p-3 sm:p-4 border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative min-w-[220px] max-w-xs flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-search-records"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search tracker ref, project, contractor..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-500 focus:bg-white transition-all text-slate-900"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters label */}
          <div className="flex items-center gap-1 text-slate-600 font-bold uppercase text-[11px] tracking-wider shrink-0">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Filters:</span>
          </div>

          {/* Company Name */}
          <select
            id="filter-company"
            value={companyFilter}
            onChange={(e) => {
              setCompanyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 shrink-0"
          >
            <option value="ALL">All Companies ({companiesList.length})</option>
            {companiesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 shrink-0"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active Valid</option>
            <option value="EXPIRING_SOON">Expiring Soon (&le; 30d)</option>
            <option value="Expired">Expired / Overdue</option>
            <option value="Released">Released</option>
            <option value="Claimed">Claimed</option>
            <option value="In Process">In Process</option>
            <option value="Under Invocation">Under Invocation</option>
          </select>

          {/* Guarantee Type */}
          <select
            id="filter-guarantee-type"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 shrink-0"
          >
            <option value="ALL">All Guarantee Types</option>
            {GUARANTEE_TYPES.map((gt) => (
              <option key={gt} value={gt}>
                {gt}
              </option>
            ))}
          </select>

          {/* Custodian Location */}
          <select
            id="filter-custodia"
            value={custodiaFilter}
            onChange={(e) => {
              setCustodiaFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 shrink-0"
          >
            <option value="ALL">All Custodians / Vaults</option>
            {custodiaList.map((cust) => (
              <option key={cust} value={cust}>
                {cust}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs text-rose-700 hover:text-rose-900 underline font-semibold shrink-0"
            >
              Reset
            </button>
          )}

          {/* Right-aligned New Guarantee button in the same line */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <button
              id="btn-new-guarantee-table"
              type="button"
              onClick={onOpenNewModal}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold text-[#1e293b] bg-[#dfb275] hover:bg-[#d4a566] rounded-full border border-[#f3d39f] transition-all shadow-xs active:scale-[0.98] whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />
              New Guarantee
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border-t border-slate-200">
        <table className="min-w-[1680px] w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-[#0b1b2d] text-slate-100 uppercase text-[11px] font-bold tracking-wider border-b-2 border-[#162a42]">
            <tr>
              {/* 1. Tracker ref no */}
              <th 
                scope="col" 
                className="w-36 min-w-[140px] px-3 py-3.5 text-left font-bold cursor-pointer hover:bg-[#122842] transition-colors whitespace-nowrap"
                onClick={() => handleSort('trackerRefNo')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Tracker Ref No</span>
                  {sortField === 'trackerRefNo' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5 text-[#dfb275]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#dfb275]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />
                  )}
                </div>
              </th>

              {/* 2. Receiving date */}
              <th 
                scope="col" 
                className="w-32 min-w-[115px] px-3 py-3.5 text-left font-bold cursor-pointer hover:bg-[#122842] transition-colors whitespace-nowrap"
                onClick={() => handleSort('receivingDate')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Receiving Date</span>
                  {sortField === 'receivingDate' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5 text-[#dfb275]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#dfb275]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />
                  )}
                </div>
              </th>

              {/* 3. Company name */}
              <th 
                scope="col" 
                className="w-48 min-w-[160px] px-3 py-3.5 text-left font-bold cursor-pointer hover:bg-[#122842] transition-colors whitespace-nowrap"
                onClick={() => handleSort('companyName')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Company Name</span>
                  {sortField === 'companyName' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5 text-[#dfb275]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#dfb275]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />
                  )}
                </div>
              </th>

              {/* 4 & 5. Project (No & Name) */}
              <th scope="col" className="w-56 min-w-[185px] px-3 py-3.5 text-left font-bold whitespace-nowrap">
                Project (No &amp; Name)
              </th>

              {/* 6 & 7. Contractor (Type & Name) */}
              <th scope="col" className="w-52 min-w-[175px] px-3 py-3.5 text-left font-bold whitespace-nowrap">
                Contractor (Type &amp; Name)
              </th>

              {/* 9. Guarantee type */}
              <th scope="col" className="w-64 min-w-[215px] px-3 py-3.5 text-left font-bold whitespace-nowrap">
                Guarantee Type
              </th>

              {/* 10. Issuing Bank & 12. Ref No */}
              <th scope="col" className="w-56 min-w-[185px] px-3 py-3.5 text-left font-bold whitespace-nowrap">
                Issuing Bank &amp; BG Ref No
              </th>

              {/* 8 & 13. Currency & Value */}
              <th 
                scope="col" 
                className="w-40 min-w-[140px] px-3 py-3.5 text-right font-bold cursor-pointer hover:bg-[#122842] transition-colors whitespace-nowrap"
                onClick={() => handleSort('guaranteeValue')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Guarantee Value</span>
                  {sortField === 'guaranteeValue' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5 text-[#dfb275]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#dfb275]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />
                  )}
                </div>
              </th>

              {/* 14 & 15. FD -> TD (Validity) */}
              <th 
                scope="col" 
                className="w-44 min-w-[155px] px-3 py-3.5 text-left font-bold cursor-pointer hover:bg-[#122842] transition-colors whitespace-nowrap"
                onClick={() => handleSort('td')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Validity (FD &rarr; TD)</span>
                  {sortField === 'td' ? (
                    sortAsc ? <ArrowUp className="w-3.5 h-3.5 text-[#dfb275]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#dfb275]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />
                  )}
                </div>
              </th>

              {/* 16. Status */}
              <th scope="col" className="w-36 min-w-[130px] px-3 py-3.5 text-left font-bold whitespace-nowrap">
                Guarantee Status
              </th>

              {/* Custodian */}
              <th scope="col" className="w-48 min-w-[160px] px-3 py-3.5 text-left font-bold whitespace-nowrap">
                Custodian
              </th>

              {/* Actions */}
              <th scope="col" className="w-24 min-w-[95px] px-3 py-3.5 text-right font-bold whitespace-nowrap sticky right-0 z-20 bg-[#0b1b2d] text-[#dfb275] border-l border-[#162a42] shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.3)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-slate-700">No guarantee records found</div>
                    <p className="text-xs text-slate-500 max-w-sm">
                      {isFiltered
                        ? 'Try clearing active search filters to see all guarantees.'
                        : 'Click "+ New Guarantee" to register the first guarantee.'}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={onOpenNewModal}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      >
                        New Guarantee
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => {
                const statusInfo = getComputedStatus(r.guaranteeStatus, r.td);

                return (
                  <tr
                    key={r.id}
                    className="group even:bg-[#fafafc] hover:bg-amber-50/30 transition-colors"
                  >
                    {/* 1. Tracker ref no */}
                    <td className="w-36 min-w-[140px] px-3 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewRecord(r)}
                          className="hover:underline hover:text-amber-700 text-left"
                        >
                          {r.trackerRefNo}
                        </button>
                        {r.attachmentName && (
                          <span title={`Attached: ${r.attachmentName}`} className="text-[#9e6f2c]">
                            <Paperclip className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 2. Receiving date */}
                    <td className="w-32 min-w-[115px] px-3 py-3 text-slate-600 font-medium whitespace-nowrap">
                      {formatDateDisplay(r.receivingDate)}
                    </td>

                    {/* 3. Company name */}
                    <td className="w-48 min-w-[160px] px-3 py-3 whitespace-nowrap">
                      <div className="truncate max-w-[160px] text-slate-950 font-bold" title={r.companyName}>
                        {r.companyName}
                      </div>
                    </td>

                    {/* 4 & 5. Project */}
                    <td className="w-56 min-w-[185px] px-3 py-3 whitespace-nowrap">
                      <div className="max-w-[180px]">
                        <div className="font-mono font-bold text-slate-900 truncate" title={r.projectNumber}>
                          {r.projectNumber}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate mt-0.5" title={r.projectName}>
                          {r.projectName}
                        </div>
                      </div>
                    </td>

                    {/* 6 & 7. Contractor */}
                    <td className="w-52 min-w-[175px] px-3 py-3 whitespace-nowrap">
                      <div className="max-w-[170px]">
                        <div className="font-bold text-slate-900 truncate" title={r.contractorName}>
                          {r.contractorName}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate mt-0.5">
                          {r.contractorType}
                        </div>
                      </div>
                    </td>

                    {/* 9. Guarantee type */}
                    <td className="w-64 min-w-[215px] px-3 py-3 whitespace-nowrap">
                      <div className="max-w-[210px]">
                        <span 
                          className="inline-block max-w-full truncate px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 align-middle" 
                          title={r.guaranteeType}
                        >
                          {r.guaranteeType}
                        </span>
                      </div>
                    </td>

                    {/* 10 & 12. Issuing bank & Guarantee ref */}
                    <td className="w-56 min-w-[185px] px-3 py-3 whitespace-nowrap">
                      <div className="max-w-[180px]">
                        <div className="font-mono text-xs font-bold text-slate-900 truncate" title={r.guaranteeReferenceNumber}>
                          {r.guaranteeReferenceNumber}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate mt-0.5" title={r.issuingBank}>
                          {r.issuingBank}
                        </div>
                      </div>
                    </td>

                    {/* 8 & 13. Currency & Value */}
                    <td className="w-40 min-w-[140px] px-3 py-3 text-right font-mono whitespace-nowrap">
                      <span className="text-[11px] text-slate-500 font-bold mr-1.5">{r.currency}</span>
                      <span className="font-bold text-slate-950 text-xs">
                        {formatCurrencyValue(r.guaranteeValue, r.currency)}
                      </span>
                    </td>

                    {/* 14 & 15. Validity (FD -> TD) */}
                    <td className="w-44 min-w-[155px] px-3 py-3 whitespace-nowrap">
                      <div className="text-xs text-slate-800 font-semibold">
                        {formatDateDisplay(r.fd)} &rarr; {formatDateDisplay(r.td)}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${statusInfo.badgeColor}`}>
                          {statusInfo.daysRemaining < 0
                            ? `Expired ${Math.abs(statusInfo.daysRemaining)}d ago`
                            : `${statusInfo.daysRemaining}d left`}
                        </span>
                      </div>
                    </td>

                    {/* 16. Guarantee status */}
                    <td className="w-36 min-w-[130px] px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.badgeColor}`}>
                        {r.guaranteeStatus}
                      </span>
                    </td>

                    {/* 17. Custodia */}
                    <td className="w-48 min-w-[160px] px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium max-w-[160px]" title={r.custodia}>
                        <Vault className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-xs truncate">{r.custodia}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="w-24 min-w-[95px] px-3 py-3 text-right whitespace-nowrap sticky right-0 z-10 bg-white group-hover:bg-amber-50 group-even:bg-[#f8fafc] border-l border-slate-200 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewRecord(r)}
                          title="View complete record details"
                          className="p-1.5 text-slate-600 hover:text-amber-800 hover:bg-amber-100/70 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditRecord(r)}
                          title="Edit guarantee"
                          className="p-1.5 text-slate-600 hover:text-blue-800 hover:bg-blue-100/70 rounded transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete guarantee record ${r.trackerRefNo}?`)) {
                              onDeleteRecord(r.id);
                            }
                          }}
                          title="Delete record"
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-100/70 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination & Footer */}
      {sortedRecords.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 bg-[#fafafc] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-950">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-slate-950">
              {Math.min(currentPage * pageSize, sortedRecords.length)}
            </span>{' '}
            of <span className="font-bold text-slate-950">{sortedRecords.length}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`px-3 py-1.5 rounded border text-xs font-semibold ${
                currentPage === 1
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-950 transition-colors shadow-2xs'
              }`}
            >
              Previous
            </button>
            <span className="px-2.5 font-bold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={`px-3 py-1.5 rounded border text-xs font-semibold ${
                currentPage === totalPages
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-950 transition-colors shadow-2xs'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
