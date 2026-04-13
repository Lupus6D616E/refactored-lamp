import React, { useEffect, useRef, useState } from 'react';

function gotosigninform(){
  window.location.href = "/public/signin.html";
}
function gotosignupform(){
  window.location.href = "/public/signup.html";
}
// 1. Navbar Component
const Navbar: React.FC = () => (
  <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
    <div className="flex-1">
      <a className="text-3xl font-bold bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
        FlexiHire
      </a>
    </div>
    <div className="flex-none">
      <ul className="menu menu-horizontal px-1">
        <li><a href="/public/signin.html">login</a></li>
        <li>
          <details>
            <summary>Other</summary>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-20 p-1 shadow-sm">
              <li><a href="/public/signup.html">Sign up</a></li>
              <li><a>Contact</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
);

// 2. HeroCarousel Component
const HeroCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % totalSlides;
      setCurrentSlide(nextSlide);
      
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: carouselRef.current.offsetWidth * nextSlide,
          behavior: 'smooth'
        });
      }
    }, 6500);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const slides = [
    {
      id: 'slide1',
      title: 'Connecting people to flexible local jobs',
      p: "Whether you're a student or a business—Flexifire makes it simple.",
      img: 'https://i.pinimg.com/1200x/d1/89/59/d1895917d882e03f8c4468a4e49dc6ee.jpg',
      btn: 'primary',
      label: 'Find a job'
    
    },
    {
      id: 'slide2',
      title: 'Grow Your Business',
      p: 'Find the best local talent in minutes.',
      img: 'https://i.pinimg.com/1200x/10/db/5f/10db5f8fc4172070651ea154c0dccc29.jpg',
      btn: 'primary',
      label: 'Get Started'
    },
    {
      id: 'slide3',
      title: 'Join the Community',
      p: 'Work whenever and wherever you want.',
      img: 'https://i.pinimg.com/1200x/45/26/0b/45260b7180cf41d5df155134a2a7ad18.jpg',
      btn: 'secondary',
      label: 'Learn More'
    }
  ];

  return (
    <div ref={carouselRef} className="carousel w-full h-[80vh] overflow-x-hidden">
      {slides.map((slide) => (
        <div key={slide.id} className="carousel-item relative w-full">
          <div className="hero h-full" style={{ backgroundImage: `url(${slide.img})` }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">{slide.title}</h1>
                <p className="py-6">{slide.p}</p>
                <button className={`btn btn-${slide.btn} rounded-2xl`}
                  onClick={() =>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
                >
                  {slide.label}</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. FeatureCard Component
const FeatureCard: React.FC<{title: string, description: string, img: string, showModal?: boolean}> = ({ title, description, img, showModal }) => (
  <div className="card bg-base-100 w-96 shadow-sm">
    <figure className="px-10 pt-10">
      <img src={img} alt={title} className="rounded-xl h-48 w-full object-cover" />
    </figure>
    <div className="card-body items-center text-center">
      <h2 className="card-title">{title}</h2>
      <p>{description}</p>
      <div className="card-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => showModal && (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
        >
          Join Us!
        </button>
      </div>
    </div>
    
    {showModal && (
      <dialog id="my_modal_3" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box p-0 overflow-visible bg-white rounded-2xl border-none">
          
          {/* LOGO PLACEMENT: Floating Brand Logo */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
              <div className="w-30 h-30 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-slate-50">
                <div className="bg-gradient-to-br from-[#0038a8] to-[#00ced1] p-3 rounded-full flex items-center justify-center w-16 h-16">
                   <img
                    src="/public/images/logo.png"
                    alt="FlexiHire Logo" 
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>
              </div>
            </div>

          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20">✕</button>
          </form>

          <div className="pt-14 pb-8 px-8 text-center">
            {/* LOGO PLACEMENT: In-line Text Logo */}
            <h3 className="text-4xl font-bold bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent inline-block mb-2">
              FlexiHire
            </h3>
            <p className="text-slate-600 font-medium mb-2">Sign in to view and accept job offers from local businesses in your area.</p>
            
            <div className="flex flex-col gap-3 mt-4">
              <button 
                className="btn btn-primary w-full rounded-xl text-lg shadow-lg shadow-blue-200" 
                onClick={gotosigninform}
              >
                Sign In
              </button>
              <button 
                className="btn btn-outline w-full rounded-xl border-slate-200" 
                onClick={gotosignupform}
              >
                Create an Account
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    )}
  </div>
);

// 4. Footer Component
const Footer: React.FC = () => (
  <footer className="footer flex flex-row justify-between items-start bg-neutral text-neutral-content p-10 w-full px-20">
    
    <nav className="flex flex-col">
      <h6 className="footer-title opacity-50 uppercase tracking-widest">Services</h6>
      <a className="link link-hover">Branding</a>
      <a className="link link-hover">Design</a>
    </nav>

    <nav className="flex flex-col">
      <h6 className="footer-title opacity-50 uppercase tracking-widest">Company</h6>
      <a className="link link-hover">About us</a>
      <a className="link link-hover">Contact</a>
    </nav>

    <nav className="flex flex-col">
      <h6 className="footer-title opacity-50 uppercase tracking-widest">Legal</h6>
      <a className="link link-hover">Terms of use</a>
      <a className="link link-hover">Privacy policy</a>
    </nav>
  </footer>
); 

// 5. MAIN COMPONENT (Ang i-eexport natin)
export const Front: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <HeroCarousel />
      <div className="py-20 flex flex-col lg:flex-row justify-center items-center gap-6 px-4">
        <FeatureCard 
          title="For Students" 
          description="Find part-time jobs and gigs that work around your schedule. Earn money while you study without compromising your education."
          img="https://images.ctfassets.net/mrbo2ykgx5lt/21677/b3a72a9e3654dd1b321a220c373e3c0b/learning-strategies-university-college-students.jpg?&w=912&fm=webp&q=80"
          showModal={true}
        />
        <FeatureCard 
          title="For PWD" 
          description="Find accessible roles that respect your needs. Work in environments that are already vetted for your success, so you can focus on your talent, not the barriers."
          img="https://crccertification.com/wp-content/uploads/2025/10/iStock-2213399618.jpg"
           showModal={true}
        />
        <FeatureCard 
          title="For SMEs" 
          description="Access a diverse pool of ready-to-work talent. Scale your business with flexible gig structures and inclusive hiring that drives real innovation and growth."
          img="https://www.wusme.org/wp-content/uploads/2022/09/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1_03_03_03-Copia-842x474.jpg"
           showModal={true}
        />
      </div>
      <Footer />
    </div>
  );
};