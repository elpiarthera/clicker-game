'use client'

import { useToast } from '@/contexts/ToastContext';
import IceCubes from '@/icons/IceCubes';
import Settings from '@/icons/Settings';
import { LEVELS } from '@/utils/consts';
import { useGameStore } from '@/utils/game-mechanics';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import Image from 'next/image';

interface TopInfoSectionProps {
    isGamePage?: boolean;
    setCurrentView: (view: string) => void;
}

export default function TopInfoSection({ isGamePage = false, setCurrentView }: TopInfoSectionProps) {
    const showToast = useToast();

    const {
        userTelegramName,
        gameLevelIndex,
        profitPerHour,
        points // Add points from game state
    } = useGameStore();

    // Calculate progress towards the next meme level
    const currentLevel = LEVELS[gameLevelIndex];
    const nextLevel = LEVELS[gameLevelIndex + 1] || null; // Check for next level

    const pointsForCurrentLevel = currentLevel.minPoints;
    const pointsForNextLevel = nextLevel ? nextLevel.minPoints : null;
    const levelProgress = pointsForNextLevel 
        ? ((points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100
        : 100; // 100% if there is no next level

    const handleSettingsClick = () => {
        triggerHapticFeedback(window);
        setCurrentView('settings');
    };

    return (
        <div className="px-4 z-10">
            <div className="flex items-center justify-between space-x-4 mt-4">
                <div className="flex items-center w-1/3">
                    <div className="flex items-center space-x-2">
                        {/* Removed the level icon before the user name */}
                        <div>
                            <p className="text-sm">{userTelegramName || "Unknown User"}</p>
                        </div>
                    </div>
                </div>
                <div className={`flex items-center w-fit border-2 border-[#43433b] rounded-full ${isGamePage ? 'px-4' : 'px-8'} py-[2px] bg-[#43433b]/[0.6] max-w-64`}>
                    {
                        isGamePage &&
                        <>
                            <div className="flex-1 text-center">
                                <p className="text-xs text-[#85827d] font-medium">Sync</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1"></div>
                                </div>
                            </div>
                            <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                        </>
                    }
                    <div className="flex-1 text-center">
                        <p className="text-xs text-[#85827d] font-medium whitespace-nowrap overflow-hidden text-ellipsis">MemeBux per hour</p>
                        <div className="flex items-center justify-center space-x-1">
                            <IceCubes size={20} />
                            <p className="text-sm">+{formatNumber(profitPerHour)}</p>
                        </div>
                    </div>
                    {
                        isGamePage &&
                        <>
                            <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                            <button
                                onClick={handleSettingsClick}
                                className="flex-1 flex items-center justify-center text-white focus:outline-none"
                            >
                                <Settings className="w-6 h-6" /> {/* Adjust size as needed */}
                            </button>
                        </>
                    }
                </div>
            </div>

            {/* Meme-Level Progress Section */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Image src={currentLevel.smallImage} width={32} height={32} alt="Current Meme Level" />
                    <p className="text-sm">Level: {currentLevel.name}</p>
                </div>
                {nextLevel && (
                    <div className="flex flex-col items-end">
                        <p className="text-sm text-gray-400">Next: {nextLevel.name}</p>
                        <div className="w-full bg-gray-600 rounded-full h-2 relative">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${levelProgress}%` }}
                            ></div>
                            <p className="absolute right-2 text-xs text-gray-300">{Math.floor(levelProgress)}%</p> {/* Added percentage */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
