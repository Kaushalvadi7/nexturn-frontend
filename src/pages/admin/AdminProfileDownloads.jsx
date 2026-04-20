import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { getCompanyProfileDownloads } from "../../lib/api";

const ITEMS_PER_PAGE = 10;

const formatTimestamp = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const buildPageWindow = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) return [1, 2, 3, 4, 5, -1, totalPages];
  if (currentPage >= totalPages - 3) {
    return [
      1,
      -1,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
};

const AdminProfileDownloads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, dateRange.start, dateRange.end]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await getCompanyProfileDownloads({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          email: debouncedSearchTerm || undefined,
          startDate: dateRange.start || undefined,
          endDate: dateRange.end || undefined,
        });

        if (!active) return;
        const nextRows = Array.isArray(response?.data) ? response.data : [];
        const nextPagination = response?.pagination || {};

        setRows(
          nextRows.map((item) => ({
            id: item.id,
            name: item.name || "-",
            email: item.email || "-",
            timestamp: formatTimestamp(item.created_at || item.createdAt),
          })),
        );
        setPagination({
          page: Number(nextPagination.page || currentPage),
          limit: Number(nextPagination.limit || ITEMS_PER_PAGE),
          total: Number(nextPagination.total || 0),
          totalPages: Number(nextPagination.totalPages || 0),
        });
      } catch (error) {
        if (!active) return;
        setRows([]);
        setPagination({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          total: 0,
          totalPages: 0,
        });
        setLoadError(error?.message || "Failed to load profile downloads.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [currentPage, debouncedSearchTerm, dateRange.start, dateRange.end]);

  const visibleFrom =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const visibleTo =
    pagination.total === 0
      ? 0
      : Math.min(pagination.page * pagination.limit, pagination.total);

  const pageWindow = useMemo(
    () => buildPageWindow(currentPage, Math.max(1, pagination.totalPages)),
    [currentPage, pagination.totalPages],
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const tableColumn = ["NAME", "EMAIL ADDRESS", "DOWNLOAD TIMESTAMP"];
    const tableRows = rows.map((lead) => [
      lead.name,
      lead.email,
      lead.timestamp,
    ]);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Company Profile Downloads", 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${pagination.page} of ${Math.max(1, pagination.totalPages)} | Total ${pagination.total}`,
      14,
      25,
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255] },
    });

    const dateStr = new Date().toISOString().split("T")[0];
    doc.save(`Nexturn_Profile_Downloads_${dateStr}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
              <span className="material-symbols-outlined text-base">
                download
              </span>
              LEAD TRACKING
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              Company Profile Downloads
            </h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              View and export users who submitted details before downloading the
              company profile.
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 shrink-0"
            disabled={rows.length === 0}
          >
            <span className="material-symbols-outlined text-sm">
              picture_as_pdf
            </span>
            Export PDF
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-black/50 uppercase tracking-widest mb-1">
                Total Leads
              </p>
              <h4 className="text-3xl font-black text-slate-900">
                {pagination.total}
              </h4>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">group</span>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">
                Search Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">
                From Date
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  calendar_today
                </span>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">
                To Date
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  event
                </span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {loadError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-4 text-sm font-semibold">
            {loadError}
          </div>
        ) : null}

        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">
                    Full Name
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">
                    Email Address
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-8 py-12 text-center text-slate-400 font-medium italic"
                    >
                      Loading profile downloads...
                    </td>
                  </tr>
                ) : rows.length > 0 ? (
                  rows.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <span className="font-black text-black text-sm">
                          {lead.name}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-blue-600 underline cursor-pointer">
                          {lead.email}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-400 text-sm">
                            schedule
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {lead.timestamp}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-8 py-12 text-center text-slate-400 font-medium italic"
                    >
                      No profile downloads found for current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">
                Showing {visibleFrom} to {visibleTo} of {pagination.total} leads
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    chevron_left
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  {pageWindow.map((page, index) =>
                    page === -1 ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-slate-400 font-bold"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-slate-900 text-white shadow-lg"
                            : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(pagination.totalPages, p + 1),
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProfileDownloads;
