import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-800">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Company</h3>
          <ul className="mt-4 space-y-4">
            <li><a href="/about" className="text-base text-slate-300 hover:text-white">About</a></li>
            <li><a href="/launch" className="text-base text-slate-300 hover:text-white">Launch</a></li>
            <li><a href="/contact" className="text-base text-slate-300 hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Services</h3>
          <ul className="mt-4 space-y-4">
            <li><a href="/wordpress" className="text-base text-slate-300 hover:text-white">WordPress Hosting</a></li>
            <li><a href="/magento" className="text-base text-slate-300 hover:text-white">Magento Hosting</a></li>

          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Support</h3>
          <ul className="mt-4 space-y-4">
            <li><a href="#" className="text-base text-slate-300 hover:text-white">Help Center</a></li>
            <li><a href="#" className="text-base text-slate-300 hover:text-white">Knowledgebase</a></li>
            <li><a href="#" className="text-base text-slate-300 hover:text-white">API Documentation</a></li>
            <li><a href="#" className="text-base text-slate-300 hover:text-white">Status Page</a></li>
          </ul>
        </div>
        {/* <div>
          <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase">Legal</h3>
          <ul className="mt-4 space-y-4">
            <li><a href="#" className="text-base text-slate-300 hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="text-base text-slate-300 hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="text-base text-slate-300 hover:text-white">SLA</a></li>
            <li><a href="#" className="text-base text-slate-300 hover:text-white">GDPR Compliance</a></li>
          </ul>
        </div> */}
      </div>
      <div className="mt-12 border-t border-slate-700 pt-8">
        <p className="text-base text-slate-400 text-center">
          &copy; 2025 Hostastra. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
  )
}

export default Footer