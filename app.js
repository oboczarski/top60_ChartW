const chartData = [
  { name: "J. Allen", pos: "QB", ktc: 3, adp: 1.5 },
  { name: "Bijan", pos: "RB", ktc: 2, adp: 2.6 },
  { name: "Maye", pos: "QB", ktc: 6, adp: 3.4 },
  { name: "Chase", pos: "WR", ktc: 1, adp: 4.4 },
  { name: "Gibbs", pos: "RB", ktc: 5, adp: 5.9 },
  { name: "Nacua", pos: "WR", ktc: 7, adp: 6.4 },
  { name: "JSN", pos: "WR", ktc: 4, adp: 7.5 },
  { name: "Daniels", pos: "QB", ktc: 11, adp: 8 },
  { name: "St.Brown", pos: "WR", ktc: 13, adp: 9.1 },
  { name: "Burrow", pos: "QB", ktc: 18, adp: 10.4 },
  { name: "Jackson", pos: "QB", ktc: 14, adp: 11.8 },
  { name: "Nabers", pos: "WR", ktc: 9, adp: 12.8 },
  { name: "Bowers", pos: "TE", ktc: 10, adp: 13.2 },
  { name: "C.Williams", pos: "QB", ktc: 8, adp: 14.1 },
  { name: "McBride", pos: "TE", ktc: 15, adp: 15.4 }
].sort((a, b) => b.adp - a.adp);

function formatName(name) {
  return name;
}

const colorKTC = "#4800ff";
const colorADP = "#b341ff";

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
      left: 100, // Reduced from 110 since letter-spacing is down
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
        // Find player object for the raw axis string
        const pIndex = params[0].dataIndex;
        const player = chartData[pIndex];
        let title = player ? formatName(player.name) + " " + player.pos : params[0].name;

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
      max: 20,
      interval: 5,
      axisLabel: {
        color: "rgba(255,255,255,0.76)",
        fontSize: 11,
        fontWeight: 500,
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
          return `{name|${formattedName}} {pos${player.pos}|${player.pos}}`;
        },
        rich: {
          name: {
            color: "rgba(255,255,255,0.76)",
            fontSize: 9,
            fontWeight: 400,
            fontFamily: "'Product Sans', 'Google Sans', sans-serif"
          },
          posQB: { color: "#d37be9", fontSize: 9, fontWeight: 400, fontFamily: "'Product Sans', 'Google Sans', sans-serif" },
          posRB: { color: "#66fccc", fontSize: 9, fontWeight: 400, fontFamily: "'Product Sans', 'Google Sans', sans-serif" },
          posWR: { color: "#60b5ff", fontSize: 9, fontWeight: 400, fontFamily: "'Product Sans', 'Google Sans', sans-serif" },
          posTE: { color: "#7e51fc", fontSize: 9, fontWeight: 400, fontFamily: "'Product Sans', 'Google Sans', sans-serif" }
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

  const ro = new ResizeObserver(() => chart.resize());
  ro.observe(el);

  window.addEventListener("resize", () => chart.resize());
}

buildSummaryChips();
initChart();
