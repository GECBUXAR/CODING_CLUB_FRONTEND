import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer.jsx";
import Faculty from "../components/Feaculty.jsx";
import Eventes from "../components/Eventes.jsx";
import Skills from "../components/Skills.jsx";

const LandingPage = () => {
  return (
    <>
      <div>
        <Navbar />
        <Hero />
        <Eventes />
        <Faculty />
        <Skills />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
