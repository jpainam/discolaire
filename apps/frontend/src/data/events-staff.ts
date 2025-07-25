export type Events = {
  year: number;
  periodType: "Q" | "H";
  periodNumber: number;
  isChecked: boolean;
  events: {
    title: string;
    isChecked: boolean;
    type?: string; // Add this
  }[];
}[];
export const events: Events = [
  {
    year: 2021,
    periodType: "Q",
    periodNumber: 4,
    isChecked: true,
    events: [
      {
        title: "Platform Conceptualization",
        isChecked: true,
        type: "Development",
      },
      { title: "Smart Contract Audit", isChecked: true, type: "Security" },
      { title: "Initial Coin Offering", isChecked: true, type: "Marketing" },
      { title: "First Exchange Listing", isChecked: true, type: "Marketing" },
      {
        title: "Partnership Announcements",
        isChecked: true,
        type: "Partnerships",
      },
    ],
  },
  {
    year: 2022,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      {
        title: "Community Governance Launch",
        isChecked: true,
        type: "Community",
      },
      {
        title: "DeFi Protocol (testnet)",
        isChecked: true,
        type: "Development",
      },
      {
        title: "Security Enhancement Update",
        isChecked: true,
        type: "Security",
      },
      { title: "Mainnet Deployment", isChecked: true, type: "Deployment" },
      { title: "Early Adopter Program", isChecked: true, type: "Community" },
      { title: "Strategic Alliances", isChecked: true, type: "Partnerships" },
      {
        title: "Brand Identity Finalization",
        isChecked: true,
        type: "Marketing",
      },
    ],
  },
  {
    year: 2022,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      {
        title: "Payment Gateway Development",
        isChecked: true,
        type: "Development",
      },
      { title: "New Platform Website", isChecked: true, type: "Marketing" },
      { title: "Beta Version Release", isChecked: true, type: "Deployment" },
      { title: "Native Token Swap", isChecked: true, type: "Development" },
      {
        title: "Additional Exchange Listings",
        isChecked: true,
        type: "Marketing",
      },
    ],
  },
  {
    year: 2023,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      {
        title: "Cross-chain Integration Research",
        isChecked: true,
        type: "Development",
      },
      { title: "Multi-chain Deployment", isChecked: true, type: "Deployment" },
      {
        title: "Centralized Exchange Development",
        isChecked: true,
        type: "Development",
      },
      {
        title: "Decentralized Exchange Protocol",
        isChecked: true,
        type: "Development",
      },
      { title: "DEX Mainnet Launch", isChecked: true, type: "Deployment" },
    ],
  },
  {
    year: 2023,
    periodType: "H",
    periodNumber: 2,
    isChecked: true,
    events: [
      { title: "Mobile App (Beta)", isChecked: true, type: "Development" },
      {
        title: "Mobile App (Official Release)",
        isChecked: true,
        type: "Deployment",
      },
    ],
  },
  {
    year: 2024,
    periodType: "H",
    periodNumber: 1,
    isChecked: true,
    events: [
      { title: "Platform V1 Release", isChecked: true, type: "Deployment" },
      {
        title: "Developer Portal Launch",
        isChecked: true,
        type: "Development",
      },
      { title: "Mobile App V2", isChecked: true, type: "Development" },
      { title: "Platform V2 Upgrade", isChecked: true, type: "Development" },
      { title: "New Feature Modules", isChecked: true, type: "Development" },
      { title: "EVM Chain Integration", isChecked: true, type: "Development" },
      {
        title: "E-commerce Plugin Development",
        isChecked: true,
        type: "E-commerce",
      },
      { title: "Payment Link Service", isChecked: true, type: "E-commerce" },
    ],
  },
  {
    year: 2024,
    periodType: "H",
    periodNumber: 2,
    isChecked: false,
    events: [
      {
        title: "Liquidity Oracle Service",
        isChecked: false,
        type: "Development",
      },
      {
        title: "Token Distribution Tool",
        isChecked: false,
        type: "Development",
      },
      {
        title: "Decentralized Raffle System",
        isChecked: false,
        type: "Development",
      },
      {
        title: "Digital Gift Card Platform",
        isChecked: false,
        type: "E-commerce",
      },
      {
        title: "Platform Alpha Testing",
        isChecked: false,
        type: "Development",
      },
    ],
  },
  {
    year: 2025,
    periodType: "H",
    periodNumber: 1,
    isChecked: false,
    events: [
      {
        title: "Multi-network Expansion",
        isChecked: false,
        type: "Deployment",
      },
      { title: "Platform Beta Testing", isChecked: false, type: "Development" },
      { title: "DAO Implementation", isChecked: false, type: "Community" },
    ],
  },
];
