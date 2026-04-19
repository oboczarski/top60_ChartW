const players = [
  { name: "Jeremiyah Love", grade: 94, tier: 1, pos: "RB" },
  { name: "Fernando Mendoza", grade: 90, tier: 2, pos: "QB" },
  { name: "Carnell Tate", grade: 89, tier: 2, pos: "WR" },
  { name: "Makai Lemon", grade: 88, tier: 2, pos: "WR" },
  { name: "Jordyn Tyson", grade: 87, tier: 2, pos: "WR" },
  { name: "KC Concepcion", grade: 84, tier: 3, pos: "WR" },
  { name: "Kenyon Sadiq", grade: 80, tier: 3, pos: "TE" },
  { name: "Omar Cooper", grade: 81, tier: 3, pos: "WR" },
  { name: "Denzel Boston", grade: 80, tier: 3, pos: "WR" },
  { name: "Jadarian Price", grade: 74, tier: 4, pos: "RB" },
  { name: "Ty Simpson", grade: 76, tier: 4, pos: "QB" },
  { name: "Eli Stowers", grade: 77, tier: 4, pos: "TE" },
  { name: "Mike Washington", grade: 73, tier: 4, pos: "RB" },
  { name: "Jonah Coleman", grade: 72, tier: 4, pos: "RB" },
  { name: "Elijah Sarratt", grade: 75, tier: 4, pos: "WR" },
  { name: "Emmett Johnson", grade: 70, tier: 4, pos: "RB" }
];

const tierMeta = {
  1: {
    label: "Tier 1",
    color: "#bb74ff",
    rgb: "187, 116, 255",
    glow: "rgba(187, 116, 255, 0.42)"
  },
  2: {
    label: "Tier 2",
    color: "#8d63ff",
    rgb: "141, 99, 255",
    glow: "rgba(141, 99, 255, 0.4)"
  },
  3: {
    label: "Tier 3",
    color: "#48d1ff",
    rgb: "72, 209, 255",
    glow: "rgba(72, 209, 255, 0.38)"
  },
  4: {
    label: "Tier 4",
    color: "#25f4c5",
    rgb: "37, 244, 197",
    glow: "rgba(37, 244, 197, 0.34)"
  }
};

const positionMeta = {
  QB: { color: "#fc3688" },
  RB: { color: "#25f4c5" },
  WR: { color: "#48d1ff" },
  TE: { color: "#8d63ff" }
};

const REFERENCE_CENTER_X = 600;
const REFERENCE_CENTER_Y = 600;

const tierBands = {
  2: {
    radius: 214,
    width: 76,
    nodeRadius: 58,
    ringColor: "rgba(141,99,255,0.34)",
    fillColor: "rgba(141,99,255,0.03)"
  },
  3: {
    radius: 324,
    width: 74,
    nodeRadius: 52,
    ringColor: "rgba(72,209,255,0.26)",
    fillColor: "rgba(72,209,255,0.024)"
  },
  4: {
    radius: 434,
    width: 72,
    nodeRadius: 46,
    ringColor: "rgba(37,244,197,0.2)",
    fillColor: "rgba(37,244,197,0.02)"
  }
};

const tierAngles = {
  2: [0, 106, 180, 276],
  3: [56, 140, 228, 318],
  4: [34, 72, 126, 180, 234, 288, 326]
};

const centerConfig = {
  nodeRadius: 102
};

const playerRadiusOffsets = {
  "Jonah Coleman": 34,
  "Emmett Johnson": 34
};

const chartPadding = {
  top: 12,
  right: 10,
  bottom: 10,
  left: 10
};

const shellEl = document.querySelector(".chart-shell");
const chartEl = document.getElementById("posChart");
const chart = echarts.init(chartEl, null, { renderer: "canvas" });

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function polarToCartesian(cx, cy, radius, angleFromTop) {
  const angle = ((angleFromTop - 90) * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  };
}

function vectorFromAngle(angleFromTop) {
  const angle = ((angleFromTop - 90) * Math.PI) / 180;

  return {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };
}

