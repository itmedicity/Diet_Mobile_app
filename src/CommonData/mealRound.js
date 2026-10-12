// The meal rounds of the ward day. Change the hours here if the kitchen runs on other times.
export const ROUNDS = [
    { name: "Breakfast", from: 5 },
    { name: "Lunch", from: 10 },
    { name: "Snacks", from: 15 },
    { name: "Dinner", from: 18 },
];

// index in ROUNDS of the round running at `hour` (0-23); dinner runs through the night
export const currentRoundIndex = (hour = new Date().getHours()) => {
    if (hour >= 18 || hour < 5) return 3;
    if (hour >= 15) return 2;
    if (hour >= 10) return 1;
    return 0;
};
