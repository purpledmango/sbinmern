"use client"


import { Check, CheckCircle, ChevronRight, Clock, MessageCircle, Rocket, Server, ShieldAlert, Star, Wallet } from "lucide-react";
import Promo from "./components/Promo";
import ProblemStatement from "./components/ProblemStatement";
import ServiceSection from "./components/ServiceSection";
import Nav from "./components/Nav";
import { useState } from "react";
import Footer from "./components/Footer";
import Image from "next/image";
import Link from "next/link";
import PricingSection from "./components/PricingSection";


export default function HomePage() {
  // State for collapsible FAQs
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 font-sans antialiased">
      {/* Navigation */}
      <Nav />

      {/* Promotional Banner - Storytelling element */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Link href={"/auth/login"}>
          <p className="text-sm font-medium animate-pulse">
            🎉 Be an early user and experience Hostastra for free for one month - limited time offer!
          </p>
        </Link>
        </div>
      </div>

     {/* Hero Section with enhanced storytelling */}
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-gradient-to-b  from-slate-white to-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
              <span className="block text-slate-900">Enterprise Grade</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                WordPress & Magento Hosting
              </span>
            </h1>
            <p className="mt-5 text-xl text-slate-600 sm:mt-8">
              <span className="block">Stop settling for slow, insecure hosting.</span>
              <span className="block mt-2 font-medium">Hostastra gives you:</span>
            </p>
            <ul className="mt-6 space-y-2 text-lg text-slate-600">
              <li className="flex items-start">
                <CheckCircle className="flex-shrink-0 h-6 w-6 text-emerald-500 mt-0.5 mr-2" />
                <span>Fully dedicated performance - no sharing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="flex-shrink-0 h-6 w-6 text-emerald-500 mt-0.5 mr-2" />
                <span>Zero setup & built-in security - no manual plugins</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="flex-shrink-0 h-6 w-6 text-emerald-500 mt-0.5 mr-2" />
                <span>Simple, affordable pricing - no surprise renewals</span>
              </li>
            </ul>
            <div className="mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="/auth/signup"
                className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Launch in 10 Seconds
                <Rocket className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-16 relative sm:mt-24 lg:mt-0 lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
              {/* 3D Container with perspective */}
              <div className="relative w-full h-96 sm:h-[500px]" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
                
                {/* Grid Container */}
                <div className="relative w-full h-full grid grid-cols-2 gap-4">
                  
                  {/* Top Left - dashboard1.png */}
                  <div 
                    className="relative transition-all duration-500 hover:scale-105"
                    style={{ 
                      transform: 'translateZ(-80px) rotateY(-15deg) rotateX(10deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-xl opacity-60 blur-[1px] hover:opacity-80 hover:blur-none transition-all duration-300">
                      <Image
                        className="w-full h-full object-cover"
                        src="/images/dashboard1.png"
                        alt="Website dashboard mockup 1"
                        width={300}
                        height={300}
                      />
                      <div className="absolute inset-0 bg-slate-800/20"></div>
                    </div>
                  </div>

                  {/* Top Right - dashboard3.png */}
                  <div 
                    className="relative transition-all duration-500 hover:scale-105"
                    style={{ 
                      transform: 'translateZ(-80px) rotateY(15deg) rotateX(10deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-xl opacity-60 blur-[1px] hover:opacity-80 hover:blur-none transition-all duration-300">
                      <Image
                        className="w-full h-full object-cover"
                        src="/images/dashboard2.png"
                        alt="Website dashboard mockup 3"
                        width={300}
                        height={300}
                      />
                      <div className="absolute inset-0 bg-slate-800/20"></div>
                    </div>
                  </div>
                </div>

                {/* Center Foreground - Main focus (dashboard2.png) */}
                <div 
                  className="absolute top-1/2 left-1/2 w-4/5 h-4/5 transition-all duration-500 hover:scale-105 z-20"
                  style={{ 
                    transform: 'translate(-50%, -50%) translateZ(100px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                    <Image
                      className="w-full h-full object-cover"
                      src="/images/dashboard1.png"
                      alt="Website dashboard mockup 2"
                      width={600}
                      height={600}
                    />
                    
                    {/* Premium glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-2xl opacity-0 blur-xl group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                </div>

                {/* Floating particles for depth */}
                <div className="absolute top-8 right-12 w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-16 left-12 w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute top-24 left-16 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
      {/* Existing components - unchanged */}
      <Promo/>
      <ProblemStatement/>
      <ServiceSection/>

     <div id="pricing">

     <PricingSection/>
    </div>
      {/* Testimonial Section with enhanced visual storytelling */}
    

      {/* Collapsible FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to know about Hostastra
            </p>
          </div>
          
          <div className="mt-16 space-y-6 max-w-3xl mx-auto">
            {[
              {
                question: "Is Hostastra beginner-friendly?",
                answer: "100%! You don't need to be a tech expert. Just choose your plan, click deploy, and your website goes live. No coding, no stress — it just works."
              },
              {
                question: "How's Hostastra different from typical shared hosting?",
                answer: "Big difference. With us, you get dedicated resources — so no more 'noisy neighbors' slowing your site down. Your performance is yours, always."
              },
              {
                question: "Why would I pay more when I can get ₹99 hosting elsewhere?",
                answer: "You could — but then you'll spend hours fixing slow speeds, adding security plugins, and dealing with terrible support. Hostastra gives you premium speed, security, and support — without the premium drama."
              },
              {
                question: "Do I need to install plugins for backups and security?",
                answer: "Nope. We've got your back. Backups run automatically, and security is built right in — no extra work, no extra cost."
              },
              {
                question: "Can I migrate my existing website easily?",
                answer: "Absolutely. We help you move your WordPress or Magento site to Hostastra — for free, with no downtime. Smooth as butter."
              },
              {
                question: "Is support actually helpful… or is it just email tickets?",
                answer: "We're here 24/7 — in plain English or Hindi. Real humans, real help. No bots. No scripted replies."
              },
              {
                question: "Will my price increase after a few months?",
                answer: "Nope. What you see is what you pay. No renewal traps, no sneaky upgrades."
              },
              {
                question: "Will my site slow down if traffic increases?",
                answer: "Not at all. You're on premium infrastructure with dedicated resources. Your site's performance won't suffer just because you're getting more visitors — in fact, we're built for growth."
              },
              {
                question: "I don't understand servers and technical stuff — will I be able to manage my site?",
                answer: "You won't have to. Hostastra takes care of the backend — you just focus on your website and content. We handle the tough stuff silently."
              },
              {
                question: "What if I need help setting things up?",
                answer: "Don't worry — we'll walk you through everything. From setup to launch, our support team is just a message away. You'll never feel stuck."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-sm"
              >
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-slate-900">
                    {faq.question}
                  </h3>
                  <ChevronRight 
                    className={`h-5 w-5 text-indigo-600 transition-transform duration-200 ${openFaq === index ? 'transform rotate-90' : ''}`}
                  />
                </button>
                <div 
                  className={`px-6 pb-5 text-slate-600 transition-all duration-300 ease-in-out ${openFaq === index ? 'block' : 'hidden'}`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with enhanced visual hierarchy */}
      

      {/* Final CTA with storytelling */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:justify-between lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to experience hosting that just works?</span>
              <span className="block text-indigo-200 mt-2">Get started today and receive:</span>
            </h2>
            <ul className="mt-6 space-y-2 text-lg text-indigo-100">
              <li className="flex items-start">
                <CheckCircle className="flex-shrink-0 h-6 w-6 text-emerald-300 mt-0.5 mr-2" />
                <span>1 month free trial</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="flex-shrink-0 h-6 w-6 text-emerald-300 mt-0.5 mr-2" />
                <span>Free website migration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="flex-shrink-0 h-6 w-6 text-emerald-300 mt-0.5 mr-2" />
                <span>24/7 expert support</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
            <a 
              href="#" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-200 hover:scale-105"
            >
              Get started now
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 bg-opacity-60 hover:bg-opacity-80 transition-all duration-200"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}