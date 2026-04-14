import React, { useEffect, useState, useRef, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./BookStyleLedgerPreview.css";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FlipBook = HTMLFlipBook;

const BookStyleLedgerPreview = ({ 
    isModal = false, 
    pdfUrl = "/api/download-leads/file?asset=company_profile" 
}) => {
    const flipBookRef = useRef(null);
    const [numPages, setNumPages] = useState(null);
    const [bookDimensions, setBookDimensions] = useState({ width: 500, height: 700 });
    
    // Defaulting to true for visual theme consistency
    const isDarkTheme = true;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loadError, setLoadError] = useState(null);
    const [pdfAspectRatio, setPdfAspectRatio] = useState(1.414); // Default to A4 ratio

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoadError(null);
    };

    const onPageLoadSuccess = (page) => {
        // Calculate the actual aspect ratio of the PDF page
        if (page && page.width && page.height) {
            const ratio = page.height / page.width;
            if (Math.abs(pdfAspectRatio - ratio) > 0.01) {
                setPdfAspectRatio(ratio);
            }
        }
    };

    const onDocumentLoadError = (error) => {
        console.error("PDF load error:", error);
        setLoadError(`Failed to load PDF (${pdfUrl}). Please check the file path.`);
    };

    const calculateBookDimensions = useCallback(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isMobileView = viewportWidth < 768;
        
        // Modal container dimensions
        const containerWidth = isModal ? (isMobileView ? viewportWidth * 0.95 : viewportWidth * 0.98) : viewportWidth;
        const containerHeight = isModal ? viewportHeight * 0.95 : viewportHeight;

        // Use the dynamically detected ratio
        const ratio = pdfAspectRatio;
        
        // Target width: single page if mobile, half container if desktop
        const targetWidth = isMobileView 
            ? Math.min(viewportWidth - 40, 480) 
            : Math.min(900, containerWidth / 2 - 60);

        const targetHeight = targetWidth * ratio; 

        // Enforce max height constraints
        const verticalPadding = isMobileView ? 200 : 120;
        const maxHeight = containerHeight - verticalPadding;
        
        let finalWidth = targetWidth;
        let finalHeight = targetHeight;

        if (finalHeight > maxHeight) {
            finalHeight = maxHeight;
            finalWidth = finalHeight / ratio;
        }

        return {
            width: Math.max(280, Math.floor(finalWidth)),
            height: Math.max(400, Math.floor(finalHeight))
        };
    }, [isModal, pdfAspectRatio]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setBookDimensions(calculateBookDimensions());
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial
        return () => window.removeEventListener('resize', handleResize);
    }, [calculateBookDimensions, pdfAspectRatio]);

    return (
        <section className={isModal ? "p-4 pb-8 bg-transparent flex flex-col items-center justify-center min-h-screen" : "py-20 bg-white flex flex-col items-center min-h-screen"}>
            {!isModal && (
                <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6 uppercase tracking-tighter">Company Profile</h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto font-mono text-xs uppercase tracking-widest">
                        Interactive digital showcase of Nexturn's legacy and capabilities
                    </p>
                </div>
            )}

            <div className={`book-calendar-page relative group/book ${isDarkTheme ? 'dark-theme' : ''}`} style={{ minHeight: isModal ? 'auto' : 'auto', padding: isModal ? '0' : '' }}>
                {bookDimensions.width > 0 && (
                  <div className="relative flex items-center justify-center">
                    {/* Navigation Buttons - Below on Mobile, Side on Desktop */}
                    {numPages && (
                      <>
                        <button 
                          onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
                          className="absolute bottom-[-80px] sm:bottom-auto left-[15%] sm:left-0 translate-x-0 sm:-translate-x-[60%] lg:-translate-x-[100%] z-[70] w-14 h-14 rounded-full bg-zinc-800 sm:bg-white/10 hover:bg-zinc-900 sm:hover:bg-white/20 border border-white/20 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer group/nav"
                          aria-label="Previous page"
                        >
                          <span className="material-symbols-outlined transition-transform group-hover/nav:-translate-x-1">arrow_back</span>
                        </button>
                        <button 
                          onClick={() => flipBookRef.current?.pageFlip().flipNext()}
                          className="absolute bottom-[-80px] sm:bottom-auto right-[15%] sm:right-0 translate-x-0 sm:translate-x-[60%] lg:translate-x-[100%] z-[70] w-14 h-14 rounded-full bg-zinc-800 sm:bg-white/10 hover:bg-zinc-900 sm:hover:bg-white/20 border border-white/20 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer group/nav"
                          aria-label="Next page"
                        >
                          <span className="material-symbols-outlined transition-transform group-hover/nav:translate-x-1">arrow_forward</span>
                        </button>
                      </>
                    )}

                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                            <div className="flex flex-col items-center justify-center space-y-4 py-20">
                                <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
                                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Preparing Profile...</p>
                            </div>
                        }
                        className="flex flex-col items-center"
                    >
                        {loadError && (
                            <div className="text-red-500 font-mono text-sm p-10 bg-red-50 rounded-xl">
                                {loadError}
                            </div>
                        )}
                        
                        {numPages && (
                            <FlipBook
                                key={`flipbook-${pdfAspectRatio}-${isMobile}`} 
                                ref={flipBookRef}
                                width={bookDimensions.width}
                                height={bookDimensions.height}
                                showCover={true}
                                mobileScrollSupport={true}
                                className="flipbook"
                                flippingTime={800}
                                useMouseEvents={true}
                                clickEventForward={true}
                                swipeDistance={30}
                                showPageCorners={true}
                                startPage={0}
                                size="fixed"
                                maxShadowOpacity={0.6}
                                usePortrait={isMobile}
                                autoSize={true}
                                drawShadow={true}
                                minWidth={isMobile ? 280 : 300}
                                maxWidth={isMobile ? 500 : 1000}
                                minHeight={isMobile ? 400 : 400}
                                maxHeight={isMobile ? 800 : 1200}
                            >
                                {/* FIRST PAGE: COVER IMAGE */}
                                <div className="page bg-white border-zinc-800" key="cover-page">
                                    <div className="w-full h-full relative overflow-hidden">
                                        <img 
                                            src="/company_profile.webp" 
                                            alt="Company Profile Cover" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                                    </div>
                                </div>

                                {/* INNER PAGES: PDF CONTENT */}
                                {Array.from(new Array(numPages), (el, index) => (
                                    <div className="page bg-white border-zinc-800" key={`pdf_page_${index + 1}`}>
                                        <Page 
                                            pageNumber={index + 1} 
                                            width={bookDimensions.width} // Use full width
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            onLoadSuccess={onPageLoadSuccess} // Trigger for all pages to ensure detection
                                            className="pdf-page-container"
                                        />
                                        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-zinc-400 opacity-30 font-mono">
                                            {index + 1} / {numPages}
                                        </div>
                                    </div>
                                ))}

                                {/* LAST PAGE: BACK COVER IMAGE */}
                                <div className="page bg-white border-zinc-800" key="back-cover-page">
                                    <div className="w-full h-full relative overflow-hidden">
                                        <img 
                                            src="/company_profile.webp" 
                                            alt="Company Profile Back Cover" 
                                            className="w-full h-full object-cover grayscale opacity-80"
                                        />
                                        <div className="absolute inset-0 bg-zinc-900/40 flex items-center justify-center">
                                            <img src="/nexturn.png" alt="Nexturn Logo" className="w-32 opacity-90" />
                                        </div>
                                    </div>
                                </div>
                            </FlipBook>
                        )}
                    </Document>
                  </div>
                )}
            </div>
        </section>
    );
};

export default BookStyleLedgerPreview;