function formatShortName(name) {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return name;
  }

  return `${parts[0].charAt(0)}. ${parts[parts.length - 1]}`;
}

function addCircleBounds(bounds, x, y, radius) {
  bounds.minX = Math.min(bounds.minX, x - radius);
  bounds.maxX = Math.max(bounds.maxX, x + radius);
  bounds.minY = Math.min(bounds.minY, y - radius);
  bounds.maxY = Math.max(bounds.maxY, y + radius);
}

function buildReferencePlayers() {
  const playersByTier = {
    2: players.filter((player) => player.tier === 2),
    3: players.filter((player) => player.tier === 3),
    4: players.filter((player) => player.tier === 4)
  };

  return players.map((player) => {
    if (player.tier === 1) {
      return {
        ...player,
        shortName: formatShortName(player.name),
        angle: 0,
        x: REFERENCE_CENTER_X,
        y: REFERENCE_CENTER_Y,
        nodeRadius: centerConfig.nodeRadius
      };
    }

    const tierPlayers = playersByTier[player.tier];
    const index = tierPlayers.findIndex((item) => item.name === player.name);
    const angle = tierAngles[player.tier][index];
    const radius =
      tierBands[player.tier].radius + (playerRadiusOffsets[player.name] || 0);
    const position = polarToCartesian(
      REFERENCE_CENTER_X,
      REFERENCE_CENTER_Y,
      radius,
      angle
    );

    return {
      ...player,
      shortName: formatShortName(player.name),
      angle,
      x: position.x,
      y: position.y,
      nodeRadius: tierBands[player.tier].nodeRadius
    };
  });
}

const referencePlayers = buildReferencePlayers();

function measureReferenceBounds() {
  const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity
  };

  addCircleBounds(
    bounds,
    REFERENCE_CENTER_X,
    REFERENCE_CENTER_Y,
    tierBands[4].radius + tierBands[4].nodeRadius + 18
  );
  addCircleBounds(bounds, REFERENCE_CENTER_X, REFERENCE_CENTER_Y, 170);

  referencePlayers.forEach((player) => {
    const glowRadius =
      player.tier === 1 ? player.nodeRadius + 34 : player.nodeRadius + 15;
    addCircleBounds(bounds, player.x, player.y, glowRadius);
  });

  return bounds;
}

const referenceBounds = measureReferenceBounds();
const referenceExtents = {
  left: REFERENCE_CENTER_X - referenceBounds.minX,
  right: referenceBounds.maxX - REFERENCE_CENTER_X,
  top: REFERENCE_CENTER_Y - referenceBounds.minY,
  bottom: referenceBounds.maxY - REFERENCE_CENTER_Y
};

function getOuterNameSize(player, nodeRadius) {
  let size = clamp(nodeRadius * 0.5, 6, 8.5);

  if (player.shortName.length >= 13) {
    size -= 0.9;
  } else if (player.shortName.length >= 10) {
    size -= 0.5;
  }

  return Math.max(5.7, size);
}

