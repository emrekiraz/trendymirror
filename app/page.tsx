import React from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'TrendyMirror',
  description: 'TrendyMirror AI-Powered Virtual Try-On Platform',
}

export default function Home() {
  // Redirect to the home page
  redirect('/home')
} 