import HomeSection from "../components/home/HomeSection";
import Capabilities from '../components/home/Capabilities';
import MaterialSpecializations from '../components/home/MaterialSpecializations';
import QualitySystem from '../components/home/QualitySystem';
import ClientReviews from '../components/home/ClientReviews';
import ExportExperience from '../components/home/ExportExperience';
import RequestQuote from '../components/home/RequestQuote';

const Home = () => {
  return (
    <div className="dark:bg-background-dark">
      <div id="hero" className="scroll-mt-24">
        <HomeSection />
      </div>
      <div className="scroll-mt-24">
        <Capabilities />
      </div>
      <div id="materials" className="scroll-mt-24">
        <MaterialSpecializations />
      </div>
      <div id="quality-system" className="scroll-mt-24">
        <QualitySystem />
      </div>
      <div id="client-reviews" className="scroll-mt-24">
        <ClientReviews />
      </div>
      <div id="export-experience" className="scroll-mt-24">
        <ExportExperience />
      </div>
      {/* <div id="request-quote" className="scroll-mt-24">
        <RequestQuote />
      </div> */}
    </div>
  );
};

export default Home;
