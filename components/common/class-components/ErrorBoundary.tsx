import React, { Component, ComponentType } from 'react';
import { FallbackComponent, Props as FallbackComponentProps } from '../functional-components/FallbackComponent';

type Props = {
    children: React.ReactChild,
    FallbackComponent: ComponentType<FallbackComponentProps>,
    onError?: Function
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
    public setState: any;
    state: State = { error: null };

    static defaultProps: { FallbackComponent: ComponentType<FallbackComponentProps> } = {
        FallbackComponent
    };

    static getDerivedStateFromError(error: any) {
        return { error };
    }

    componentDidCatch(error: any, info: any) {
        console.warn('ErrorBoundary Error', error, 'Info. ', info);
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
