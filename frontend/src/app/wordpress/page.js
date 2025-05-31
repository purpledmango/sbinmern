import { Server, Zap, Shield, Clock, HardDrive, Cpu, Database, Rocket, Lock, RefreshCw, Cloud, Globe, Monitor, Check, Star, User, Briefcase, Code } from 'lucide-react';
import Image from 'next/image';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import CTA from '../components/CTA';
import PricingSection from '../components/PricingSection';
import Link from 'next/link';
import { FaWordpressSimple } from 'react-icons/fa';

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
    <div className="min-h-screen bg-white text-slate-800">
      <Nav />

      {/* Hero Section with Logo */}
      <div className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              {/* Logo */}
              <div className="flex items-center justify-center lg:justify-start mb-8">
                <div className="bg-indigo-600 p-3 rounded-xl shadow-lg">
                  <FaWordpressSimple className="h-8 w-8 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-indigo-600">Hostastra</span>
              </div>
              
              <h1 className="text-4xl tracking-tight font-bold sm:text-5xl xl:text-6xl leading-tight">
                <span className="block text-slate-900">Dedicated WordPress</span>
                <span className="block text-indigo-600">Hosting</span>
              </h1>
              <p className="mt-6 text-xl text-slate-600 leading-relaxed">
                Built for Bloggers, Business Owners & Developers who are tired of shared hosting.
                Experience WordPress hosting that's dedicated, not shared.
              </p>
              <div className="mt-10">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Link href="/auth/login" className="flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                    <Rocket className="h-5 w-5 mr-2" />
                    Launch in 10 Seconds
                  </Link>
                  <a href="#plans" className="flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200">
                    <Server className="h-5 w-5 mr-2" />
                    View Plans
                  </a>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  All plans include free SSL, automated backups, and dedicated resources
                </p>
              </div>
            </div>
            <div className="mt-16 lg:mt-0 lg:col-span-6">
              <div className="relative">
                <div className="relative mx-auto w-full rounded-2xl shadow-2xl overflow-hidden bg-white p-8">
                  <Image
                    src="/images/wordpress-logo.png"
                    alt="WordPress on Hostastra"
                    width={600}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>
                
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg">
                  1-Month Free Trial
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg">
                  10-Second Setup
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Type Selection */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4">Find Your Perfect Plan</h2>
            <h3 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Which Best Describes You?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Blogger */}
            <div className="group hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-slate-900">I'm a Blogger</h3>
              </div>
              <p className="text-slate-600 mb-6">You focus on writing, we handle the tech.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">1-click WordPress setup</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Free SSL & Daily Backups</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Blazing-fast page speed</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">No plugins needed for security or cache</span>
                </li>
              </ul>
              <div className="bg-blue-50 p-6 rounded-xl">
                <p className="font-semibold text-blue-900 mb-1">WordPress Lite</p>
                <p className="text-2xl font-bold text-blue-700 mb-2">₹499/mo</p>
                <p className="text-sm text-slate-600 mb-2">For personal blogs and portfolio sites</p>
                <p className="text-xs text-slate-500">1 vCPU | 1 GB RAM | 10 GB SSD | Daily Backup | SSL Included</p>
              </div>
            </div>
            
            {/* Business Owner */}
            <div className="relative group hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl border-2 border-indigo-200 p-8 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                Most Popular
              </div>
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-slate-900">I Run a Business Site</h3>
              </div>
              <p className="text-slate-600 mb-6">Built to keep your website fast, secure, and running 24/7.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Dedicated resources for stability</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Automated backups & built-in security</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Supports contact forms, landing pages</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Integrations with popular business tools</span>
                </li>
              </ul>
              <div className="bg-indigo-50 p-6 rounded-xl">
                <p className="font-semibold text-indigo-900 mb-1">WordPress Pro</p>
                <p className="text-2xl font-bold text-indigo-700 mb-2">₹999/mo</p>
                <p className="text-sm text-slate-600 mb-2">For business websites and lead-gen landing pages</p>
                <p className="text-xs text-slate-500">1 vCPU | 2 GB RAM | 50 GB SSD | Priority Support | Daily Backups</p>
              </div>
            </div>
            
            {/* Developer */}
            <div className="group hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-slate-900">I'm a Web Developer/Agency</h3>
              </div>
              <p className="text-slate-600 mb-6">Run multiple client sites effortlessly with high performance.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Host multiple WordPress sites</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">High-performance stack with full root access</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Priority support & custom configs</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Optimized for developer workflows</span>
                </li>
              </ul>
              <div className="bg-purple-50 p-6 rounded-xl">
                <p className="font-semibold text-purple-900 mb-1">WordPress Pro+</p>
                <p className="text-2xl font-bold text-purple-700 mb-2">₹1499/mo</p>
                <p className="text-sm text-slate-600 mb-2">For developers & growing agencies</p>
                <p className="text-xs text-slate-500">2 vCPU | 8 GB RAM | 80 GB SSD Enhanced Security</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-6">
              <Zap className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
              Why Choose Hostastra for WordPress?
            </h3>
            <p className="text-xl text-slate-600">
              Because you deserve WordPress hosting that's fast, secure, and easy — without relying on dozens of plugins or struggling with slow shared servers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem, index) => (
              <div key={index} className="group">
                <div className="h-full bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 p-6 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-600">
                      <span className="text-sm font-bold">×</span>
                    </div>
                    <span className="ml-3 text-sm font-semibold text-red-600 uppercase tracking-wider">Problem {index + 1}</span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {problem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-6">
              <Monitor className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-sm text-indigo-600 font-semibold tracking-wide uppercase mb-4">Hostastra Solution</h2>
            <p className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
              Optimized WordPress Experience
            </p>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need for a fast, secure WordPress site
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="h-full bg-white rounded-2xl border border-slate-200 p-8 transition-all duration-300 hover:shadow-xl hover:border-indigo-200">
                  <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-600 text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div id="plans" className="py-20 bg-white">
        <PricingSection/>
      </div>

      {/* Testimonial Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Trusted by 100+ Bloggers & Business Owners
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-10 shadow-xl border border-slate-200">
            <div className="text-2xl italic text-slate-700 leading-relaxed mb-8">
              "Hostastra took away all the headaches I had with plugins, speed, and backups. It just works, and it's fast!"
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-7 w-7 text-indigo-600" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-lg font-semibold text-slate-900">Himanshu</div>
                <div className="text-slate-500">Food Blogger</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm text-indigo-600 font-semibold tracking-wide uppercase mb-4">FAQ</h2>
            <p className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Still Thinking? We've Got Answers to What's On Your Mind.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-slate-900 flex items-start mb-4">
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                    <span className="text-sm font-semibold text-indigo-600">{index + 1}</span>
                  </span>
                  {faq.question}
                </h3>
                <p className="text-slate-600 leading-relaxed pl-12">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl mb-6">
            Ready to Host Like a King?
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-10">
            Choose your plan and launch your WordPress site in 10 seconds.
            No plugin chaos. No tech drama. Just speed, security, and peace of mind.
          </p>
          <div className="mb-6">
            <a
              href="#"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-xl hover:shadow-2xl"
            >
              <Rocket className="h-6 w-6 mr-3" />
              Launch My WordPress Site Now
            </a>
          </div>
          <p className="text-sm text-slate-500">Includes 1-month free trial</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}