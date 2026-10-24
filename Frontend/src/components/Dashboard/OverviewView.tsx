import React, { useState, useMemo } from 'react';
import { ApplicationRecord, ReviewStatus } from '../../types';
import { 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileCheck 
} from 'lucide-react';

interface OverviewViewProps {
  applications: ApplicationRecord[];
  onSelectApplication: (app: ApplicationRecord) => void;
  searchQuery: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  applications,
  onSelectApplication,
  searchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'id' | 'institutionName' | 'submissionDate' | 'status'>('submissionDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const metrics = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'Pending Scrutiny' || a.status === 'Under Review').length;
    const attention = applications.filter(a => a.status === 'Action Required' || a.status === 'Escalated').length;
    const completed = applications.filter(a => a.status === 'Approved' || a.status === 'Returned for Correction').length;
    return { total, pending, attention, completed };
  }, [applications]);

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        !searchQuery ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.assignedReviewer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || app.applicationType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        const compare = valA.localeCompare(valB as string);
        return sortOrder === 'asc' ? compare : -compare;
      }
      return 0;
    });
  }, [applications, searchQuery, statusFilter, typeFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage) || 1;
  const paginatedApps = filteredApps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field: 'id' | 'institutionName' | 'submissionDate' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Approved</span>
          </span>
        );
      case 'Action Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-400/30">
            <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Action Required</span>
          </span>
        );
      case 'Escalated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/15 text-rose-300 border border-rose-400/30">
            <AlertCircle className="w-3.5 h-3.5 text-rose-300 shrink-0" />
            <span>Escalated</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#111F33] text-[#F6F0D5] border border-[#F6F0D5]/20">
            <Clock className="w-3.5 h-3.5 text-[#D9CEAA]" />
            <span>Under Review</span>
          </span>
        );
      case 'Returned for Correction':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#0E1A2B] text-[#D9CEAA] border border-[#F6F0D5]/15">
            <FileCheck className="w-3.5 h-3.5 text-[#D9CEAA]" />
            <span>Returned</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#0C1624] text-[#D9CEAA]/70 border border-[#F6F0D5]/15">
            <Clock className="w-3.5 h-3.5 text-[#D9CEAA]/70 shrink-0" />
            <span>Pending Scrutiny</span>
          </span>
        );
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto text-[#F6F0D5] bg-[#0C1624]">
      {/* SUMMARY METRICS */}
      <section 
        aria-label="Summary Metrics" 
        className="bg-[#111F33] border border-[#F6F0D5]/15 rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#F6F0D5]/15">
          <div className="py-2 lg:py-0 lg:px-6 first:pl-0">
            <div className="text-[11px] uppercase tracking-wider text-[#D9CEAA]/70 font-semibold mb-1">
              Total Applications
            </div>
            <div className="text-3xl font-semibold text-[#F6F0D5] tracking-tight">
              {metrics.total}
            </div>
            <div className="text-xs text-[#D9CEAA]/70 mt-1 flex items-center gap-1">
              <span>All technical programs</span>
            </div>
          </div>

          <div className="py-2 lg:py-0 lg:px-6">
            <div className="text-[11px] uppercase tracking-wider text-[#D9CEAA]/70 font-semibold mb-1">
              Pending Scrutiny
            </div>
            <div className="text-3xl font-semibold text-[#F6F0D5] tracking-tight">
              {metrics.pending}
            </div>
            <div className="text-xs text-[#D9CEAA]/70 mt-1 flex items-center gap-1">
              <span>Under initial review</span>
            </div>
          </div>

          <div className="py-2 lg:py-0 lg:px-6">
            <div className="text-[11px] uppercase tracking-wider text-[#D9CEAA]/70 font-semibold mb-1">
              Requiring Attention
            </div>
            <div className="text-3xl font-semibold text-[#F6F0D5] tracking-tight flex items-baseline gap-2">
              <span>{metrics.attention}</span>
              <span className="text-xs font-normal text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                Discrepancies
              </span>
            </div>
            <div className="text-xs text-[#D9CEAA]/70 mt-1">
              <span>Action or escalation</span>
            </div>
          </div>

          <div className="py-2 lg:py-0 lg:px-6 last:pr-0">
            <div className="text-[11px] uppercase tracking-wider text-[#D9CEAA]/70 font-semibold mb-1">
              Completed Reviews
            </div>
            <div className="text-3xl font-semibold text-[#F6F0D5] tracking-tight">
              {metrics.completed}
            </div>
            <div className="text-xs text-[#D9CEAA]/70 mt-1">
              <span>Approvals and returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT APPLICATIONS TABLE SECTION */}
      <section className="bg-[#111F33] border border-[#F6F0D5]/15 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 sm:p-6 border-b border-[#F6F0D5]/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#F6F0D5] tracking-tight">
              Recent Institutional Applications
            </h2>
            <p className="text-xs text-[#D9CEAA]/70 mt-0.5">
              Select any application to open the dedicated scrutiny workspace and inspect supporting evidence.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-[#0C1624] border border-[#F6F0D5]/15 rounded-xl px-2.5 py-1.5 text-[#F6F0D5]">
              <Filter className="w-3.5 h-3.5 text-[#D9CEAA]/70" />
              <label htmlFor="status-filter-select" className="text-[#D9CEAA]/70">Status:</label>
              <select
                id="status-filter-select"
                aria-label="Filter by review status"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer text-[#F6F0D5]"
              >
                <option value="ALL" className="bg-[#0C1624]">All Statuses</option>
                <option value="Action Required" className="bg-[#0C1624]">Action Required</option>
                <option value="Pending Scrutiny" className="bg-[#0C1624]">Pending Scrutiny</option>
                <option value="Under Review" className="bg-[#0C1624]">Under Review</option>
                <option value="Approved" className="bg-[#0C1624]">Approved</option>
                <option value="Escalated" className="bg-[#0C1624]">Escalated</option>
                <option value="Returned for Correction" className="bg-[#0C1624]">Returned</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#0C1624] border border-[#F6F0D5]/15 rounded-xl px-2.5 py-1.5 text-[#F6F0D5]">
              <label htmlFor="type-filter-select" className="text-[#D9CEAA]/70">Type:</label>
              <select
                id="type-filter-select"
                aria-label="Filter by application type"
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer text-[#F6F0D5]"
              >
                <option value="ALL" className="bg-[#0C1624]">All Categories</option>
                <option value="Extension of Approval (EOA)" className="bg-[#0C1624]">EOA</option>
                <option value="New Technical Institution" className="bg-[#0C1624]">New Institution</option>
                <option value="Increase in Approved Intake" className="bg-[#0C1624]">Increase in Intake</option>
                <option value="Introduction of Emerging Tech" className="bg-[#0C1624]">Emerging Tech</option>
              </select>
            </div>

            {(statusFilter !== 'ALL' || typeFilter !== 'ALL' || searchQuery) && (
              <button
                onClick={() => { setStatusFilter('ALL'); setTypeFilter('ALL'); }}
                className="text-xs text-[#F6F0D5] underline px-2 py-1 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#F6F0D5]">
            <thead className="bg-[#0C1624] border-b border-[#F6F0D5]/15 text-[#D9CEAA]/80 font-semibold uppercase text-[11px] tracking-wider select-none">
              <tr>
                <th 
                  onClick={() => toggleSort('id')}
                  className="py-3 px-5 cursor-pointer hover:text-[#F6F0D5] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Application ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('institutionName')}
                  className="py-3 px-5 cursor-pointer hover:text-[#F6F0D5] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Institution Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-5">Application Type</th>
                <th 
                  onClick={() => toggleSort('submissionDate')}
                  className="py-3 px-5 cursor-pointer hover:text-[#F6F0D5] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Submission</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('status')}
                  className="py-3 px-5 cursor-pointer hover:text-[#F6F0D5] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Review Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-5">Assigned Reviewer</th>
                <th className="py-3 px-5">Last Updated</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F0D5]/10">
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#D9CEAA]/60">
                    No application records match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => (
                  <tr 
                    key={app.id}
                    onClick={() => onSelectApplication(app)}
                    className="hover:bg-[#162740] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-5 font-mono text-[#F6F0D5] font-semibold whitespace-nowrap">
                      {app.id}
                    </td>

                    <td className="py-3.5 px-5 max-w-xs">
                      <div className="font-semibold text-[#F6F0D5] group-hover:text-white line-clamp-1">
                        {app.institutionName}
                      </div>
                      <div className="text-[11px] text-[#D9CEAA]/70">
                        {app.state} • {app.region} Region
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-[#F6F0D5]/90">
                      <div>{app.applicationType}</div>
                      <div className="text-[10px] text-[#D9CEAA]/60">{app.program}</div>
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap text-[#D9CEAA]/70 font-mono text-[11px]">
                      {app.submissionDate}
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="text-[#F6F0D5] font-medium">{app.assignedReviewer}</div>
                      <div className="text-[10px] text-[#D9CEAA]/60 truncate max-w-[140px]">{app.reviewerRole}</div>
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap text-[#D9CEAA]/70 font-mono text-[11px]">
                      {app.lastUpdated}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectApplication(app);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F6F0D5] text-[#0C1624] hover:bg-white transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Scrutinize</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-4 border-t border-[#F6F0D5]/15 bg-[#0C1624] flex items-center justify-between text-xs text-[#D9CEAA]/80">
          <div>
            Showing <span className="font-semibold text-[#F6F0D5]">{paginatedApps.length}</span> of <span className="font-semibold text-[#F6F0D5]">{filteredApps.length}</span> records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#F6F0D5]/20 hover:bg-[#162740] text-[#F6F0D5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-[#F6F0D5]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#F6F0D5]/20 hover:bg-[#162740] text-[#F6F0D5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
