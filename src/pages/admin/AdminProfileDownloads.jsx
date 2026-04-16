import React, { useState, useMemo, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminProfileDownloads = () => {
  // Static data as requested
  const staticLeads = [
    { id: 1, name: "Aarav Sharma", email: "aarav.sharma@example.com", timestamp: "2026-04-16 10:30:00" },
    { id: 2, name: "Ishani Patel", email: "ishani.p@industrial.in", timestamp: "2026-04-16 11:15:20" },
    { id: 3, name: "Marcus Webber", email: "m.webber@globaltech.com", timestamp: "2026-04-16 14:05:10" },
    { id: 4, name: "Kunal Mehra", email: "kunal.m@precisionmolds.com", timestamp: "2026-04-16 15:45:00" },
    { id: 5, name: "Sarah Jenkins", email: "s.jenkins@ukmanufacture.co.uk", timestamp: "2026-04-16 16:20:00" },
    { id: 6, name: "Rajesh Gupta", email: "rajesh.gupta@autoparts.com", timestamp: "2026-04-15 09:12:30" },
    { id: 7, name: "Elena Rodriguez", email: "elena.r@eurotech.es", timestamp: "2026-04-15 13:45:15" },
    { id: 8, name: "David Chen", email: "d.chen@shanghaicnc.cn", timestamp: "2026-04-15 16:30:45" },
    { id: 9, name: "Oliver Smith", email: "oliver.smith@example.com", timestamp: "2026-04-14 10:00:00" },
    { id: 10, name: "Sophia Jones", email: "sophia.j@tech.com", timestamp: "2026-04-14 11:30:00" },
    { id: 11, name: "Lucas Brown", email: "lucas.b@design.net", timestamp: "2026-04-14 14:20:00" },
    { id: 12, name: "Mia Wilson", email: "mia.w@corp.org", timestamp: "2026-04-14 16:10:00" },
    { id: 13, name: "Ethan Garcia", email: "ethan.g@web.io", timestamp: "2026-04-13 09:45:00" },
    { id: 14, name: "Isabella Martinez", email: "isabella.m@service.biz", timestamp: "2026-04-13 12:15:00" },
    { id: 15, name: "Amos Miller", email: "amos.m@factory.in", timestamp: "2026-04-13 15:30:00" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLeads = useMemo(() => {
    return staticLeads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const leadDate = lead.timestamp.split(" ")[0];
      const matchesDate = 
        (!dateRange.start || leadDate >= dateRange.start) &&
        (!dateRange.end || leadDate <= dateRange.end);
      
      return matchesSearch && matchesDate;
    });
  }, [searchTerm, dateRange]);

  // Handle page reset on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateRange]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - (margin * 2);

    // 1. Premium Background Layer
    doc.setFillColor(252, 252, 254); 
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Decorative blurred shapes
    doc.setFillColor(240, 244, 255);
    doc.roundedRect(-20, -20, 100, 100, 50, 50, 'F');
    doc.setFillColor(255, 248, 240);
    doc.roundedRect(pageWidth - 60, pageHeight - 60, 100, 100, 50, 50, 'F');

    // --- 2. HEADER (Letterhead) ---
    const companyName = "NEXTURN COMPONENTCRAFT PVT. LTD.";
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    
    const textWidth = doc.getTextWidth(companyName);
    const logoWidth = 19; 
    const logoHeight = 16;
    const spacing = 5; 
    const totalWidth = logoWidth + spacing + textWidth;
    const startX = (pageWidth - totalWidth) / 2;

    try {
      doc.addImage(
        '/images/Screenshot_2026-03-18_182531-removebg-preview.webp', 
        startX, 
        7.4, 
        logoWidth, 
        logoHeight
      );
    } catch (e) {}

    doc.setTextColor(17, 24, 39);
    doc.text(companyName, startX + logoWidth + spacing, 18.5);
    
    doc.setDrawColor(100, 116, 139); // Slate-500
    doc.setLineWidth(0.8);
    doc.line(margin, 28, pageWidth - margin, 28);

    // 3. Document Title Bar
    let y = 35;
    doc.setFillColor(31, 41, 55); 
    doc.rect(margin, y, contentWidth, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("OFFICIAL PROFILE DOWNLOAD RECORD", margin + 4, y + 6.5);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, pageWidth - margin - 4, y + 6.5, { align: 'right' });

    y += 18;

    // 4. Data Table
    const tableColumn = ["NAME", "EMAIL ADDRESS", "DOWNLOAD TIMESTAMP"];
    const tableRows = filteredLeads.map(lead => [
      lead.name.toUpperCase(),
      lead.email,
      lead.timestamp
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: y,
      theme: 'grid',
      styles: { 
        fontSize: 8, 
        cellPadding: 4,
        font: 'helvetica',
        textColor: [15, 23, 42]
      },
      headStyles: { 
        fillColor: [31, 41, 55], 
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left'
      },
      alternateRowStyles: { 
        fillColor: [248, 250, 252] 
      },
      margin: { left: margin, right: margin }
    });

    // 5. Footer branding
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.8);
    doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 24, 39);
    doc.text("info@nexturn.com", margin, pageHeight - 12);
    doc.text("Page 1 of 1", pageWidth - margin, pageHeight - 12, { align: 'right' });

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`Nexturn_Profile_Downloads_${dateStr}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
               <span className="material-symbols-outlined text-base">download</span>
               LEAD TRACKING
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Company Profile Downloads</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              View and export a list of potential clients who have downloaded your digital company profile.
            </p>
          </div>
          
          <button 
            onClick={handleDownloadPDF}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            Export Official PDF
          </button>
        </div>

        {/* Stats & Filters Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-black/50 uppercase tracking-widest mb-1">Total Leads</p>
              <h4 className="text-3xl font-black text-slate-900">{filteredLeads.length}</h4>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
               <span className="material-symbols-outlined">group</span>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Search */}
             <div className="space-y-2">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Search Leads</label>
                <div className="relative">
                   <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                   <input 
                    type="text" 
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                   />
                </div>
             </div>

             {/* Date Start */}
             <div className="space-y-2">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">From Date</label>
                <div className="relative">
                   <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">calendar_today</span>
                   <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                   />
                </div>
             </div>

             {/* Date End */}
             <div className="space-y-2">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">To Date</label>
                <div className="relative">
                   <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">event</span>
                   <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                   />
                </div>
             </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">Full Name</th>
                  <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">Email Address</th>
                  <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">Digital Signature (Timestamp)</th>
                  <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLeads.length > 0 ? paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-black text-black text-sm">{lead.name}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-blue-600 underline cursor-pointer">{lead.email}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-slate-400 text-sm">schedule</span>
                         <span className="text-sm font-bold text-slate-700">{lead.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                         Downloaded
                       </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-medium italic">
                      No matching leads found for the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
              </p>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        currentPage === i + 1 
                        ? "bg-slate-900 text-white shadow-lg" 
                        : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
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
