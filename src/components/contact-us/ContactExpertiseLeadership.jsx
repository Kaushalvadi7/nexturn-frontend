import { useEffect, useRef, useState } from "react";
import { getCompanyEmployees } from "../../lib/api";
import WatermarkImage from "../common/WatermarkImage";
import { getFlagUrlFromName } from "../../utils/countryMapping";

const ContactExpertiseLeadership = () => {
  const sectionRef = useRef(null);
  const observerRef = useRef(null);
  const [leaders, setLeaders] = useState([]);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);
  const [leaderError, setLeaderError] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isActive = true;
    const fetchLeaders = async () => {
      setIsLoadingLeaders(true);
      setLeaderError("");
      try {
        const data = await getCompanyEmployees();
        if (!isActive) return;
        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          name: row.name || "",
          role: row.role || "",
          education: row.education || "",
          experience: row.experience || "",
          countryRepresentative: row.country_representative || "",
          image: row.image || null,
        }));
        setLeaders(normalized);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load leadership profiles", error);
        setLeaders([]);
        setLeaderError(error?.message || "Failed to load leadership profiles.");
      } finally {
        if (isActive) setIsLoadingLeaders(false);
      }
    };

    fetchLeaders();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer || !sectionRef.current) return;
    const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));
  }, [leaders.length, isLoadingLeaders]);

  return (
    <section ref={sectionRef} className="pt-8 pb-5 bg-white overflow-hidden font-['Source_Sans_3',sans-serif]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Leadership Header */}
        <div className=" scroll-mt-24 reveal-on-scroll reveal-hidden text-center mb-8 lg:mb-10 max-w-7xl mx-auto ">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight
">
            Meet our minds behind the success
          </h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            Our leadership combines decades of precision engineering, quality assurance, and global sourcing experience.
            Together, we drive innovation and ensure every component meets international standards.
          </p>
        </div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {leaderError && (
            <div className="md:col-span-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
              {leaderError}
            </div>
          )}
          {isLoadingLeaders && (
            <div className="md:col-span-3 rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500">
              Loading leadership profiles...
            </div>
          )}
          {!isLoadingLeaders && leaders.length === 0 && !leaderError && (
            <div className="md:col-span-3 text-center text-sm font-semibold text-slate-500">
              No leadership profiles available.
            </div>
          )}

          {leaders.map((leader, index) => (
            <div
              key={leader.id || index}
              className="reveal-on-scroll reveal-hidden flex flex-col bg-[#f4f6f8] rounded-[1.5rem] overflow-hidden hover:shadow-2xl hover:shadow-[#1b365d]/5 hover:border-[#1b365d] border border-transparent transition-all duration-500 group"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                {leader.image ? (
                  <WatermarkImage
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    watermarkText="NEXTURN COMPONENTCRAFT"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-6xl">account_circle</span>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 space-y-2">
                <div className="min-w-0">
                  <h3 className="text-2xl font-black text-[#1b365d] mb-2 break-words">{leader.name}</h3>
                  <p className="text-[#e17000] font-black text-sm uppercase tracking-wider break-words">{leader.role}</p>
                </div>
                <div className="space-y-4 min-w-0 pt-2">
                  {leader.countryRepresentative && (
                    <div className="flex gap-4 items-start">
                      <div className="w-6 flex justify-center shrink-0 pt-0.5">
                        <img
                          src={getFlagUrlFromName(leader.countryRepresentative, "w40")}
                          alt={`${leader.countryRepresentative} flag`}
                          className="w-6 h-4 rounded-[2px] shadow-sm object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed break-words whitespace-pre-wrap flex-1 min-w-0">
                        {leader.countryRepresentative}
                      </p>
                    </div>
                  )}
                  {leader.education && (
                    <div className="flex gap-4 items-start">
                      <div className="w-6 flex justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#1b365d] text-xl font-light">
                          engineering
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed break-words whitespace-pre-wrap flex-1 min-w-0">
                        {leader.education}
                      </p>
                    </div>
                  )}
                  {leader.experience && (
                    <div className="flex gap-4 items-start">
                      <div className="w-6 flex justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#1b365d] text-xl font-light">
                          work_history
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed break-words whitespace-pre-wrap flex-1 min-w-0">
                        {leader.experience}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ContactExpertiseLeadership;
