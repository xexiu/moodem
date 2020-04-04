import React, { Component } from 'react';
import { FallbackComponent } from '../common/FallbackComponent';

export class ErrorBoundary extends Component {
    state = { error: null, hasError: false }

    static getDerivedStateFromError(error) {
        return { error, hasError: true }
    }

    componentDidCatch(error, info) {
        //logErrorToService(error, info.componentStack) ---> https://sentry.io/
    }

    resetError = () => {
        this.setState({ error: null, hasError: false })
    }

    render() {
        return this.state.hasError
            ? <FallbackComponent error={this.state.error} resetError={this.resetError} />
            : this.props.children
    }
}