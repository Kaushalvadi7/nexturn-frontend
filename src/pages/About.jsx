import AboutHero from "../components/about/AboutHero";
import EngineeringPrecision from "../components/about/EngineeringPrecision";
import ManufacturingInfrastructure from "../components/about/ManufacturingInfrastructure";
import ExpertiseLeadership from "../components/about/ExpertiseLeadership";
import ManufacturingFacility from "../components/about/ManufacturingFacility";
import SuccessStories from "../components/about/SuccessStories";
import HistoryTimeline from "../components/about/HistoryTimeline";

const About = () => {
  return (
    <div className="dark:bg-background-dark">
      <div id="overview" className="scroll-mt-16">
        <AboutHero />
      </div>
      <div id="engineering-precision" className="scroll-mt-16">
        <EngineeringPrecision />
      </div>
      <div id="journey-timeline" className="scroll-mt-16">
        <HistoryTimeline />
      </div>
      <div id="manufacturing-infrastructure" className="scroll-mt-16">
        <ManufacturingInfrastructure />
      </div>
      <div id="expertise-leadership" className="scroll-mt-16">
        <ExpertiseLeadership />
      </div>
      <div id="manufacturing-facilities" className="scroll-mt-16">
        <ManufacturingFacility />
      </div>
      <div id="success-stories" className="scroll-mt-16">
        <SuccessStories />
      </div>
    </div>
  );
};

export default About;
