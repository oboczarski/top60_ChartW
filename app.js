const chartData = [
  { name: "J.Allen", fullName: "Josh Allen", pos: "QB", ktc: 3, adp: 1.5 },
  { name: "Bijan", fullName: "Bijan Robinson", pos: "RB", ktc: 2, adp: 2.6 },
  { name: "J.Chase", fullName: "Ja'Marr Chase", pos: "WR", ktc: 1, adp: 4.4 },
  { name: "Maye", fullName: "Drake Maye", pos: "QB", ktc: 6, adp: 3.4 },
  { name: "Gibbs", fullName: "Jahmyr Gibbs", pos: "RB", ktc: 5, adp: 5.9 },
  { name: "JSN", fullName: "Jaxon Smith-Njigba", pos: "WR", ktc: 4, adp: 7.5 },
  { name: "Nacua", fullName: "Puka Nacua", pos: "WR", ktc: 7, adp: 6.4 },
  { name: "Daniels", fullName: "Jayden Daniels", pos: "QB", ktc: 11, adp: 8 },
  { name: "Nabers", fullName: "Malik Nabers", pos: "WR", ktc: 9, adp: 12.8 },
  { name: "St.Brown", fullName: "Amon-Ra St. Brown", pos: "WR", ktc: 13, adp: 9.1 },
  { name: "C.Williams", fullName: "Caleb Williams", pos: "QB", ktc: 8, adp: 14.1 },
  { name: "Bowers", fullName: "Brock Bowers", pos: "TE", ktc: 10, adp: 13.2 },
  { name: "L.Jackson", fullName: "Lamar Jackson", pos: "QB", ktc: 14, adp: 11.8 },
  { name: "Jefferson", fullName: "Justin Jefferson", pos: "WR", ktc: 12, adp: 16.3 },
  { name: "Burrow", fullName: "Joe Burrow", pos: "QB", ktc: 18, adp: 10.4 }
].sort((a, b) => b.adp - a.adp);

const polarChartData = [
  { name: "J.Allen", fullName: "Josh Allen", pos: "QB", ktc: 3, adp: 1.5 },
  { name: "Bijan", fullName: "Bijan Robinson", pos: "RB", ktc: 2, adp: 2.6 },
  { name: "J.Chase", fullName: "Ja'Marr Chase", pos: "WR", ktc: 1, adp: 4.4 },
  { name: "Maye", fullName: "Drake Maye", pos: "QB", ktc: 6, adp: 3.4 },
  { name: "Gibbs", fullName: "Jahmyr Gibbs", pos: "RB", ktc: 5, adp: 5.9 },
  { name: "JSN", fullName: "Jaxon Smith-Njigba", pos: "WR", ktc: 4, adp: 7.5 },
  { name: "Nacua", fullName: "Puka Nacua", pos: "WR", ktc: 7, adp: 6.4 },
  { name: "Daniels", fullName: "Jayden Daniels", pos: "QB", ktc: 11, adp: 8 },
  { name: "Nabers", fullName: "Malik Nabers", pos: "WR", ktc: 9, adp: 12.8 },
  { name: "St.Brown", fullName: "Amon-Ra St. Brown", pos: "WR", ktc: 13, adp: 9.1 },
  { name: "C.Williams", fullName: "Caleb Williams", pos: "QB", ktc: 8, adp: 14.1 },
  { name: "Bowers", fullName: "Brock Bowers", pos: "TE", ktc: 10, adp: 13.2 }
];

function formatName(name) {
  return name;
}

const colorKTC = "#4800ff";
const colorMid = "#ca18fb"; // Editable middle gradient color
const colorADP = "#ff6441";
const chartFontFamily = "'Product Sans', 'Google Sans', sans-serif";

