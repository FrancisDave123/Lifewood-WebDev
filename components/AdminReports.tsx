import React, { useState } from 'react';
import {
  BookOpen,
  ClipboardList,
  Download,
  FileSpreadsheet,
  LayoutDashboard,
  Loader2,
  Mail,
  Menu,
  UserCircle2
} from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminProfileModal } from './AdminProfileModal';
import { useProfile } from './ProfileContext';
import { ROLE_OPTIONS } from './adminProfile';
import { generateApplicantsExcel } from '../services/generateApplicantsExcel';
import type { PageRoute } from '../routes/routeTypes';

interface AdminReportsProps {
  navigateTo?: (page: PageRoute) => void;
}

type ReportFormat = 'excel' | 'pdf' | 'word';

export const AdminReports: React.FC<AdminReportsProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profile, adminGmail, saveProfile } = useProfile();
  const [selectedFormats, setSelectedFormats] = useState<ReportFormat[]>(['excel']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const toggleFormat = (fmt: ReportFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    );
  };

  const handleGenerate = async () => {
    if (selectedFormats.length === 0) {
      setGenerateError('Please select at least one format.');
      return;
    }
    setGenerateError('');
    setIsGenerating(true);
    try {
      if (selectedFormats.includes('excel')) {
        await generateApplicantsExcel();
      }
      // PDF and Word: coming soon
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Failed to generate report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sidebarItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-dashboard');
      }
    },
    {
      label: 'Applicants',
      icon: ClipboardList,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-manage-applicants');
      }
    },
    {
      label: 'Inquiries',
      icon: Mail,
      onClick: () => {
        setIsSidebarOpen(false);
        navigateTo?.('admin-manage-inquiries');
      }
    },
    {
      label: 'Reports',
      icon: BookOpen,
      active: true,
      onClick: () => setIsSidebarOpen(false)
    }
  ];

  return (
    <section className="min-h-screen bg-transparent lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onEditProfile={() => {
            setIsSidebarOpen(false);
            setIsProfileOpen(true);
          }}
          onSignOut={() => navigateTo?.('signin')}
          onHome={() => navigateTo?.('home')}
          profileName={`${profile.firstName} ${profile.lastName}`.trim()}
          profileRole={ROLE_OPTIONS.find((r) => r.id === profile.roleId)?.label || 'Internal Access'}
          avatarSrc={profile.avatarUrl}
          items={sidebarItems}
        />

        <main className="relative flex-1 overflow-hidden p-4 md:p-6 animate-pop-out opacity-0 lg:h-screen lg:overflow-y-auto">
          <div className="relative z-10 mx-auto max-w-6xl space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-lifewood-serpent/10 bg-white p-3 lg:hidden">
              <button type="button" onClick={() => setIsSidebarOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-lifewood-serpent px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white">
                <Menu className="h-4 w-4" />Menu
              </button>
              <button type="button" onClick={() => navigateTo?.('signin')} className="rounded-xl border border-lifewood-serpent/15 px-3 py-2 text-xs font-semibold text-lifewood-serpent">Sign out</button>
            </div>

            <div className="rounded-3xl border border-lifewood-serpent/10 bg-white p-5 shadow-[0_16px_50px_rgba(19,48,32,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lifewood-green">Reports</p>
              <h1 className="mt-1 text-2xl font-black text-lifewood-serpent md:text-3xl">Generate Reports</h1>
              <p className="mt-2 text-sm text-lifewood-serpent/65">
                Export applicant data directly from the database into your preferred format.
              </p>

              <div className="mt-5">
                <div className="rounded-2xl border border-lifewood-serpent/10 bg-lifewood-seaSalt/60 p-5">
                  <div className="mb-4 inline-flex rounded-xl bg-lifewood-green/10 p-2 text-lifewood-green">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <p className="text-base font-bold text-lifewood-serpent">Generate Applicants Report</p>
                  <p className="mt-1 text-xs text-lifewood-serpent/60">
                    Exports all applicant data from the database including status, designation, school, and CV details.
                  </p>

                  {/* Format checkboxes */}
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">Select Format</p>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-lifewood-serpent/15 bg-white px-4 py-2.5 text-sm font-semibold text-lifewood-serpent transition hover:border-lifewood-green/40 has-[:checked]:border-lifewood-green has-[:checked]:bg-lifewood-green/5">
                        <input
                          type="checkbox"
                          checked={selectedFormats.includes('excel')}
                          onChange={() => toggleFormat('excel')}
                          className="h-4 w-4 rounded border-lifewood-serpent/30 text-lifewood-green focus:ring-lifewood-green"
                        />
                        <FileSpreadsheet className="h-4 w-4 text-lifewood-green" />
                        Excel (.xlsx)
                      </label>
                      {/* <label className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-lifewood-serpent/10 bg-lifewood-serpent/5 px-4 py-2.5 text-sm font-semibold text-lifewood-serpent/40 opacity-60">
                        <input type="checkbox" disabled className="h-4 w-4 rounded border-lifewood-serpent/20" />
                        <Download className="h-4 w-4" />
                        PDF — Coming Soon
                      </label>
                      <label className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-lifewood-serpent/10 bg-lifewood-serpent/5 px-4 py-2.5 text-sm font-semibold text-lifewood-serpent/40 opacity-60">
                        <input type="checkbox" disabled className="h-4 w-4 rounded border-lifewood-serpent/20" />
                        <Download className="h-4 w-4" />
                        Word — Coming Soon
                      </label> */}
                    </div>
                  </div>

                  {/* Sheet preview when Excel is selected */}
                  {selectedFormats.includes('excel') && (
                    <div className="mt-4 rounded-xl border border-lifewood-green/20 bg-white p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-lifewood-serpent/60">Sheets included in Excel export</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Applicants',
                          'Applicants per Day',
                          'Summary of Applicants',
                          'Applicants Hired',
                          'Applicants Rejected',
                          'Pending Applicants',
                        ].map((sheet) => (
                          <span key={sheet} className="inline-flex items-center rounded-full bg-lifewood-green/10 px-3 py-1 text-xs font-semibold text-lifewood-green">
                            {sheet}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {generateError && (
                    <p className="mt-3 text-xs font-semibold text-red-600">{generateError}</p>
                  )}

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating || selectedFormats.length === 0}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                        isGenerating || selectedFormats.length === 0
                          ? 'cursor-not-allowed bg-lifewood-serpent/15 text-lifewood-serpent/40'
                          : 'bg-lifewood-green text-white shadow-sm hover:bg-lifewood-green/90'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Generate Report
                        </>
                      )}
                    </button>
                    {selectedFormats.length === 0 && (
                      <p className="mt-2 text-xs text-lifewood-serpent/50">Select at least one format to generate.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AdminProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        adminGmail={adminGmail}
        authUserId={null}
        onSave={saveProfile}
      />
    </section>
  );
};

export default AdminReports;
