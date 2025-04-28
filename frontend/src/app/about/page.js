import { ShieldCheck, Server, Clock, Wallet, ChevronRight, CheckCircle, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import CTA from '../components/CTA';

export const metadata = {
  title: "HostAstra.com - About Hostastra Cloud Solutions",
  description: "Premium hosting solutions tailored for performance-intensive applications"
}

export default function HomePage() {
 
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      {/* Navigation */}
      <Nav/>

      {/* Hero Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-indigo-600">HostAstra.com Hosting Solutions</span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="inline">About </span>
                  <span className=" text-indigo-600 inline-block">Us</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Premium hosting solutions tailored for performance-intensive applications
              </p>
              
              {/* Features Grid */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Custom Docker hosting solutions with dedicated resources</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">High-performance Magento hosting on premium NVMe storage</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Enterprise-grade hardware with 24/7 monitoring</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Custom server configurations for optimal performance</span>
                </div>
              </div>

              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a href="#" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Docker Hosting
                  </a>
                  <a href="#" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                    Magento Hosting
                  </a>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  All plans include premium hardware, dedicated resources, and 24/7 expert support
                </p>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full lg:max-w-md">
                <div className="relative block w-full overflow-hidden">
                  <Image 
                    className="w-full" 
                    src="/images/about.png" 
                    alt="About HostAstra.com" 
                    width={400}
                    height={400}
                  />
                  {/* <div className="absolute inset-1 bg-gradient-to-tr from-indigo-600 to-purple-600 mix-blend-multiply opacity-20"></div> */}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Hardware Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Infrastructure</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Premium Hardware Solutions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our custom hosting runs on enterprise-grade infrastructure
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  <Server className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">NVMe Storage</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Lightning-fast storage for your databases and applications
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Dedicated Resources</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Isolated CPU and RAM for consistent performance
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">99.9% Uptime</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Enterprise-grade reliability for your business
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Custom Configs</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Tailored solutions for Wordpress and Magento workloads
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTA/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}