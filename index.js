const readline = require("readline");

function calculateMaxProfit(timeUnits) {
  const buildings = [
    { type: "T", duration: 5, profit: 1500 },
    { type: "P", duration: 4, profit: 1000 },
    { type: "C", duration: 10, profit: 3000 },
  ];

  // Initialize DP array where each entry contains max earnings and combinations
  const dp = new Array(timeUnits + 1);
  for (let t = 0; t <= timeUnits; t++) {
    dp[t] = { maxEarnings: 0, combinations: [] };
  }

  for (let t = timeUnits; t >= 0; t--) {
    let currentMax = 0;
    let currentCombinations = [];

    for (const b of buildings) {
      const finishTime = t + b.duration;
      if (finishTime >= timeUnits) continue;

      const currentProfit = b.profit * (timeUnits - finishTime);
      const totalProfit = currentProfit + dp[finishTime].maxEarnings;

      if (totalProfit > currentMax) {
        currentMax = totalProfit;
        currentCombinations = [];
        // If no previous combinations, add new combination
        if (dp[finishTime].combinations.length === 0) {
          const newCombo = { T: 0, P: 0, C: 0 };
          newCombo[b.type] = 1;
          currentCombinations.push(newCombo);
        } else {
          // Add all combinations from finishTime, incrementing current building
          dp[finishTime].combinations.forEach((combo) => {
            const newCombo = { ...combo };
            newCombo[b.type] += 1;
            currentCombinations.push(newCombo);
          });
        }
      } else if (totalProfit === currentMax) {
        // Merge combinations from this building type
        if (dp[finishTime].combinations.length === 0) {
          const newCombo = { T: 0, P: 0, C: 0 };
          newCombo[b.type] = 1;
          // Check if this combo is already present
          const exists = currentCombinations.some(
            (c) =>
              c.T === newCombo.T && c.P === newCombo.P && c.C === newCombo.C
          );
          if (!exists) {
            currentCombinations.push(newCombo);
          }
        } else {
          dp[finishTime].combinations.forEach((combo) => {
            const newCombo = { ...combo };
            newCombo[b.type] += 1;
            const exists = currentCombinations.some(
              (c) =>
                c.T === newCombo.T && c.P === newCombo.P && c.C === newCombo.C
            );
            if (!exists) {
              currentCombinations.push(newCombo);
            }
          });
        }
      }
    }

    // Update dp[t] if currentMax is greater or equal
    if (currentMax > dp[t].maxEarnings) {
      dp[t].maxEarnings = currentMax;
      dp[t].combinations = currentCombinations;
    } else if (currentMax === dp[t].maxEarnings) {
      // Merge new combinations, avoiding duplicates
      currentCombinations.forEach((newCombo) => {
        const exists = dp[t].combinations.some(
          (c) => c.T === newCombo.T && c.P === newCombo.P && c.C === newCombo.C
        );
        if (!exists) {
          dp[t].combinations.push(newCombo);
        }
      });
    }
  }

  return dp[0];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter total time units: ", (input) => {
  const n = parseInt(input.trim());
  if (isNaN(n)) {
    console.log("Invalid input!");
    rl.close();
    return;
  }

  const result = calculateMaxProfit(n);
  console.log(`Maximum Earnings: $${result.maxEarnings}`);
  console.log("Solutions:");
  result.combinations.forEach((combo, index) => {
    console.log(`${index + 1}. T: ${combo.T} P: ${combo.P} C: ${combo.C}`);
  });
  rl.close();
});