function buildRawLayout(width, height) {
  const availableWidth = width - chartPadding.left - chartPadding.right;
  const availableHeight = height - chartPadding.top - chartPadding.bottom;
  const scale =
    Math.min(
      availableWidth /
        (2 * Math.max(referenceExtents.left, referenceExtents.right)),
      availableHeight /
        (2 * Math.max(referenceExtents.top, referenceExtents.bottom))
    ) * 0.985;
  const center = {
    x: chartPadding.left + availableWidth / 2,
    y: chartPadding.top + availableHeight / 2
  };

  const bandLayout = Object.entries(tierBands).map(([tier, band]) => ({
    tier: Number(tier),
    radius: band.radius * scale,
    width: band.width * scale,
    ringColor: band.ringColor,
    fillColor: band.fillColor
  }));

  const playerLayout = referencePlayers.map((player) => {
    const isCenter = player.tier === 1;
    const nodeRadius = player.nodeRadius * scale * (isCenter ? 1.05 : 1.08);

    return {
      ...player,
      color: tierMeta[player.tier].color,
      rgb: tierMeta[player.tier].rgb,
      glow: tierMeta[player.tier].glow,
      posColor: positionMeta[player.pos].color,
      x: center.x + (player.x - REFERENCE_CENTER_X) * scale,
      y: center.y + (player.y - REFERENCE_CENTER_Y) * scale,
      nodeRadius,
      haloRadius:
        nodeRadius + (isCenter ? Math.max(16, 34 * scale) : Math.max(7, 15 * scale)),
      shellRadius: isCenter ? nodeRadius + Math.max(7, 10 * scale) : nodeRadius,
      coreRadius: isCenter
        ? nodeRadius
        : Math.max(6.5, nodeRadius - Math.max(2.5, 6 * scale)),
      innerRadius: isCenter ? Math.max(14, nodeRadius - Math.max(4, 14 * scale)) : 0,
      posFontSize: isCenter
        ? clamp(nodeRadius * 0.31, 9.6, 12.3)
        : clamp(nodeRadius * 0.42, 6.2, 8.7),
      gradeFontSize: isCenter
        ? clamp(nodeRadius * 0.74, 23, 32)
        : clamp(nodeRadius * 0.82, 9.2, 13.4),
      nameFontSize: isCenter
        ? clamp(nodeRadius * 0.34, 11, 14.2)
        : getOuterNameSize(player, nodeRadius),
      posOffsetY: isCenter
        ? -nodeRadius * 0.57
        : player.tier === 2
          ? -nodeRadius * 0.43
          : player.tier === 3
            ? -nodeRadius * 0.48
            : -nodeRadius * 0.55,
      gradeOffsetY: isCenter ? -nodeRadius * 0.01 : nodeRadius * 0.04,
      nameOffsetY: isCenter
        ? nodeRadius * 0.56
        : player.tier === 4
          ? nodeRadius * 0.81
          : player.tier === 3
          ? nodeRadius * 0.75
          : nodeRadius * 0.68
    };
  });

  return {
    width,
    height,
    scale,
    center,
    outerBackdropRadius: (tierBands[4].radius + tierBands[4].nodeRadius + 18) * scale,
    coreOrbitRadii: [118 * scale, 146 * scale, 170 * scale],
    coreRingOuter: 156 * scale,
    coreRingInner: 128 * scale,
    bands: bandLayout,
    players: playerLayout,
    centerPlayer: playerLayout.find((player) => player.tier === 1),
    outerPlayers: playerLayout.filter((player) => player.tier !== 1)
  };
}

function measureLayoutBounds(layout) {
  const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity
  };

  addCircleBounds(bounds, layout.center.x, layout.center.y, layout.outerBackdropRadius);
  addCircleBounds(bounds, layout.center.x, layout.center.y, layout.coreOrbitRadii[2]);

  layout.players.forEach((player) => {
    addCircleBounds(bounds, player.x, player.y, player.haloRadius);
  });

  return bounds;
}

function computeLayout(width, height) {
  const layout = buildRawLayout(width, height);
  const bounds = measureLayoutBounds(layout);
  const minX = chartPadding.left;
  const maxX = width - chartPadding.right;
  const minY = chartPadding.top;
  const maxY = height - chartPadding.bottom;

  let shiftX = 0;
  let shiftY = 0;

  if (bounds.minX < minX) {
    shiftX += minX - bounds.minX;
  } else if (bounds.maxX > maxX) {
    shiftX += maxX - bounds.maxX;
  }

  if (bounds.minY < minY) {
    shiftY += minY - bounds.minY;
  } else if (bounds.maxY > maxY) {
    shiftY += maxY - bounds.maxY;
  }

  if (!shiftX && !shiftY) {
    return layout;
  }

  const players = layout.players.map((player) => ({
    ...player,
    x: player.x + shiftX,
    y: player.y + shiftY
  }));

  return {
    ...layout,
    center: {
      x: layout.center.x + shiftX,
      y: layout.center.y + shiftY
    },
    players,
    centerPlayer: players.find((player) => player.tier === 1),
    outerPlayers: players.filter((player) => player.tier !== 1)
  };
}

