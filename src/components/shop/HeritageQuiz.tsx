'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles, Check, ArrowRight, Home, Briefcase, PartyPopper, Heart } from 'lucide-react';

const STEPS = [
    {
        id: 'occasion',
        question: 'What is the occasion?',
        options: [
            { id: 'Wedding', label: 'Wedding / Bridal', icon: Heart, description: 'Grandeur & Tradition' },
            { id: 'Festive', label: 'Festive / Celebration', icon: PartyPopper, description: 'Vibrant & Joyous' },
            { id: 'Office', label: 'Work / Formal', icon: Briefcase, description: 'Sophisticated & Subtle' },
            { id: 'Casual', label: 'Daily / Casual', icon: Home, description: 'Elegant & Comfortable' }
        ]
    },
    {
        id: 'style',
        question: 'What is your style preference?',
        options: [
            { id: 'Traditional', label: 'Purely Traditional', description: 'Timeless heritage designs' },
            { id: 'Contemporary', label: 'Contemporary Fusion', description: 'Modern takes on classics' },
            { id: 'Minimalist', label: 'Minimalist Chic', description: 'Subtle textures & tones' }
        ]
    },
    {
        id: 'fabric',
        question: 'What fabric do you prefer?',
        options: [
            { id: 'Silk', label: 'Royal Silk', description: 'Premium Kanchipuram & Banarasi' },
            { id: 'Cotton', label: 'Pure Cotton', description: 'Breathable Gadwal & Venkatagiri' },
            { id: 'Linen', label: 'Modern Linen', description: 'Chic hand-spun elegance' }
        ]
    }
];

export default function HeritageQuiz() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const handleSelect = (optionId: string) => {
        const nextAnswers = { ...answers, [STEPS[currentStep].id]: optionId };
        setAnswers(nextAnswers);

        if (currentStep < STEPS.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 300);
        } else {
            // Finish Quiz
            finishQuiz(nextAnswers);
        }
    };

    const finishQuiz = (finalAnswers: Record<string, string>) => {
        const params = new URLSearchParams();
        if (finalAnswers.occasion) params.append('occasions', finalAnswers.occasion);
        if (finalAnswers.fabric) params.append('fabrics', finalAnswers.fabric);
        if (finalAnswers.style) params.append('q', finalAnswers.style);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <section className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-12 md:py-16">
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                {/* Visual Side */}
                <div className="relative bg-orange-600 p-8 lg:p-14 flex flex-col justify-between overflow-hidden min-h-[400px]">
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <pattern id="weave-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9" stroke="white" strokeWidth="0.5" />
                            </pattern>
                            <rect width="100" height="100" fill="url(#weave-pattern)" />
                        </svg>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2 text-white/80 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">
                            <Sparkles className="w-3 h-3" />
                            Style Concierge
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                            Find Your <br />
                            <span className="text-orange-200">Perfect Weave</span>
                        </h2>
                        <p className="text-white/80 font-medium text-base md:text-lg max-w-sm leading-relaxed">
                            Answer 3 quick questions about your occasion and style, and we'll curate a collection tailored just for you.
                        </p>
                    </div>

                    <div className="relative z-10 pt-8">
                        <div className="flex gap-2">
                            {STEPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-10 bg-white' : 'w-3 bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Question Side */}
                <div className="p-6 md:p-10 lg:p-14 bg-white">
                    <div className="max-w-md mx-auto h-full flex flex-col justify-center">
                        <div className="space-y-2 mb-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Step {currentStep + 1} of {STEPS.length}</span>
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{STEPS[currentStep].question}</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {STEPS[currentStep].options.map((option: any) => {
                                const Icon = option.icon || Sparkles;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleSelect(option.id)}
                                        className={`group flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${answers[STEPS[currentStep].id] === option.id
                                            ? 'border-orange-600 bg-orange-50/50'
                                            : 'border-gray-50 hover:border-orange-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${answers[STEPS[currentStep].id] === option.id ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-orange-600'
                                                }`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{option.label}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{option.description}</p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[STEPS[currentStep].id] === option.id ? 'bg-green-500 border-green-500 text-white' : 'border-gray-100 text-transparent'
                                            }`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="mt-8 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors self-start flex items-center gap-2"
                            >
                                <ArrowRight className="w-3 h-3 rotate-180" />
                                Go Back
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
