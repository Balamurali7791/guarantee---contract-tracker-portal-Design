import React from 'react';
import { 
  FileCheck, 
  AlertTriangle, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { GuaranteeRecord } from '../types';
import { calculateDaysRemaining } from '../utils/dateUtils';

interface MetricsCardsProps {
  records: GuaranteeRecord[];
  onSelectFilterStatus?: (status: string) => void;
  activeFilterStatus?: string;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  records,
  onSelectFilterStatus,
  activeFilterStatus = 'ALL',
}) => {
  const totalCount = records.length;

  // Active records
  const activeCount = records.filter(
    (r) => r.guaranteeStatus === 'Active' && calculateDaysRemaining(r.td) > 30
  ).length;

  // Expiring within 30 days
  const expiringSoonCount = records.filter((r) => {
    if (r.guaranteeStatus === 'Released' || r.guaranteeStatus === 'Claimed') return false;
    const days = calculateDaysRemaining(r.td);
    return days >= 0 && days <= 30;
  }).length;

  // Expired
  const expiredCount = records.filter((r) => {
    if (r.guaranteeStatus === 'Released' || r.guaranteeStatus === 'Claimed') return false;
    const days = calculateDaysRemaining(r.td);
    return days < 0 || r.guaranteeStatus === 'Expired';
  }).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-6">
      {/* Grid of 4 deep navy cards styled as per sample image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Guarantees */}
        <div 
          id="card-total-guarantees"
          onClick={() => onSelectFilterStatus && onSelectFilterStatus('ALL')}
          className={`bg-[#0b1b2d] rounded-2xl p-4 transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 border ${
            activeFilterStatus === 'ALL'
              ? 'ring-2 ring-[#dfb275] border-[#dfb275]/50'
              : 'border-[#172c47] hover:border-slate-500'
          } flex items-center gap-3.5`}
        >
          {/* Pure white rounded icon squircle */}
          <div className="w-11 h-11 rounded-xl bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
            <FileCheck className="w-5 h-5 text-[#0b1b2d]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-bold text-sm tracking-tight truncate">
              Total Guarantees
            </div>
            <div className="text-slate-300 text-xs truncate mt-0.5">
              <span className="text-[#dfb275] font-bold font-mono text-sm mr-1">{totalCount}</span>
              in custody
            </div>
          </div>
        </div>

        {/* Card 2: Active Guarantees */}
        <div 
          id="card-active-guarantees"
          onClick={() => onSelectFilterStatus && onSelectFilterStatus('Active')}
          className={`bg-[#0b1b2d] rounded-2xl p-4 transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 border ${
            activeFilterStatus === 'Active'
              ? 'ring-2 ring-[#dfb275] border-[#dfb275]/50'
              : 'border-[#172c47] hover:border-slate-500'
          } flex items-center gap-3.5`}
        >
          <div className="w-11 h-11 rounded-xl bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-bold text-sm tracking-tight truncate">
              Active Valid Bonds
            </div>
            <div className="text-slate-300 text-xs truncate mt-0.5">
              <span className="text-emerald-400 font-bold font-mono text-sm mr-1">{activeCount}</span>
              in full force
            </div>
          </div>
        </div>

        {/* Card 3: Expiring Soon */}
        <div 
          id="card-expiring-soon"
          onClick={() => onSelectFilterStatus && onSelectFilterStatus('EXPIRING_SOON')}
          className={`bg-[#0b1b2d] rounded-2xl p-4 transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 border ${
            activeFilterStatus === 'EXPIRING_SOON'
              ? 'ring-2 ring-[#dfb275] border-[#dfb275]/50'
              : 'border-[#172c47] hover:border-slate-500'
          } flex items-center gap-3.5`}
        >
          <div className="w-11 h-11 rounded-xl bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-bold text-sm tracking-tight truncate">
              Expiring &le; 30 Days
            </div>
            <div className="text-slate-300 text-xs truncate mt-0.5">
              <span className="text-amber-400 font-bold font-mono text-sm mr-1">{expiringSoonCount}</span>
              action required
            </div>
          </div>
        </div>

        {/* Card 4: Expired / Overdue */}
        <div 
          id="card-expired-guarantees"
          onClick={() => onSelectFilterStatus && onSelectFilterStatus('Expired')}
          className={`bg-[#0b1b2d] rounded-2xl p-4 transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 border ${
            activeFilterStatus === 'Expired'
              ? 'ring-2 ring-[#dfb275] border-[#dfb275]/50'
              : 'border-[#172c47] hover:border-slate-500'
          } flex items-center gap-3.5`}
        >
          <div className="w-11 h-11 rounded-xl bg-white text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-bold text-sm tracking-tight truncate">
              Expired / Overdue
            </div>
            <div className="text-slate-300 text-xs truncate mt-0.5">
              <span className="text-rose-400 font-bold font-mono text-sm mr-1">{expiredCount}</span>
              awaiting release
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
