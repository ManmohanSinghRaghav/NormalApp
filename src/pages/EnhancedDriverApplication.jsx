import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { MathuraDataService } from '../services/MathuraDataService'

export default function EnhancedDriverApplication() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    phoneNumber: '',
    email: user?.email || '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Professional Information
    licenseNumber: '',
    licenseType: '',
    licenseExpiry: '',
    experience: '',
    previousEmployer: '',
    
    // Vehicle Information
    ownVehicle: false,
    vehicleType: '',
    vehicleNumber: '',
    vehicleModel: '',
    
    // Documents
    profilePhoto: null,
    licensePhoto: null,
    vehicleRC: null,
    
    // Additional
    references: '',
    notes: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

  const steps = [
    {
      title: t('driver.personalInfo', 'Personal Information'),
      description: t('driver.personalInfoDesc', 'Basic personal details'),
      icon: '👤'
    },
    {
      title: t('driver.professionalInfo', 'Professional Information'),
      description: t('driver.professionalInfoDesc', 'License and experience details'),
      icon: '🚗'
    },
    {
      title: t('driver.documents', 'Documents'),
      description: t('driver.documentsDesc', 'Upload required documents'),
      icon: '📄'
    },
    {
      title: t('driver.review', 'Review & Submit'),
      description: t('driver.reviewDesc', 'Review your application'),
      icon: '✅'
    }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileUpload = (fieldName) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setFormData(prev => ({
            ...prev,
            [fieldName]: event.target.result
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const applicationData = {
        full_name: formData.fullName,
        phone: formData.phoneNumber,
        email: formData.email,
        notes: `License: ${formData.licenseNumber}, Experience: ${formData.experience} years, Vehicle Type: ${formData.vehicleType}, ${formData.notes}`
      }

      const result = await MathuraDataService.submitDriverApplication(applicationData)
      
      if (result.success) {
        navigate('/driver/pending')
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.fullName', 'Full Name')} *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.phoneNumber', 'Phone Number')} *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.email', 'Email Address')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                  placeholder="your.email@example.com"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.dateOfBirth', 'Date of Birth')} *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('driver.address', 'Address')} *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your complete address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.city', 'City')} *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Mathura"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.state', 'State')} *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select State</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.pincode', 'Pincode')} *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="281001"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.licenseNumber', 'License Number')} *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="UP123456789012"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.licenseType', 'License Type')} *
                </label>
                <select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select License Type</option>
                  <option value="Light Motor Vehicle">Light Motor Vehicle (LMV)</option>
                  <option value="Heavy Motor Vehicle">Heavy Motor Vehicle (HMV)</option>
                  <option value="Transport Vehicle">Transport Vehicle</option>
                  <option value="Commercial Vehicle">Commercial Vehicle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.licenseExpiry', 'License Expiry Date')} *
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.experience', 'Experience (Years)')} *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Experience</option>
                  <option value="0-1">0-1 Years</option>
                  <option value="1-3">1-3 Years</option>
                  <option value="3-5">3-5 Years</option>
                  <option value="5-10">5-10 Years</option>
                  <option value="10+">10+ Years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('driver.previousEmployer', 'Previous Employer (if any)')}
              </label>
              <input
                type="text"
                name="previousEmployer"
                value={formData.previousEmployer}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Company name or 'Self-employed'"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Vehicle Information</h4>
              
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="ownVehicle"
                    checked={formData.ownVehicle}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t('driver.ownVehicle', 'I own a vehicle')}
                  </span>
                </label>
              </div>

              {formData.ownVehicle && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('driver.vehicleType', 'Vehicle Type')}
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="bus">Bus</option>
                      <option value="miniBus">Mini Bus</option>
                      <option value="auto">Auto Rickshaw</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('driver.vehicleNumber', 'Vehicle Number')}
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="UP-12-AB-1234"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.profilePhoto', 'Profile Photo')} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.profilePhoto ? (
                    <div>
                      <img 
                        src={formData.profilePhoto} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleFileUpload('profilePhoto')}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => handleFileUpload('profilePhoto')}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Upload Photo
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* License Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.licensePhoto', 'License Photo')} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.licensePhoto ? (
                    <div>
                      <img 
                        src={formData.licensePhoto} 
                        alt="License" 
                        className="w-32 h-20 mx-auto mb-2 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleFileUpload('licensePhoto')}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M9 12a3 3 0 003-3h12a3 3 0 003 3m0 0v6a3 3 0 01-3 3H12a3 3 0 01-3-3v-6m0 0h12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => handleFileUpload('licensePhoto')}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Upload License
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Clear photo of your driving license</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {formData.ownVehicle && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.vehicleRC', 'Vehicle RC Copy')}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.vehicleRC ? (
                    <div>
                      <img 
                        src={formData.vehicleRC} 
                        alt="Vehicle RC" 
                        className="w-32 h-20 mx-auto mb-2 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleFileUpload('vehicleRC')}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Change Document
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M9 12h6l3-3h12l3 3h6a3 3 0 013 3v12a3 3 0 01-3 3H9a3 3 0 01-3-3V15a3 3 0 013-3z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => handleFileUpload('vehicleRC')}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Upload RC Copy
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Vehicle Registration Certificate</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.emergencyContact', 'Emergency Contact Name')}
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('driver.emergencyPhone', 'Emergency Contact Phone')}
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('driver.applicationSummary', 'Application Summary')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Name:</strong> {formData.fullName}</p>
                    <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>City:</strong> {formData.city}, {formData.state}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Professional Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>License:</strong> {formData.licenseNumber}</p>
                    <p><strong>Type:</strong> {formData.licenseType}</p>
                    <p><strong>Experience:</strong> {formData.experience}</p>
                    {formData.ownVehicle && (
                      <p><strong>Vehicle:</strong> {formData.vehicleType} - {formData.vehicleNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Documents Uploaded</h4>
                <div className="flex gap-4">
                  {formData.profilePhoto && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Profile Photo
                    </div>
                  )}
                  {formData.licensePhoto && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      License Copy
                    </div>
                  )}
                  {formData.vehicleRC && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Vehicle RC
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('driver.additionalNotes', 'Additional Notes')}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any additional information you'd like to share..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Application Review Process</p>
                  <p>Your application will be reviewed within 2-3 business days. You'll receive email and SMS notifications about the status updates.</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🚌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('driver.applicationTitle', 'Driver Application')}
          </h1>
          <p className="text-gray-600">
            {t('driver.applicationSubtitle', 'Join NextStop as a professional driver')}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index + 1 < currentStep
                    ? 'bg-success-600 text-white'
                    : index + 1 === currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1 < currentStep ? '✓' : step.icon}
                </div>
                <div className="text-center mt-2">
                  <div className={`text-sm font-medium ${
                    index + 1 <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-full h-0.5 mt-5 -ml-4 ${
                    index + 1 < currentStep ? 'bg-success-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-danger-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-danger-800">Error</span>
              </div>
              <p className="text-danger-700 mt-1">{error}</p>
            </div>
          )}

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
