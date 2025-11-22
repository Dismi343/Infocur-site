import React, { useState } from 'react';
import Footer from '../components/Footer';

const teamMembers = [
  { role: "President", name: "G.M.A.J. Gunasekara" },
  { role: "Vice President", name: "H.M.P.M.B.Jayathilaka" },
  { role: "Secretary", name: "H.I. Dahanayaka" },
  { role: "Vice Secretary", name: "G.P.A.S.Pathirana" },
  { role: "Junior Treasurer", name: "P.L.Pushpakumara" },
  { role: "Chief Patron", name: "Dr. D.M. Samarathunga" },
  { role: "President", name: "Kavindu Naveeshan" },
  { role: "Advisory Committee", name: "Dr. Malaka Pathirana" },
  { role: "Advisory Committee", name: "Dr. Y.M.A.L.W Yapa" },
  { role: "Senior Treasurer", name: "Dr. J.A.P. Bodhika" },
];

const operationalTeam = [
  { name: "K.M.I.N. Kulathunga" },
  { name: "G.S.Adikaram" },
  { name: "Nimesh H. Bandara" },
  { name: "Kavindu Heshan" },
];

const photographyHeads = [
  { name: "Janakmal Gunasekara" },
  { name: "Menuja Wickramathilaka" },
  { name: "Tharuka Uthsara" },
];

const ITEMS_PER_PAGE = 3;

const groupColors = {
  "Operational Team": "border-green-400",
  "Photography Heads": "border-purple-400",
  "Committee Members": "border-blue-400",
};

// Reusable MemberCard Component
const MemberCard = ({ name, role, borderColor }) => (
  <div className={`bg-white rounded-md shadow-md p-6 w-full sm:w-72 border-l-8 ${borderColor} hover:shadow-lg hover:scale-[1.04] transition cursor-pointer`}>
    {role && <h4 className="text-blue-700 font-semibold text-lg">{role}</h4>}
    <h4 className="text-gray-900 font-semibold text-lg">{name}</h4>
  </div>
);

const TeamPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(teamMembers.length / ITEMS_PER_PAGE);

  const next = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const goToPage = (index) => setCurrentPage(index);

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const visibleMembers = teamMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
    <div className="min-h-screen flex flex-col font-sora bg-[#788DA2] py-12">
      <main className="flex-grow px-5 sm:px-8 py-14 max-w-7xl mx-auto w-full">

        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          About Inforcour Photography Society
        </h2>
        <h4 className='mb-10 text-center'>
            Founded in 2015, Infocuor Photography Society has grown into a vibrant hub of creativity and passion within the Faculty of Science, University of Ruhuna. For a decade, we've been dedicated to enhancing photography and videography skills while capturing the true spirit of university life through professional event coverage.
            With 100+ events covered annually, 18,000+ followers on social media, and numerous workshops and competitions, Infocuor continues to inspire young creatives. Our team of talented undergraduates works with dedication and resourcefulness, turning every frame into a timeless story.
            Celebrating 10 years of excellence in visual storytelling.
        </h4>
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">
          Meet the Team
        </h2>
        

        {/* Committee Members Slider */}
        <section className="mb-16">
          <h3 className="bg-blue-400 text-white text-xl sm:text-2xl font-semibold px-5 py-3 rounded-md mb-6 max-w-max mx-auto sm:mx-0">
            Committee Members
          </h3>

          

          <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto px-2">
            <button
              onClick={prev}
              disabled={currentPage === 0}
              className="px-3 py-2 rounded-md text-blue-600 font-bold disabled:text-blue-300 hover:bg-blue-100 transition"
              aria-label="Previous page"
            >
              &lt;
            </button>

            <div className="flex flex-wrap justify-center gap-8 flex-grow mx-4 transition-all duration-500">
              {visibleMembers.map((member, index) => (
                <MemberCard
                  key={index}
                  name={member.name}
                  role={member.role}
                  borderColor={groupColors["Committee Members"]}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 rounded-md text-blue-600 font-bold disabled:text-blue-300 hover:bg-blue-100 transition"
              aria-label="Next page"
            >
              &gt;
            </button>
          </div>

          {/* Dot Navigation */}
          <div className="flex justify-center space-x-3 mt-6">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full transition-colors ${
                  index === currentPage ? "bg-blue-400" : "bg-gray-300 hover:bg-blue-300"
                }`}
                onClick={() => goToPage(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Operational Team & Photography Heads */}
        {[
          { title: "Operational Team", data: operationalTeam },
          { title: "Photography Heads", data: photographyHeads },
        ].map(({ title, data }) => (
          <section key={title} className="mb-16 max-w-5xl mx-auto px-2 sm:px-0">
            <h3
              className={`bg-gray-800 text-white text-xl sm:text-2xl font-semibold px-5 py-3 rounded-md mb-6 max-w-max
              ${groupColors[title]} bg-opacity-90`}
            >
              {title}
            </h3>
            <div className="flex flex-wrap gap-8 justify-center">
              {data.map((person, idx) => (
                <MemberCard
                  key={idx}
                  name={person.name}
                  borderColor={groupColors[title]}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
      </div>
      <Footer />
    </>
  );
};

export default TeamPage;
