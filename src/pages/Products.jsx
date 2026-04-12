import ProductHero from "../components/products/ProductHero";
import ProductFeatures from "../components/products/ProductFeatures";
import ProductFilter from "../components/products/ProductFilter";
import ProductGrid from "../components/products/ProductGrid";
import AvailableMaterials from "../components/products/AvailableMaterials";

const Products = () => {

  return (
    <div className="bg-[#fafbfc] min-h-screen pt-0 pb-16 font-['Source_Sans_3',sans-serif]">
      <div id="overview" className="scroll-mt-24">
        <ProductHero />
      </div>
      <div id="features" className="scroll-mt-24">
        {/* <ProductFeatures /> */}
      </div>
      {/* <ProductFilter />
      <ProductGrid /> */}
      <div id="materials" className="scroll-mt-24">
        <AvailableMaterials />
      </div>
    </div>
  );
};

export default Products;