function getPosBadgeMarkup(pos) {
  if (pos === "QB") {
    return '<span style="background:rgba(211,123,233,0.15); color:#d37be9; padding:2px 6px; border-radius:4px; font-weight:600; font-size:10px; margin-left:6px;">QB</span>';
  }
  if (pos === "RB") {
    return '<span style="background:rgba(102,252,204,0.15); color:#66fccc; padding:2px 6px; border-radius:4px; font-weight:600; font-size:10px; margin-left:6px;">RB</span>';
  }
  if (pos === "WR") {
    return '<span style="background:rgba(96,181,255,0.15); color:#60b5ff; padding:2px 6px; border-radius:4px; font-weight:600; font-size:10px; margin-left:6px;">WR</span>';
  }
  if (pos === "TE") {
    return '<span style="background:rgba(126,81,252,0.15); color:#7e51fc; padding:2px 6px; border-radius:4px; font-weight:600; font-size:10px; margin-left:6px;">TE</span>';
  }
  return "";
}

function buildTooltipMarkup(player, values) {
  const title = player && player.fullName ? player.fullName : formatName(player.name);
  const posBadge = player ? getPosBadgeMarkup(player.pos) : "";

  return `
    <div style="font-size:12px; font-weight:600; color:rgba(255,255,255,0.9); margin-bottom:6px; display:flex; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px;">
      ${title}${posBadge}
    </div>
    <div style="display:flex; justify-content:space-between; gap:24px; margin-bottom:2px; align-items:center;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="width:8px; height:8px; border-radius:50%; background:${colorADP};"></span>
        <span style="color:rgba(255,255,255,0.7); font-size:12px;">ADP</span>
      </div>
      <strong style="font-size:14px; color:#fff;">${values.adp ?? ""}</strong>
    </div>
    <div style="display:flex; justify-content:space-between; gap:24px; align-items:center;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="width:8px; height:8px; border-radius:50%; background:${colorKTC};"></span>
        <span style="color:rgba(255,255,255,0.7); font-size:12px;">KTC Rank</span>
      </div>
      <strong style="font-size:14px; color:#fff;">${values.ktc ?? ""}</strong>
    </div>
  `;
}

function attachChartResize(chart, el) {
  const ro = new ResizeObserver(() => chart.resize());
  ro.observe(el);
  window.addEventListener("resize", () => chart.resize());
}

function attachElementResize(el, callback) {
  const ro = new ResizeObserver(() => callback());
  ro.observe(el);
  window.addEventListener("resize", callback);
}

function polarToCartesian(cx, cy, angle, radius) {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius
  };
}

function getPolarLabelAnchor(angle) {
  const cosine = Math.cos(angle);
  if (cosine > 0.3) {
    return "start";
  }
  if (cosine < -0.3) {
    return "end";
  }
  return "middle";
}

