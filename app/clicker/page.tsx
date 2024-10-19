'use client'

import React, { useState, useEffect, useCallback, ReactNode, ErrorInfo } from 'react';
import Game from '@/components/Game';
import Mine from '@/components/Mine';
import Friends from '@/components/Friends';
import Earn from '@/components/Earn';
import Airdrop from '@/components/Airdrop';
import Navigation from '@/components/Navigation';
import LoadingScreen from '@/components/Loading';
import { LEVELS, LevelData } from '@/utils/consts';  // Import LEVELS for meme levels
import Boost from '@/components/Boost';
import { AutoIncrement } from '@/components/AutoIncrement';
import { PointSynchronizer } from '@/components/PointSynchronizer';
import Settings from '@/components/Settings';

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

class ErrorBoundary extends React.Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={new Error('Something went wrong')} resetErrorBoundary={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}

function ClickerPage() {
    const [currentView, setCurrentViewState] = useState<string>('loading');
    const [isInitialized, setIsInitialized] = useState(false);
    const [points, setPoints] = useState(0); // Add state to track user points
    const [memeLevel, setMemeLevel] = useState<LevelData>(LEVELS[0]); // Initial meme level

    const setCurrentView = (newView: string) => {
        console.log('Changing view to:', newView);
        setCurrentViewState(newView);
    };

    const calculateMemeLevel = useCallback(() => {
        const levelIndex = LEVELS.findIndex(level => points >= level.minPoints) || 0;
        setMemeLevel(LEVELS[levelIndex]);
    }, [points]);

    useEffect(() => {
        calculateMemeLevel();  // Recalculate meme level when points change
    }, [points, calculateMemeLevel]);

    const renderCurrentView = useCallback(() => {
        if (!isInitialized) {
            return <LoadingScreen
                setIsInitialized={setIsInitialized}
                setCurrentView={setCurrentView}
            />;
        }

        switch (currentView) {
            case 'game':
                return (
                    <Game
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        points={points}
                        memeLevel={memeLevel} // Pass meme level to Game component
                        setPoints={setPoints} // To update points
                    />
                );
            case 'boost':
                return <Boost currentView={currentView} setCurrentView={setCurrentView} />;
            case 'settings':
                return <Settings setCurrentView={setCurrentView} />;
            case 'mine':
                return <Mine setCurrentView={setCurrentView} />;
            case 'friends':
                return <Friends />;
            case 'earn':
                return <Earn />;
            case 'airdrop':
                return <Airdrop />;
            default:
                return (
                    <Game
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        points={points}
                        memeLevel={memeLevel} // Ensure meme level is available
                        setPoints={setPoints}
                    />
                );
        }
    }, [currentView, isInitialized, points, memeLevel]);

    console.log('ClickerPage rendering. Current state:', { currentView, isInitialized });

    return (
        <div className="bg-black min-h-screen text-white">
            {isInitialized && (
                <>
                    <AutoIncrement />
                    <PointSynchronizer />
                </>
            )}
            {renderCurrentView()}
            {isInitialized && currentView !== 'loading' && (
                <Navigation
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />
            )}
        </div>
    );
}

export default function ClickerPageWithErrorBoundary() {
    return (
        <ErrorBoundary>
            <ClickerPage />
        </ErrorBoundary>
    );
}