function buildConnectorData(layout) {
  return layout.outerPlayers.map((player) => {
    const direction = vectorFromAngle(player.angle);

    return {
      coords: [
        [
          layout.center.x + direction.x * (layout.centerPlayer.nodeRadius + Math.max(8, 12 * layout.scale)),
          layout.center.y + direction.y * (layout.centerPlayer.nodeRadius + Math.max(8, 12 * layout.scale))
        ],
        [player.x, player.y]
      ],
      lineStyle: {
        color: player.color,
        width:
          player.tier === 2
            ? Math.max(2, 2.1 * layout.scale * 2.8)
            : player.tier === 3
              ? Math.max(1.7, 1.8 * layout.scale * 2.8)
              : Math.max(1.5, 1.5 * layout.scale * 2.8),
        opacity: 0.62,
        shadowColor: player.color,
        shadowBlur: Math.max(6, 12 * layout.scale * 2.4)
      }
    };
  });
}

function makeGraphicCircle(cx, cy, radius, fill, stroke, lineWidth, extra) {
  const options = extra || {};

  return {
    type: "circle",
    silent: true,
    z: options.z,
    shape: { cx, cy, r: radius },
    style: {
      fill,
      stroke,
      lineWidth,
      ...(options.style || {})
    }
  };
}

function buildGraphic(layout) {
  const elements = [];
  const dashA = Math.max(3, 7 * layout.scale * 2.4);
  const dashB = Math.max(5, 11 * layout.scale * 2.4);
  const coreDashA = Math.max(2, 5 * layout.scale * 2.2);
  const coreDashB = Math.max(5, 12 * layout.scale * 2.2);
  const spokeWidthLarge = Math.max(1.2, 4 * layout.scale * 2.2);
  const spokeWidthSmall = Math.max(1, 2 * layout.scale * 2.2);

  elements.push(
    makeGraphicCircle(
      layout.center.x,
      layout.center.y,
      layout.outerBackdropRadius,
      "rgba(0,0,0,0.34)",
      "rgba(255,255,255,0.04)",
      1
    )
  );

  elements.push(
    makeGraphicCircle(
      layout.center.x,
      layout.center.y,
      layout.bands[layout.bands.length - 1].radius +
        layout.bands[layout.bands.length - 1].width / 2 +
        Math.max(2, 8 * layout.scale),
      "transparent",
      "rgba(141,99,255,0.08)",
      1
    )
  );

  layout.bands.forEach((band) => {
    elements.push(
      makeGraphicCircle(
        layout.center.x,
        layout.center.y,
        band.radius,
        "transparent",
        band.fillColor,
        band.width
      )
    );
    elements.push(
      makeGraphicCircle(
        layout.center.x,
        layout.center.y,
        band.radius,
        "transparent",
        band.ringColor,
        Math.max(1, 1.4 * layout.scale * 2.4),
        { style: { lineDash: [dashA, dashB] } }
      )
    );
    elements.push(
      makeGraphicCircle(
        layout.center.x,
        layout.center.y,
        band.radius - band.width / 2,
        "transparent",
        "rgba(255,255,255,0.055)",
        1
      )
    );
    elements.push(
      makeGraphicCircle(
        layout.center.x,
        layout.center.y,
        band.radius + band.width / 2,
        "transparent",
        "rgba(255,255,255,0.05)",
        1
      )
    );
  });

  elements.push(
    makeGraphicCircle(
      layout.center.x,
      layout.center.y,
      layout.coreOrbitRadii[0],
      "transparent",
      "rgba(255,255,255,0.08)",
      1.1
    )
  );
  elements.push(
    makeGraphicCircle(
      layout.center.x,
      layout.center.y,
      layout.coreOrbitRadii[1],
      "transparent",
      "rgba(168,107,255,0.15)",
      1,
      { style: { lineDash: [coreDashA, coreDashB] } }
    )
  );
  elements.push(
    makeGraphicCircle(
      layout.center.x,
      layout.center.y,
      layout.coreOrbitRadii[2],
      "transparent",
      "rgba(73,215,255,0.1)",
      1,
      { style: { lineDash: [Math.max(1.5, 2 * layout.scale * 2.2), Math.max(4, 9 * layout.scale * 2.2)] } }
    )
  );

  for (let index = 0; index < 28; index += 1) {
    const angle = index * (360 / 28);
    const inner = polarToCartesian(
      layout.center.x,
      layout.center.y,
      layout.coreOrbitRadii[0],
      angle
    );
    const outer = polarToCartesian(
      layout.center.x,
      layout.center.y,
      layout.coreRingOuter,
      angle
    );

    elements.push({
      type: "line",
      silent: true,
      z: 6,
      shape: {
        x1: inner.x,
        y1: inner.y,
        x2: outer.x,
        y2: outer.y
      },
      style: {
        stroke: "rgba(168,107,255,0.18)",
        lineWidth: index % 2 === 0 ? spokeWidthLarge : spokeWidthSmall,
        lineCap: "round"
      }
    });
  }

  elements.push(
    makeGraphicCircle(
      layout.center.x,
      layout.center.y,
      layout.coreRingOuter,
      "transparent",
      "rgba(168,107,255,0.12)",
      Math.max(6, 20 * layout.scale * 1.8),
      { style: { lineDash: [coreDashA, coreDashB] } }
    )
  );
  elements.push(
    makeGraphicCircle(
      layout.center.x,
      layout.center.y,
      layout.coreRingInner,
      "transparent",
      "rgba(255,88,214,0.14)",
      Math.max(3.5, 8 * layout.scale * 1.8),
      { style: { lineDash: [Math.max(1, layout.scale * 2.2), Math.max(3, 7 * layout.scale * 2.2)] } }
    )
  );

  return elements;
}

