'use client'

import React from 'react'
import Link from 'next/link'
import Logo from '@/app/components/ui/Logo'
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/landing/features' },
      { name: 'Pricing', href: '/landing/pricing' },
      { name: 'Business', href: '/landing/business' },
      { name: 'Enterprise', href: '/landing/enterprise' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '/landing/docs' },
      { name: 'Blog', href: '/landing/blog' },
      { name: 'Case Studies', href: '/landing/case-studies' },
      { name: 'Help Center', href: '/landing/help' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/landing/about' },
      { name: 'Careers', href: '/landing/careers' },
      { name: 'Contact', href: 'mailto:hello@trendymirror.com' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  },
]

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/trendymirrorcom' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  { name: 'GitHub', icon: Github, href: 'https://github.com' },
]

export default function LandingFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and company info */}
          <div className="lg:col-span-2">
            <Logo href="/home" />
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              TrendyMirror is an AI-powered virtual try-on platform that helps fashion retailers and consumers visualize clothing on different body types.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-primary transition-colors"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/home/features"
                  className="text-sm text-gray-600 hover:text-blue-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/home/pricing"
                  className="text-sm text-gray-600 hover:text-blue-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/home/business"
                  className="text-sm text-gray-600 hover:text-blue-primary transition-colors"
                >
                  Business
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/home/about"
                  className="text-sm text-gray-600 hover:text-blue-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@trendymirror.com"
                  className="text-sm text-gray-600 hover:text-blue-primary transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-blue-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} TrendyMirror. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-blue-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-blue-primary">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-xs text-gray-500 hover:text-blue-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 