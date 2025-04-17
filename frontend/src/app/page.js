"use client"
import { useState } from 'react';
import { ShieldCheck, Server, Clock, Wallet, ChevronRight, CheckCircle, Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-full"></div>
                <span className="ml-2 font-bold text-xl">HostAstra</span>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <a href="#" className="px-3 py-2 text-sm font-medium text-indigo-600">Home</a>
              <a href="#" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">WordPress</a>
              <a href="#" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">Magento</a>
              <a href="#" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">Pricing</a>
              <a href="#" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">About</a>
              <a href="#" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">Contact</a>
            </div>
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-slate-600 hover:text-slate-800 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            <div className="hidden md:flex items-center">
              <a href="/auth/login " className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Login
              </a>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 bg-indigo-50">Home</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">WordPress</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">Magento</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">Pricing</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">About</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">Contact</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">Get Started</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-indigo-600">Professional Hosting Services</span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block">Affordable</span>
                  <span className="block text-indigo-600">WordPress & Magento</span>
                  <span className="block">Solutions</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Experience top-quality WordPress and Magento hosting with free backups and budget-friendly pricing. Perfect for businesses of all sizes.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a href="#" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    WordPress Hosting
                  </a>
                  <a href="#" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                    Magento Hosting
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg shadow-lg overflow-hidden">
                  <Image 
                    className="w-full" 
                    src="/api/placeholder/600/400" 
                    alt="Website dashboard mockup" 
                    width={200}
                    height={200}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 mix-blend-multiply opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-6 text-center">
                      <div className="text-lg font-medium text-white">Easy Management</div>
                      <div className="text-sm text-white opacity-90">WordPress & Magento Dashboard</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Powerful Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-800 sm:text-4xl">
              Everything you need for your website
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 lg:mx-auto">
              Our platforms come with everything you need to create, manage, and grow your online presence.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                  <ShieldCheck size={24} />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-slate-800">Free Backups</h3>
                  <p className="mt-2 text-base text-slate-500">
                    Daily automated backups included with all plans, ensuring your data is always safe and recoverable.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                  <Server size={24} />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-slate-800">Optimized Servers</h3>
                  <p className="mt-2 text-base text-slate-500">
                    Servers optimized specifically for WordPress and Magento, delivering fast and reliable performance.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                  <Clock size={24} />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-slate-800">99.9% Uptime</h3>
                  <p className="mt-2 text-base text-slate-500">
                    We guarantee 99.9% uptime for your website, keeping your business running smoothly 24/7.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                  <Wallet size={24} />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-slate-800">Affordable Pricing</h3>
                  <p className="mt-2 text-base text-slate-500">
                    Competitive pricing plans that fit your budget, with no hidden fees or surprise charges.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                  <CheckCircle size={24} />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-slate-800">Easy Management</h3>
                  <p className="mt-2 text-base text-slate-500">
                    User-friendly control panel for effortless website management, updates, and monitoring.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                  <ChevronRight size={24} />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-slate-800">24/7 Support</h3>
                  <p className="mt-2 text-base text-slate-500">
                    Round-the-clock customer support ready to help you with any issues or questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Affordable plans for every need
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
              Choose the perfect plan for your business with our transparent pricing.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* WordPress Basic */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white">
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                    WordPress Basic
                  </h3>
                </div>
                <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                  INR 800
                  <span className="ml-1 text-2xl font-medium text-slate-500">/mo</span>
                </div>
                <p className="mt-5 text-lg text-slate-500">
                  Perfect for small personal websites and blogs.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-slate-50 sm:p-10">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">1 Website</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">10 GB Storage</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">Free Daily Backups</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">Free SSL Certificate</p>
                  </div>
                </div>
                <div className="mt-8">
                  <a href="#" className="block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-5 text-center font-medium text-white hover:bg-indigo-700">
                    Get Started
                  </a>
                </div>
              </div>
            </div>

            {/* WordPress Pro */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden border-2 border-indigo-500 bg-white">
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                    WordPress Pro
                  </h3>
                </div>
                <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                  INR 1900
                  <span className="ml-1 text-2xl font-medium text-slate-500">/mo</span>
                </div>
                <p className="mt-5 text-lg text-slate-500">
                  Ideal for business websites and online stores.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-slate-50 sm:p-10">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">5 Websites</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">30 GB Storage</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">Automated Daily Backups</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">Free SSL Certificate</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">Priority Support</p>
                  </div>
                </div>
                <div className="mt-8">
                  <a href="#" className="block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-5 text-center font-medium text-white hover:bg-indigo-700">
                    Get Started
                  </a>
                </div>
              </div>
            </div>

            {/* Magento Business */}
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white">
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                    Magento Business
                  </h3>
                </div>
                <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                  INR 9000
                  <span className="ml-1 text-2xl font-medium text-slate-500">/mo</span>
                </div>
                <p className="mt-5 text-lg text-slate-500">
                  Complete solution for e-commerce businesses.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-slate-50 sm:p-10">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">Dedicated Magento Store</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">50 GB Storage</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">Hourly Automated Backups</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">Free SSL Certificate</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">24/7 Priority Support</p>
                  </div>
                </div>
                <div className="mt-8">
                  <a href="#" className="block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-5 text-center font-medium text-white hover:bg-indigo-700">
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">Sign up today and get one month free.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-slate-300 hover:text-white">About</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Services</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-slate-300 hover:text-white">WordPress Hosting</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">Magento Hosting</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">Website Design</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">E-commerce Solutions</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-slate-300 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">Knowledgebase</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">API Documentation</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">Status Page</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-slate-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">SLA</a></li>
                <li><a href="#" className="text-base text-slate-300 hover:text-white">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-700 pt-8">
            <p className="text-base text-slate-400 text-center">
              &copy; 2025 Hostastra. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}