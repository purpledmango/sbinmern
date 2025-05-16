"use client"


import { CheckCircle, ChevronRight, Clock, MessageCircle, Rocket, Server, ShieldAlert, Star, Wallet } from "lucide-react";
import Promo from "./components/Promo";
import ProblemStatement from "./components/ProblemStatement";
import ServiceSection from "./components/ServiceSection";
import Nav from "./components/Nav";
import { useState } from "react";
import Footer from "./components/Footer";
import Image from "next/image";

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
          <p className="text-sm font-medium animate-pulse">
            🎉 Be an early user and experience Hostastra for free for one month - limited time offer!
          </p>
        </div>
      </div>

      {/* Hero Section with enhanced storytelling */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
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
                  <span>Blazing fast speeds (no more waiting)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 text-emerald-500 mt-0.5 mr-2" />
                  <span>Rock-solid security (sleep peacefully)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 text-emerald-500 mt-0.5 mr-2" />
                  <span>Real human support (no bots)</span>
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
                <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-w-1 aspect-h-1">
                  <Image 
                    className="w-full" 
                    src="/images/icon.png" 
                    alt="Website dashboard mockup" 
                    width={600}
                    height={600}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-700/20 mix-blend-multiply" />
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

      {/* Features Section with visual storytelling */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
              Why Choose Us
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              The hosting experience you've been searching for
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-slate-600">
              We've fixed everything that frustrates you about traditional hosting
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <ShieldAlert size={24} />,
                title: "Free Backups",
                description: "Daily automated backups included with all plans, ensuring your data is always safe and recoverable."
              },
              {
                icon: <Server size={24} />,
                title: "Optimized Servers",
                description: "Servers optimized specifically for WordPress and Magento, delivering fast and reliable performance."
              },
              {
                icon: <Clock size={24} />,
                title: "99.9% Uptime",
                description: "We guarantee 99.9% uptime for your website, keeping your business running smoothly 24/7."
              },
              {
                icon: <Wallet size={24} />,
                title: "Affordable Pricing",
                description: "Competitive pricing plans that fit your budget, with no hidden fees or surprise charges."
              },
              {
                icon: <CheckCircle size={24} />,
                title: "Easy Management",
                description: "User-friendly control panel for effortless website management, updates, and monitoring."
              },
              {
                icon: <MessageCircle size={24} />,
                title: "24/7 Support",
                description: "Round-the-clock customer support ready to help you with any issues or questions."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-8 transition-all duration-200 hover:shadow-lg hover:border-indigo-100 border border-transparent">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-100 text-indigo-600">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-base text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section with enhanced visual storytelling */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Real Stories from Happy Customers
            </h2>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from businesses who've made the switch
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="p-8 sm:p-10">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="ml-4">
                  <blockquote className="text-lg leading-7 text-slate-700">
                    <p>
                      "I tried a few hosting providers before — some were affordable but gave poor performance, 
                      and others offered premium service but were way too expensive. After a lot of frustration, 
                      I found Hostastra. Finally, a platform that gives me speed I was looking for, solid security, 
                      and real support without draining my pocket. Best part is I no longer have to install a bunch 
                      of plugins or worry about backups and security.. Hostastra handles it all."
                    </p>
                  </blockquote>
                  <div className="mt-6">
                    <div className="text-base font-medium text-slate-900">Siddharth</div>
                    <div className="text-sm text-slate-500">E-commerce Store Owner</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
              Simple, Transparent Pricing
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Choose the perfect plan for your needs
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
              No hidden fees, no surprises. Just powerful hosting at fair prices.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* WordPress Basic */}
            <div className="flex flex-col rounded-xl shadow-lg overflow-hidden bg-white border border-slate-200 hover:border-indigo-300 transition-all duration-200">
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div className="flex justify-between items-start">
                  <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                    WordPress Lite
                  </h3>
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">POPULAR</span>
                </div>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                  ₹499
                  <span className="ml-1 text-xl font-medium text-slate-500">/mo</span>
                </div>
                <p className="mt-3 text-lg text-slate-600">
                  Perfect for small personal websites and blogs.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-slate-50 sm:p-10">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">1 vCPU / 2GB RAM</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">10 GB Storage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">Free Weekly Backups</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">Free SSL Certificate</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a 
                    href="#" 
                    className="block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-5 text-center font-medium text-white hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>

            {/* WordPress Pro - Highlighted */}
            <div className="flex flex-col rounded-xl shadow-xl overflow-hidden border-2 border-indigo-500 bg-white transform scale-105 z-10">
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div className="flex justify-between items-start">
                  <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                    WordPress Pro
                  </h3>
                  <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">BEST VALUE</span>
                </div>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                  ₹999
                  <span className="ml-1 text-xl font-medium text-slate-500">/mo</span>
                </div>
                <p className="mt-3 text-lg text-slate-600">
                  Ideal for business websites and online stores.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-slate-50 sm:p-10">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">1 Dedicated cores</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">2 GB RAM</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">20 GB Disk</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">Automated Weekly Backups</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">Free SSL Certificate</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">Priority Support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a 
                    href="#" 
                    className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-md py-3 px-5 text-center font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200 shadow-md"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>

            {/* Magento Business */}
            <div className="flex flex-col rounded-xl shadow-lg overflow-hidden bg-white border border-slate-200 hover:border-indigo-300 transition-all duration-200">
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                  WordPress Business
                </h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                  ₹1499
                  <span className="ml-1 text-xl font-medium text-slate-500">/mo</span>
                </div>
                <p className="mt-3 text-lg text-slate-600">
                  Complete solution for high-traffic sites.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-slate-50 sm:p-10">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">2 Dedicated cores</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">8 GB RAM</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">80 GB Disk</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">Weekly Automated Backups</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">Free SSL Certificate</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-700">24/7 Priority Support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a 
                    href="#" 
                    className="block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-5 text-center font-medium text-white hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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