const fmtNum = (n, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: d });

// Aceita vírgula ou ponto como separador decimal.
const parseNum = (s) => parseFloat(String(s).replace(",", "."));

function fmtHours(h) {
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return hh > 0 ? `${hh} h${mm ? ` ${mm} min` : ""}` : `${mm} min`;
}

const weightInput = document.getElementById("weight");
const cards = [];

function buildCard(drug) {
  const el = document.createElement("article");
  el.className = "card drug";
  el.innerHTML = `
    <header>
      <h3>${drug.name}</h3>
      <div class="chips">
        <span class="chip">Dose usual ${fmtNum(drug.min, 3)} – ${fmtNum(drug.max, 3)} ${drug.unit}</span>
        <span class="chip soft">${drug.concLabel}</span>
      </div>
    </header>
    <div class="fields">
      <label>Dose escolhida
        <span class="input-wrap" data-unit="${drug.unit}"><input data-f="dose" type="text" inputmode="decimal" placeholder="${fmtNum(drug.min, 3)}"></span>
      </label>
      <label>Volume total
        <span class="input-wrap" data-unit="mL"><input data-f="total" type="text" inputmode="decimal" placeholder="ex.: 20"></span>
      </label>
      <label>Taxa de infusão
        <span class="input-wrap" data-unit="mL/h"><input data-f="rate" type="text" inputmode="decimal" placeholder="ex.: 2"></span>
      </label>
      <label>Concentração
        <span class="input-wrap" data-unit="${drug.unit.split("/")[0]}/mL"><input data-f="conc" type="text" inputmode="decimal" value="${String(drug.conc).replace(".", ",")}"></span>
      </label>
    </div>
    <div class="alert" hidden></div>
    <dl class="results">
      <div><dt>Volume de fármaco</dt><dd data-r="drug">—</dd></div>
      <div><dt>Volume de soro</dt><dd data-r="diluent">—</dd></div>
      <div><dt>Duração estimada</dt><dd data-r="hours">—</dd></div>
    </dl>`;
  const q = (s) => el.querySelector(s);
  const state = {
    update() {
      const dose = parseNum(q('[data-f="dose"]').value);
      const alert = q(".alert");
      const res = calcInfusion({
        weight: parseNum(weightInput.value),
        dose,
        conc: parseNum(q('[data-f="conc"]').value),
        perMin: drug.perMin,
        totalVolume: parseNum(q('[data-f="total"]').value),
        rate: parseNum(q('[data-f="rate"]').value),
      });

      const msgs = [];
      if (Number.isFinite(dose) && dose > 0 && (dose < drug.min || dose > drug.max)) {
        msgs.push(`Dose fora da faixa usual (${fmtNum(drug.min, 3)} – ${fmtNum(drug.max, 3)} ${drug.unit}).`);
      }
      if (res && res.diluentVolume < 0) {
        msgs.push("O volume de fármaco passa do volume total. Aumente o volume total ou reduza a dose/taxa.");
      }
      alert.hidden = msgs.length === 0;
      alert.innerHTML = msgs.map((m) => `<p>${m}</p>`).join("");

      q('[data-r="drug"]').textContent = res ? `${fmtNum(res.drugVolume)} mL` : "—";
      q('[data-r="diluent"]').textContent = res && res.diluentVolume >= 0 ? `${fmtNum(res.diluentVolume)} mL` : "—";
      q('[data-r="hours"]').textContent = res ? fmtHours(res.hours) : "—";
      el.classList.toggle("done", !!res && res.diluentVolume >= 0);
    },
  };
  el.addEventListener("input", state.update);
  cards.push(state);
  return el;
}

const groupsEl = document.getElementById("groups");
const GROUP_ICONS = ["❤️", "💉", "💊"];
GROUPS.forEach((g, i) => {
  const sec = document.createElement("section");
  sec.innerHTML = `<h2 class="group-title"><span class="ico" aria-hidden="true">${GROUP_ICONS[i] || "•"}</span>${g.name}</h2>`;
  g.drugs.forEach((d) => sec.appendChild(buildCard(d)));
  groupsEl.appendChild(sec);
});

weightInput.addEventListener("input", () => cards.forEach((c) => c.update()));
