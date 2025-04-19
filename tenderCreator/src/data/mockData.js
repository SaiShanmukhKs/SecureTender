export const initialTenders = [
  {
    id: 1,
    title: "Office Supplies Procurement",
    description: "Supply of stationery and office consumables for Q1 2025",
    deadline: "2025-03-15",
    status: "Open",
    bidders: [
      { id: 101, name: "OfficeMax Inc.", bid: 12500, rating: 4.5 },
      { id: 102, name: "Stationery Plus", bid: 13800, rating: 4.8 },
      { id: 103, name: "Business Supplies Co.", bid: 11900, rating: 3.9 },
    ],
    awardedTo: null,
  },
  {
    id: 2,
    title: "IT Hardware Maintenance",
    description: "Annual maintenance contract for server infrastructure",
    deadline: "2025-03-10",
    status: "Open",
    bidders: [
      { id: 201, name: "TechCare Solutions", bid: 45000, rating: 4.7 },
      { id: 202, name: "ServerPro Maintenance", bid: 42000, rating: 4.2 },
      { id: 203, name: "IT Support 365", bid: 48000, rating: 4.9 },
    ],
    awardedTo: null,
  },
  {
    id: 3,
    title: "Cafeteria Services",
    description: "Providing cafeteria services for 100 employees",
    deadline: "2025-02-28",
    status: "Awarded",
    bidders: [
      { id: 301, name: "Food Delights", bid: 35000, rating: 4.6 },
      { id: 302, name: "Tasty Bites Catering", bid: 32000, rating: 4.3 },
      { id: 303, name: "Corporate Meals Inc.", bid: 38000, rating: 4.8 },
    ],
    awardedTo: 303,
  },
];
