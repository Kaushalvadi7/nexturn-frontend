import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

const getProductImages = (product) => {
  const images = Array.isArray(product?.images) ? product.images : [];
  const imageUrls = images
    .sort((a, b) => {
      if (a?.is_primary && !b?.is_primary) return -1;
      if (!a?.is_primary && b?.is_primary) return 1;
      return (a?.sort_order ?? 0) - (b?.sort_order ?? 0);
    })
    .map((img) => img?.image_url)
    .filter(Boolean);

  if (imageUrls.length > 0) {
    return imageUrls;
  }

  if (product?.image) {
    return [product.image];
  }

  return [];
};

const ProductDetails = () => {
  const location = useLocation();
  const product = location.state?.material || null;

  const images = useMemo(() => getProductImages(product), [product]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  if (!product) {
    return (
      <div className="bg-[#fafbfc] min-h-screen pt-20 md:pt-32 pb-20 font-['Source_Sans_3',sans-serif]">
        <section className="px-4 sm:px-6 lg:px-8 max-w-[960px] mx-auto">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-12 text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-black text-[#1E3A5F]">Product not available</h1>
            <p className="text-slate-500 text-sm md:text-base font-medium">
              Open this page from the product list to load the selected product details.
            </p>
            <div className="pt-2">
              <Link
                to="/product-list"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E3A5F] text-white rounded-xl font-black text-xs uppercase tracking-widest"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#fafbfc] min-h-screen pt-16 md:pt-20 pb-16 font-['Source_Sans_3',sans-serif]">
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="hover:text-[#1E3A5F] transition-colors flex-shrink-0">Home</Link>
          <span className="material-symbols-outlined text-[10px] flex-shrink-0">chevron_right</span>
          <Link to="/product-list" className="hover:text-[#1E3A5F] transition-colors flex-shrink-0">Products</Link>
          <span className="material-symbols-outlined text-[10px] flex-shrink-0">chevron_right</span>
          <span className="text-[#1E3A5F] flex-shrink-0">{product.name}</span>
        </nav>

        <div className="space-y-8">
          {/* Header Section */}
          <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1 space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium break-words whitespace-pre-wrap">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex shrink-0 lg:ml-8">
              {product.category?.name && (
                <span className="text-[#e17000] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] bg-[#e17000]/5 px-3 py-1.5 rounded-lg border border-[#e17000]/10">
                 Category : {product.category.name}
                </span>
              )}
            </div>
          </div>

          {/* Image Grid Section */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e17000] border-b border-slate-100 pb-4">
              Product Showcase
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {images.length > 0 ? (
                images.map((img, idx) => (
                  <div 
                    key={`${img}-${idx}`} 
                    onClick={() => setSelectedImage(img)}
                    className="group cursor-pointer bg-white rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-500 relative aspect-square"
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${idx + 1}`} 
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 text-4xl">
                        fullscreen
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 p-12 text-center">
                  <span className="material-symbols-outlined text-slate-300 text-5xl mb-4">image_not_supported</span>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No images available for this product</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Section */}
          <div className="flex flex-col sm:flex-row gap-4 pt-12 border-t border-slate-100">
            <Link
              to="/contact-us#quote-form"
              className="px-10 py-5 bg-[#1E3A5F] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#12243d] transition-all shadow-xl shadow-[#1E3A5F]/20 flex items-center justify-center gap-4 group"
            >
              <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">send</span>
              Request Quote
            </Link>
            <Link
              to="/product-list"
              className="px-10 py-5 bg-white text-[#1E3A5F] border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-4"
            >
              View More Products
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal using Portal */}
      {selectedImage && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="fixed top-6 right-6 md:top-12 md:right-12 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all z-[10000] backdrop-blur-xl border border-white/10 flex items-center justify-center group shadow-2xl"
          >
            <span className="material-symbols-outlined text-2xl font-bold group-hover:rotate-90 transition-transform duration-300">close</span>
          </button>

          <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt={product.name}
              className="max-w-[95vw] max-h-[85vh] md:max-h-[90vh] object-contain rounded-lg md:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-8 duration-500"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductDetails;