function gradientForCenterNode(color) {
  return new echarts.graphic.RadialGradient(0.5, 0.42, 0.74, [
    { offset: 0, color: "rgba(246,237,255,0.98)" },
    { offset: 0.24, color: "rgba(222,193,255,0.96)" },
    { offset: 0.58, color: color },
    { offset: 1, color: "rgba(52,17,100,1)" }
  ]);
}

function buildNodeSeries(data, isCenter) {
  return {
    type: "custom",
    coordinateSystem: "cartesian2d",
    z: isCenter ? 12 : 10,
    data: data.map((player, index) => [player.x, player.y, index]),
    renderItem(params, api) {
      const item = data[api.value(2)];
      const point = api.coord([item.x, item.y]);
      const x = point[0];
      const y = point[1];
      const strokeWidth = isCenter
        ? Math.max(2.2, item.nodeRadius * 0.08)
        : Math.max(1.4, item.nodeRadius * 0.11);

      const children = [
        {
          type: "circle",
          shape: { cx: x, cy: y, r: item.haloRadius },
          silent: true,
          style: {
            fill: item.color,
            opacity: isCenter ? 0.16 : 0.13,
            shadowBlur: isCenter ? 28 : 18,
            shadowColor: item.color
          }
        },
        {
          type: "circle",
          shape: { cx: x, cy: y, r: item.shellRadius },
          silent: true,
          style: {
            fill: isCenter ? "rgba(255,255,255,0.04)" : "rgba(8,13,34,0.96)",
            stroke: isCenter ? "rgba(255,255,255,0.12)" : item.color,
            lineWidth: strokeWidth
          }
        },
        {
          type: "circle",
          shape: { cx: x, cy: y, r: item.coreRadius },
          silent: true,
          style: {
            fill: isCenter ? gradientForCenterNode(item.color) : "rgba(12,18,42,0.96)",
            stroke: isCenter ? item.color : "rgba(255,255,255,0.08)",
            lineWidth: isCenter ? Math.max(2.4, item.nodeRadius * 0.08) : 1
          }
        }
      ];

      if (isCenter) {
        children.push({
          type: "circle",
          shape: { cx: x, cy: y, r: item.innerRadius },
          silent: true,
          style: {
            fill: "rgba(24,14,49,0.28)",
            stroke: "rgba(255,255,255,0.16)",
            lineWidth: 1
          }
        });
      }

      children.push(
        {
          type: "text",
          x,
          y: y + item.posOffsetY,
          silent: true,
          style: {
            text: item.pos,
            fill: item.posColor,
            font: `700 ${item.posFontSize}px "Product Sans", "Google Sans", sans-serif`,
            textAlign: "center",
            textVerticalAlign: "middle"
          }
        },
        {
          type: "text",
          x,
          y: y + item.gradeOffsetY,
          silent: true,
          style: {
            text: String(item.grade),
            fill: "#fff",
            font: `${isCenter ? 800 : 700} ${item.gradeFontSize}px "Product Sans", "Google Sans", sans-serif`,
            textAlign: "center",
            textVerticalAlign: "middle"
          }
        },
        {
          type: "text",
          x,
          y: y + item.nameOffsetY,
          silent: true,
          style: {
            text: item.shortName,
            fill: "rgba(255,255,255,0.94)",
            font: `400 ${item.nameFontSize}px "Product Sans", "Google Sans", sans-serif`,
            padding: isCenter ? [2, 6, 3, 5] : [2, 4, 2, 4],
            backgroundColor: isCenter
              ? "rgba(10,16,36,0.48)"
              : "rgba(33, 41, 55, 0.94)",
            borderColor: echarts.color.modifyAlpha(item.color, isCenter ? 0.5 : 0.38),
            borderWidth: 1,
            borderRadius: 999,
            shadowBlur: isCenter ? 10 : 7,
            shadowColor: echarts.color.modifyAlpha(item.color, isCenter ? 0.3 : 0.22),
            textAlign: "center",
            textVerticalAlign: "middle"
          }
        }
      );

      return {
        type: "group",
        children
      };
    },
    tooltip: {
      formatter(params) {
        const item = data[params.dataIndex];

        return `
          <div style="font-family:'Product Sans','Google Sans',sans-serif; min-width:128px;">
            <div style="font-size:13px; font-weight:700; margin-bottom:5px;">${item.name}</div>
            <div style="font-size:11px; color:rgba(255,255,255,0.7);">${tierMeta[item.tier].label} · ${item.pos}</div>
            <div style="margin-top:6px; font-size:12px; font-weight:700;">Grade: ${item.grade}</div>
          </div>
        `;
      }
    }
  };
}

