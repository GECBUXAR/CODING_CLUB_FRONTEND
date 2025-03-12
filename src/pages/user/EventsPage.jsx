import Navbar from "../../components/common/Navbar.jsx";
import AllEventes from "../../components/events/AllEventes.jsx";

const AllEventsPage = () => {
  return (
    <>
      <div>
        <main className="min-h-screen pt-12">
          <div className="container mx-auto px-2 py-8">
            <Navbar />
            <AllEventes />
          </div>
        </main>
      </div>
    </>
  );
};

export default AllEventsPage;
