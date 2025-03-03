import Banner from "./components/shared/Banner";
import Testimonials from "./components/shared/Testimonial/TestimonialSection";
import Product from "./product/page";

const HomePage = async () => {
  return (
    <>
      <Banner></Banner>
      <Product></Product>
      <Testimonials></Testimonials>
    </>
  );
};

export default HomePage;
