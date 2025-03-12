import Navbar from "../../components/common/Navbar.jsx";
import AllExams from "../../components/exam/AllExams.jsx";

const ExamsPage = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen pt-12">
        <div className="container mx-auto px-2 py-8">
          <AllExams />
        </div>
      </main>
    </div>
  );
};

export default ExamsPage;
