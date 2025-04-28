import { ShieldCheck, Server, Clock, Wallet, ChevronRight, CheckCircle, Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import Image from 'next/image';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import CTA from '../components/CTA';

export const metadata = {
  title: "HostAstra.com - Contact Our Hosting Experts",
  description: "Get in touch with our hosting specialists for premium solutions tailored to your needs"
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      {/* Navigation */}
      <Nav/>

      {/* Hero Section */}
      <div className="relative py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-indigo-600">HostAstra.com Support</span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="inline">Contact </span>
                  <span className="text-indigo-600 inline-block">Our Team</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Our hosting experts are available 24/7 to help with your infrastructure needs
              </p>
              
              {/* Contact Methods */}
              <div className="mt-8 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                    <Mail className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email Support</h3>
                    <p className="mt-1 text-base text-gray-500">
                      <a href="mailto:support@hostastra.com" className="text-indigo-600 hover:text-indigo-500">
                        support@hostastra.com
                      </a>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Typically responds within 1 hour</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                    <Phone className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Phone Support</h3>
                    <p className="mt-1 text-base text-gray-500">
                      <a href="tel:+18005551234" className="text-indigo-600 hover:text-indigo-500">
                        +1 (800) 555-1234
                      </a>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">24/7 emergency support available</p>
                  </div>
                </div>

                {/* <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                    <MessageSquare className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Live Chat</h3>
                    <p className="mt-1 text-base text-gray-500">
                      <a href="#" className="text-indigo-600 hover:text-indigo-500">
                        Start live chat now
                      </a>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Available 24/7 with average 2 min response time</p>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full lg:max-w-md">
                <div className="relative block w-full overflow-hidden rounded-xl shadow-xl">
                  <div className="bg-white p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                    <form className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <select
                          id="subject"
                          name="subject"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option>General Inquiry</option>
                          <option>Sales Question</option>
                          <option>Technical Support</option>
                          <option>Billing Question</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        ></textarea>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      {/* <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Locations</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Global Support Centers
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We provide local support from multiple locations worldwide
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-indigo-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">North America</h3>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-base text-gray-500">123 Tech Boulevard</p>
                <p className="text-base text-gray-500">San Francisco, CA 94107</p>
                <p className="text-base text-gray-500">United States</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-indigo-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">Europe</h3>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-base text-gray-500">45 Cloud Street</p>
                <p className="text-base text-gray-500">Amsterdam, 1012 LP</p>
                <p className="text-base text-gray-500">Netherlands</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-indigo-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">Asia Pacific</h3>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-base text-gray-500">8 Hosting Lane</p>
                <p className="text-base text-gray-500">Singapore, 038981</p>
                <p className="text-base text-gray-500">Singapore</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <CTA/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}