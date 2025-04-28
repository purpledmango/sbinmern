"use client"

import { useEffect, useState } from 'react';
import { Rocket, Clock, Calendar } from 'lucide-react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: { current: 0, previous: 0 },
    hours: { current: 0, previous: 0 },
    minutes: { current: 0, previous: 0 },
    seconds: { current: 0, previous: 0 }
  });
  
  const [isLaunched, setIsLaunched] = useState(false);
  const [isFlipping, setIsFlipping] = useState({
    days: false,
    hours: false,
    minutes: false,
    seconds: false
  });

  useEffect(() => {
    // Set launch date to May 2nd of the current year
    const currentYear = new Date().getFullYear();
    const launchDate = new Date(`May 2, ${currentYear} 00:00:00`);
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = launchDate - now;
      
      if (difference <= 0) {
        // Launch date has passed
        setIsLaunched(true);
        return;
      }
      
      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      // Update time with previous values for flip animation
      setTimeLeft(prev => {
        const newState = {
          days: { previous: prev.days.current, current: days },
          hours: { previous: prev.hours.current, current: hours },
          minutes: { previous: prev.minutes.current, current: minutes },
          seconds: { previous: prev.seconds.current, current: seconds }
        };
        
        // Trigger flip animations when values change
        if (prev.seconds.current !== seconds) {
          setIsFlipping(f => ({ ...f, seconds: true }));
          setTimeout(() => setIsFlipping(f => ({ ...f, seconds: false })), 500);
        }
        
        if (prev.minutes.current !== minutes) {
          setIsFlipping(f => ({ ...f, minutes: true }));
          setTimeout(() => setIsFlipping(f => ({ ...f, minutes: false })), 500);
        }
        
        if (prev.hours.current !== hours) {
          setIsFlipping(f => ({ ...f, hours: true }));
          setTimeout(() => setIsFlipping(f => ({ ...f, hours: false })), 500);
        }
        
        if (prev.days.current !== days) {
          setIsFlipping(f => ({ ...f, days: true }));
          setTimeout(() => setIsFlipping(f => ({ ...f, days: false })), 500);
        }
        
        return newState;
      });
    };
    
    // Initial update
    updateCountdown();
    
    // Set interval to update every second
    const timer = setInterval(updateCountdown, 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);
  
  // Flip card component for time units
  const FlipTimeUnit = ({ value, label, flipping }) => {
    const current = value.current.toString().padStart(2, '0');
    const previous = value.previous.toString().padStart(2, '0');
    
    return (
      <div className="flex flex-col items-center mx-2 md:mx-4">
        <div className="relative w-16 h-24 md:w-20 md:h-28 perspective-1000">
          {/* Top half (always showing current value) */}
          <div className="absolute w-full h-1/2 bg-white rounded-t-lg flex items-end justify-center overflow-hidden shadow-inner border-t border-l border-r border-indigo-100">
            <span className="text-3xl md:text-4xl font-bold text-indigo-600 translate-y-1/2">
              {current}
            </span>
          </div>
          
          {/* Bottom half with flip effect */}
          <div className="absolute top-1/2 w-full h-1/2">
            {/* Bottom half static background */}
            <div className="absolute w-full h-full bg-white rounded-b-lg flex items-start justify-center overflow-hidden shadow-inner border-b border-l border-r border-indigo-100">
              <span className="text-3xl md:text-4xl font-bold text-indigo-600 -translate-y-1/2">
                {current}
              </span>
            </div>
            
            {/* Bottom flipping card */}
            <div 
              className={`absolute w-full h-full origin-top ${flipping ? 'animate-flip-down' : 'hidden'}`}
              style={{ 
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="absolute w-full h-full bg-white rounded-b-lg flex items-start justify-center overflow-hidden shadow-md border-b border-l border-r border-indigo-200">
                <span className="text-3xl md:text-4xl font-bold text-indigo-600 -translate-y-1/2">
                  {previous}
                </span>
              </div>
            </div>
            
            {/* Top flipping card */}
            <div 
              className={`absolute w-full h-full -translate-y-full origin-bottom ${flipping ? 'animate-flip-up' : 'hidden'}`}
              style={{ 
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="absolute w-full h-full bg-white rounded-t-lg flex items-end justify-center overflow-hidden shadow-md border-t border-l border-r border-indigo-200">
                <span className="text-3xl md:text-4xl font-bold text-indigo-600 translate-y-1/2">
                  {previous}
                </span>
              </div>
            </div>
          </div>
        </div>
        <span className="mt-2 text-xs font-medium text-slate-600 uppercase tracking-wider">{label}</span>
      </div>
    );
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-slate-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-300 blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-purple-300 blur-3xl"></div>
      </div>
      
      <style jsx global>{`
        @keyframes flipUp {
          0% { 
            transform: rotateX(0deg);
            z-index: 10;
          }
          50% {
            z-index: 10;
          }
          100% { 
            transform: rotateX(-180deg);
            z-index: 1;
          }
        }
        
        @keyframes flipDown {
          0% { 
            transform: rotateX(180deg);
            z-index: 1;
          }
          50% {
            z-index: 1;
          }
          100% { 
            transform: rotateX(0deg);
            z-index: 10;
          }
        }
        
        .animate-flip-up {
          animation: flipUp 0.5s cubic-bezier(0.37, 0.24, 0.36, 1) forwards;
        }
        
        .animate-flip-down {
          animation: flipDown 0.5s cubic-bezier(0.37, 0.24, 0.36, 1) forwards;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
      
      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-xl mb-6 group">
            <Calendar className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700 transition-all duration-300" />
          </div>
          
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase mb-3">Coming Soon</h2>
          <p className="text-4xl leading-tight font-bold tracking-tight text-gray-900 sm:text-5xl">
            Launching <span className="text-indigo-600">May 2nd</span>
          </p>
          <p className="mt-5 max-w-2xl text-xl text-gray-600 mx-auto">
            {isLaunched ? 
              "We've launched! Explore our optimized WordPress hosting solutions now." :
              "Get ready for blazing-fast WordPress hosting solutions designed for performance"}
          </p>
        </div>
        
        {isLaunched ? (
          <div className="flex flex-col items-center">
            <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
              <Rocket className="h-6 w-6 mr-2" />
              <span className="font-semibold">We're live! HostAstra has officially launched.</span>
            </div>
            
            <a href="#" className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 hover:scale-105">
              <Rocket className="h-5 w-5 mr-2" />
              Explore Our Hosting
            </a>
          </div>
        ) : (
          <>
            <div className="mb-12 p-6 rounded-2xl bg-white shadow-xl border border-slate-100 group hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-wrap justify-center">
                <FlipTimeUnit value={timeLeft.days} label="days" flipping={isFlipping.days} />
                <FlipTimeUnit value={timeLeft.hours} label="hours" flipping={isFlipping.hours} />
                <FlipTimeUnit value={timeLeft.minutes} label="minutes" flipping={isFlipping.minutes} />
                <FlipTimeUnit value={timeLeft.seconds} label="seconds" flipping={isFlipping.seconds} />
              </div>
              
              <div className="mt-8 flex justify-center">
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-purple-500 h-2.5 rounded-full transition-all duration-1000" 
                    style={{ 
                      width: `${Math.max(5, 100 - (timeLeft.days.current * 100 / 30))}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-slate-600 mb-6">Be the first to know when we launch</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Notify Me
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}