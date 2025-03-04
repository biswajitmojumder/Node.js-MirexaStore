import Banner from "./components/shared/Banner";
import Newsletter from "./components/shared/NewsletterSubscription/NewsletterSubscription";
import Testimonials from "./components/shared/Testimonial/TestimonialSection";
import Product from "./product/page";

const HomePage = async () => {
  return (
    <>
      <Banner></Banner>
      <Product></Product>
      <Testimonials></Testimonials>
      <Newsletter></Newsletter>
    </>
  );
};

export default HomePage;
