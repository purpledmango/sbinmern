 
  
  
  
  
  
  import { ShieldCheck, Server, Clock, Wallet, ChevronRight, CheckCircle, Menu, X, Cpu, MemoryStick, HardDrive, Lock, HelpCircle } from 'lucide-react';
  import Image from 'next/image';
  import Footer from '../components/Footer';
  import Nav from '../components/Nav';
  import CTA from '../components/CTA';
  import { FaMagento, FaWordpress, FaWordpressSimple } from 'react-icons/fa';

  export const metadata = {
      title: "HostAstra.com - Pricing Plans",
      description: "The Most Affordable Premium Wordpress and Magento Hosting Solution"
  }

  export default function PricingPage() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
        {/* Navigation */}
        <Nav/>

        {/* Plans Section */}
       <CTA/>
        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Still Thinking? We've Got Answers to What's On Your Mind</h2>
              <p className="text-slate-500 mt-4">Common questions from our customers</p>
            </div>
            
            <div className="space-y-8">
              {/* FAQ Item 1 */}
              <div className="bg-slate-50 rounded-lg p-6 hover:shadow-md transition duration-300">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">Why is your pricing higher than ₹99 hosting plans?</h3>
                    <p className="mt-2 text-slate-600">
                      Because we don't cut corners. With ₹99 plans, you get overcrowded servers, no support, and you're left to handle security and backups on your own. Hostastra gives you dedicated power, built-in security, automated backups, and real human support — no plugins, no patchwork, no compromises.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="bg-slate-50 rounded-lg p-6 hover:shadow-md transition duration-300">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">Will I have to manage everything myself after purchase?</h3>
                    <p className="mt-2 text-slate-600">
                      Not at all. Hostastra is fully managed — you don't need to worry about installations, security, or updates. Just deploy your WordPress or Magento site and focus on growing. We handle the rest in the background like your tech army.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="bg-slate-50 rounded-lg p-6 hover:shadow-md transition duration-300">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">Can I trust a newer hosting platform over known brands?</h3>
                    <p className="mt-2 text-slate-600">
                      We get it. But while the big names charge more and care less, we're building Hostastra with creators like you in mind. We're fast, transparent, and built on India's own premium cloud — and over 100+ customers have already made the switch.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FAQ Item 4 */}
              <div className="bg-slate-50 rounded-lg p-6 hover:shadow-md transition duration-300">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">Will I need to buy extra plugins for security or backups?</h3>
                    <p className="mt-2 text-slate-600">
                      No. Everything comes built-in. Automatic backups, enterprise-grade security, and SSL are included with every plan — so you can stop spending time (and money) on add-ons.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FAQ Item 5 */}
              <div className="bg-slate-50 rounded-lg p-6 hover:shadow-md transition duration-300">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">Is it safe to host my eCommerce site on Hostastra?</h3>
                    <p className="mt-2 text-slate-600">
                      Absolutely. Our Magento-optimized plans are made for speed and security. Your store will run on dedicated resources, not shared servers — so no noisy neighbors or performance drops.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FAQ Item 6 */}
              <div className="bg-slate-50 rounded-lg p-6 hover:shadow-md transition duration-300">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">What if I face issues at midnight?</h3>
                    <p className="mt-2 text-slate-600">
                      We're up when you are. Hostastra's 24/7 royal support is here — and yes, we speak your language. Whether it's 2 PM or 2 AM, you won't be left waiting.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FAQ Item 7 */}
              <div className="bg-slate-50 rounded-lg p-6 hover:shadow-md transition duration-300">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">Will my pricing increase on renewal?</h3>
                    <p className="mt-2 text-slate-600">
                      Never. What you see is what you pay — no surprise hikes, no tricks. We believe in transparent, fair pricing — today, and every renewal after.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FAQ Item 8 */}
              <div className="bg-slate-50 rounded-lg p-6 hover:shadow-md transition duration-300">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">Can I cancel anytime if I don't like it?</h3>
                    <p className="mt-2 text-slate-600">
                      Yes, anytime. No lock-in, no drama. Try us risk-free — and if you ever want to leave, we'll even help you migrate out.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Final CTA */}
            <div className="mt-12 text-center bg-indigo-50 rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-800">Ready to Experience Hosting That Feels Effortless, Powerful, and Truly Yours?</h3>
              <p className="mt-4 text-slate-600 mb-6">Sign up now and get 1 month free</p>
              <a href='/auth/login' className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
                Get Started
              </a>
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