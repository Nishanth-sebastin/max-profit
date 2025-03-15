const readline = require("readline");

function calculateMaxProfit(timeUnits) {
  const buildings = [
    { type: "T", duration: 5, profit: 1500 },
    { type: "P", duration: 4, profit: 1000 },
    { type: "C", duration: 10, profit: 3000 },
  ];

  // dp[t] stores: { maxEarnings, T, P, C }
  const dp = new Array(timeUnits + 1);
  for (let t = timeUnits; t >= 0; t--) {
    dp[t] = { maxEarnings: 0, T: 0, P: 0, C: 0 };

    for (const b of buildings) {
      const finishTime = t + b.duration;
      if (finishTime > timeUnits) continue;

      const currentProfit = b.profit * (timeUnits - finishTime);
      const totalProfit = currentProfit + dp[finishTime].maxEarnings;

      if (
        totalProfit > dp[t].maxEarnings ||
        (totalProfit === dp[t].maxEarnings &&
          (b.type === "T" || b.type === "P"))
      ) {
        // Prefer smaller duration if equal
        dp[t].maxEarnings = totalProfit;
        dp[t].T = dp[finishTime].T + (b.type === "T" ? 1 : 0);
        dp[t].P = dp[finishTime].P + (b.type === "P" ? 1 : 0);
        dp[t].C = dp[finishTime].C + (b.type === "C" ? 1 : 0);
      }
    }
  }

  return dp[0];
}

// Read input and execute
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
  console.log(`T: ${result.T} P: ${result.P} C: ${result.C}`);
  rl.close();
});
