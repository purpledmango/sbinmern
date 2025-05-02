"use client";
import Head from 'next/head';
import { Store, ShoppingCart, Calendar, Bell, Mail, Clock, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SelectiveDisplay() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeComponent, setActiveComponent] = useState('checkout'); // Default active component
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer effect
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate - now;
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      if (difference < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Email submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setEmail('');
  };

  // Services data with availability status
  const services = [
    { 
      id: 'checkout', 
      icon: ShoppingCart, 
      title: "Advanced Checkout", 
      desc: "Streamlined one-page checkout experience",
      available: true
    },
    { 
      id: 'inventory', 
      icon: Calendar, 
      title: "Inventory Management", 
      desc: "Real-time stock syncing across channels",
      available: false
    },
    { 
      id: 'notifications', 
      icon: Bell, 
      title: "Smart Notifications", 
      desc: "AI-driven customer engagement system",
      available: false
    }
  ];

  return (
    <>
      <Head>
        <title>Magento Services - Feature Preview</title>
        <meta name="description" content="Preview our advanced Magento services with some features coming soon." />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-center opacity-5"></div>

        <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-12">
          <div className="w-full max-w-5xl mx-auto text-center relative z-10">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl">
                  <Store className="h-16 w-16 text-purple-300" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-300">
                Magento Services
              </h1>
              <p className="text-xl sm:text-2xl text-purple-200 max-w-2xl mx-auto mb-8">
                Preview our advanced Magento solutions with some features available now and others coming soon.
              </p>
            </div>

            {/* Services Navigation */}
            <div className="flex justify-center mb-8 gap-4 flex-wrap">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => setActiveComponent(service.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2
                    ${activeComponent === service.id 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
                      : 'bg-white/10 text-purple-200 hover:bg-white/20'}
                    ${!service.available && 'relative overflow-hidden'}`}
                  disabled={!service.available}
                >
                  <service.icon className="h-5 w-5" />
                  <span>{service.title}</span>
                  {!service.available && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="h-4 w-4" />
                        <span>Coming Soon</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Main content area - shows only active component */}
            <div className="mb-12 grid grid-cols-1 gap-8">
              {/* Advanced Checkout - Fully Available */}
              {activeComponent === 'checkout' && (
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20">
                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-purple-500/30 rounded-lg">
                      <ShoppingCart className="h-10 w-10 text-purple-300" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-6">Advanced Checkout System</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">One-Page Checkout</h3>
                      <p className="text-purple-200">Streamlined, fully responsive checkout process that minimizes cart abandonment.</p>
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Multiple Payment Options</h3>
                      <p className="text-purple-200">Support for credit cards, PayPal, Apple Pay, and cryptocurrency payments.</p>
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Guest Checkout</h3>
                      <p className="text-purple-200">Frictionless purchasing without requiring account creation.</p>
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                      <p className="text-purple-200">Clear breakdown of costs including tax, shipping, and any applied discounts.</p>
                    </div>
                  </div>
                  
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg font-medium transition-all hover:from-purple-600 hover:to-indigo-700">
                    Integrate Now
                  </button>
                </div>
              )}
              
              {/* Components that are "Coming Soon" */}
              {(activeComponent === 'inventory' || activeComponent === 'notifications') && (
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Lock className="h-16 w-16 text-purple-300 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
                    <p className="text-purple-200 max-w-md text-center mb-6">
                      This feature is currently under development and will be available in:
                    </p>
                    
                    {/* Countdown for the greyed-out features */}
                    <div className="flex justify-center space-x-4">
                      {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="flex flex-col items-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-lg text-xl sm:text-2xl font-bold mb-1">
                            {value}
                          </div>
                          <span className="text-xs sm:text-sm text-purple-200 capitalize">{unit}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Notification sign-up specifically for this feature */}
                    <div className="mt-8 max-w-md w-full px-4">
                      {isSubmitted ? (
                        <div className="bg-green-500/20 p-4 rounded-lg backdrop-blur-md border border-green-500/30">
                          <p className="text-green-200">
                            Thanks! We&apos;ll notify you when this feature launches.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-grow">
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
                              <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg font-medium transition-all hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-400 whitespace-nowrap"
                          >
                            Notify Me
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                  
                  {/* Blurred content behind the overlay */}
                  <div className="opacity-30">
                    <div className="flex justify-center mb-6">
                      <div className="p-3 bg-purple-500/30 rounded-lg">
                        {activeComponent === 'inventory' ? (
                          <Calendar className="h-10 w-10 text-purple-300" />
                        ) : (
                          <Bell className="h-10 w-10 text-purple-300" />
                        )}
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-6">
                      {activeComponent === 'inventory' ? 'Inventory Management' : 'Smart Notifications'}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {Array(4).fill(0).map((_, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-lg h-24"></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="w-full py-6 text-center text-purple-300">
          <p>© {new Date().getFullYear()} Magento Services. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}