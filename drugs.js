// Tabela de fármacos, extraída da planilha "CALCULADORA DE INFUSÕES - UTI 2026".
// conc: concentração na unidade base (mcg/mL, mg/mL ou mUi/mL), igual à unidade da dose.
// perMin: true quando a dose é por minuto (a conta multiplica por 60 para chegar a /h).
const GROUPS = [
  {
    name: "Vasoativos",
    drugs: [
      { name: "Noradrenalina", conc: 1000, concLabel: "1.000 mcg/mL", min: 0.1, max: 2.0, unit: "mcg/kg/min", perMin: true },
      { name: "Dobutamina", conc: 12500, concLabel: "12.500 mcg/mL", min: 2, max: 20, unit: "mcg/kg/min", perMin: true },
      { name: "Vasopressina", conc: 20000, concLabel: "20.000 mUi/mL", min: 0.1, max: 2.0, unit: "mUi/kg/min", perMin: true },
      { name: "Adrenalina", conc: 1000, concLabel: "1.000 mcg/mL", min: 0.05, max: 2.0, unit: "mcg/kg/min", perMin: true },
      { name: "Lidocaína", conc: 20000, concLabel: "20.000 mcg/mL", min: 25, max: 75, unit: "mcg/kg/min", perMin: true },
    ],
  },
  {
    name: "Analgesia, sedação e anestesia",
    drugs: [
      { name: "Fentanil", conc: 50, concLabel: "50 mcg/mL", min: 1, max: 10, unit: "mcg/kg/h", perMin: false },
      { name: "Midazolam", conc: 5, concLabel: "5 mg/mL", min: 0.1, max: 0.5, unit: "mg/kg/h", perMin: false },
      { name: "Propofol", conc: 10, concLabel: "10 mg/mL", min: 0.1, max: 0.8, unit: "mg/kg/min", perMin: true },
      { name: "Dexmedetomidina", conc: 500, concLabel: "500 mcg/mL", min: 0.5, max: 2.0, unit: "mcg/kg/h", perMin: false },
      { name: "Remifentanil", conc: 1000, concLabel: "1.000 mcg/mL (2 mg/2 mL)", min: 0.1, max: 0.5, unit: "mcg/kg/min", perMin: true },
      { name: "Cetamina", conc: 100, concLabel: "100 mg/mL", min: 0.6, max: 1.2, unit: "mg/kg/h", perMin: false },
    ],
  },
  {
    name: "Antieméticos e bloqueio neuromuscular",
    drugs: [
      { name: "Metoclopramida", conc: 5, concLabel: "5 mg/mL", min: 0.01, max: 0.02, unit: "mg/kg/h", perMin: false },
      { name: "Cerenia", conc: 10000, concLabel: "10.000 mcg/mL", min: 50, max: 150, unit: "mcg/kg/h", perMin: false },
      { name: "Rocurônio", conc: 10, concLabel: "10 mg/mL", min: 0.2, max: 0.5, unit: "mg/kg/h", perMin: false },
    ],
  },
];

// Mesma conta da planilha:
//   volume de fármaco = (peso * (60 se /min) * dose / concentração) * volume total / taxa
// Retorna null enquanto faltar algum dado válido.
function calcInfusion({ weight, dose, conc, perMin, totalVolume, rate }) {
  if (![weight, dose, conc, totalVolume, rate].every((n) => Number.isFinite(n) && n > 0)) return null;
  const drugMlPerHour = (weight * (perMin ? 60 : 1) * dose) / conc;
  const hours = totalVolume / rate;
  const drugVolume = drugMlPerHour * hours;
  return { drugVolume, diluentVolume: totalVolume - drugVolume, hours };
}

if (typeof module !== "undefined") module.exports = { GROUPS, calcInfusion };
