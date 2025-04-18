'use client'

import { useState, useEffect } from 'react'
import Button from '@/app/components/ui/Button'
import { Text } from '@/app/components/ui/Typography'
import { useAuth } from '@/app/hooks/use-auth'
import { supabase } from '@/app/lib/supabase'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  // Get user data from auth context
  const { user } = useAuth()
  
  // User information state
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    productUpdates: true,
    marketingEmails: false
  })
  
  // Language state
  const [language, setLanguage] = useState('en')
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      // Set email from user object
      setUserInfo(prev => ({
        ...prev,
        email: user.email || ''
      }))
      
      // Check user metadata first (for Google login)
      const fullName = user.user_metadata?.full_name as string
      if (fullName) {
        const nameParts = fullName.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
        
        setUserInfo(prev => ({
          ...prev,
          firstName, 
          lastName
        }))
      }
      
      // Fetch additional profile data from Supabase
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single()
            
          if (error) {
            console.error('Error fetching user profile:', error)
            return
          }
          
          if (data) {
            // Only update if there's actual data
            const firstName = data.first_name || userInfo.firstName || ''
            const lastName = data.last_name || userInfo.lastName || ''
            
            setUserInfo(prev => ({
              ...prev,
              firstName: String(firstName),
              lastName: String(lastName)
            }))
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
        }
      }
      
      fetchUserProfile()
    }
  }, [user])
  
  // Handle user info form changes
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInfo(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle notification preference changes
  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }
  
  // Handle language change
  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }
  
  // Save user information
  const handleSaveUserInfo = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      // Update profile in Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: userInfo.firstName,
          last_name: userInfo.lastName,
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        throw profileError
      }

      // Update user metadata if email changed
      if (userInfo.email !== user.email) {
        // Update email in Supabase Auth
        const { error: emailError } = await supabase.auth.updateUser({
          email: userInfo.email
        })
        
        if (emailError) {
          throw emailError
        }
        
        toast.success('Email update verification has been sent to your new email')
      } else {
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }
  
  // Delete account
  const handleDeleteAccount = async () => {
    if (!user) return
    
    // Implement a confirmation dialog here
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (!confirmed) return
    
    setIsLoading(true)
    try {
      // Call Supabase function or API to delete account
      // For example:
      const { error } = await supabase.rpc('delete_user')
      
      if (error) throw error
      
      toast.success('Account deleted successfully')
      // Redirect to home page after deletion
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <Text color="light">Manage your account settings and preferences</Text>
      </div>
      
      {/* User Info Section */}
      <div className="bg-white rounded-lg shadow-level-1 p-6 mb-8">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          <p className="text-gray-500 text-sm">Update your personal information</p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={userInfo.firstName}
                onChange={handleUserInfoChange}
                className="form-input"
                placeholder="Your first name"
              />
            </div>
            <div className="w-full md:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={userInfo.lastName}
                onChange={handleUserInfoChange}
                className="form-input"
                placeholder="Your last name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              className="form-input"
              placeholder="Your email address"
            />
            <Text color="light" variant="body-sm" className="mt-1">
              Changing your email will require verification
            </Text>
          </div>
          <div className="pt-4">
            <Button 
              variant="primary" 
              onClick={handleSaveUserInfo}
              className="mr-2"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Notification Preferences Section */}
      <div className="bg-white rounded-lg shadow-level-1 p-6 mb-8">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
          <p className="text-gray-500 text-sm">Manage how we contact you</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Text color="dark" className="font-medium">Email Notifications</Text>
              <Text color="light" variant="body-sm">Receive notifications via email</Text>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
              <input
                type="checkbox"
                id="emailNotifications"
                className="absolute w-0 h-0 opacity-0"
                checked={notifications.emailNotifications}
                onChange={() => handleNotificationChange('emailNotifications')}
              />
              <label
                htmlFor="emailNotifications"
                className={`block w-12 h-6 overflow-hidden rounded-full cursor-pointer ${
                  notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 transform ${
                    notifications.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Text color="dark" className="font-medium">Product Updates</Text>
              <Text color="light" variant="body-sm">Receive updates about new features and improvements</Text>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
              <input
                type="checkbox"
                id="productUpdates"
                className="absolute w-0 h-0 opacity-0"
                checked={notifications.productUpdates}
                onChange={() => handleNotificationChange('productUpdates')}
              />
              <label
                htmlFor="productUpdates"
                className={`block w-12 h-6 overflow-hidden rounded-full cursor-pointer ${
                  notifications.productUpdates ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 transform ${
                    notifications.productUpdates ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Text color="dark" className="font-medium">Marketing Emails</Text>
              <Text color="light" variant="body-sm">Receive marketing and promotional emails</Text>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
              <input
                type="checkbox"
                id="marketingEmails"
                className="absolute w-0 h-0 opacity-0"
                checked={notifications.marketingEmails}
                onChange={() => handleNotificationChange('marketingEmails')}
              />
              <label
                htmlFor="marketingEmails"
                className={`block w-12 h-6 overflow-hidden rounded-full cursor-pointer ${
                  notifications.marketingEmails ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 transform ${
                    notifications.marketingEmails ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Language Preferences Section */}
      <div className="bg-white rounded-lg shadow-level-1 p-6 mb-8">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Language Preferences</h2>
          <p className="text-gray-500 text-sm">Choose your preferred language</p>
        </div>
        <div>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="language">
              Language
            </label>
            <div className="relative">
              <select
                id="language"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="form-input block w-full appearance-none"
              >
                <option value="en">English</option>
                {/* More languages can be added here in the future */}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <Text color="light" variant="body-sm" className="mt-2">
              More languages will be available soon
            </Text>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white rounded-lg shadow-level-1 p-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Delete Account</h2>
          <p className="text-gray-500 text-sm">This action is permanent and cannot be undone</p>
        </div>
        <div>
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Warning</h3>
                <div className="mt-1 text-sm">
                  <p>Deleting your account will permanently remove all your data. This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleDeleteAccount} 
            disabled={isLoading}
            className="text-red-600 hover:bg-red-50 border-red-600"
          >
            {isLoading ? 'Processing...' : 'Delete Account'}
          </Button>
        </div>
      </div>
    </div>
  )
} 