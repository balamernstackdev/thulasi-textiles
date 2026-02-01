'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallbackTitle?: string;
    fallbackMessage?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ShoppingErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Granular Shop Error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 md:p-12 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl text-center space-y-6 my-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl text-rose-600">
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                            {this.props.fallbackTitle || 'Localized Heritage Glitch'}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                            {this.props.fallbackMessage || 'This section of the loom is temporarily stuck. We are working to fix the thread.'}
                        </p>
                    </div>

                    <button
                        onClick={this.handleReset}
                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Retry Section
                    </button>

                    {process.env.NODE_ENV !== 'production' && (
                        <div className="mt-4 p-3 bg-red-50 rounded-xl text-left">
                            <p className="text-[10px] font-mono text-red-600">{this.state.error?.message}</p>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
