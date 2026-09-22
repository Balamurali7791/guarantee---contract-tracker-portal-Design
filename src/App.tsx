/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { RecordsTable } from './components/RecordsTable';
import { RecordModal } from './components/RecordModal';
import { UploadExcelModal } from './components/UploadExcelModal';
import { RecordDetailDrawer } from './components/RecordDetailDrawer';
import { GuaranteeRecord, GuaranteeStatus } from './types';
import { INITIAL_GUARANTEE_RECORDS } from './utils/sampleData';
import { CheckCircle2, AlertCircle, Info, X, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'guarantee_tracker_portal_records_v1';

export default function App() {
  const [records, setRecords] = useState<GuaranteeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load records from localStorage', e);
    }
    return INITIAL_GUARANTEE_RECORDS;
  });

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GuaranteeRecord | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<GuaranteeRecord | null>(null);
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('ALL');

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to persist records', e);
    }
  }, [records]);

  // Handle saving new or edited record
  const handleSaveRecord = (savedRecord: GuaranteeRecord) => {
    if (editingRecord) {
      setRecords((prev) =>
        prev.map((r) => (r.id === savedRecord.id ? savedRecord : r))
      );
      if (selectedDetailRecord && selectedDetailRecord.id === savedRecord.id) {
        setSelectedDetailRecord(savedRecord);
      }
      showToast(`Guarantee ${savedRecord.trackerRefNo} updated successfully.`);
    } else {
      setRecords((prev) => [savedRecord, ...prev]);
      showToast(`New guarantee ${savedRecord.trackerRefNo} lodged in portal.`);
    }
    setIsRecordModalOpen(false);
    setEditingRecord(null);
  };

  // Handle duplicating an existing record
  const handleDuplicateRecord = (recordToDuplicate: GuaranteeRecord) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const duplicated: GuaranteeRecord = {
      ...recordToDuplicate,
      id: `BG-${Date.now()}`,
      trackerRefNo: `TRK-${new Date().getFullYear()}-${randomSuffix}`,
      guaranteeReferenceNumber: `${recordToDuplicate.guaranteeReferenceNumber}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecords((prev) => [duplicated, ...prev]);
    showToast(`Duplicated into new guarantee ${duplicated.trackerRefNo}.`);
  };

  // Handle deleting single record
  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    if (selectedDetailRecord?.id === id) {
      setSelectedDetailRecord(null);
    }
    showToast('Guarantee record deleted.', 'info');
  };

  // Handle bulk deleting
  const handleBulkDelete = (ids: string[]) => {
    const idSet = new Set(ids);
    setRecords((prev) => prev.filter((r) => !idSet.has(r.id)));
    if (selectedDetailRecord && idSet.has(selectedDetailRecord.id)) {
      setSelectedDetailRecord(null);
    }
    showToast(`Deleted ${ids.length} guarantee records.`, 'info');
  };

  // Handle Excel import completion
  const handleImportComplete = (importedRecords: GuaranteeRecord[], mode: 'append' | 'replace') => {
    if (mode === 'replace') {
      setRecords(importedRecords);
      showToast(`Replaced portal records with ${importedRecords.length} entries from Excel.`);
    } else {
      setRecords((prev) => [...importedRecords, ...prev]);
      showToast(`Successfully imported ${importedRecords.length} guarantee records.`);
    }
  };

  // Quick status update from drawer
  const handleUpdateStatus = (id: string, newStatus: GuaranteeStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, guaranteeStatus: newStatus, updatedAt: new Date().toISOString() } : r))
    );
    if (selectedDetailRecord?.id === id) {
      setSelectedDetailRecord((prev) => (prev ? { ...prev, guaranteeStatus: newStatus } : null));
    }
    showToast(`Status updated to "${newStatus}".`);
  };

  // Reset to initial sample data
  const handleResetData = () => {
    if (confirm('Reset tracker portal to initial commercial sample data? Any unexported local changes will be replaced.')) {
      setRecords(INITIAL_GUARANTEE_RECORDS);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Reset to initial sample records.', 'info');
    }
  };

  const existingCompanies = Array.from(new Set(records.map((r) => r.companyName).filter(Boolean)));
  const existingCustodia = Array.from(new Set(records.map((r) => r.custodia).filter(Boolean)));

  return (
    <div className="min-h-screen bg-[#f3f5f8] flex flex-col selection:bg-[#dfb275] selection:text-[#0b1b2d] text-slate-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl border text-xs font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-700/80 shadow-emerald-950/20'
                : toast.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-700/80 shadow-rose-950/20'
                : 'bg-slate-900 text-amber-200 border-amber-500/40 shadow-slate-950/30'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar & Branding */}
      <Header
        records={records}
        onOpenNewModal={() => {
          setEditingRecord(null);
          setIsRecordModalOpen(true);
        }}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Bank Guarantee Tracker Tag between SharePoint black line and widget cards */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#0b1b2d] text-white flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#dfb275] stroke-[2.2]" />
          </div>
          <h1 className="font-classic text-sm sm:text-base font-bold text-slate-900 tracking-wider uppercase">
            Bank Guarantee Tracker
          </h1>
        </div>

        {/* KPI Metrics & Expiry Alerts */}
        <MetricsCards
          records={records}
          activeFilterStatus={activeFilterStatus}
          onSelectFilterStatus={(status) => setActiveFilterStatus(status)}
        />

        {/* Guarantee Register Table */}
        <RecordsTable
          records={records}
          filterStatusOverride={activeFilterStatus}
          onClearFilterStatusOverride={() => setActiveFilterStatus('ALL')}
          onViewRecord={(rec) => setSelectedDetailRecord(rec)}
          onEditRecord={(rec) => {
            setEditingRecord(rec);
            setIsRecordModalOpen(true);
          }}
          onDuplicateRecord={handleDuplicateRecord}
          onDeleteRecord={handleDeleteRecord}
          onBulkDelete={handleBulkDelete}
          onOpenNewModal={() => {
            setEditingRecord(null);
            setIsRecordModalOpen(true);
          }}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />
      </main>

      {/* Modal: New / Edit Guarantee Form */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        initialData={editingRecord}
        existingCompanies={existingCompanies}
        existingCustodia={existingCustodia}
      />

      {/* Modal: Upload Excel / CSV */}
      <UploadExcelModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Slide-over Drawer: Record Details & Physical Custody View */}
      <RecordDetailDrawer
        record={selectedDetailRecord}
        onClose={() => setSelectedDetailRecord(null)}
        onEdit={(rec) => {
          setSelectedDetailRecord(null);
          setEditingRecord(rec);
          setIsRecordModalOpen(true);
        }}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
