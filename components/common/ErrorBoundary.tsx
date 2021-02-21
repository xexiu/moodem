import React, { Component, ComponentType } from 'react';
import { FallbackComponent, Props as FallbackComponentProps } from '../common/FallbackComponent';

type Props = {
    children: Node,
    FallbackComponent: ComponentType<FallbackComponentProps>,
    onError?: Function
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
    public setState: any;
    public props: any;
    state: State = { error: null };

    static defaultProps: { FallbackComponent: ComponentType<FallbackComponentProps> } = {
        FallbackComponent
    };

    static getDerivedStateFromError(error: any) {
        return { error };
    }

    componentDidCatch(error, info) {
        // logErrorToService(error, info.componentStack) ---> https://sentry.io/
    }

    resetError = () => {
        this.setState({ error: null });
    };

    render() {
        return this.state.error
            ? <FallbackComponent
                error={this.state.error}
                resetError={this.resetError}
            />
            : this.props.children;
    }
}
