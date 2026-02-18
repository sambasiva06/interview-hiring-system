import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4d4f' }}>
                    <h1>Something went wrong.</h1>
                    <p>{typeof this.state.error?.message === 'string' ? this.state.error.message : (typeof this.state.error === 'string' ? this.state.error : 'A runtime error occurred.')}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#1890ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