function syncShellAtmosphere(layout) {
  shellEl.style.setProperty("--core-x", `${layout.center.x}px`);
  shellEl.style.setProperty("--core-y", `${layout.center.y}px`);
  shellEl.style.setProperty("--chart-scale", layout.scale.toFixed(3));
}

function renderChart() {
  const width = chartEl.clientWidth;
  const height = chartEl.clientHeight;

  if (!width || !height) {
    return;
  }

  const layout = computeLayout(width, height);

  syncShellAtmosphere(layout);

  chart.setOption(
    {
      animationDuration: 700,
      animationEasing: "cubicOut",
      backgroundColor: "transparent",
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: false
      },
      xAxis: {
        type: "value",
        min: 0,
        max: width,
        show: false
      },
      yAxis: {
        type: "value",
        min: 0,
        max: height,
        inverse: true,
        show: false
      },
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(7,11,28,0.96)",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        textStyle: {
          color: "#fff",
          fontFamily: "'Product Sans', 'Google Sans', sans-serif"
        },
        extraCssText:
          "box-shadow:0 16px 48px rgba(0,0,0,0.45); border-radius:14px; padding:10px 12px;"
      },
      graphic: buildGraphic(layout),
      series: [
        {
          type: "lines",
          coordinateSystem: "cartesian2d",
          polyline: false,
          silent: true,
          z: 2,
          data: buildConnectorData(layout)
        },
        buildNodeSeries(layout.outerPlayers, false),
        buildNodeSeries([layout.centerPlayer], true)
      ]
    },
    true
  );
}

renderChart();

let resizeFrame = 0;

function queueRender() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    chart.resize();
    renderChart();
  });
}

const resizeObserver = new ResizeObserver(queueRender);
resizeObserver.observe(shellEl);
window.addEventListener("resize", queueRender);
