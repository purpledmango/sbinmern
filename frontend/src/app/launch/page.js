"use client"

import { useEffect, useState } from 'react';
import { Rocket, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to get initial time consistently
const getInitialTime = () => {
  const currentYear = new Date().getFullYear();
  const launchDate = new Date(`May 2, ${currentYear} 00:00:00`);
  const now = new Date();
  const difference = launchDate - now;
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLaunched: true };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isLaunched: false
  };
};

export default function CountdownTimer() {
  // Initialize state with consistent values
  const [timeLeft, setTimeLeft] = useState(() => {
    const initial = getInitialTime();
    return { 
      days: initial.days,
      hours: initial.hours,
      minutes: initial.minutes,
      seconds: initial.seconds
    };
  });
  
  const [previousTime, setPreviousTime] = useState({ ...timeLeft });
  const [isLaunched, setIsLaunched] = useState(getInitialTime().isLaunched);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const updateCountdown = () => {
      const initial = getInitialTime();
      if (initial.isLaunched) {
        setIsLaunched(true);
        return;
      }
      
      setPreviousTime(timeLeft);
      setTimeLeft({ 
        days: initial.days,
        hours: initial.hours,
        minutes: initial.minutes,
        seconds: initial.seconds
      });
    };
    
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const FlipTimeUnit = ({ value, previousValue, label }) => {
    if (!isMounted) return null; // Don't render on server
    
    const current = value.toString().padStart(2, '0');
    const previous = previousValue.toString().padStart(2, '0');
    const isAnimating = value !== previousValue;
    
    return (
      <div className="flex flex-col items-center mx-2 md:mx-4">
        <div className="relative w-16 h-24 md:w-20 md:h-28 perspective-1000">
          {/* Static top half */}
          <div className="absolute top-0 w-full h-1/2 bg-white rounded-t-lg flex items-end justify-center overflow-hidden shadow-inner border-t border-l border-r border-indigo-100 z-10">
            <span className="text-3xl md:text-4xl font-bold text-indigo-600 translate-y-1/2">
              {current}
            </span>
          </div>
          
          {/* Static bottom half */}
          <div className="absolute bottom-0 w-full h-1/2 bg-white rounded-b-lg flex items-start justify-center overflow-hidden shadow-inner border-b border-l border-r border-indigo-100">
            <span className="text-3xl md:text-4xl font-bold text-indigo-600 -translate-y-1/2">
              {current}
            </span>
          </div>
          
          {/* Flipping card */}
          {isMounted && (
            <AnimatePresence>
              {isAnimating && (
                <motion.div
                  key={`${label}-flip`}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: -180 }}
                  exit={{ rotateX: -180 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute top-0 w-full h-1/2 origin-bottom bg-white rounded-t-lg flex items-end justify-center overflow-hidden shadow-lg border-t border-l border-r border-indigo-200"
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    zIndex: 20
                  }}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-end justify-center bg-white">
                      <span className="text-3xl md:text-4xl font-bold text-indigo-600 translate-y-1/2">
                        {previous}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-end justify-center bg-white" style={{
                      transform: 'rotateX(180deg)',
                      backfaceVisibility: 'hidden'
                    }}>
                      <span className="text-3xl md:text-4xl font-bold text-indigo-600 translate-y-1/2">
                        {current}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        <span className="mt-2 text-xs font-medium text-slate-600 uppercase tracking-wider">{label}</span>
      </div>
    );
  };

  const currentYear = new Date().getFullYear();
  const launchDate = new Date(`May 2, ${currentYear} 00:00:00`);
  const formattedDate = launchDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-indigo-100 p-3 rounded-full mb-6">
            <Rocket className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            {isLaunched ? "Launch Successful!" : "Countdown to Launch"}
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            {isLaunched 
              ? "Our product has officially launched! Thank you for your support."
              : "We're preparing something amazing for you. Stay tuned!"}
          </p>
        </div>

        {!isLaunched ? (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-indigo-100">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center bg-indigo-50 px-4 py-2 rounded-full">
                <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-sm font-medium text-indigo-700">Time Remaining</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <FlipTimeUnit 
                value={timeLeft.days} 
                previousValue={previousTime.days} 
                label="Days" 
              />
              <FlipTimeUnit 
                value={timeLeft.hours} 
                previousValue={previousTime.hours} 
                label="Hours" 
              />
              <FlipTimeUnit 
                value={timeLeft.minutes} 
                previousValue={previousTime.minutes} 
                label="Minutes" 
              />
              <FlipTimeUnit 
                value={timeLeft.seconds} 
                previousValue={previousTime.seconds} 
                label="Seconds" 
              />
            </div>
            
            <div className="mt-10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-slate-700">
                Launch Date: {formattedDate}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-green-100 text-center">
            <div className="inline-flex items-center justify-center bg-green-100 p-3 rounded-full mb-6">
              <Rocket className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              We Have Liftoff!
            </h2>
            <p className="text-slate-600 mb-6">
              The product launched successfully on {formattedDate}.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition-colors">
              Explore Now
            </button>
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-100 rounded-full opacity-20 -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-100 rounded-full opacity-20 translate-x-20 translate-y-20"></div>
    </div>
  );
} 