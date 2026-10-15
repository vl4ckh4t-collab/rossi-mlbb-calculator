const $ = (id) => document.getElementById(id);
const money = (value) => Number.isFinite(value) ? Math.round(value).toLocaleString("en-US") : "—";
function updateCalculator() {
  const cost = Math.max(0, Number($("cost").value) || 0);
  const percent = Math.max(0, Number($("profit").value) || 0);
  const profit = cost * percent / 100;
  $("costDisplay").textContent = money(cost);
  $("profitAmount").textContent = money(profit);
  $("sellingPrice").textContent = money(cost + profit);
  document.querySelectorAll("[data-profit]").forEach((b) => b.classList.toggle("selected", Number(b.dataset.profit) === percent));
  renderPlans();
}
$("cost").addEventListener("input", updateCalculator);
$("profit").addEventListener("input", updateCalculator);
document.querySelectorAll("[data-profit]").forEach((b) => b.addEventListener("click", () => { $("profit").value = b.dataset.profit; updateCalculator(); }));
$("themeSelect").addEventListener("change", (e) => {
  document.body.dataset.theme = e.target.value;
  try { localStorage.setItem("rossi-mlbb-theme", e.target.value); } catch (_) {}
});
try {
  const saved = localStorage.getItem("rossi-mlbb-theme");
  if (saved && ["sakura", "blue", "mint", "dark"].includes(saved)) { document.body.dataset.theme = saved; $("themeSelect").value = saved; }
} catch (_) {}
const starterPlans = [{name:"86 Diamonds",cost:2500},{name:"172 Diamonds",cost:4900},{name:"257 Diamonds",cost:7300}];
let plans = starterPlans.map(p => ({...p}));
function renderPlans() {
  const percent = Math.max(0, Number($("profit").value) || 0);
  $("planRows").replaceChildren();
  plans.forEach((plan, index) => {
    const tr=document.createElement("tr"), name=document.createElement("td"), costCell=document.createElement("td"), costInput=document.createElement("input"), selling=document.createElement("td"), profit=document.createElement("td"), action=document.createElement("td"), remove=document.createElement("button");
    name.textContent=plan.name; costInput.type="number"; costInput.min="0"; costInput.step="any"; costInput.value=plan.cost; costInput.setAttribute("aria-label",plan.name+" Cost Price / ဝယ်ဈေး");
    costInput.addEventListener("input",()=>{ plans[index].cost=Math.max(0,Number(costInput.value)||0); selling.textContent=money(plans[index].cost*(1+Math.max(0,Number($("profit").value)||0)/100)); profit.textContent=money(plans[index].cost*Math.max(0,Number($("profit").value)||0)/100); });
    costCell.append(costInput); selling.textContent=money(plan.cost*(1+percent/100)); profit.textContent=money(plan.cost*percent/100); profit.className="profit-text";
    remove.type="button"; remove.className="delete-btn"; remove.textContent="ဖျက် · Remove"; remove.setAttribute("aria-label",plan.name+" ကိုဖျက်ရန် / Remove plan"); remove.addEventListener("click",()=>{plans.splice(index,1);renderPlans();});
    action.append(remove); tr.append(name,costCell,selling,profit,action); $("planRows").append(tr);
  });
}
$("addPlanForm").addEventListener("submit",(e)=>{e.preventDefault();const name=$("planName").value.trim(),cost=Number($("planCost").value);if(!name||!Number.isFinite(cost)||cost<0)return;plans.push({name,cost});$("planName").value="";$("planCost").value="";renderPlans();});
$("resetPlans").addEventListener("click",()=>{plans=starterPlans.map(p=>({...p}));renderPlans();});
updateCalculator();