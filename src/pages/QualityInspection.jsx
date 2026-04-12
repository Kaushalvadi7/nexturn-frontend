import React, { useEffect } from 'react';
import InspectionHero from '../components/quality-inspection/InspectionHero';
import InspectionProcess from '../components/quality-inspection/InspectionProcess';
import InspectionEquipment from '../components/quality-inspection/InspectionEquipment';
import QualityControlCharts from '../components/quality-inspection/QualityControlCharts';
import QualityCertifications from '../components/quality-inspection/QualityCertifications';

const QualityInspection = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div id="overview" className="scroll-mt-16">
        <InspectionHero />
      </div>

      {/* Main Content Section */}
      <div id="process" className="scroll-mt-16">
        <InspectionProcess />
      </div>

      {/* Equipment & SPC Section */}
      <div id="equipment" className="scroll-mt-16">
        <InspectionEquipment />
      </div>

      {/* Quality Control Charts Section */}
      <div id="spc-charts" className="scroll-mt-16">
        <QualityControlCharts />
      </div>

      {/* Certifications, Documentation, and Feedback Sections */}
      <div id="certifications" className="scroll-mt-16">
        <QualityCertifications />
      </div>
    </div>
  );
};

export default QualityInspection;
