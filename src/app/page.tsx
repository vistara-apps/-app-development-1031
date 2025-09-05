'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsOnboarded } from '@/store';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const isOnboarded = useIsOnboarded();

  useEffect(() => {
    // Redirect based on onboarding status
    if (isOnboarded) {
      router.push('/dashboard');
    }
  }, [isOnboarded, router]);

  const handleGetStarted = () => {
    router.push('/onboarding');
  };

  const handleEnterApp = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="p-4 bg-primary/10 rounded-full"
              >
                <Shield className="h-16 w-16 text-primary" />
              </motion.div>
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance"
            >
              LegalShield AI
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 text-balance"
            >
              Navigate legal encounters with confidence.
              <br />
              <span className="text-primary font-semibold">Your rights, in your pocket.</span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={handleEnterApp}
                className="flex items-center space-x-2"
              >
                <span>Enter App</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                className="bg-white rounded-lg p-6 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="bg-primary/5 rounded-xl p-8 border border-primary/20"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to protect your rights?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands who trust LegalShield AI for legal guidance during police interactions.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="flex items-center space-x-2"
            >
              <span>Start Now - It's Free</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Shield,
    title: 'State-Specific Rights',
    description: 'Get legal rights information tailored to your specific state laws and regulations.',
  },
  {
    icon: Shield,
    title: 'Scripted Responses',
    description: 'Pre-written, effective phrases for common police interactions in English and Spanish.',
  },
  {
    icon: Shield,
    title: 'Emergency Recording',
    description: 'One-tap recording with automatic emergency contact alerts and location sharing.',
  },
  {
    icon: Shield,
    title: 'Incident Cards',
    description: 'Generate shareable incident summaries stored permanently on IPFS for legal documentation.',
  },
];
