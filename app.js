const chartData = [
  { name: "Josh Allen", pos: "QB", ktc: 3, adp: 1.5 },
  { name: "Bijan Robinson", pos: "RB", ktc: 2, adp: 2.6 },
  { name: "Drake Maye", pos: "QB", ktc: 6, adp: 3.4 },
  { name: "Ja'Marr Chase", pos: "WR", ktc: 1, adp: 4.4 },
  { name: "Jahmyr Gibbs", pos: "RB", ktc: 5, adp: 5.9 },
  { name: "Puka Nacua", pos: "WR", ktc: 7, adp: 6.4 },
  { name: "Jaxon Smith-Njigba", pos: "WR", ktc: 4, adp: 7.5 },
  { name: "Jayden Daniels", pos: "QB", ktc: 11, adp: 8 },
  { name: "Amon-Ra St. Brown", pos: "WR", ktc: 13, adp: 9.1 },
  { name: "Joe Burrow", pos: "QB", ktc: 18, adp: 10.4 },
  { name: "Lamar Jackson", pos: "QB", ktc: 14, adp: 11.8 },
  { name: "Malik Nabers", pos: "WR", ktc: 9, adp: 12.8 },
  { name: "Brock Bowers", pos: "TE", ktc: 10, adp: 13.2 },
  { name: "Caleb Williams", pos: "QB", ktc: 8, adp: 14.1 },
  { name: "Trey McBride", pos: "TE", ktc: 15, adp: 15.4 }
].sort((a, b) => b.adp - a.adp); // Reverse order so ADP #1 is at top

function formatName(name, pos) {
  const parts = name.split(" ");
  const firstInitial = parts[0][0];
  const lastName = parts.slice(1).join(" ");
  // Using unicode spaces to force alignment before position.
  return `${firstInitial}. ${lastName}  ${pos}`;
}

const colorKTC = "#ff4187";
const colorADP = "#6a00ff";

function buildSummaryChips() {
  const chips = document.getElementById("summaryChips");
  
  // Calculate analytics directly from provided data
  const valDiscrepancies = chartData.map(p => ({
    ...p,
    diff: p.adp - p.ktc // Positive means KTC ranks them higher (number is lower) than ADP
  }));
  
  const biggestValue = [...valDiscrepancies].sort((a, b) => b.diff - a.diff)[0];
  const mostOvervalued = [...valDiscrepancies].sort((a, b) => a.diff - b.diff)[0];
  
  const qbCount = chartData.filter(d => d.pos === "QB").length;
  const wrCount = chartData.filter(d => d.pos === "WR").length;

  const summaries = [
    {
      label: "Best KTC Value",
      val: biggestValue.name.split(" ").pop(),
      sub: `Diff: +${biggestValue.diff.toFixed(1)}`,
      line: colorKTC
    },
    {
      label: "Lowest Value",
      val: mostOvervalued.name.split(" ").pop(),
      sub: `Diff: ${mostOvervalued.diff.toFixed(1)}`,
      line: colorADP
    },
    {
      label: "Top 15 QBs",
      val: qbCount,
      sub: "Count",
      line: "#1ac2ff"
    },
    {
      label: "Top 15 WRs",
      val: wrCount,
      sub: "Count",
      line: "#0299fe"
    }
  ];

  chips.innerHTML = summaries
    .map(
      (item) => `
        <div class="stat-chip" style="--chip-line: ${item.line}; box-shadow: 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px rgba(255,255,255,0.02);">
          <div class="stat-chip-top" style="justify-content:center; margin-bottom: 2px;">
            <span class="stat-label" style="font-size:9px; color:rgba(255,255,255,0.6);">${item.label}</span>
          </div>
          <div class="stat-chip-bottom" style="flex-direction:column; gap:2px;">
            <span class="stat-count" style="font-size:16px; font-weight:700;">${item.val}</span>
            <span class="stat-sub" style="font-size:10px; color:${item.line};">${item.sub}</span>
          </div>
        </div>
      `
    )
    .join("");
}

function initChart() {
  const el = document.getElementById("posChart");
  const chart = echarts.init(el, null, { renderer: "svg" });

  const yAxisData = chartData.map(d => formatName(d.name, d.pos));
  const adpData = chartData.map(d => d.adp);
  const ktcData = chartData.map(d => d.ktc);

  chart.setOption({
    animationDuration: 450,
    backgroundColor: "transparent",
    grid: {
      left: 110,
      right: 20,
      top: 36,
      bottom: 44,
      containLabel: false
    },
    legend: {
      data: ["ADP", "KTC Rank"],
      top: 4,
      right: 16,
      icon: "circle",
      itemHeight: 8,
      textStyle: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 11,
        fontFamily: "'Product Sans', 'Google Sans', sans-serif"
      }
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(5,6,11,0.96)",
      borderColor: "rgba(255,255,255,0.10)",
      borderWidth: 1,
      textStyle: { color: "#fff", fontSize: 12 },
      axisPointer: { type: "shadow", shadowStyle: { color: "rgba(255,255,255,0.04)" } },
      extraCssText: "border-radius:12px; box-shadow:0 16px 40px rgba(0,0,0,.45); padding:8px 12px;",
      formatter: function (params) {
        let title = params[0].axisValue;
        let pADP = params.find(p => p.seriesName === "ADP");
        let pKTC = params.find(p => p.seriesName === "KTC Rank");
        
        return `
          <div style="font-size:11px; color:rgba(255,255,255,.55); margin-bottom:6px;">${title}</div>
          <div style="display:flex; justify-content:space-between; gap:16px; margin-bottom:4px;">
            <span style="color:${colorADP};">● ADP</span>
            <strong>${pADP ? pADP.value : ''}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; gap:16px;">
            <span style="color:${colorKTC};">● KTC Rank</span>
            <strong>${pKTC ? pKTC.value : ''}</strong>
          </div>
        `;
      }
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 15,
      interval: 5,
      axisLabel: {
        color: "rgba(255,255,255,0.76)",
        fontSize: 11,
        fontWeight: 300,
      },
      splitLine: { show: true, lineStyle: { color: "rgba(255,255,255,0.05)", type: "dotted" } }
    },
    yAxis: {
      type: "category",
      data: yAxisData,
      axisLabel: {
        color: "rgba(255,255,255,0.86)",
        fontSize: 11,
        fontWeight: 400,
        fontFamily: "monospace", // Keeps spacing uniform for the position
        interval: 0
      },
      axisLine: { show: false },
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
              x: minX,
              y: y - 4,
              width: width,
              height: 8,
              r: 4
            },
            style: api.style({
              fill: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: x0 < x1 ? colorKTC : colorADP },
                { offset: 1, color: x0 < x1 ? colorADP : colorKTC }
              ])
            })
          };
        },
        data: chartData.map((d, i) => [d.ktc, d.adp, i]),
        z: 1,
        tooltip: { show: false }
      },
      {
        name: "KTC Rank",
        type: "scatter",
        symbol: "circle",
        symbolSize: 10,
        itemStyle: { color: colorKTC },
        data: ktcData,
        z: 2
      },
      {
        name: "ADP",
        type: "scatter",
        symbol: "circle",
        symbolSize: 10,
        itemStyle: { color: colorADP },
        data: adpData,
        z: 2
      }
    ]
  });

  const ro = new ResizeObserver(() => chart.resize());
  ro.observe(el);

  window.addEventListener("resize", () => chart.resize());
}

buildSummaryChips();
initChart();
