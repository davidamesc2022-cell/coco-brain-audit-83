import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-200">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Algo salió mal</h2>
            <p className="text-sm text-gray-600 mb-6">
              El aplicativo encontró un error inesperado al intentar procesar esta pantalla.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-xs font-mono overflow-auto max-h-48 mb-6 text-gray-800">
              <p className="font-bold">{this.state.error?.toString()}</p>
              <pre className="mt-2 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Recargar aplicativo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
