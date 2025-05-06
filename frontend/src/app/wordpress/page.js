import { Server, Zap, Shield, Clock, HardDrive, Cpu, Database, Rocket, Lock, RefreshCw, Cloud, Globe, Monitor, Check, Star, User, Briefcase, Code } from 'lucide-react';
import Image from 'next/image';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import CTA from '../components/CTA';

export const metadata = {
  title: "Hostastra - Dedicated WordPress Hosting",
  description: "Dedicated WordPress hosting for Bloggers, Business Owners & Developers who are tired of shared hosting."
}

export default function WordPressPage() {
  const features = [
    {
      icon: Rocket,
      title: "Instant WordPress Deployment",
      description: "Go live in 10 seconds with one-click setup"
    },
    {
      icon: Shield,
      title: "Built-in Security & Backups",
      description: "No need for extra plugins, everything included"
    },
    {
      icon: Cpu,
      title: "Dedicated Resources",
      description: "Never share server power with other websites"
    },
    {
      icon: Clock,
      title: "24/7 Royal Support",
      description: "Speak with humans, not bots, in English and Hindi"
    },
    {
      icon: HardDrive,
      title: "No Technical Headaches",
      description: "Fully managed by our expert team"
    },
    {
      icon: Globe,
      title: "Made for India",
      description: "Local infrastructure & support in your language"
    }
  ];

  const problems = [
    "Slow speeds on cheap shared hosting",
    "Complex technical setups and maintenance",
    "Having to install multiple plugins for basic features",
    "Poor support that only sends tickets",
    "Hidden renewal price increases",
    "Downtime during traffic spikes"
  ];
  
  const plans = [
    {
      name: "WordPress Lite",
      bestFor: "Bloggers & Starters",
      price: "₹799/mo",
      features: [
        "1 Website",
        "1 vCPU",
        "1 GB RAM",
        "30 GB SSD",
        "Free SSL",
        "Daily Backups"
      ],
      icon: User,
      color: "bg-blue-500",
      recommended: false
    },
    {
      name: "WordPress Pro",
      bestFor: "Business Owners",
      price: "₹1299/mo",
      features: [
        "1 Website",
        "1 vCPU",
        "2 GB RAM",
        "50 GB SSD",
        "Priority Support",
        "Daily Backups"
      ],
      icon: Briefcase,
      color: "bg-indigo-600",
      recommended: true
    },
    {
      name: "WordPress Pro+",
      bestFor: "Developers & Agencies",
      price: "₹1999/mo",
      features: [
        "5 Websites",
        "2 vCPU",
        "4 GB RAM",
        "100 GB SSD",
        "Enhanced Security",
        "Premium Support"
      ],
      icon: Code,
      color: "bg-purple-600",
      recommended: false
    }
  ];
  
  const faqs = [
    {
      question: "I'm using cheap shared hosting for ₹99/month. Why should I pay more for Hostastra?",
      answer: "Because ₹99 hosting comes with slow speeds, shared servers, and no real support. Hostastra gives you dedicated power, built-in security, backups, and fast performance — all included. You save time, avoid tech headaches, and grow faster."
    },
    {
      question: "I'm not technical — will I need to set up WordPress, backups, or security on my own?",
      answer: "No. Everything is ready out of the box. WordPress comes pre-installed, backups run automatically, and your site is protected from day one — no plugins, no manual setup."
    },
    {
      question: "Will my website still be fast if I get more visitors or traffic spikes?",
      answer: "Yes. Unlike shared hosting, Hostastra gives you dedicated resources, so your website won't slow down even if your traffic grows. You don't share power with anyone else."
    },
    {
      question: "Can I migrate my current WordPress site without downtime or extra cost?",
      answer: "Yes, and we do it for you — free migration, no downtime, and no effort required from your side."
    },
    {
      question: "Do I need to buy separate plugins for caching, security, or daily backups?",
      answer: "No. Hostastra includes all of that. You won't need to install 5–6 extra plugins — it's already taken care of in the platform itself."
    },
    {
      question: "What if I try it and don't like it? Am I locked in?",
      answer: "You're not locked in. Cancel anytime, and if you want to move out, we'll even help you migrate your site elsewhere — no questions asked."
    }
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
                <span className="ml-3 text-2xl font-bold text-indigo-600">Hostastra</span>
              </div>
              
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block">Dedicated WordPress</span>
                <span className="block text-indigo-600">Hosting</span>
              </h1>
              <p className="mt-3 text-lg text-slate-500">
                Built for Bloggers, Business Owners & Developers who are tired of shared hosting.
                Experience WordPress hosting that's dedicated, not shared.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto lg:mx-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a href="#" className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 hover:scale-105">
                    <Rocket className="h-5 w-5 mr-2" />
                    Launch in 10 Seconds
                  </a>
                  <a href="#plans" className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-all duration-300 hover:scale-105">
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
                  alt="WordPress on Hostastra"
                  width={600}
                  height={400}
                  className="w-full"
                />
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                1-Month Free Trial
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                10-Second Setup
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Type Selection */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-sm font-medium text-indigo-600 uppercase tracking-wider">Find Your Perfect Plan</h2>
            <h3 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Which Best Describes You?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Blogger */}
            <div className="hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900">I'm a Blogger</h3>
              </div>
              <p className="text-gray-700 mb-4">You focus on writing, we handle the tech.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>1-click WordPress setup</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Free SSL & Daily Backups</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Blazing-fast page speed</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>No plugins needed for security or cache</span>
                </li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-blue-700">Suggested Plan: WordPress Lite</p>
                <p className="text-sm text-blue-600">₹799/mo</p>
                <p className="text-xs text-gray-600 mt-1">For personal blogs and portfolio sites</p>
                <p className="text-xs text-gray-600 mt-1">1 vCPU | 1 GB RAM | 30 GB SSD | Daily Backup | SSL Included</p>
              </div>
            </div>
            
            {/* Business Owner */}
            <div className="hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-100 shadow-md p-6 transform scale-105">
              <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">Popular</div>
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900">I Run a Business Site</h3>
              </div>
              <p className="text-gray-700 mb-4">Built to keep your website fast, secure, and running 24/7.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dedicated resources for stability</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Automated backups & built-in security</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Supports contact forms, landing pages</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Integrations with popular business tools</span>
                </li>
              </ul>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="font-medium text-indigo-700">Suggested Plan: WordPress Pro</p>
                <p className="text-sm text-indigo-600">₹1299/mo</p>
                <p className="text-xs text-gray-600 mt-1">For business websites and lead-gen landing pages</p>
                <p className="text-xs text-gray-600 mt-1">1 vCPU | 2 GB RAM | 50 GB SSD | Priority Support | Daily Backups</p>
              </div>
            </div>
            
            {/* Developer */}
            <div className="hover:shadow-xl transition-all duration-300 bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900">I'm a Web Developer/Agency</h3>
              </div>
              <p className="text-gray-700 mb-4">Run multiple client sites effortlessly with high performance.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Host multiple WordPress sites</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>High-performance stack with full root access</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority support & custom configs</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Optimized for developer workflows</span>
                </li>
              </ul>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-medium text-purple-700">Suggested Plan: WordPress Pro+</p>
                <p className="text-sm text-purple-600">₹1999/mo</p>
                <p className="text-xs text-gray-600 mt-1">For developers & growing agencies</p>
                <p className="text-xs text-gray-600 mt-1">2 vCPU | 4 GB RAM | 100 GB SSD | Host up to 5 Sites | Enhanced Security</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full mb-6">
              <Cloud className="h-6 w-6 text-indigo-600" />
            </div>
            
            <h2 className="text-sm font-medium text-indigo-600 uppercase tracking-wider">WordPress Challenges</h2>
            
            <h3 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose Hostastra for WordPress?
            </h3>
            
            <p className="mt-4 text-lg text-gray-600">
              Because you deserve WordPress hosting that's fast, secure, and easy — without relying on dozens of plugins or struggling with slow shared servers.
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
      <div className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:text-center">
            <Monitor className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Hostastra Solution</h2>
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

      {/* Plans Section */}
      <div id="plans" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Server className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-sm text-indigo-600 font-semibold tracking-wide uppercase">Pricing Plans</h2>
            <p className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Choose Your WordPress Hosting Plan
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
              Affordable, dedicated plans crafted for bloggers, business owners, and agencies — with all the essentials built in and no hidden surprises.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${plan.recommended ? 'border-2 border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50' : 'border border-gray-100'}`}
              >
                {plan.recommended && (
                  <div className="bg-indigo-500 text-white text-center py-2 font-medium">
                    Recommended
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white mx-auto mb-6">
                    <plan.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900">{plan.name}</h3>
                  <p className="text-center text-sm text-gray-500 mb-6">
                    {plan.bestFor}
                  </p>
                  <p className="text-center">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  </p>
                  <div className="mt-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                          <p className="ml-3 text-gray-700">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-50 p-6">
                  <a
                    href="#"
                    className={`block w-full py-3 px-4 rounded-md shadow text-center text-white font-medium ${plan.recommended ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-500 hover:bg-blue-600'} transition duration-300`}
                  >
                    Get Started
                  </a>
                  <p className="mt-3 text-xs text-center text-gray-500">Includes 1-month free trial</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Star className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-sm text-indigo-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Trusted by 100+ Bloggers & Business Owners
            </p>
          </div>
          
          <div className="bg-indigo-50 rounded-2xl p-8 sm:p-10 shadow-lg">
            <div className="text-xl italic text-gray-800">
              "Hostastra took away all the headaches I had with plugins, speed, and backups. It just works, and it's fast!"
            </div>
            <div className="mt-6 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-base font-medium text-gray-900">Himanshu</div>
                <div className="text-sm text-gray-500">Food Blogger</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm text-indigo-600 font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Still Thinking? We've Got Answers to What's On Your Mind.
            </p>
          </div>
          
          <div className="grid gap-6 md:gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-medium text-gray-900 flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                  </span>
                  {faq.question}
                </h3>
                <p className="mt-4 text-base text-gray-500 pl-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ready to Host Like a King?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Choose your plan and launch your WordPress site in 10 seconds.
            No plugin chaos. No tech drama. Just speed, security, and peace of mind.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 hover:scale-105"
            >
              <Rocket className="h-5 w-5 mr-2" />
              Launch My WordPress Site Now
            </a>
            <p className="mt-3 text-sm text-gray-500">Includes 1-month free trial</p>
          </div>
        </div>
      </div>

    </div>
  )}