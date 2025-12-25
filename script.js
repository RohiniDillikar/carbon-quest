let mode = "monthly";
let multiplier = 1;

function setMode(selected) {
  mode = selected;
  multiplier = mode === "yearly" ? 12 : 1;
  calculate();
}

const demoUsers = [
  { name: "You", points: 0 },
  { name: "Aarav", points: 950 },
  { name: "Diya", points: 720 },
  { name: "Rohan", points: 500 }
];

const factors = {
  electricity: 0.82,
  car: 0.21,
  lpg: 2.98
};

let pieChart;

function updateValues() {
  elecVal.innerText = electricity.value;
  carVal.innerText = car.value;
  lpgVal.innerText = lpg.value;
}

function calculate() {
  const e = +electricity.value;
  const c = +car.value;
  const l = +lpg.value;

  const eCO2 = e * factors.electricity;
  const cCO2 = c * factors.car;
  const lCO2 = l * factors.lpg;
  const total = (eCO2 + cCO2 + lCO2) * multiplier;


  const previous = localStorage.getItem("previousCO2") || total;
  const reduction = Math.max(previous - total, 0);

  localStorage.setItem("previousCO2", total);

  renderSummary(total, reduction);
  renderRewards(reduction);
  renderTips(eCO2, cCO2, lCO2);
  renderImpact(reduction);
  renderChart(eCO2, cCO2, lCO2);


localStorage.setItem("streak", streak);

}

function renderSummary(total, reduction) {
  summary.innerHTML = `
    <h2>📊 Carbon Summary</h2>
    <p><b>Total Emission:</b> ${total.toFixed(1)} kg CO₂</p>
    <p><b>CO₂ Reduced:</b> ${reduction.toFixed(1)} kg</p>
  `;
}

function renderRewards(reduction) {
  const points = Math.round(reduction * 10);
  const badge = getBadge(points);

  reward.innerHTML = `
    <h2>🏆 Rewards</h2>
    <p>Points Earned: <b>${points}</b></p>
    <p>Badge: <b>${badge}</b></p>
  `;
  if (badge === "🌿 Eco Saver" && !localStorage.getItem("ecoSaver")) {
  popup.style.display = "flex";
  localStorage.setItem("ecoSaver", "true");
}
// Update current user's points
demoUsers[0].points = points;

// Sort leaderboard
demoUsers.sort((a, b) => b.points - a.points);

// Render leaderboard
let leaderboardHTML = "";
demoUsers.forEach((user, index) => {
  leaderboardHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.points}</td>
    </tr>
  `;
});

leaderboardBody.innerHTML = leaderboardHTML;

}

function getBadge(points) {
  if (points > 3000) return "🌍 Climate Champion";
  if (points > 1500) return "🌳 Carbon Warrior";
  if (points > 600) return "🌿 Eco Saver";
  if (points > 100) return "🌱 Green Beginner";
  return "🚶 Getting Started";
}

function renderTips(e, c, l) {
  let msg = "<h2>💡 Reduction Tips</h2>";

  if (c > e)
    msg += "🚗 Reduce car travel → use public transport or carpool.<br>";
  if (e > 200)
    msg += "💡 Switch to LED bulbs and energy-efficient appliances.<br>";
  if (l > 20)
    msg += "🔥 Reduce LPG usage → try induction cooking or pressure cookers.<br>";
  if (msg === "<h2>💡 Reduction Tips</h2>")
    msg += "✅ Great job! Your emissions are well balanced.";

  tips.innerHTML = msg;
}

function renderImpact(reduction) {
  const trees = (reduction / 40).toFixed(1);
  const powerDays = (reduction / 8).toFixed(1);

  impact.innerHTML = `
    <h2>🌱 Real-World Impact</h2>
    <p>🌳 Trees Saved: <b>${trees}</b></p>
    <p>💡 Electricity Powered: <b>${powerDays} days</b></p>
  `;
}

function renderChart(e, c, l) {
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: {
      labels: ["Electricity", "Car", "LPG"],
      datasets: [{
        data: [e, c, l],
        backgroundColor: ["#66bb6a", "#ffa726", "#ef5350"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}
function closePopup() {
  popup.style.display = "none";
}
