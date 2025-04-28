import { ShieldCheck, Server, Clock, Wallet, ChevronRight, CheckCircle, Menu, X, Cpu, MemoryStick, HardDrive, Lock, CpuIcon, MagnetIcon, Magnet } from 'lucide-react';
import Image from 'next/image';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import CTA from '../components/CTA';
import { FaMagento, FaWordpress, FaWordpressSimple } from 'react-icons/fa';

export const metadata = {
    title: "HostAstra.com - Pricing Plans",
    description: "The Most Affordable Premium Wordpress and Magento Hosting Solution"
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      {/* Navigation */}
      <Nav/>

      {/* Plans Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Hosting Plan</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
            {/* WordPress Plan */}
            <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col border border-slate-200 hover:shadow-2xl transition duration-300">
              <div className="flex justify-center mb-6">
                <FaWordpress className="h-14 w-14 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">1-Core WordPress</h3>
              <p className="text-slate-500 text-center mb-6">Perfect for small businesses and growing websites</p>
              
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-indigo-600">INR 999</span>
                <span className="text-base font-medium text-slate-600">/mo</span>
              </div>
              
              <ul className="text-slate-600 text-sm mb-8 space-y-3 flex-grow">
                <li className="flex items-center">
                  <Cpu className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>1 vCPU</span>
                </li>
                <li className="flex items-center">
                  <MemoryStick className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>2 GB RAM</span>
                </li>
                <li className="flex items-center">
                  <HardDrive className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>50 GB SSD Storage</span>
                </li>
                <li className="flex items-center">
                  <FaWordpressSimple className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>WordPress Ready</span>
                </li>
                <li className="flex items-center">
                  <Lock className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Free SSL & Backups</span>
                </li>
              </ul>
              
              <a href='/auth/login' className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 block text-center">
                Get Started
              </a>
            </div>

            {/* Magento Plan */}
            <div className="relative bg-slate-800 text-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col border border-slate-700 hover:shadow-2xl transition duration-300">
              <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                Coming Soon
              </div>
              
              <div className="flex justify-center mb-6">
                <FaMagento className="h-14 w-14 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">1-Core Magento</h3>
              <p className="text-slate-300 text-center mb-6">Optimized for eCommerce platforms needing robust performance</p>
              
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-indigo-400">--</span>
                <span className="text-base font-medium text-slate-400">/mo</span>
              </div>
              
              <ul className="text-slate-300 text-sm mb-8 space-y-3 flex-grow">
                <li className="flex items-center">
                  <CpuIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>2 vCPUs</span>
                </li>
                <li className="flex items-center">
                  <MemoryStick className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>4 GB RAM</span>
                </li>
                <li className="flex items-center">
                  <HardDrive className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>100 GB SSD Storage</span>
                </li>
                <li className="flex items-center">
                  <FaMagento className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Magento Preinstalled</span>
                </li>
                <li className="flex items-center">
                  <Lock className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Free SSL & Backups</span>
                </li>
              </ul>
              
              <button className="mt-auto bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg opacity-80 cursor-not-allowed">
                Not Available
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}