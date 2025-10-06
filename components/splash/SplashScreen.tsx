'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Brain, Zap, Shield, Database, Users } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const steps = [
    {
      icon: <Stethoscope className="w-16 h-16 text-blue-500" />,
      title: "Baby-AGI Medical",
      subtitle: "Research Assistant",
      description: "AI-powered medical research with evidence-based analysis"
    },
    {
      icon: <Brain className="w-16 h-16 text-green-500" />,
      title: "Intelligent Analysis",
      subtitle: "20+ Medical Specialties",
      description: "Autonomous task generation following clinical guidelines"
    },
    {
      icon: <Database className="w-16 h-16 text-purple-500" />,
      title: "Evidence-Based",
      subtitle: "Research Protocols",
      description: "Systematic reviews, RCTs, and meta-analyses"
    },
    {
      icon: <Shield className="w-16 h-16 text-orange-500" />,
      title: "Clinical Compliance",
      subtitle: "Professional Standards",
      description: "IRB approval tracking and peer review requirements"
    }
  ];

  // Get window dimensions safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
          }, 1500);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [steps.length, onComplete]);

  const features = [
    { icon: <Stethoscope className="w-5 h-5" />, text: "20 Medical Specialties" },
    { icon: <Brain className="w-5 h-5" />, text: "AI-Powered Research" },
    { icon: <Database className="w-5 h-5" />, text: "Evidence-Based Analysis" },
    { icon: <Shield className="w-5 h-5" />, text: "Clinical Compliance" },
    { icon: <Zap className="w-5 h-5" />, text: "Autonomous Tasks" },
    { icon: <Users className="w-5 h-5" />, text: "Peer Review Ready" }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
        >
          {/* Background Medical Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-500 rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border-2 border-green-500 rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-28 h-28 border-2 border-purple-500 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 border-2 border-orange-500 rounded-full"></div>
            
            {/* Medical Cross Pattern */}
            <div className="absolute top-1/4 left-1/4 w-6 h-20 bg-blue-500 opacity-20 rounded"></div>
            <div className="absolute top-1/3 left-1/4 w-20 h-6 bg-blue-500 opacity-20 rounded"></div>
            
            <div className="absolute bottom-1/4 right-1/4 w-6 h-20 bg-green-500 opacity-20 rounded"></div>
            <div className="absolute bottom-1/3 right-1/4 w-20 h-6 bg-green-500 opacity-20 rounded"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
            {/* Main Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-6"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-full border border-white/20">
                  {steps[currentStep].icon}
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold text-white">
                  {steps[currentStep].title}
                </h1>
                <h2 className="text-xl text-blue-200 font-medium">
                  {steps[currentStep].subtitle}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {steps[currentStep].description}
                </p>
              </motion.div>
            </motion.div>

            {/* Progress Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex space-x-2 mt-8"
            >
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-blue-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </motion.div>

            {/* Features Grid - Show on last step */}
            {currentStep === steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 gap-3 mt-8 text-sm"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center space-x-2 text-slate-300 bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10"
                  >
                    <div className="text-blue-400">
                      {feature.icon}
                    </div>
                    <span className="text-xs">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Loading Animation */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
            />
          </div>

          {/* Subtle Animation Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  x: Math.random() * dimensions.width,
                  y: Math.random() * dimensions.height 
                }}
                animate={{ 
                  opacity: [0, 0.3, 0],
                  x: Math.random() * dimensions.width,
                  y: Math.random() * dimensions.height,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}