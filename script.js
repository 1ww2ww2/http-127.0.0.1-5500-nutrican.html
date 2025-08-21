// ------------------------
// 1) Datos ampliados
// ------------------------
const sampleData = [
  // Vitamina C (pérdidas altas en frutas/verduras enlatadas)
  {
    alimento: "Durazno",
    nutriente: "Vitamina C (mg/100g)",
    antes: 10,
    despues: 3,
    recomendacion: "Preferir consumo fresco; si es enlatado, combinar con cítricos o pimientos para compensar vitamina C.",
    danio: "Deficiencia prolongada puede reducir la función inmunológica y causar síntomas de escorbuto en casos severos."
  },
  {
    alimento: "Porotos verdes",
    nutriente: "Vitamina C (mg/100g)",
    antes: 12,
    despues: 6,
    recomendacion: "Usar el líquido del enlatado en sopas/cremas para recuperar parte de vitaminas solubles.",
    danio: "Baja crónica de vitamina C puede afectar cicatrización y absorción de hierro."
  },

  // Hierro (estable; pérdidas bajas)
  {
    alimento: "Espinaca",
    nutriente: "Hierro (mg/100g)",
    antes: 2.7,
    despues: 2.6,
    recomendacion: "Mejorar absorción combinando con alimentos ricos en vitamina C (limón, tomate, naranja).",
    danio: "Deficiencia sostenida de hierro puede ocasionar anemia ferropénica y fatiga crónica."
  },

  // Proteína (muy estable)
  {
    alimento: "Salmón",
    nutriente: "Proteínas (g/100g)",
    antes: 22,
    despues: 21.5,
    recomendacion: "El enlatado conserva bien la proteína; verificar sodio y escurrir si es necesario.",
    danio: "Déficit proteico severo a largo plazo afecta masa muscular y respuesta inmune."
  },

  // Tiamina (B1) sensible al calor en legumbres
  {
    alimento: "Garbanzos",
    nutriente: "Vitamina B1 (mg/100g)",
    antes: 0.40,
    despues: 0.20,
    recomendacion: "Alternar secos cocidos y enlatados; enriquecer con cereales integrales y semillas.",
    danio: "Baja crónica puede impactar sistema nervioso (síntomas tipo beriberi)."
  },

  // Folato moderadamente sensible
  {
    alimento: "Maíz",
    nutriente: "Folato (µg/100g)",
    antes: 42,
    despues: 30,
    recomendacion: "Añadir verduras de hoja fresca o legumbres para equilibrar folatos.",
    danio: "Deficiencia prolongada puede causar anemia megaloblástica; en embarazo, riesgo de defectos del tubo neural."
  },

  // Vitamina A (carotenos) bastante estable
  {
    alimento: "Zanahoria",
    nutriente: "Vitamina A (µg RAE/100g)",
    antes: 835,
    despues: 800,
    recomendacion: "Añadir una pequeña fuente de grasa saludable (aceite de oliva) para mejorar biodisponibilidad.",
    danio: "Déficit crónico puede afectar visión (ceguera nocturna) y salud epitelial."
  },

  // Licopeno (en tomate: la biodisponibilidad puede aumentar tras el calor)
  {
    alimento: "Tomate",
    nutriente: "Licopeno (mg/100g)",
    antes: 8,
    despues: 12, // mejora aparente/biodisponibilidad
    recomendacion: "La cocción y el enlatado pueden aumentar la biodisponibilidad del licopeno; combinar con aceite.",
    danio: "No aplica como 'daño' por aumento; evitar azúcares/sodio añadidos en salsas."
  },

  // Omega-3 en pescado enlatado
  {
    alimento: "Atún",
    nutriente: "Omega-3 (g/100g)",
    antes: 1.5,
    despues: 1.4,
    recomendacion: "Buena fuente estable; preferir en agua; revisar contenido de sodio.",
    danio: "Ingesta baja crónica de omega-3 puede relacionarse con mayor inflamación sistémica."
  }
];

// ------------------------
// 2) Utilidades de cálculo
// ------------------------
function lossPercent(antes, despues) {
  if (antes === 0) return 0;
  return ((antes - despues) / antes) * 100; // puede ser negativa si mejora
}

function riskFromLoss(pct) {
  // pct > 0 = pérdida; pct < 0 = mejora
  if (pct <= -5) return { label: "Beneficio", class: "benefit" };
  if (pct < 5 && pct > -5) return { label: "Nulo/Bajo", class: "none" };
  if (pct < 20) return { label: "Bajo", class: "low" };
  if (pct < 50) return { label: "Medio", class: "medium" };
  return { label: "Alto", class: "high" };
}

// ------------------------
// 3) Render de tarjetas
// ------------------------
const cardsRoot = document.getElementById("card-container");

function renderCards(data) {
  cardsRoot.innerHTML = "";
  data.forEach((item, idx) => {
    const pct = lossPercent(item.antes, item.despues);
    const risk = riskFromLoss(pct);

    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("role", "button");
    card.onclick = () => updateView(idx);

    card.innerHTML = `
      <h3>${item.alimento}</h3>
      <p>${item.nutriente}</p>
      <span class="badge ${risk.class}">${risk.label}</span>
    `;

    cardsRoot.appendChild(card);
  });
}

// ------------------------
// 4) Gráfico de barras
// ------------------------
let chart;
const ctx = document.getElementById("nutriChart").getContext("2d");

function initChart(item) {
  const data = {
    labels: ["Antes del enlatado", "Después del enlatado"],
    datasets: [{
      label: `${item.nutriente} en ${item.alimento}`,
      data: [item.antes, item.despues],
      backgroundColor: ["#10b981", "#ef4444"] // (solo referencia visual)
    }]
  };

  chart = new Chart(ctx, {
    type: "bar",
    data,
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`
          }
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function updateChart(item) {
  chart.data.datasets[0].label = `${item.nutriente} en ${item.alimento}`;
  chart.data.datasets[0].data = [item.antes, item.despues];
  chart.update();
}

// ------------------------
// 5) Panel de información
// ------------------------
const info = document.getElementById("info");

function renderInfo(item) {
  const pct = lossPercent(item.antes, item.despues);
  const risk = riskFromLoss(pct);
  const pctFmt = (pct >= 0 ? "-" : "+") + Math.abs(pct).toFixed(1) + "%";
  const tendencia = pct >= 0 ? "pérdida" : "mejora (biodisponibilidad)";

  info.innerHTML = `
    <h2 class="info-title">${item.alimento}</h2>
    <div class="info-grid">
      <p><span class="kpi">Nutriente</span> ${item.nutriente}</p>
      <p><span class="kpi">Antes</span> ${item.antes}</p>
      <p><span class="kpi">Después</span> ${item.despues}</p>
      <p><span class="kpi">Cambio</span> ${pctFmt} (${tendencia})</p>
      <p><span class="kpi">Nivel de riesgo</span> <span class="badge ${risk.class}">${risk.label}</span></p>
      <p><strong>Recomendación:</strong> ${item.recomendacion}</p>
      <p><strong>Daños a largo plazo:</strong> ${item.danio ?? item.danio ?? item.danio}</p>
    </div>
  `;
}

// ------------------------
// 6) Controlador de vista
// ------------------------
function updateView(index) {
  const item = sampleData[index];
  updateChart(item);
  renderInfo(item);
}

// ------------------------
// 7) Inicialización
// ------------------------
(function init(){
  renderCards(sampleData);
  initChart(sampleData[0]);
  renderInfo(sampleData[0]);
})();
