'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StateSelector } from '@/components/ui/StateSelector';
import { Shield, MapPin, Users, Languages, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { isValidPhoneNumber } from '@/lib/utils';
import toast from 'react-hot-toast';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to LegalShield AI',
    description: 'Your personal legal rights companion',
  },
  {
    id: 'location',
    title: 'Select Your State',
    description: 'We need to know your state to provide accurate legal information',
  },
  {
    id: 'language',
    title: 'Choose Your Language',
    description: 'Select your preferred language for legal scripts and guides',
  },
  {
    id: 'emergency',
    title: 'Emergency Contacts',
    description: 'Add trusted contacts who will be alerted during emergencies',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Your LegalShield AI is ready to protect your rights',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { 
    selectedState, 
    setSelectedState, 
    language, 
    setLanguage, 
    emergencyContacts, 
    addEmergencyContact, 
    removeEmergencyContact,
    setIsOnboarded 
  } = useAppStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [newContact, setNewContact] = useState('');

  const currentStepData = ONBOARDING_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep === 1 && !selectedState) {
      toast.error('Please select your state to continue');
      return;
    }

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setIsOnboarded(true);
      toast.success('Welcome to LegalShield AI!');
      router.push('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddContact = () => {
    if (!newContact.trim()) {
      toast.error('Please enter a contact number');
      return;
    }

    if (!isValidPhoneNumber(newContact)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (emergencyContacts.includes(newContact)) {
      toast.error('This contact is already added');
      return;
    }

    addEmergencyContact(newContact);
    setNewContact('');
    toast.success('Emergency contact added');
  };

  const handleRemoveContact = (contact: string) => {
    removeEmergencyContact(contact);
    toast.success('Emergency contact removed');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: // Location step
        return !!selectedState;
      case 2: // Language step
        return !!language;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {getStepIcon(currentStep)}
                  </div>
                  <CardTitle className="text-2xl">
                    {currentStepData.title}
                  </CardTitle>
                  <p className="text-gray-600">
                    {currentStepData.description}
                  </p>
                </CardHeader>

                <CardContent>
                  {renderStepContent()}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>
                {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
              </span>
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                <Check className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  function getStepIcon(step: number) {
    const iconClass = "h-12 w-12 text-primary";
    const containerClass = "p-3 bg-primary/10 rounded-full";

    switch (step) {
      case 0:
        return (
          <div className={containerClass}>
            <Shield className={iconClass} />
          </div>
        );
      case 1:
        return (
          <div className={containerClass}>
            <MapPin className={iconClass} />
          </div>
        );
      case 2:
        return (
          <div className={containerClass}>
            <Languages className={iconClass} />
          </div>
        );
      case 3:
        return (
          <div className={containerClass}>
            <Users className={iconClass} />
          </div>
        );
      case 4:
        return (
          <div className={containerClass}>
            <Check className={iconClass} />
          </div>
        );
      default:
        return (
          <div className={containerClass}>
            <Shield className={iconClass} />
          </div>
        );
    }
  }

  function renderStepContent() {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center space-y-6">
            <p className="text-lg text-gray-700">
              LegalShield AI helps you navigate police interactions with confidence by providing:
            </p>
            <div className="grid gap-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>State-specific legal rights information</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>Pre-written scripts for common situations</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>Emergency recording and alert features</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>Shareable incident documentation</span>
              </div>
            </div>
          </div>
        );

      case 1: // Location
        return (
          <div className="space-y-4">
            <StateSelector
              value={selectedState}
              onChange={setSelectedState}
              placeholder="Select your state"
            />
            <p className="text-sm text-gray-600">
              We use your state information to provide accurate legal rights and procedures specific to your location.
            </p>
          </div>
        );

      case 2: // Language
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  language === 'en'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`h-4 w-4 rounded-full border-2 ${
                    language === 'en' ? 'border-primary bg-primary' : 'border-gray-300'
                  }`} />
                  <span className="font-medium">English</span>
                </div>
              </button>
              
              <button
                onClick={() => setLanguage('es')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  language === 'es'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`h-4 w-4 rounded-full border-2 ${
                    language === 'es' ? 'border-primary bg-primary' : 'border-gray-300'
                  }`} />
                  <span className="font-medium">Español</span>
                </div>
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Legal scripts and guides will be provided in your selected language.
            </p>
          </div>
        );

      case 3: // Emergency Contacts
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="tel"
                  placeholder="Enter phone number (e.g., +1 555-123-4567)"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button onClick={handleAddContact}>
                  Add
                </Button>
              </div>
              
              {emergencyContacts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Emergency Contacts:</h4>
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <span className="font-mono">{contact}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveContact(contact)}
                        className="text-error hover:text-error"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-600">
              These contacts will be automatically notified when you start an emergency recording. You can skip this step and add contacts later.
            </p>
          </div>
        );

      case 4: // Complete
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <p className="text-lg text-gray-700">
              Your LegalShield AI is configured and ready to help protect your rights during legal encounters.
            </p>
            <div className="bg-primary/5 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Remember:</strong> This app provides general legal information and should not replace professional legal advice. Always comply with lawful orders and prioritize your safety.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  }
}
