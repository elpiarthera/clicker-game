// components/Navigation.tsx
'use client'

import React from 'react';
import Image from 'next/legacy/image'; // Next.js legacy image import
import Mine from '@/icons/Mine';
import Friends from '@/icons/Friends';
import Coins from '@/icons/Coins';
import { iceToken } from '@/images';
import memebux2 from '@/images/memebux2.png';
import { IconProps } from '@/utils/types';
import { triggerHapticFeedback } from '@/utils/ui';
import { StaticImageData } from 'next/image'; // Import StaticImageData from 'next/image'

// Define a type for NavItem to include both image and icon
type NavItem = {
  name: string;
  icon?: React.FC<IconProps> | null;
  image?: StaticImageData | null; // Correctly typed image
  view: string;
};

// Navigation items with images and icons
const navItems: NavItem[] = [
  { name: 'Game', image: memebux2, view: 'game' },
  { name: 'Mine', icon: Mine, view: 'mine' },
  { name: 'Friends', icon: Friends, view: 'friends' },
  { name: 'Earn', icon: Coins, view: 'earn' },
  { name: 'Airdrop', image: iceToken, view: 'airdrop' },
];

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Navigation({ currentView, setCurrentView }: NavigationProps) {
  
  // Handle view change with haptic feedback
  const handleViewChange = (view: string) => {
    if (typeof setCurrentView === 'function') {
      triggerHapticFeedback(window);
      setCurrentView(view);
    }
  };

  // Ensure setCurrentView is a function
  if (typeof setCurrentView !== 'function') {
    console.error('setCurrentView is not a function. Navigation cannot be rendered properly.');
    return null; // Return fallback UI or null
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#272a2f] flex justify-around items-center z-40 text-xs border-t border-[#43433b] max-h-24">
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => handleViewChange(item.view)}
          className="flex-1"
        >
          <div className={`flex flex-col items-center justify-center ${currentView === item.view ? 'text-white bg-[#1c1f24]' : 'text-[#85827d]'} h-16 m-1 p-2 rounded-2xl`}>
            <div className="w-8 h-8 relative">
              
              {/* Correct Image rendering with Next.js Image */}
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={32}
                  height={32}
                  layout="intrinsic" // Use 'intrinsic' layout
                />
              )}
              
              {/* Fix icon rendering using React.createElement */}
              {item.icon && React.createElement(item.icon, { className: "w-full h-full" })} 
              
            </div>
            <p className="mt-1">{item.name}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
