import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    (this as any).setState({ error, errorInfo });
    console.error('[ErrorBoundary] Render error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Error de renderizado</h2>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-4 max-h-60 overflow-auto">
              <pre className="text-xs text-red-800 font-mono whitespace-pre-wrap break-all">
                {this.state.error?.toString()}
                {this.state.error?.stack && '\n\n' + this.state.error.stack}
              </pre>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-xl font-semibold hover:bg-neutral-900 transition-colors"
              >
                Recargar aplicación
              </button>
              <button
                onClick={() => (this as any).setState({ hasError: false, error: null, errorInfo: null })}
                className="flex-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Ocultar
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}