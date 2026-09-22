/**
 * Date utility helpers for Bank Guarantees & Contract tracking
 */

export function calculateDaysRemaining(tdString: string): number {
  if (!tdString) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const td = new Date(tdString);
  td.setHours(0, 0, 0, 0);
  if (isNaN(td.getTime())) return 0;
  const diffTime = td.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getComputedStatus(
  explicitStatus: string,
  tdString: string
): { label: string; badgeColor: string; daysRemaining: number } {
  const days = calculateDaysRemaining(tdString);

  if (explicitStatus === 'Released') {
    return { label: 'Released', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300 font-semibold', daysRemaining: days };
  }
  if (explicitStatus === 'Claimed') {
    return { label: 'Claimed', badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 font-semibold', daysRemaining: days };
  }
  if (explicitStatus === 'In Process') {
    return { label: 'In Process', badgeColor: 'bg-sky-100 text-sky-900 border-sky-300 font-semibold', daysRemaining: days };
  }
  if (explicitStatus === 'Under Invocation') {
    return { label: 'Under Invocation', badgeColor: 'bg-rose-100 text-rose-900 border-rose-400 font-bold animate-pulse', daysRemaining: days };
  }

  // If active or general:
  if (days < 0) {
    return { label: 'Expired', badgeColor: 'bg-rose-100 text-rose-900 border-rose-300 font-semibold', daysRemaining: days };
  }
  if (days <= 30) {
    return { label: `Expiring Soon (${days}d)`, badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold', daysRemaining: days };
  }
  return { label: 'Active', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold', daysRemaining: days };
}

export function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mIndex = parseInt(month, 10) - 1;
    if (mIndex >= 0 && mIndex < 12) {
      return `${day} ${monthNames[mIndex]} ${year}`;
    }
  }
  return dateStr;
}

export function formatCurrencyValue(amount: number, currency: string = 'USD'): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
