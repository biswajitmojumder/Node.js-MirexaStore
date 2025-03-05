import Banner from "./components/shared/Banner";
import Newsletter from "./components/shared/NewsletterSubscription/NewsletterSubscription";
import Testimonials from "./components/shared/Testimonial/TestimonialSection";
import FloatingIcons from "./components/ui/FloatingIcons";
import Product from "./product/page";

const HomePage = () => {
  return (
    <>
      <Banner />
      <Product />
      <Testimonials />
      <Newsletter />
      <FloatingIcons />
    </>
  );
};

export default HomePage;
