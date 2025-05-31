import { XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 w-full">
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
            <Image alt='hostraLogo' src={"/images/nobg-logo.png"} width={400} height={400}/>
          </div>
        </div>
        <div className='flex w-full justify-center items-center gap-6 mt-8'>
          <Link href='https://www.instagram.com/hostastra/' className="text-indigo-400 hover:text-indigo-300 transition-colors">
            <FaInstagram size={24} />
          </Link>
          <Link href='https://x.com/Host__Astra' className="text-indigo-400 hover:text-indigo-300 transition-colors">
            <XIcon size={24} />
          </Link>
          <Link href='https://www.linkedin.com/company/host-astra/' className="text-indigo-400 hover:text-indigo-300 transition-colors">
            <FaLinkedin size={24} />
          </Link>
          <Link href='https://www.facebook.com/people/HostAstra/61576070984566/' className="text-indigo-400 hover:text-indigo-300 transition-colors">
            <FaFacebook size={24} />
          </Link>
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