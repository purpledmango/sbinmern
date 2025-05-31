import { CheckCircle } from 'lucide-react'
import React from 'react'

const PricingSection = () => {
  return (
     <section className="py-16 bg-gradient-to-b from-slate-white to-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
                  Simple, Transparent Pricing
                </span>
                <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  Experience Dedicated Hosting Without the Stress of a Hefty Price Tag
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
                  Enjoy blazing speed, unbeatable reliability, and complete peace of mind
    with India’s own royal and premium wordpress and magento hosting, Hostastra.
    
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
                        href="/auth/signup" 
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
                        href="/auth/signup" 
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
                        href="/auth/signup" 
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
  )
}

export default PricingSection
