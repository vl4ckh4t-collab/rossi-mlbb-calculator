const plans = [
  { dia: "Weekly Pass", org: "", coin: 76 },
  { dia: "Twilight Pass", org: "", coin: 402.5 },
  { dia: "86", org: "78+8", coin: 61.5 },
  { dia: "172", org: "156+16", coin: 122 },
  { dia: "257", org: "234+23", coin: 177.5 },
  { dia: "343", org: "257+86", coin: 239 },
  { dia: "429", org: "257+172", coin: 299.5 },
  { dia: "514", org: "257+257", coin: 355 },
  { dia: "600", org: "514+86", coin: 416.5 },
  { dia: "706", org: "625+81", coin: 480 },
  { dia: "878", org: "706+172", coin: 602 },
  { dia: "963", org: "706+257", coin: 657.5 },
  { dia: "1049", org: "706+343", coin: 719 },
  { dia: "1135", org: "706+429", coin: 779.5 },
  { dia: "1412", org: "706+706", coin: 960 },
  { dia: "2195", org: "1860+335", coin: 1453 },
  { dia: "2901", org: "2195+706", coin: 1933 },
  { dia: "3688", org: "3099+589", coin: 2424 },
  { dia: "5532", org: "4649+883", coin: 3660 },
  { dia: "9288", org: "7740+1548", coin: 6079 },
  { section: "⭐ Double Dia Plan" },
  { dia: "50+", org: "", coin: 39 },
  { dia: "150+", org: "", coin: 116.9 },
  { dia: "250+", org: "", coin: 187.5 },
  { dia: "500+", org: "", coin: 385 }
];

const rateInput = document.getElementById("smileRate");
const profitInput = document.getElementById("profitRate");
const tbody = document.getElementById("plans");
const money = n => Number.isFinite(n) ? n.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "—";

for (let p = 0; p <= 100.0001; p += 0.5) {
  const value = p.toFixed(1).replace(/\.0$/, "");
  const option = document.createElement("option");
  option.value = value;
  option.textContent = `${value}%`;
  if (value === "3") option.selected = true;
  profitInput.append(option);
}

const themeButtons = document.querySelectorAll(".theme-btn");
function setTheme(theme) {
  document.body.dataset.theme = theme;
  themeButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.theme === theme)));
  try { localStorage.setItem("rossi-mlbb-theme", theme); } catch (_) {}
}
themeButtons.forEach(button => button.addEventListener("click", () => setTheme(button.dataset.theme)));
let savedTheme = "sakura";
try { savedTheme = localStorage.getItem("rossi-mlbb-theme") || "sakura"; } catch (_) {}
setTheme(["blue", "sakura", "dark"].includes(savedTheme) ? savedTheme : "sakura");

function render() {
  tbody.replaceChildren();
  const enteredRate = Math.max(0, Number(rateInput.value) || 0);
  const effectiveRate = enteredRate / 1000; // e.g. 80000 => 80, matching the original calculator
  const profitPercent = Number(profitInput.value) || 0;
  let planNo = 0;

  plans.forEach(plan => {
    const tr = document.createElement("tr");
    if (plan.section) {
      tr.className = "section-row";
      const td = document.createElement("td");
      td.colSpan = 7;
      td.textContent = plan.section;
      tr.append(td);
      tbody.append(tr);
      return;
    }
    planNo += 1;
    const base = plan.coin * effectiveRate;
    const profit = base * profitPercent / 100;
    const values = [
      planNo, plan.dia, plan.org || "–", String(plan.coin),
      enteredRate > 0 ? money(base) : "—",
      enteredRate > 0 ? money(profit) : "—",
      enteredRate > 0 ? money(base + profit) : "—"
    ];
    const labels = ["No.", "Dia Plan", "Org Dia Plan", "Coin Price", "MMK Result", "အမြတ် / Profit", "Total MMK"];
    values.forEach((value, col) => {
      const td = document.createElement("td");
      td.dataset.label = labels[col];
      td.textContent = value;
      if (col >= 3) td.classList.add("money");
      tr.append(td);
    });
    tbody.append(tr);
  });
}
rateInput.addEventListener("input", render);
profitInput.addEventListener("change", render);
render();
