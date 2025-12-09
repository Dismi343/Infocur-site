import React from 'react';
import { User, Award, Briefcase, Camera } from 'lucide-react';
import Footer from '../components/Footer';

// --- DATA FROM YOUR IMAGES (2026 Board Structure) ---

const advisoryBoard = [
  { role: "Senior Treasurer", name: "Dr. D.M. Samarathunga" },
  { role: "Chief Patron", name: "Dr. Manjula De Silva" },
  { role: "Advisory Committee", name: "Mr. Malaka Pathirana" },
  { role: "Advisory Committee", name: "Dr. Y.M.A.L.W. Yapa" },
];

const executiveBoard = [
  { role: "Junior Treasurer", name: "Ishara Dilshani" },
  { role: "Vice President", name: "Sasinidu Udara" },
  { role: "President", name: "Pasindu Manojith" },
  { role: "Secretary", name: "Sewwandi Pathirana" },
  { role: "Vice Secretary", name: "Vimanshi Herath" },
];

const directorBoard = [
  { name: "Sanuka Thennakoon" },
  { name: "Thiru Pava" },
  { name: "Thasindu Nayanajith" },
  { name: "Udith Lakshan" },
  { name: "Lal Pushpakumaran" },
  { name: "Chamie Ranawakaarachchi" },
  { name: "Madhusha Sahan" },
  { name: "Meghaka Ravishka" },
  { name: "Lasindu Rangana" },
  { name: "Bimal Weerakoon" },
  { name: "Kavindu Dulanga" },
  { name: "Chathumini Rathnayaka" },
];

// Grouping the specific committees as seen in the uploaded images
const committeeGroups = [
  {
    title: "Photography Co-Heads",
    members: [
      { name: "Umindu Hirushan" },
      { name: "Sadeepa Dilshan" },
    ]
  },
  {
    title: "Web Development & Social Media",
    members: [
      { name: "Dulan Madushika" },
      { name: "Chalana Ishara" },
    ]
  },
  {
    title: "Creative Heads",
    members: [
      { role: "Videography Head", name: "Charitha Bandara" },
      { role: "Graphic Design Head", name: "Shanilka Dilrangi" },
      { role: "Content Writing Head", name: "Dilakshi K. Mendis" },
    ]
  },
  {
    title: "Event Management Co-Heads",
    members: [
      { name: "Mayurini De Silva" },
      { name: "Lakmini Saubhagya" },
      { name: "Loshini Dileka" },
      { name: "Anjana Ishara" },
    ]
  }
];

// --- REUSABLE COMPONENTS ---

const MemberCard = ({ name, role, variant = "light" }) => {
  const isDark = variant === "dark";
  
  return (
    <div className={`flex flex-col items-center p-6 rounded-xl transition-transform duration-300 hover:-translate-y-2 h-full
      ${isDark ? 'bg-white/10 text-white backdrop-blur-sm border border-white/20' : 'bg-white text-slate-800 shadow-md border border-slate-100'}
    `}>
      {/* Avatar Placeholder */}
      <div className={`w-24 h-24 rounded-full mb-4 flex items-center justify-center shadow-inner
        ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-slate-100 text-slate-400'}
      `}>
        <User size={40} />
      </div>

      <h3 className={`font-bold text-lg text-center leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
        {name}
      </h3>
      
      {role && (
        <span className={`mt-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full
          ${isDark ? 'bg-blue-500/30 text-blue-100' : 'bg-blue-50 text-blue-600'}
        `}>
          {role}
        </span>
      )}
    </div>
  );
};

const SectionTitle = ({ title, icon: Icon }) => (
  <div className="text-center mb-12">
    <div className="flex justify-center mb-3">
      <div className="p-3 bg-blue-50 rounded-full">
        {Icon && <Icon className="text-blue-600 w-6 h-6" />}
      </div>
    </div>
    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">{title}</h2>
    <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
  </div>
);

const TeamPage = () => {
  
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      
      {/* 1. HERO SECTION (Code provided by user) */}
      <div className="bg-[#1e293b] text-white py-20 px-4 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        
        <div className="mt-10 max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Meet the <span className="text-blue-400">Infocuor</span> Team
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Celebrating 10 years of excellence in visual storytelling. We are the creative heartbeat of the Faculty of Science, University of Ruhuna.
          </p>
        </div>
      </div>

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* 2. ABOUT SECTION (Code provided by user) */}
        <section className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">Our Story</h4>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">A Decade of Vision</h2>
              <p className="mb-4 leading-relaxed">
                Founded in 2015, Infocuor Photography Society has grown into a vibrant hub of creativity and passion. For a decade, we've been dedicated to enhancing photography and videography skills while capturing the true spirit of university life.
              </p>
              <p className="leading-relaxed">
                With <span className="font-semibold text-slate-900">100+ events covered annually</span> and <span className="font-semibold text-slate-900">18,000+ followers</span>, our team of talented undergraduates works with dedication, turning every frame into a timeless story.
              </p>
            </div>
            <div className="h-64 md:h-full bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
               {/* Replace this div with an actual group photo if available */}
               <div className="text-center text-slate-400">
                  <Camera size={48} className="mx-auto mb-2 opacity-50"/>
                  <span className="text-sm font-medium">Team Group Photo Placeholder</span>
               </div>
            </div>
          </div>
        </section>


        {/* 3. ADVISORY BOARD */}
        <section>
          <SectionTitle title="Advisory Board - 2026" icon={Award} />
          <div className="flex flex-wrap justify-center gap-8">
            {advisoryBoard.map((member, idx) => (
              <div key={idx} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-2rem)] max-w-xs">
                <MemberCard {...member} />
              </div>
            ))}
          </div>
        </section>

        {/* 4. EXECUTIVE BOARD */}
        <section>
          <SectionTitle title="Executive Board - 2026" icon={Briefcase} />
          <div className="flex flex-wrap justify-center gap-8 md:gap-10">
            {executiveBoard.map((member, idx) => (
              <div key={idx} className="w-full sm:w-72">
                <MemberCard {...member} />
              </div>
            ))}
          </div>
        </section>

        {/* 5. DIRECTOR BOARD */}
        <section>
          <SectionTitle title="Director Board - 2026" icon={Award} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {directorBoard.map((member, idx) => (
              <div key={idx} className="w-full max-w-xs">
                <MemberCard {...member} />
              </div>
            ))}
          </div>
        </section>

        {/* 6. COMMITTEE MEMBERS (Grouped Blocks) */}
        <section>
          <SectionTitle title="Committee Members - 2026" icon={Briefcase} />
          
          <div className="space-y-12">
            {committeeGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="w-full">
                {/* Dark Blue Container for the Group */}
                <div className="bg-[#0B1E3F] rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>

                  <h3 className="text-2xl font-bold text-white text-center mb-10 relative z-10 border-b border-white/10 pb-4 inline-block mx-auto left-1/2 -translate-x-1/2">
                    {group.title}
                  </h3>

                  <div className="flex flex-wrap justify-center gap-8 relative z-10">
                    {group.members.map((member, memIdx) => (
                      <div key={memIdx} className="w-full sm:w-64">
                         {/* Using the 'dark' variant for transparent cards on blue bg */}
                        <MemberCard {...member} variant="dark" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TeamPage;