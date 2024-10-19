// utils/consts.ts
import { crystal1, crystal2, crystal3, crystal4, crystal5, crystal6, crystal7, crystal8, crystal9, mainCharacter } from "@/images";
import { StaticImageData } from "next/image";

export const ALLOW_ALL_DEVICES = true;

export const WALLET_MANIFEST_URL = "https://violet-traditional-rabbit-103.mypinata.cloud/ipfs/QmcFgnfXoiNtp8dvy25xA9hMEjz5AzugTuPQNTHQMTw9Tf";

export interface LevelData {
  name: string;
  minPoints: number;
  bigImage: StaticImageData;
  smallImage: StaticImageData;
  color: string;
  friendBonus: number;
  friendBonusPremium: number;
}

export const LEVELS: LevelData[] = [
  {
    name: "Meme Newbie",  // Updated name
    minPoints: 0,
    bigImage: mainCharacter,
    smallImage: crystal1,  // Replace with appropriate image
    color: "#7FFF00",  // Light green
    friendBonus: 0,
    friendBonusPremium: 0,
  },
  {
    name: "GIF Jockey",  // Updated name
    minPoints: 5000,  // Updated points
    bigImage: mainCharacter,
    smallImage: crystal2,  // Replace with appropriate image
    color: "#FFD700",  // Yellow
    friendBonus: 5000,  // Updated friend bonuses
    friendBonusPremium: 10000,
  },
  {
    name: "Meme Scout",  // Updated name
    minPoints: 25000,  // Updated points
    bigImage: mainCharacter,
    smallImage: crystal3,  // Replace with appropriate image
    color: "#00BFFF",  // Sky blue
    friendBonus: 10000,  // Updated friend bonuses
    friendBonusPremium: 20000,
  },
  {
    name: "Viral Rookie",  // Updated name
    minPoints: 100000,  // Updated points
    bigImage: mainCharacter,
    smallImage: crystal4,  // Replace with appropriate image
    color: "#FFA500",  // Orange
    friendBonus: 20000,  // Updated friend bonuses
    friendBonusPremium: 40000,
  },
  {
    name: "Dank Dealer",  // Updated name
    minPoints: 1000000,  // Updated points
    bigImage: mainCharacter,
    smallImage: crystal5,  // Replace with appropriate image
    color: "#FFD700",  // Gold
    friendBonus: 50000,  // Updated friend bonuses
    friendBonusPremium: 100000,
  },
  {
    name: "Meme Mystic",  // Updated name
    minPoints: 2500000,  // Updated points
    bigImage: mainCharacter,
    smallImage: crystal6,  // Replace with appropriate image
    color: "#9932CC",  // Purple
    friendBonus: 100000,  // Updated friend bonuses
    friendBonusPremium: 150000,
  },
  {
    name: "Laugh Lord",  // Updated name
    minPoints: 10000000,  // Updated points
    bigImage: mainCharacter,
    smallImage: crystal7,  // Replace with appropriate image
    color: "#8B0000",  // Dark red
    friendBonus: 200000,  // Updated friend bonuses
    friendBonusPremium: 300000,
  },
  {
    name: "Troll Boss",  // Updated name
    minPoints: 25000000,  // Updated points
    bigImage: mainCharacter,
    smallImage: crystal8,  // Replace with appropriate image
    color: "#006400",  // Dark green
    friendBonus: 400000,  // Updated friend bonuses
    friendBonusPremium: 600000,
  },
  {
    name: "Meme Titan",  // Updated name
    minPoints: 50000000,  // Updated points
    bigImage: mainCharacter,
    smallImage: crystal9,  // Replace with appropriate image
    color: "#7DF9FF",  // Electric blue
    friendBonus: 750000,  // Updated friend bonuses
    friendBonusPremium: 1000000,
  },
  {
    name: "Cosmic Memelord",  // Updated name
    minPoints: 100000000,  // Updated points
    bigImage: mainCharacter,
    smallImage: crystal9,  // Replace with appropriate image
    color: "#0F0F0F",  // Cosmic black
    friendBonus: 1000000,  // Updated friend bonuses
    friendBonusPremium: 2000000,
  },
];

export const DAILY_REWARDS = [
  500,
  1000,
  2500,
  5000,
  15000,
  25000,
  100000,
  500000,
  1000000,
  5000000
];

export const MAXIMUM_INACTIVE_TIME_FOR_MINE = 3*60*60*1000; // 3 hours in milliseconds

export const MAX_ENERGY_REFILLS_PER_DAY = 6;
export const ENERGY_REFILL_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds
export const TASK_WAIT_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

export const REFERRAL_BONUS_BASE = 5000;
export const REFERRAL_BONUS_PREMIUM = 25000;

// Multitap
export const multitapUpgradeBasePrice = 1000;
export const multitapUpgradeCostCoefficient = 2;

export const multitapUpgradeBaseBenefit = 1;
export const multitapUpgradeBenefitCoefficient = 1;

// Energy
export const energyUpgradeBasePrice = 1000;
export const energyUpgradeCostCoefficient = 2;

export const energyUpgradeBaseBenefit = 500;
export const energyUpgradeBenefitCoefficient = 1;

// Mine (profit per hour)
export const mineUpgradeBasePrice = 1000;
export const mineUpgradeCostCoefficient = 1.5;

export const mineUpgradeBaseBenefit = 100;
export const mineUpgradeBenefitCoefficient = 1.2;
