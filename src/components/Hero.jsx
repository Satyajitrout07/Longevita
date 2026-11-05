import React from 'react';
import { 
  ArrowRight, 
  Pill, 
  UserCheck, 
  ClipboardList, 
  HeartPulse, 
  Brain, 
  ShieldCheck, 
  Sprout 
} from 'lucide-react';
import heroWoman from '../assets/hero-woman.jpg';
import plantCorner from '../assets/plant-corner.jpg';

export default function Hero({ onNavigate }) {
  const checklistItems = [
    { label: 'Monitor', icon: HeartPulse },
    { label: 'Understand', icon: Brain },
    { label: 'Prevent', icon: ShieldCheck },
    { label: 'Thrive', icon: Sprout },
  ];

  const features = [
    {
      title: 'Track',
      subtitle: 'Health Markers',
      icon: Pill,
      bg: 'bg-[#D6F5F3] dark:bg-teal-950/70',
      iconColor: 'text-[#0D9488] dark:text-teal-300',
    },
    {
      title: 'Expert',
      subtitle: 'Guidance',
      icon: UserCheck,
      bg: 'bg-[#E0F2FE] dark:bg-sky-950/70',
      iconColor: 'text-[#0284C7] dark:text-sky-300',
    },
    {
      title: 'Personalised',
      subtitle: 'Plans',
      icon: ClipboardList,
      bg: 'bg-[#DCFCE7] dark:bg-emerald-950/70',
      iconColor: 'text-[#16A34A] dark:text-emerald-300',
    },
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-20 lg:pt-10 lg:pb-24 transition-colors duration-300">
      {/* Background ambient teal & mint watercolor gradients */}
      <div 
        className="absolute top-12 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#CCFBF1]/50 dark:from-teal-900/20 via-[#E0F2FE]/30 dark:via-sky-900/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-[#D1FAE5]/30 dark:from-emerald-950/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-6 xl:col-span-6 z-10 flex flex-col items-start pt-2 lg:pt-4">
            
            {/* Pill Tag / Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDFAF5] dark:bg-emerald-950/60 border border-[#A7F3D0] dark:border-emerald-800/70 text-[#047857] dark:text-emerald-300 text-[11px] sm:text-[11.5px] font-bold tracking-[0.06em] uppercase mb-6 sm:mb-7 shadow-xs">
              PREVENTIVE HEALTH FOR A HEALTHIER TOMORROW
            </div>

            {/* Main Headline */}
            <h1 className="text-[44px] sm:text-[54px] lg:text-[60px] xl:text-[64px] font-extrabold text-[#0A1C2A] dark:text-white tracking-[-0.03em] leading-[1.12] mb-5 sm:mb-6 text-balance transition-colors duration-200">
              Live healthier <br />
              for a longer tomorrow
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] sm:text-[18px] text-slate-600 dark:text-slate-300 font-normal leading-[1.6] max-w-[480px] mb-8 sm:mb-9 text-pretty transition-colors duration-200">
              Personalised health tracking, expert guidance and preventive care — all in one place.
            </p>

            {/* Explore Plans CTA Button */}
            <div className="mb-14 sm:mb-16">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('signup')}
                className="group inline-flex items-center gap-3 px-8 py-4 text-[16px] font-semibold text-white bg-[#0A1C2A] dark:bg-teal-500 dark:text-[#06131D] dark:hover:bg-teal-400 hover:bg-[#142C3E] rounded-full transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Explore Plans</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Bottom 3 Feature Pillars */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4 w-full max-w-[500px]">
              {features.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div key={feat.title} className="flex flex-col items-start group">
                    <div className={`w-12 h-12 rounded-full ${feat.bg} flex items-center justify-center ${feat.iconColor} mb-3.5 transition-transform duration-200 group-hover:scale-110 shadow-xs`}>
                      <IconComponent className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="text-[15px] font-bold text-[#0A1C2A] dark:text-white tracking-[-0.01em] leading-tight transition-colors duration-200">
                      {feat.title}
                    </span>
                    <span className="text-[13.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1 transition-colors duration-200">
                      {feat.subtitle}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hero Visual & Interactive Floating Cards */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex justify-center items-center mt-6 lg:mt-0">
            
            {/* Visual Frame Container */}
            <div className="relative w-full max-w-[540px] flex justify-center">
              
              {/* Soft decorative background shape & flowing curve */}
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-[#99F6E4]/35 dark:from-teal-800/25 via-[#A7F3D0]/25 dark:via-emerald-900/20 to-[#BAE6FD]/30 dark:to-sky-900/20 rounded-[48px] filter blur-2xl -z-10 scale-95" 
                aria-hidden="true" 
              />
              
              {/* Organic fluid aura SVG behind woman */}
              <svg 
                className="absolute -top-10 -right-6 w-[420px] h-[420px] pointer-events-none -z-10 opacity-70 dark:opacity-40"
                viewBox="0 0 400 400" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M320 180C360 260 280 340 190 350C100 360 40 280 60 190C80 100 160 50 250 70C300 80 300 140 320 180Z" 
                  fill="url(#organic-gradient)" 
                  fillOpacity="0.45"
                />
                {/* Thin flowing wavy curves */}
                <path 
                  d="M30 160C90 130 180 200 280 160C340 135 380 90 390 60" 
                  stroke="#2DD4BF" 
                  strokeWidth="1.5" 
                  strokeOpacity="0.4" 
                  strokeDasharray="4 6"
                />
                <path 
                  d="M50 220C120 200 200 270 310 230C360 210 390 180 410 140" 
                  stroke="#14B8A6" 
                  strokeWidth="1.2" 
                  strokeOpacity="0.25"
                />
                <defs>
                  <linearGradient id="organic-gradient" x1="60" y1="70" x2="350" y2="350" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#99F6E4" />
                    <stop offset="0.6" stopColor="#E0F2FE" />
                    <stop offset="1" stopColor="#DCFCE7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Main Portrait of the Woman */}
              <div className="relative z-10 w-full max-w-[440px] sm:max-w-[480px]">
                <img
                  src={heroWoman}
                  alt="Healthy, active woman smiling confidently"
                  className="w-full h-auto object-cover rounded-3xl select-none"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 82%, transparent 99%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 82%, transparent 99%)',
                  }}
                />
              </div>

              {/* Floating Card 1: Top Right "Small steps today..." */}
              <div className="absolute top-24 sm:top-28 lg:top-32 right-0 sm:right-2 lg:-right-6 xl:-right-2 z-20 animate-float-gentle">
                <div className="glass-card rounded-[22px] px-6 py-5 max-w-[215px] transition-transform duration-300 hover:scale-105">
                  <p className="text-[#1E3A56] dark:text-teal-100 font-medium text-[15px] leading-[1.38] tracking-[-0.01em]">
                    Small steps<br />
                    today, a healthier<br />
                    tomorrow
                  </p>
                </div>
              </div>

              {/* Floating Card 2: Bottom Right "Monitor / Understand / Prevent / Thrive" */}
              <div className="absolute bottom-4 right-2 sm:right-4 lg:-right-4 xl:right-0 z-20 animate-float-subtle">
                <div className="white-float-card rounded-[24px] p-5 sm:p-6 min-w-[200px] transition-transform duration-300 hover:scale-[1.02]">
                  <ul className="space-y-4">
                    {checklistItems.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <li key={item.label} className="flex items-center gap-3.5 group cursor-pointer">
                          <div className="w-7 h-7 rounded-full bg-[#E6F8F3] dark:bg-teal-950/80 flex items-center justify-center text-[#0D9488] dark:text-teal-300 group-hover:bg-[#0D9488] group-hover:text-white transition-colors duration-150">
                            <ItemIcon className="w-3.5 h-3.5 stroke-[2.4]" />
                          </div>
                          <span className="text-[14.5px] font-semibold text-slate-800 dark:text-slate-100 tracking-[-0.01em] group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-150">
                            {item.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Lush Plant Leaves in Bottom Right Corner */}
              <div className="absolute -bottom-8 -right-8 sm:-bottom-12 sm:-right-10 w-44 sm:w-52 lg:w-56 pointer-events-none z-10 dark:opacity-80">
                <img
                  src={plantCorner}
                  alt="Fresh tropical wellness plant leaves"
                  className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-luminosity opacity-95 select-none"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
