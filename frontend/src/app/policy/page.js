import { ShieldCheck, Server, Clock, Wallet, ChevronRight, CheckCircle, Mail, Phone, MapPin, MessageSquare, Send, Shield, Lock, Eye, Users, FileText, AlertCircle } from 'lucide-react';
import Nav from '../components/Nav';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <Eye className="h-6 w-6 text-indigo-600" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Full name</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Email address</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Contact number</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Billing and payment details</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />IP address</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Login credentials</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Technical and Usage Data</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />Browser type and version</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />Device information</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />Operating system</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />Pages visited and time spent</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />Referral sources</li>
              <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-500 mr-2" />Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "information-usage",
      title: "How We Use Your Information",
      icon: <Server className="h-6 w-6 text-indigo-600" />,
      content: (
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start"><ChevronRight className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />Provide, operate, and maintain our services</li>
          <li className="flex items-start"><ChevronRight className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />Process transactions and send related information</li>
          <li className="flex items-start"><ChevronRight className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />Communicate with you, including responding to inquiries and customer service</li>
          <li className="flex items-start"><ChevronRight className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />Monitor and analyze usage and trends to improve user experience</li>
          <li className="flex items-start"><ChevronRight className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />Detect, prevent, and address technical issues</li>
          <li className="flex items-start"><ChevronRight className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />Comply with legal obligations</li>
        </ul>
      )
    },
    {
      id: "information-sharing",
      title: "Sharing Your Information",
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">We do not sell your personal data.</p>
          </div>
          <p className="text-gray-600">However, we may share your information with:</p>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-semibold text-gray-900">Service Providers</h4>
              <p className="text-gray-600">Trusted third parties that assist in operating our website and services, such as payment processors and analytics providers.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-gray-900">Legal Obligations</h4>
              <p className="text-gray-600">When required by law or in response to valid requests by public authorities.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-900">Business Transfers</h4>
              <p className="text-gray-600">In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="h-6 w-6 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">We implement appropriate technical and organizational measures to protect your personal data. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.</p>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-indigo-800 font-medium">Your data is protected with industry-standard security measures</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: <FileText className="h-6 w-6 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Subject to applicable laws, you may have the right to:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
              <h4 className="font-medium text-gray-900">Access</h4>
              <p className="text-sm text-gray-600">Access the personal data we hold about you</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
              <h4 className="font-medium text-gray-900">Correction</h4>
              <p className="text-sm text-gray-600">Request correction or deletion of your personal data</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
              <h4 className="font-medium text-gray-900">Object</h4>
              <p className="text-sm text-gray-600">Object to or restrict our processing of your personal data</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
              <h4 className="font-medium text-gray-900">Withdraw</h4>
              <p className="text-sm text-gray-600">Withdraw consent at any time</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-indigo-800">To exercise these rights, contact us at: </span>
              <a href="mailto:privacy@hostastra.com" className="text-indigo-600 hover:text-indigo-700 font-medium ml-1">
                privacy@hostastra.com
              </a>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      <Nav/>

    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      {/* Hero Section */}
      <div className="relative py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-100 rounded-full p-4">
                <ShieldCheck className="h-12 w-12 text-indigo-600" />
              </div>
            </div>
            <h1>
              <span className="block text-sm font-semibold uppercase tracking-wide text-indigo-600">Hostastra Technologies</span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="inline">Privacy </span>
                <span className="text-indigo-600 inline-block">Policy</span>
              </span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-base text-slate-500 sm:mt-5 sm:text-xl">
              Your privacy is our priority. Learn how we collect, use, and protect your information.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              <span className="inline-flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Effective Date: 31 May 2025
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            Hostastra Technologies Pvt. Ltd. ("Hostastra", "we", "us", or "our") is committed to safeguarding your privacy. 
            This Privacy Policy outlines how we collect, use, disclose, and protect your information when you interact with our 
            website <a href="https://www.hostastra.com" className="text-indigo-600 hover:text-indigo-700">https://www.hostastra.com</a>, 
            services, and platforms. By accessing or using our services, you agree to the terms of this Privacy Policy.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-6">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-2 mr-4">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{index + 1}. {section.title}</h2>
                  </div>
                </div>
              </div>
              <div className="p-8">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Data Retention</h3>
            </div>
            <p className="text-gray-600">
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
              comply with our legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Children's Privacy</h3>
            </div>
            <p className="text-gray-600">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal data from children. 
              If we become aware that we have collected personal data from a child without verification of parental consent, 
              we take steps to remove that information.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h3>
            <p className="text-gray-600 mb-6">If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-indigo-600 mr-2" />
                <a href="mailto:privacy@hostastra.com" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  privacy@hostastra.com
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-gray-600">B - 51, Lalbagh colony, Loni, GZB, 201102</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">Limitation of Liability</h4>
              <p className="text-yellow-700 text-sm">
                Hostastra Technologies Pvt. Ltd. shall not be held liable for any direct, indirect, incidental, consequential, 
                or punitive damages arising out of unauthorized access to or alteration of your transmissions or data, 
                statements or conduct of any third party on our services, or any other matter relating to our services. 
                We disclaim all warranties, express or implied, including but not limited to the implied warranties of 
                merchantability and fitness for a particular purpose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
        </>
  );
}