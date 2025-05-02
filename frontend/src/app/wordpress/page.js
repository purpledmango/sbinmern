import { Server, Zap, Shield, Clock, HardDrive, Cpu, Database, Rocket, Lock, RefreshCw, Cloud, Globe, Monitor } from 'lucide-react';
import Image from 'next/image';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import CTA from '../components/CTA';

export const metadata = {
  title: "HostAstra.com - Optimized WordPress Hosting",
  description: "One-click WordPress deployment with dedicated resources, free SSL, and automated backups"
}

export default function WordPressPage() {
  const features = [
    {
      icon: Rocket,
      title: "One-Click Deployment",
      description: "Launch a fully-configured WordPress site in under 60 seconds"
    },
    {
      icon: Cpu,
      title: "Dedicated Resources",
      description: "Isolated CPU and RAM for consistent performance"
    },
    {
      icon: Shield,
      title: "Free SSL Certificates",
      description: "Automatic HTTPS security for all WordPress sites"
    },
    {
      icon: RefreshCw,
      title: "Automated Backups",
      description: "Daily backups included with all plans"
    },
    {
      icon: HardDrive,
      title: "NVMe Storage",
      description: "Blazing-fast storage for WordPress databases"
    },
    {
      icon: Database,
      title: "Snapshot Backups",
      description: "Optional on-demand backups (paid add-on)"
    }
  ];

  const problems = [
    "Slow load times due to shared resources",
    "Complex setup and configuration",
    "Security vulnerabilities",
    "Frequent downtime during traffic spikes",
    "Manual backup management",
    "SSL certificate complications"
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <Nav />

      {/* Hero Section with Logo */}
      <div className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              {/* Logo */}
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="bg-indigo-600 p-3 rounded-lg shadow-lg">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-indigo-600">HostAstra</span>
              </div>
              
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block">WordPress Hosting </span>
                <span className="block text-indigo-600">Without Compromise</span>
              </h1>
              <p className="mt-3 text-lg text-slate-500">
                Enterprise-grade infrastructure simplified for your WordPress sites. 
                Focus on your content while we handle the technical complexities.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto lg:mx-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a href="#" className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 hover:scale-105">
                    <Rocket className="h-5 w-5 mr-2" />
                    Launch WordPress
                  </a>
                  <a href="#" className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-all duration-300 hover:scale-105">
                    <Server className="h-5 w-5 mr-2" />
                    View Plans
                  </a>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  All plans include free SSL, automated backups, and dedicated resources
                </p>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:col-span-6">
              <div className="relative mx-auto w-full rounded-xl shadow-xl overflow-hidden">
                <Image
                  src="/images/wordpress-logo.png"
                  alt="WordPress on HostAstra"
                  width={600}
                  height={400}
                  className="w-full"
                />
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                99.9% Uptime
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                Lightning Fast
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full mb-6">
              <Cloud className="h-6 w-6 text-indigo-600" />
            </div>
            
            <h2 className="text-sm font-medium text-indigo-600 uppercase tracking-wider">WordPress Challenges</h2>
            
            <h3 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Common Problems We Solve
            </h3>
            
            <p className="mt-4 text-lg text-gray-600">
              Traditional WordPress hosting often comes with limitations we&apos;ve eliminated
            </p>
          </div>
          
          {/* Problem Cards */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="hover:translate-y-1 transition-all duration-300"
              >
                <div className="h-full bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600">
                      <Zap className="h-5 w-5" />
                    </div>
                    <span className="ml-3 text-xs font-semibold text-indigo-600 uppercase tracking-wider">Problem {index + 1}</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {problem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:text-center">
            <Monitor className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">HostAstra Solution</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Optimized WordPress Experience
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need for a fast, secure WordPress site
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="text-center transform transition-all duration-500 hover:scale-105 hover:rotate-1"
                >
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative bg-white p-6 rounded-xl shadow-xl">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div className="mt-5">
                        <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                        <p className="mt-2 text-base text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Process */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Server className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-sm text-indigo-600 font-semibold tracking-wide uppercase">Simple Setup</h2>
            <p className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Get Started in Minutes
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-indigo-100"></div>
            
            <div className="space-y-12 md:space-y-24">
              {[
                {
                  title: "Select WordPress",
                  description: "Choose WordPress from our one-click application installer",
                  icon: Server
                },
                {
                  title: "Configure Resources",
                  description: "Select your dedicated CPU, RAM and storage allocation",
                  icon: Cpu
                },
                {
                  title: "Launch Instance",
                  description: "Deploy your optimized WordPress environment instantly",
                  icon: Rocket
                },
                {
                  title: "Access Dashboard",
                  description: "Login to your auto-configured WordPress admin panel",
                  icon: Lock
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  {/* Step number */}
                  <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-indigo-500 text-indigo-600 font-bold mb-4 md:mb-0 mx-auto">
                    {index + 1}
                  </div>
                  
                  {/* Content card */}
                  <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:pr-12 md:mr-auto' : 'md:pl-12 md:ml-auto'}`}>
                    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                      <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <item.icon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="ml-3 text-lg font-medium text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA button */}
      <div className="fixed bottom-10 right-10 z-50">
        <a 
          href="#" 
          className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all duration-300 hover:scale-110 group"
        >
          <Rocket className="h-5 w-5 mr-2" />
          Launch Now
        </a>
      </div>

      <CTA />
      <Footer />
    </div>
  );
}