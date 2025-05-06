import { ShieldCheck, Server, Clock, Wallet, ChevronRight, CheckCircle, Menu, X, Star, Zap, Shield, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Nav from './components/Nav';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      {/* Navigation */}
      <Nav/>

      {/* Promotional Banner */}
      <div className="bg-indigo-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium">
            Be an early user and experience Hostastra for free for one month
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-indigo-600">Premium WordPress and Magento Hosting</span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block">Experience</span>
                  <span className="block text-indigo-600">dedicated hosting</span>
                  <span className="block">at an affordable price</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Zero manual plugin installations, ever. Leave slow load times behind. Experience seamless, secure, and royal-grade hosting for WordPress & Magento — no manual backups, no security hassles. Just deploy and go.
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
                <div className="mt-5">
                  <p className="text-center lg:text-left text-lg font-semibold text-indigo-600">Launch Your Website in 10 Seconds</p>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full lg:max-w-md">
                <Image 
                  className="w-full" 
                  src="/images/icon.png" 
                  alt="Website dashboard mockup" 
                  width={600}
                  height={600}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Struggling to Choose Between Shared Hosting That Frustrates You — and Dedicated Hosting That's Just Too Expensive?
            </h2>
            <p className="mt-4 text-xl text-slate-500">
              You're not alone. Most users face the same daily battle:
              Shared hosting is slow, risky, and full of compromises. Dedicated hosting promises power but comes with premium pricing, complex setup, and endless manual tasks.
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Here's What You're Dealing With Right Now:</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg text-slate-800">Hidden Renewal Charges</h4>
                <p className="mt-2 text-slate-500">Initial discounts seem attractive, but renewal prices shoot up unexpectedly.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg text-slate-800">Slow Website Loading</h4>
                <p className="mt-2 text-slate-500">Overcrowded shared servers and weak infrastructure drag your site down.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg text-slate-800">Poor Support with Language Barriers</h4>
                <p className="mt-2 text-slate-500">Support teams that don't understand your urgency or your language.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg text-slate-800">Complex Setup & Manual Configurations</h4>
                <p className="mt-2 text-slate-500">You spend hours adding backup tools, security plugins, and caching just to make it work.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg text-slate-800">No Built-In Security or Backups</h4>
                <p className="mt-2 text-slate-500">You're constantly worried about threats and data loss unless you set up everything manually.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg text-slate-800">Zero Real Ownership</h4>
                <p className="mt-2 text-slate-500">In shared hosting, your site's speed and stability depends on what others on the same server are doing.</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
  <div className="relative inline-block">
    <p className="text-2xl font-semibold text-slate-800 relative z-10 px-4">
      After battling these frustrations daily...
    </p>
    <div className="absolute bottom-0 left-0 w-full h-2 bg-indigo-100 opacity-80 -z-0"></div>
  </div>
  
  <p className="mt-6 text-3xl font-bold text-indigo-600">
    Switching to dedicated hosting seems like the only escape
  </p>
  
  <div className="mt-8 animate-pulse">
    <p className="text-xl font-medium text-slate-600">
      But then comes the <span className="text-red-500 font-bold">harsh reality</span> →
    </p>
  </div>
  
  <div className="mt-8 max-w-2xl mx-auto bg-red-50/50 p-6 rounded-xl border-l-4 border-red-500">
    <ul className="space-y-4 text-left">
      <li className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="ml-3 text-lg font-medium text-slate-800">
          <span className="font-bold">The prices are too high:</span> Dedicated hosting costs 5-10× more than shared
        </p>
      </li>
      <li className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="ml-3 text-lg font-medium text-slate-800">
          <span className="font-bold">Setup nightmare:</span> Manual backups, security configs, performance tuning
        </p>
      </li>
    </ul>
  </div>
  
  <div className="mt-8 bg-white p-4 inline-block rounded-lg shadow-sm border border-slate-200">
    <p className="text-slate-600 italic">
      "You're stuck between slow shared hosting and expensive dedicated servers"
    </p>
  </div>
</div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
              That's Exactly Why We Built Hostastra
            </h2>
            <p className="mt-4 text-xl text-slate-600">
              To give you the power of premium hosting, without the price tag or the painful setup.
              No need to install 10 plugins for security, caching, or backups.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
            <div className="flex items-start">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700">Instant WP Deployment</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700">Built-in Security (No manual plugins)</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700">Automatic Daily Backups</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700">Premium Ultra-Fast Servers</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700">Local Language Support</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700">Predictable Pricing (No Surprise Renewals)</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700">Dedicated Resources (Not Shared)</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
              <p className="ml-3 text-base text-slate-700">24/7 Royal Support</p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-xl font-semibold text-indigo-600">Just deploy and go.</p>
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

      {/* Testimonial Section */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-800">Experience Dedicated Hosting Without the Stress of a Hefty Price Tag</h2>
            <p className="mt-4 text-xl text-slate-600">
              Enjoy blazing speed, unbeatable reliability, and complete peace of mind with India's own royal and premium WordPress and Magento hosting, Hostastra.
            </p>
            <p className="mt-2 text-lg text-slate-500">(Monthly/Quarterly/Yearly)</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="px-6 py-8 sm:p-10">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-lg leading-7 text-slate-700">
                    "I tried a few hosting providers before — some were affordable but gave poor performance, and others offered premium service but were way too expensive.
                    After a lot of frustration, I found Hostastra.
                    Finally, a platform that gives me speed I was looking for, solid security, and real support without draining my pocket.
                    Best part is I no longer have to install a bunch of plugins or worry about backups and security.. Hostastra handles it all."
                  </p>
                  <div className="mt-3">
                    <div className="text-base font-medium text-slate-800">~ Siddharth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-slate-800">Trusted by 100+ Bloggers, Businesses & Digital Creators</h3>
            <p className="mt-4 text-lg text-slate-600">
              From growing blogs to high-traffic e-commerce stores, Hostastra powers websites that demand speed, security, and support without compromise.
            </p>
            <div className="mt-8 flex justify-center space-x-8">
              {/* Placeholder for customer logos */}
              <div className="h-12 w-24 bg-slate-200 rounded flex items-center justify-center text-slate-500">Logo</div>
              <div className="h-12 w-24 bg-slate-200 rounded flex items-center justify-center text-slate-500">Logo</div>
              <div className="h-12 w-24 bg-slate-200 rounded flex items-center justify-center text-slate-500">Logo</div>
              <div className="h-12 w-24 bg-slate-200 rounded flex items-center justify-center text-slate-500">Logo</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Still Thinking? We've Got Answers to What's On Your Mind.</h2>
      <div className="mt-4 h-1 w-20 bg-blue-500 mx-auto"></div>
    </div>
    
    <div className="mt-16 grid gap-8 lg:grid-cols-2">
      <div className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 flex items-start">
          <span className="text-blue-600 mr-2">1.</span> Is Hostastra beginner-friendly?
        </h3>
        <p className="mt-4 text-slate-700 leading-relaxed">100%! You don't need to be a tech expert. Just choose your plan, click deploy, and your website goes live. No coding, no stress — it just works.</p>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 flex items-start">
          <span className="text-blue-600 mr-2">2.</span> How's Hostastra different from typical shared hosting?
        </h3>
        <p className="mt-4 text-slate-700 leading-relaxed">Big difference. With us, you get dedicated resources — so no more "noisy neighbors" slowing your site down. Your performance is yours, always.</p>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 flex items-start">
          <span className="text-blue-600 mr-2">3.</span> Why would I pay more when I can get ₹99 hosting elsewhere?
        </h3>
        <p className="mt-4 text-slate-700 leading-relaxed">You could — but then you'll spend hours fixing slow speeds, adding security plugins, and dealing with terrible support. Hostastra gives you premium speed, security, and support — without the premium drama.</p>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 flex items-start">
          <span className="text-blue-600 mr-2">4.</span> Do I need to install plugins for backups and security?
        </h3>
        <p className="mt-4 text-slate-700 leading-relaxed">Nope. We've got your back. Backups run automatically, and security is built right in — no extra work, no extra cost.</p>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 flex items-start">
          <span className="text-blue-600 mr-2">5.</span> Can I migrate my existing website easily?
        </h3>
        <p className="mt-4 text-slate-700 leading-relaxed">Absolutely. We help you move your WordPress or Magento site to Hostastra — for free, with no downtime. Smooth as butter.</p>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 flex items-start">
          <span className="text-blue-600 mr-2">6.</span> Is support actually helpful… or is it just email tickets?
        </h3>
        <p className="mt-4 text-slate-700 leading-relaxed">We're here 24/7 — in plain English or Hindi. Real humans, real help. No bots. No scripted replies.</p>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 flex items-start">
          <span className="text-blue-600 mr-2">7.</span> Will my price increase after a few months?
        </h3>
        <p className="mt-4 text-slate-700 leading-relaxed">Nope. What you see is what you pay. No renewal traps, no sneaky upgrades.</p>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 flex items-start">
          <span className="text-blue-600 mr-2">8.</span> Will my site slow down if traffic increases?
        </h3>
        <p className="mt-4 text-slate-700 leading-relaxed">Not at all. You're on premium infrastructure with dedicated resources. Your site's performance won't suffer just because you're getting more visitors — in fact, we're built for growth.</p>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 flex items-start">
          <span className="text-blue-600 mr-2">9.</span> I don't understand servers and technical stuff — will I be able to manage my site?
        </h3>
        <p className="mt-4 text-slate-700 leading-relaxed">You won't have to. Hostastra takes care of the backend — you just focus on your website and content. We handle the tough stuff silently.</p>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 flex items-start">
          <span className="text-blue-600 mr-2">10.</span> What if I need help setting things up?
        </h3>
        <p className="mt-4 text-slate-700 leading-relaxed">Don't worry — we'll walk you through everything. From setup to launch, our support team is just a message away. You'll never feel stuck.</p>
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
                  INR 999
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
                  INR 1999
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
                    Wordpress Business
                  </h3>
                </div>
                <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                  INR 2999
                  <span className="ml-1 text-2xl font-medium text-slate-500"></span>
                </div>
                <p className="mt-5 text-lg text-slate-500">
                  Complete solution for e-commerce businesses.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-slate-50 sm:p-10">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">Dedicated Wodpress Solution</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">50 GB Storage each website</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <p className="ml-3 text-base text-slate-700">Daily Automated Backups</p>
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
            <span className="block">Ready to Experience Hosting That Feels Effortless, Powerful, and Truly Yours?</span>
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
      <Footer/>
    </div>
  );
}