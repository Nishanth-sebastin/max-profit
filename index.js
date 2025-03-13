const readline = require("readline");

function calculateMaxProfit(n, maxEarnings) {
  const buildings = [
    { type: "T", time: 5, earn: 1500 },
    { type: "P", time: 4, earn: 1000 },
    { type: "C", time: 10, earn: 3000 },
  ];

  const dp = Array(n + 1)
    .fill()
    .map(() => ({
      maxEarnings: 0,
      T: 0,
      P: 0,
      C: 0,
    }));

  for (let t = n; t >= 0; t--) {
    let bestT = 0,
      bestP = 0,
      bestC = 0;

    for (const b of buildings) {
      const newTime = t + b.time;
      if (newTime > n) continue;

      const currentEarn = b.earn * (n - newTime);
      const totalEarn = currentEarn + dp[newTime].maxEarnings;

      if (
        totalEarn > maxEarnings ||
        (totalEarn === maxEarnings && bestT + bestP + bestC === 0)
      ) {
        maxEarnings = totalEarn;
        switch (b.type) {
          case "T":
            bestT = dp[newTime].T + 1;
            bestP = dp[newTime].P;
            bestC = dp[newTime].C;
            break;
          case "P":
            bestT = dp[newTime].T;
            bestP = dp[newTime].P + 1;
            bestC = dp[newTime].C;
            break;
          case "C":
            bestT = dp[newTime].T;
            bestP = dp[newTime].P;
            bestC = dp[newTime].C + 1;
            break;
        }
      }
    }

    dp[t] = { maxEarnings, T: bestT, P: bestP, C: bestC };
  }

  return `T: ${dp[0].T} P: ${dp[0].P} C: ${dp[0].C}`;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter time units: ", (input) => {
  const n = parseInt(input);

  rl.question("Enter earnings: ", (maxEarningsInput) => {
    const maxEarnings = parseInt(maxEarningsInput);
    console.log(calculateMaxProfit(n, maxEarnings));

    rl.close();
  });
});
