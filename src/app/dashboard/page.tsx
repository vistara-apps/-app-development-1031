'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { useRecording } from '@/hooks/useRecording';
import { useLocation } from '@/hooks/useLocation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RecordButton, AlertButton } from '@/components/recording/RecordButton';
import { 
  Shield, 
  FileText, 
  MessageSquare, 
  MapPin, 
  Settings, 
  AlertTriangle,
  Clock,
  Users
} from 'lucide-react';
import { getStateName } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    selectedState, 
    language, 
    emergencyContacts, 
    isOnboarded 
  } = useAppStore();
  
  const { 
    isRecording, 
    duration, 
    startRecording, 
    stopRecording, 
    isSupported: recordingSupported 
  } = useRecording();
  
  const { 
    location, 
    requestLocation, 
    isLoading: locationLoading 
  } = useLocation();

  const [recentActivity] = useState([
    { id: 1, type: 'guide', title: 'Traffic Stop Rights', time: '2 hours ago' },
    { id: 2, type: 'script', title: 'Vehicle Search Script', time: '1 day ago' },
    { id: 3, type: 'recording', title: 'Emergency Recording', time: '3 days ago' },
  ]);

  useEffect(() => {
    if (!isOnboarded) {
      router.push('/onboarding');
    }
  }, [isOnboarded, router]);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      // Auto-request location when recording starts
      if (!location) {
        requestLocation();
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const blob = await stopRecording();
      if (blob) {
        toast.success('Recording saved successfully');
        // Here you would typically upload the recording
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleEmergencyAlert = async () => {
    if (emergencyContacts.length === 0) {
      toast.error('No emergency contacts configured');
      router.push('/settings');
      return;
    }

    // Simulate sending alerts
    toast.success(`Alert sent to ${emergencyContacts.length} contact(s)`);
  };

  const quickActions = [
    {
      title: 'Legal Guides',
      description: 'View state-specific rights',
      icon: FileText,
      href: '/guides',
      color: 'bg-blue-500',
    },
    {
      title: 'Scripts',
      description: 'Get scripted responses',
      icon: MessageSquare,
      href: '/scripts',
      color: 'bg-green-500',
    },
    {
      title: 'Emergency',
      description: 'Record & alert contacts',
      icon: AlertTriangle,
      href: '/emergency',
      color: 'bg-red-500',
    },
    {
      title: 'Settings',
      description: 'Manage preferences',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500',
    },
  ];

  if (!isOnboarded) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">LegalShield AI</h1>
                <p className="text-sm text-gray-600">
                  {selectedState ? getStateName(selectedState) : 'No state selected'} • {language === 'es' ? 'Español' : 'English'}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => router.push('/settings')}
              className="p-2"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Emergency Recording Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-error" />
                  <span>Emergency Recording</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-6">
                  <RecordButton
                    isRecording={isRecording}
                    duration={duration}
                    onStart={handleStartRecording}
                    onStop={handleStopRecording}
                    disabled={!recordingSupported}
                  />
                  
                  {!recordingSupported && (
                    <p className="text-sm text-error text-center">
                      Recording not supported on this device
                    </p>
                  )}
                  
                  <div className="flex space-x-4">
                    <AlertButton
                      onAlert={handleEmergencyAlert}
                      disabled={emergencyContacts.length === 0}
                    />
                    
                    <Button
                      variant="secondary"
                      onClick={requestLocation}
                      disabled={locationLoading}
                      className="flex items-center space-x-2"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>
                        {locationLoading ? 'Getting Location...' : 'Update Location'}
                      </span>
                    </Button>
                  </div>
                  
                  {location && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Current location: {location.address || `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => router.push(action.href)}
                      className="p-4 rounded-lg border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${action.color} text-white`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recording</span>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${isRecording ? 'bg-error animate-pulse' : 'bg-gray-300'}`} />
                    <span className="text-sm font-medium">
                      {isRecording ? 'Active' : 'Ready'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${location ? 'bg-accent' : 'bg-gray-300'}`} />
                    <span className="text-sm font-medium">
                      {location ? 'Available' : 'Not set'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Emergency Contacts</span>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {emergencyContacts.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {item.type === 'guide' && <FileText className="h-4 w-4 text-primary" />}
                          {item.type === 'script' && <MessageSquare className="h-4 w-4 text-primary" />}
                          {item.type === 'recording' && <AlertTriangle className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No recent activity
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Legal Disclaimer */}
            <Card className="border-notification/20 bg-notification/5">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-notification mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Legal Disclaimer
                    </p>
                    <p className="text-xs text-gray-600">
                      This app provides general legal information and should not replace professional legal advice. Always prioritize your safety and comply with lawful orders.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
