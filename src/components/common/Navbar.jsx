import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useContactInfo } from "./contactInfo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { hrefs } = useContactInfo();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setOpenMobileSubmenu(null); // Reset submenus when closing
  };

  const toggleMobileSubmenu = (itemName) => {
    setOpenMobileSubmenu(openMobileSubmenu === itemName ? null : itemName);
  };

  const navItems = [
    {
      name: "Home",
      href: "/",
      children: [
        // { name: "Hero", href: "/#hero" },
        { name: "Manufacturing Capabilities", href: "/#capabilities" },
        { name: "Materials Specialization", href: "/#materials" },
        { name: "Quality Process", href: "/#quality-system" },
        { name: "Export Experience", href: "/#export-experience" },
        { name: "Regions we serve", href: "/#regions-we-serve" },
      ],
    },
    {
      name: "About Us",
      href: "/about-us",
      children: [
        {
          name: "Engineering Precision",
          href: "/about-us#engineering-precision",
        },
        { name: "Export Journey", href: "/about-us#journey-timeline" },
        {
          name: "Manufacturing Infrastructure",
          href: "/about-us#manufacturing-infrastructure",
        },
        { name: "Leadership", href: "/about-us#expertise-leadership" },
        { name: "Manufacturing Facility", href: "/about-us#manufacturing-facilities" },
        { name: "Success Stories", href: "/about-us#success-stories" },
      ],
    },
    {
      name: "Products",
      href: "/products",
      children: [{ name: "Categories", href: "/products#materials" }],
    },
    {
      name: "Quality Inspection",
      href: "/quality-inspection",
      children: [
        { name: "Quality Process", href: "/quality-inspection#process" },
        { name: "Quality Equipment", href: "/quality-inspection#equipment" },
        { name: "Certifications", href: "/quality-inspection#certifications" },
      ],
    },
    {
      name: "Contact Us",
      href: "/contact-us",
      children: [
        { name: "Contact Options", href: "/contact-us#contact-options" },
        { name: "Request a Quote", href: "/contact-us#quote-form" },
        { name: "FAQ", href: "/contact-us#faq" },
      ],
    },
  ];

  const isActiveLink = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const scrollToTop = () => {
    if (window.smoother && typeof window.smoother.scrollTo === "function") {
      window.smoother.scrollTo(0, true);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBrandClick = (event) => {
    event.preventDefault();
    setIsMenuOpen(false);
    setOpenMobileSubmenu(null);

    if (location.pathname !== "/" || location.hash) {
      navigate("/");
      requestAnimationFrame(scrollToTop);
      return;
    }

    scrollToTop();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            onClick={handleBrandClick}
            className="flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer"
          >
            <div className="home-hero-bg-premium w-12 sm:w-16 h-12 sm:h-14 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
              <img 
                src="/images/Screenshot_2026-03-18_182531-removebg-preview.webp" 
                alt="Nexturn Logo" 
                className="h-8 sm:h-10 w-auto object-contain transform scale-[1.5]"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[23px] sm:text-[27px] font-extrabold uppercase text-[#1B365D] leading-none tracking-normal inline-block transform scale-x-[0.95]" style={{ fontFamily: "'Syne', sans-serif" }}>
                NEXTURN
              </span>
              <span className="text-[10px] sm:text-[12.5px] font-bold text-[#1B365D]/85 uppercase tracking-[0.12em] whitespace-nowrap mt-1 pl-2">
                Componentcraft Pvt. Ltd.
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8 h-full">
            {navItems.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <div key={item.name} className="relative group h-full">
                  <Link
                    to={item.href}
                    className={`text-[10px] xl:text-[11px] font-bold h-full flex items-center gap-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "border-accent text-accent"
                        : "border-transparent text-black/70 hover:text-accent"
                    }`}
                  >
                    {item.name}
                    {item.children && (
                      <span className="material-symbols-outlined text-sm xl:text-base transition-transform group-hover:rotate-180">
                        expand_more
                      </span>
                    )}
                  </Link>

                  {item.children && (
                    <div className="absolute top-16 left-0 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                      <div className="space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={`${item.name}-${child.href}`}
                            to={child.href}
                            className="flex items-center justify-between px-4 py-3 rounded-xl transition-all text-slate-600 hover:bg-slate-50 hover:text-black"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                              {child.name}
                            </span>
                            <span className="material-symbols-outlined text-sm">
                              arrow_forward
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 xl:gap-4 shrink-0">
            {/* <div className="hidden lg:block">
              <LanguageSelector />
            </div> */}
            <a
              href={hrefs.whatsapp || "#"}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#22bf5c] text-white px-3 xl:px-5 py-2 sm:py-2.5 rounded font-bold text-xs xl:text-sm shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.89 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
            <Link
              to="/contact-us#quote-form"
              className="hidden sm:block bg-accent hover:bg-orange-700 text-white px-3 xl:px-6 py-2 sm:py-2.5 rounded font-bold text-xs xl:text-sm shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              Request Quote
            </Link>
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-black cursor-pointer"
            >
              <span className="material-symbols-outlined">
                {isMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl animate-fade-in-up [animation-duration:300ms]">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item) => {
              const isActive = isActiveLink(item.href);
              const isSubmenuOpen = openMobileSubmenu === item.name;
              return (
                <div key={item.name} className="space-y-1">
                  <div className={`flex items-center justify-between rounded-lg transition-all ${
                    isActive ? "bg-orange-50" : "hover:bg-slate-50"
                  }`}>
                    <Link
                      to={item.href}
                      className={`flex-1 px-3 py-4 text-base font-semibold transition-colors ${
                        isActive ? "text-accent" : "text-black"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <button
                        onClick={() => toggleMobileSubmenu(item.name)}
                        className="px-4 py-4 text-slate-400 hover:text-accent focus:outline-none transition-colors"
                      >
                        <span className={`material-symbols-outlined transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </button>
                    )}
                  </div>
                  {item.children && isSubmenuOpen && (
                    <div className="pl-4 space-y-1 animate-fade-in">
                      {item.children.map((child) => (
                        <Link
                          key={`${item.name}-mobile-${child.href}`}
                          to={child.href}
                          className="block px-3 py-3 text-[14px] font-semibold rounded-lg text-slate-600 hover:bg-slate-50 hover:text-black transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="pt-4 space-y-4">
              {/* <div className="px-3">
                <LanguageSelector />
              </div> */}
              <a
                href={hrefs.whatsapp || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white px-6 py-4 rounded-lg font-bold shadow-lg text-center cursor-pointer transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.89 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
              <Link
                to="/contact-us#quote-form"
                className="block w-full bg-accent text-white px-6 py-4 rounded-lg font-bold shadow-lg text-center cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
