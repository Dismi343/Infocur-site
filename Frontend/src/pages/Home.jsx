import React from 'react';
import { useNavigate } from 'react-router-dom';
//import UpcomingEvents from "../components/UpcomingEvents";
import owl from '../assets/owl.png';
import RotatingText from '../components/RotatingText';
import Footer2 from "../components/Footer2";
import ImageLoop from "../components/ImageLoop";
import L2 from "../assets/loop/L2.jpg";
import L3 from "../assets/loop/L3.jpg";
import L4 from "../assets/loop/L4.jpg";
import L5 from "../assets/loop/L5.jpg";
import L6 from "../assets/loop/L6.jpg";
import L7 from "../assets/loop/L7.jpg";
import L8 from "../assets/loop/L8.jpg";
import L9 from "../assets/loop/L9.jpg";
import L10 from "../assets/loop/L10.jpg";
import L11 from "../assets/loop/L11.jpg";
import L12 from "../assets/loop/L12.jpg";
import L13 from "../assets/loop/L13.jpg";
import L14 from "../assets/loop/L14.jpg";
import L15 from "../assets/loop/L15.jpg";
import L16 from "../assets/loop/L16.jpg";
import L17 from "../assets/loop/L17.jpg";
import L18 from "../assets/loop/L18.jpg";
import L19 from "../assets/loop/L19.jpg";
import L20 from "../assets/loop/L20.jpg";
import L21 from "../assets/loop/L21.jpg";
import P1 from "../assets/loop/P1.jpg";
import P3 from "../assets/loop/P3.jpg";
import P4 from "../assets/loop/P4.jpg";
import P5 from "../assets/loop/P5.jpg";
import P7 from "../assets/loop/P7.jpg";
import P10 from "../assets/loop/P10.jpg";
import P11 from "../assets/loop/P11.jpg";
import P12 from "../assets/loop/P12.jpg";
import P13 from "../assets/loop/P13.jpg";
import P14 from "../assets/loop/P14.jpg";
import P15 from "../assets/loop/P15.jpg";
import P16 from "../assets/loop/P16.jpg";
import P17 from "../assets/loop/P17.jpg";
import P18 from "../assets/loop/P18.jpg";
import P19 from "../assets/loop/P19.jpg";


function Home(){
  const navigate = useNavigate();
  const photos = [
  L2,P1,L18,P19,L3,P3,L4,P4,L21,L5,P16,L17,L13,P5,L19,L6,P7,P18,L8,L14,P10,L9,P11,L10,L20,P12,L15,P17,L11,P13,L12,P14,L7,P15,L16

];

    return (
      <div className=" bg-[#788DA2] mt-18">
        <div className="w-[90%] py-10 mb-10 flex flex-col lg:flex-row items-center justify-between gap-10 mx-auto">
          
          {/* Left side */}
          <div className="flex flex-col max-w-full lg:max-w-[60%]">
            <div>
              <p className="font-splash text-[48px] sm:text-[64px] lg:text-[96px] ">
                Capturing Moments
              </p>
            </div>
            <div>
              <p className="text-[20px] sm:text-[18px] font-sora mt-4">
                Make your event unforgettable - book a professional photography session with the University of Ruhuna's premier photography club.
              </p>
            </div>
            <button
              type="button"
              className="underline cursor-pointer"
              onClick={() => navigate('/booking')} >
                  Book Now
            </button>
          </div>

          {/* Right side */}
          <div className="max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] mx-auto">
            <img src={owl} alt="Photography Owl" className="w-full h-auto object-contain" />
          </div>
        </div>

        
        
        {/*<div className="w-[90%] mx-auto ">
            <UpcomingEvents />
        </div> */}
        <div>
                <p className="text-[45px] mb-5 font-sora text-white mx-auto text-center">Glimpse of our work</p>
        </div>
        <div className=" flex flex-col justify-center gap-10 bg-[#788DA2]">
                    {/* Row 1: Left direction */}
                    <ImageLoop
                      images={photos}
                      speed={40}
                      direction="left"
                      height={400}
                      fadeOut
                      scaleOnHover
                      fadeOutColor="#2b425aff"
                    />

                    {/* Row 2: Right direction 
                    <ImageLoop
                      images={photos}
                      speed={40}
                      direction="right"
                      height={300}
                      fadeOut
                      scaleOnHover
                      fadeOutColor="#f8fafc"
                    />*/}
    </div>

        {/* Pricing */}
        <div className="py-12">
          <div className="max-w-[85%] lg:max-w-[70%]  mx-auto">
            <p className="text-black text-center font-semibold font-sora text-[30px] lg:text-[55px]">Capture your moments with confidence. Student-Friendly Prices</p>
          </div>
          <div className="max-w-[80%] mt-5 mx-auto">
            <p className="text-white text-center font-sora text-[20px] lg:text-[30px] ">Whether it's a club event, graduation, or personal shoot, our team offers professional photography at 
            low rates, tailored for the university community. </p>
          </div>
        </div>

        <div className="py-12 bg-black flex flex-col justify-center mx-auto">
              <div>
                <p className="text-[45px] mb-5 font-sora text-white mx-auto text-center">Photography is all about</p>
              </div>
              <RotatingText
                  texts={['Capturing', 'Moments', 'Emotions']}
                  mainClassName="w-[320px] px-2 sm:px-1 md:px-2 text-[45px] font-sora font-bold bg-[#2682C1] mx-auto text-black overflow-hidden py-0.5 md:py-1 justify-center rounded-lg"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                  />
        </div>
        <Footer2/>
      </div>
    );
}
export default Home;