function formatPolarValue(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function buildSummaryChips() {
  const chips = document.getElementById("summaryChips");
  
  const positions = [
    { key: "QB", lineStart: "#ff9a3d", lineEnd: "#ff4187", glow: "rgba(255,120,90,0.34)" },
    { key: "RB", lineStart: "#1ac2ff", lineEnd: "#06ff97", glow: "rgba(100,216,255,0.34)" },
    { key: "WR", lineStart: "#8153ff", lineEnd: "#0299fe", glow: "rgba(124,111,255,0.34)" },
    { key: "TE", lineStart: "#ff4187", lineEnd: "#6a00ff", glow: "rgba(255,107,200,0.30)" }
  ];

  const summaries = positions.map(posGroup => {
    const players = chartData.filter(d => d.pos === posGroup.key);
    const count = players.length;
    let avgDiff = 0;
    if (count > 0) {
      const totalDiff = players.reduce((sum, p) => sum + (p.adp - p.ktc), 0);
      avgDiff = totalDiff / count;
    }
    
    return {
      ...posGroup,
      count,
      avgDiff
    };
  });

  chips.innerHTML = summaries
    .map(
      (item) => `
        <div class="stat-chip" style="--chip-line: linear-gradient(90deg, ${item.lineStart}, ${item.lineEnd}); --chip-dot: linear-gradient(135deg, ${item.lineStart}, ${item.lineEnd}); box-shadow: 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px rgba(255,255,255,0.02), 0 -3px 10px ${item.glow};">
          <div class="stat-chip-top" style="margin-bottom: 2px;">
            <span class="stat-dot"></span>
            <span class="stat-label" style="font-size:13px; color:rgba(255,255,255,0.8);">${item.key}</span>
          </div>
          <div class="stat-chip-bottom" style="flex-direction:row; align-items:center; gap:4px; margin-top:2px;">
            <div style="display:flex; flex-direction:column; align-items:center;">
              <span class="stat-count" style="font-size:18px; font-weight:700;">${item.count}</span>
              <span class="stat-sub" style="font-size:8px; color:rgba(255,255,255,0.4);">COUNT</span>
            </div>
            <div style="width:1px; height:16px; background:rgba(255,255,255,0.1);"></div>
            <div style="display:flex; flex-direction:column; align-items:center;">
              <span class="stat-count" style="font-size:14px; font-weight:500; color:${item.count > 0 ? (item.avgDiff > 0 ? '#06ff97' : '#ff4187') : 'inherit'}">${item.count > 0 ? (item.avgDiff > 0 ? '+' : '') + item.avgDiff.toFixed(1) : '-'}</span>
              <span class="stat-sub" style="font-size:8px; color:rgba(255,255,255,0.4);">AVG SHIFT</span>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function initChart() {
  const el = document.getElementById("posChart");
  const chart = echarts.init(el, null, { renderer: "svg" });

  const adpData = chartData.map(d => d.adp);
  const ktcData = chartData.map(d => d.ktc);

  chart.setOption({
    animationDuration: 450,
    backgroundColor: "transparent",
    grid: {
      left: 90, // Increased since label is inline again
      right: 20,
      top: 6,
      bottom: 24,
      containLabel: false
    },
    legend: {
      top: 6,
      right: 24,
      itemHeight: 14,
      itemWidth: 14,
      data: [
        { name: "ADP", icon: "roundRect" },
        { name: "KTC Rank", icon: "roundRect" }
      ],
      textStyle: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
        fontFamily: chartFontFamily
      }
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(10, 11, 16, 0.95)",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      textStyle: { color: "#fff", fontSize: 13, fontFamily: chartFontFamily },
      axisPointer: { type: "shadow", shadowStyle: { color: "rgba(255,255,255,0.03)" } },
      extraCssText: "border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,0.6); padding: 6px 9px; backdrop-filter: blur(8px);",
      formatter: function (params) {
        const pIndex = params[0].dataIndex;
        const player = chartData[pIndex];
        const adpPoint = params.find(p => p.seriesName === "ADP");
        const ktcPoint = params.find(p => p.seriesName === "KTC Rank");

        return buildTooltipMarkup(player, {
          adp: adpPoint ? adpPoint.value : "",
          ktc: ktcPoint ? ktcPoint.value : ""
        });
      }
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 20,
      interval: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "rgba(255,255,255,0.76)",
        fontSize: 11,
        fontWeight: 500,
        margin: 0,
      },
      splitLine: { show: true, lineStyle: { color: "rgba(255,255,255,0.05)", type: "dotted" } }
    },
    yAxis: {
      type: "category",
      data: chartData.map(d => d.name),
      axisLabel: {
        formatter: function (value) {
          const player = chartData.find(d => d.name === value);
          if (!player) return value;
          const formattedName = formatName(player.name);
          return `{name|${formattedName}  •  }{pos${player.pos}|${player.pos}}`;
        },
        rich: {
          name: {
            color: "rgba(255,255,255,0.76)",
            fontSize: 9,
            fontWeight: 600,
            fontFamily: chartFontFamily
          },
          posQB: { color: "#d37be9", fontSize: 9, fontWeight: 400, fontFamily: chartFontFamily },
          posRB: { color: "#66fccc", fontSize: 9, fontWeight: 400, fontFamily: chartFontFamily },
          posWR: { color: "#60b5ff", fontSize: 9, fontWeight: 400, fontFamily: chartFontFamily },
          posTE: { color: "#7e51fc", fontSize: 9, fontWeight: 400, fontFamily: chartFontFamily }
        },
        interval: 0,
        margin: 4
      },
      axisLine: { show: true, lineStyle: { color: "rgba(255,255,255,0.10)" } },
      axisTick: { show: false }
    },
    series: [
      {
        name: "Connector",
        type: "custom",
        renderItem: function (params, api) {
          const y = api.coord([0, api.value(2)])[1];
          const x0 = api.coord([api.value(0), api.value(2)])[0]; // KTC
          const x1 = api.coord([api.value(1), api.value(2)])[0]; // ADP
          const minX = Math.min(x0, x1);
          const maxX = Math.max(x0, x1);
          const width = maxX - minX;

          // True range bar connection
          return {
            type: "rect",
            transition: ["shape"],
            shape: {
              x: minX - 6,
              y: y - 6,
              width: width + 12,
              height: 12,
              r: 6
            },
            style: api.style({
              fill: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: x0 < x1 ? colorKTC : colorADP },
                { offset: 0.5, color: colorMid },
                { offset: 1, color: x0 < x1 ? colorADP : colorKTC }
              ])
            })
          };
        },
        data: chartData.map((d, i) => [d.ktc, d.adp, i]),
        z: 3,
        tooltip: { show: false }
      },
      {
        name: "KTC Rank",
        type: "scatter",
        symbol: "circle",
        symbolSize: 12,
        itemStyle: { color: colorKTC },
        data: ktcData,
        z: 2
      },
      {
        name: "ADP",
        type: "scatter",
        symbol: "circle",
        symbolSize: 12,
        itemStyle: { color: colorADP },
        data: adpData,
        z: 2
      }
    ]
  });

  attachChartResize(chart, el);
}

function initPolarChart() {
  const el = document.getElementById("polarChart");
  const shell = document.querySelector(".chart-shell-polar");
  const tooltip = document.getElementById("polarTooltip");

  function hideTooltip() {
    tooltip.style.opacity = "0";
    tooltip.style.transform = "translate(-9999px, -9999px)";
  }

  function positionTooltip(event) {
    if (tooltip.style.opacity !== "1") {
      return;
    }

    const shellRect = shell.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let x = event.clientX - shellRect.left + 14;
    let y = event.clientY - shellRect.top + 14;

    if (x + tooltipRect.width > shellRect.width - 10) {
      x = event.clientX - shellRect.left - tooltipRect.width - 14;
    }

    if (y + tooltipRect.height > shellRect.height - 10) {
      y = event.clientY - shellRect.top - tooltipRect.height - 14;
    }

    tooltip.style.transform = `translate(${Math.max(10, x)}px, ${Math.max(10, y)}px)`;
  }

  function showTooltip(index, event) {
    const player = polarChartData[index];
    tooltip.innerHTML = buildTooltipMarkup(player, {
      adp: player ? formatPolarValue(player.adp) : "",
      ktc: player ? formatPolarValue(player.ktc) : ""
    });
    tooltip.style.opacity = "1";
    positionTooltip(event);
  }

  function renderPolarChart() {
    const width = el.clientWidth;
    const height = el.clientHeight;

    if (!width || !height) {
      return;
    }

    const centerX = width / 2;
    const centerY = height * 0.585;
    const outerRadius = Math.min(width * 0.46, height * 0.425);
    const coreRadius = Math.max(3.5, outerRadius * 0.014);
    const labelBandInnerRadius = outerRadius * 0.14;
    const labelBandOuterRadius = outerRadius * 0.27;
    const hubOrbitRadius = labelBandInnerRadius * 0.46;
    const centerPlateRadius = Math.max(10, hubOrbitRadius - 3);
    const labelRadius = (labelBandInnerRadius + labelBandOuterRadius) / 2;
    const scaleInnerRadius = outerRadius * 0.31;
    const maxValue = 20;
    const ringValues = [5, 10, 15, 20];
    const angleStep = (Math.PI * 2) / polarChartData.length;
    const tickAngles = [
      { angle: -Math.PI / 2 - 0.24, anchor: "end", dx: -4 },
      { angle: Math.PI / 2 - 0.24, anchor: "start", dx: 4 }
    ];
    const rangeWidth = 13.5;
    const markerRadius = 6.4;
    const scaleRadius = (value) =>
      scaleInnerRadius + (value / maxValue) * (outerRadius - scaleInnerRadius);

    const defs = [];
    const innerGuideRing = `
      <circle
        cx="${centerX}"
        cy="${centerY}"
        r="${scaleInnerRadius}"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        stroke-width="1"
      />
    `;
    const nameBand = `
      <circle
        cx="${centerX}"
        cy="${centerY}"
        r="${(labelBandInnerRadius + labelBandOuterRadius) / 2}"
        fill="none"
        stroke="rgba(255,255,255,0.042)"
        stroke-width="${labelBandOuterRadius - labelBandInnerRadius}"
      />
      <circle
        cx="${centerX}"
        cy="${centerY}"
        r="${labelBandInnerRadius}"
        fill="none"
        stroke="rgba(255,255,255,0.075)"
        stroke-width="1"
      />
      <circle
        cx="${centerX}"
        cy="${centerY}"
        r="${labelBandOuterRadius}"
        fill="none"
        stroke="rgba(255,255,255,0.075)"
        stroke-width="1"
      />
    `;
    const hubOrbit = `
      <circle
        cx="${centerX}"
        cy="${centerY}"
        r="${hubOrbitRadius}"
        fill="none"
        stroke="rgba(255,255,255,0.055)"
        stroke-width="1"
      />
    `;
    const outerGuideRing = `
      <circle
        cx="${centerX}"
        cy="${centerY}"
        r="${outerRadius}"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        stroke-width="1"
      />
    `;
    const rings = ringValues.map((value) => {
      const radius = scaleRadius(value);
      return `
        <circle
          cx="${centerX}"
          cy="${centerY}"
          r="${radius}"
          fill="none"
          stroke="rgba(255,255,255,0.055)"
          stroke-width="1"
          stroke-dasharray="2.5 5"
        />
      `;
    });

    const ringLabels = tickAngles.flatMap(({ angle, anchor, dx }) =>
      ringValues.map((value) => {
        const point = polarToCartesian(centerX, centerY, angle, scaleRadius(value));
        return `
          <text
            x="${point.x + dx}"
            y="${point.y}"
            fill="rgba(255,255,255,0.54)"
            font-size="11"
            font-weight="500"
            font-family="${chartFontFamily}"
            text-anchor="${anchor}"
            dominant-baseline="middle"
          >
            ${value}
          </text>
        `;
      })
    );

    const spokes = polarChartData.map((player, index) => {
      const angle = -Math.PI / 2 + index * angleStep;
      const outerPoint = polarToCartesian(centerX, centerY, angle, outerRadius);
      const hubOrbitPoint = polarToCartesian(centerX, centerY, angle, hubOrbitRadius);
      const labelBandInnerPoint = polarToCartesian(centerX, centerY, angle, labelBandInnerRadius);
      const labelBandOuterPoint = polarToCartesian(centerX, centerY, angle, labelBandOuterRadius);
      const spokeStart = polarToCartesian(centerX, centerY, angle, scaleInnerRadius);
      const ktcRadius = scaleRadius(player.ktc);
      const adpRadius = scaleRadius(player.adp);
      const innerRadius = Math.min(ktcRadius, adpRadius);
      const outerValueRadius = Math.max(ktcRadius, adpRadius);
      const innerPoint = polarToCartesian(centerX, centerY, angle, innerRadius);
      const outerValuePoint = polarToCartesian(centerX, centerY, angle, outerValueRadius);
      const ktcPoint = polarToCartesian(centerX, centerY, angle, ktcRadius);
      const adpPoint = polarToCartesian(centerX, centerY, angle, adpRadius);
      const labelPoint = polarToCartesian(centerX, centerY, angle, labelRadius);
      const labelRotationBase = (angle * 180) / Math.PI;
      const labelRotation =
        Math.cos(angle) < 0
          ? labelRotationBase + 180
          : labelRotationBase;
      const gradientId = `polar-gradient-${index}`;
      const innerColor = ktcRadius <= adpRadius ? colorKTC : colorADP;
      const outerColor = ktcRadius <= adpRadius ? colorADP : colorKTC;

      defs.push(`
        <linearGradient id="${gradientId}" x1="${innerPoint.x}" y1="${innerPoint.y}" x2="${outerValuePoint.x}" y2="${outerValuePoint.y}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${innerColor}" />
          <stop offset="50%" stop-color="${colorMid}" />
          <stop offset="100%" stop-color="${outerColor}" />
        </linearGradient>
      `);

      return `
        <g class="polar-player-layer" data-player-index="${index}" style="cursor: pointer;">
          <line
            x1="${hubOrbitPoint.x}"
            y1="${hubOrbitPoint.y}"
            x2="${labelBandInnerPoint.x}"
            y2="${labelBandInnerPoint.y}"
            stroke="rgba(255,255,255,0.045)"
            stroke-width="0.9"
          />
          <line
            x1="${labelBandOuterPoint.x}"
            y1="${labelBandOuterPoint.y}"
            x2="${spokeStart.x}"
            y2="${spokeStart.y}"
            stroke="rgba(255,255,255,0.07)"
            stroke-width="1"
          />
          <line
            x1="${spokeStart.x}"
            y1="${spokeStart.y}"
            x2="${outerPoint.x}"
            y2="${outerPoint.y}"
            stroke="rgba(255,255,255,0.05)"
            stroke-width="1"
          />
          <line
            x1="${spokeStart.x}"
            y1="${spokeStart.y}"
            x2="${outerPoint.x}"
            y2="${outerPoint.y}"
            stroke="transparent"
            stroke-width="20"
          />
          <line
            x1="${innerPoint.x}"
            y1="${innerPoint.y}"
            x2="${outerValuePoint.x}"
            y2="${outerValuePoint.y}"
            stroke="url(#${gradientId})"
            stroke-width="${rangeWidth}"
            stroke-linecap="round"
          />
          <circle
            cx="${ktcPoint.x}"
            cy="${ktcPoint.y}"
            r="${markerRadius}"
            fill="${colorKTC}"
          />
          <circle
            cx="${adpPoint.x}"
            cy="${adpPoint.y}"
            r="${markerRadius}"
            fill="${colorADP}"
          />
          <circle
            cx="${labelBandOuterPoint.x}"
            cy="${labelBandOuterPoint.y}"
            r="1.7"
            fill="rgba(255,255,255,0.10)"
          />
          <text
            x="${labelPoint.x}"
            y="${labelPoint.y}"
            fill="rgba(255,255,255,0.80)"
            font-size="8.6"
            font-weight="600"
            font-family="${chartFontFamily}"
            text-anchor="middle"
            dominant-baseline="middle"
            style="letter-spacing:-0.02em"
            transform="rotate(${labelRotation} ${labelPoint.x} ${labelPoint.y})"
          >
            ${formatName(player.name)}
          </text>
        </g>
      `;
    });

    el.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" aria-label="Top 12 polar range chart" role="img">
        <defs>
          ${defs.join("")}
        </defs>
        <g>
          ${nameBand}
          ${hubOrbit}
          ${innerGuideRing}
          ${rings.join("")}
          ${outerGuideRing}
          ${ringLabels.join("")}
          ${spokes.join("")}
          <circle
            cx="${centerX}"
            cy="${centerY}"
            r="${centerPlateRadius}"
            fill="rgba(255,255,255,0.014)"
            stroke="rgba(255,255,255,0.055)"
            stroke-width="1"
          />
          <circle cx="${centerX}" cy="${centerY}" r="${coreRadius}" fill="rgba(255,255,255,0.18)" />
        </g>
      </svg>
    `;

    el.querySelectorAll(".polar-player-layer").forEach((node) => {
      node.addEventListener("mouseenter", (event) => {
        showTooltip(Number(node.getAttribute("data-player-index")), event);
      });
      node.addEventListener("mousemove", positionTooltip);
      node.addEventListener("mouseleave", hideTooltip);
    });
  }

  renderPolarChart();
  attachElementResize(el, renderPolarChart);
}

buildSummaryChips();
initChart();
initPolarChart();
