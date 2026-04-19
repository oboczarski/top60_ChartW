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
  1: { label: "Tier 1" },
  2: { label: "Tier 2" },
  3: { label: "Tier 3" },
  4: { label: "Tier 4" }
};

const REFERENCE_CENTER_X = 600;
const REFERENCE_CENTER_Y = 600;

const tierBands = {
  2: {
    radius: 214,
    width: 76,
    nodeRadius: 58
  },
  3: {
    radius: 324,
    width: 74,
    nodeRadius: 52
  },
  4: {
    radius: 434,
    width: 72,
    nodeRadius: 46
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

function readCssVar(styles, name, fallback = "") {
  const value = styles.getPropertyValue(name).trim();

  return value || fallback;
}

function readCssNumber(styles, name, fallback = 0) {
  const value = Number.parseFloat(readCssVar(styles, name));

  return Number.isFinite(value) ? value : fallback;
}

function readCssNumberList(styles, name, fallback = []) {
  const value = readCssVar(styles, name);

  if (!value) {
    return fallback;
  }

  const matches = value.match(/-?\d*\.?\d+/g);

  if (!matches) {
    return fallback;
  }

  const numbers = matches
    .map((match) => Number.parseFloat(match))
    .filter((number) => Number.isFinite(number));

  return numbers.length ? numbers : fallback;
}

function readChartTheme() {
  const styles = getComputedStyle(shellEl);
  const fontFamily = readCssVar(
    styles,
    "--chart-font-family",
    '"Product Sans", "Google Sans", sans-serif'
  );
  const getTierColor = (tier) => readCssVar(styles, `--tier-${tier}`);
  return {
    fontFamily,
    text: {
      strong: readCssVar(styles, "--chart-text-strong", "#fff"),
      name: readCssVar(styles, "--chart-text-name", "rgba(255,255,255,0.94)")
    },
    tooltip: {
      background: readCssVar(styles, "--chart-tooltip-bg", "rgba(7,11,28,0.96)"),
      border: readCssVar(styles, "--chart-tooltip-border", "rgba(255,255,255,0.08)"),
      muted: readCssVar(
        styles,
        "--chart-tooltip-text-muted",
        "rgba(255,255,255,0.7)"
      ),
      shadow: readCssVar(
        styles,
        "--chart-tooltip-shadow",
        "0 16px 48px rgba(0,0,0,0.45)"
      ),
      radius: readCssVar(styles, "--chart-tooltip-radius", "14px"),
      padding: readCssVar(styles, "--chart-tooltip-padding", "10px 12px")
    },
    positions: {
      QB: readCssVar(styles, "--pos-qb", "#fc3688"),
      RB: readCssVar(styles, "--pos-rb", "#25f4c5"),
      WR: readCssVar(styles, "--pos-wr", "#48d1ff"),
      TE: readCssVar(styles, "--pos-te", "#8d63ff")
    },
    tiers: {
      1: { color: getTierColor(1) },
      2: { color: getTierColor(2) },
      3: { color: getTierColor(3) },
      4: { color: getTierColor(4) }
    },
    bands: {
      2: {
        ringColor: readCssVar(styles, "--tier-2-band-stroke"),
        fillColor: readCssVar(styles, "--tier-2-band-fill")
      },
      3: {
        ringColor: readCssVar(styles, "--tier-3-band-stroke"),
        fillColor: readCssVar(styles, "--tier-3-band-fill")
      },
      4: {
        ringColor: readCssVar(styles, "--tier-4-band-stroke"),
        fillColor: readCssVar(styles, "--tier-4-band-fill")
      }
    },
    connectors: {
      opacity: readCssNumber(styles, "--connector-opacity", 0.62),
      shadowBlurMin: readCssNumber(styles, "--connector-shadow-blur-min", 6),
      shadowBlurScale: readCssNumber(styles, "--connector-shadow-blur-scale", 28.8),
      tiers: {
        2: {
          color: readCssVar(styles, "--connector-tier-2-color", getTierColor(2)),
          widthMin: readCssNumber(styles, "--connector-tier-2-width-min", 2),
          widthScale: readCssNumber(styles, "--connector-tier-2-width-scale", 5.88)
        },
        3: {
          color: readCssVar(styles, "--connector-tier-3-color", getTierColor(3)),
          widthMin: readCssNumber(styles, "--connector-tier-3-width-min", 1.7),
          widthScale: readCssNumber(styles, "--connector-tier-3-width-scale", 5.04)
        },
        4: {
          color: readCssVar(styles, "--connector-tier-4-color", getTierColor(4)),
          widthMin: readCssNumber(styles, "--connector-tier-4-width-min", 1.5),
          widthScale: readCssNumber(styles, "--connector-tier-4-width-scale", 4.2)
        }
      }
    },
    graphics: {
      outerBackdropFill: readCssVar(
        styles,
        "--chart-outer-backdrop-fill",
        "rgba(0,0,0,0.34)"
      ),
      outerBackdropStroke: readCssVar(
        styles,
        "--chart-outer-backdrop-stroke",
        "rgba(255,255,255,0.04)"
      ),
      outerAccentStroke: readCssVar(
        styles,
        "--chart-outer-accent-stroke",
        "rgba(141,99,255,0.08)"
      ),
      bandEdgeInner: readCssVar(
        styles,
        "--chart-band-edge-inner",
        "rgba(255,255,255,0.055)"
      ),
      bandEdgeOuter: readCssVar(
        styles,
        "--chart-band-edge-outer",
        "rgba(255,255,255,0.05)"
      ),
      coreOrbit1Stroke: readCssVar(
        styles,
        "--chart-core-orbit-1-stroke",
        "rgba(255,255,255,0.08)"
      ),
      coreOrbit2Stroke: readCssVar(
        styles,
        "--chart-core-orbit-2-stroke",
        "rgba(168,107,255,0.15)"
      ),
      coreOrbit3Stroke: readCssVar(
        styles,
        "--chart-core-orbit-3-stroke",
        "rgba(73,215,255,0.1)"
      ),
      coreSpokeStroke: readCssVar(
        styles,
        "--chart-core-spoke-stroke",
        "rgba(168,107,255,0.18)"
      ),
      coreRingOuterStroke: readCssVar(
        styles,
        "--chart-core-ring-outer-stroke",
        "rgba(168,107,255,0.12)"
      ),
      coreRingInnerStroke: readCssVar(
        styles,
        "--chart-core-ring-inner-stroke",
        "rgba(255,88,214,0.14)"
      ),
      bandDashAMin: readCssNumber(styles, "--chart-band-dash-a-min", 3),
      bandDashAScale: readCssNumber(styles, "--chart-band-dash-a-scale", 16.8),
      bandDashBMin: readCssNumber(styles, "--chart-band-dash-b-min", 5),
      bandDashBScale: readCssNumber(styles, "--chart-band-dash-b-scale", 26.4),
      coreDashAMin: readCssNumber(styles, "--chart-core-dash-a-min", 2),
      coreDashAScale: readCssNumber(styles, "--chart-core-dash-a-scale", 11),
      coreDashBMin: readCssNumber(styles, "--chart-core-dash-b-min", 5),
      coreDashBScale: readCssNumber(styles, "--chart-core-dash-b-scale", 26.4),
      coreOrbit3DashAMin: readCssNumber(
        styles,
        "--chart-core-orbit-3-dash-a-min",
        1.5
      ),
      coreOrbit3DashAScale: readCssNumber(
        styles,
        "--chart-core-orbit-3-dash-a-scale",
        4.4
      ),
      coreOrbit3DashBMin: readCssNumber(
        styles,
        "--chart-core-orbit-3-dash-b-min",
        4
      ),
      coreOrbit3DashBScale: readCssNumber(
        styles,
        "--chart-core-orbit-3-dash-b-scale",
        19.8
      ),
      coreRingInnerDashAMin: readCssNumber(
        styles,
        "--chart-core-ring-inner-dash-a-min",
        1
      ),
      coreRingInnerDashAScale: readCssNumber(
        styles,
        "--chart-core-ring-inner-dash-a-scale",
        2.2
      ),
      coreRingInnerDashBMin: readCssNumber(
        styles,
        "--chart-core-ring-inner-dash-b-min",
        3
      ),
      coreRingInnerDashBScale: readCssNumber(
        styles,
        "--chart-core-ring-inner-dash-b-scale",
        15.4
      ),
      bandRingLineMin: readCssNumber(styles, "--chart-band-ring-line-min", 1),
      bandRingLineScale: readCssNumber(
        styles,
        "--chart-band-ring-line-scale",
        3.36
      ),
      spokeLargeMin: readCssNumber(styles, "--chart-spoke-large-min", 1.2),
      spokeLargeScale: readCssNumber(styles, "--chart-spoke-large-scale", 8.8),
      spokeSmallMin: readCssNumber(styles, "--chart-spoke-small-min", 1),
      spokeSmallScale: readCssNumber(styles, "--chart-spoke-small-scale", 4.4),
      coreRingOuterLineMin: readCssNumber(
        styles,
        "--chart-core-ring-outer-line-min",
        6
      ),
      coreRingOuterLineScale: readCssNumber(
        styles,
        "--chart-core-ring-outer-line-scale",
        36
      ),
      coreRingInnerLineMin: readCssNumber(
        styles,
        "--chart-core-ring-inner-line-min",
        3.5
      ),
      coreRingInnerLineScale: readCssNumber(
        styles,
        "--chart-core-ring-inner-line-scale",
        14.4
      )
    },
    nodes: {
      haloOpacityCenter: readCssNumber(
        styles,
        "--chart-node-halo-opacity-center",
        0.16
      ),
      haloOpacityOuter: readCssNumber(
        styles,
        "--chart-node-halo-opacity-outer",
        0.13
      ),
      haloBlurCenter: readCssNumber(styles, "--chart-node-halo-blur-center", 28),
      haloBlurOuter: readCssNumber(styles, "--chart-node-halo-blur-outer", 18),
      shellFillCenter: readCssVar(
        styles,
        "--chart-node-shell-fill-center",
        "rgba(255,255,255,0.04)"
      ),
      shellFillOuter: readCssVar(
        styles,
        "--chart-node-shell-fill-outer",
        "rgba(8,13,34,0.96)"
      ),
      shellStrokeCenter: readCssVar(
        styles,
        "--chart-node-shell-stroke-center",
        "rgba(255,255,255,0.12)"
      ),
      coreFillOuter: readCssVar(
        styles,
        "--chart-node-core-fill-outer",
        "rgba(12,18,42,0.96)"
      ),
      coreStrokeOuter: readCssVar(
        styles,
        "--chart-node-core-stroke-outer",
        "rgba(255,255,255,0.08)"
      ),
      innerFillCenter: readCssVar(
        styles,
        "--chart-node-inner-fill-center",
        "rgba(24,14,49,0.28)"
      ),
      innerStrokeCenter: readCssVar(
        styles,
        "--chart-node-inner-stroke-center",
        "rgba(255,255,255,0.16)"
      ),
      shellStrokeWidthCenterMin: readCssNumber(
        styles,
        "--chart-node-shell-stroke-width-center-min",
        2.2
      ),
      shellStrokeWidthCenterFactor: readCssNumber(
        styles,
        "--chart-node-shell-stroke-width-center-factor",
        0.08
      ),
      shellStrokeWidthOuterMin: readCssNumber(
        styles,
        "--chart-node-shell-stroke-width-outer-min",
        1.4
      ),
      shellStrokeWidthOuterFactor: readCssNumber(
        styles,
        "--chart-node-shell-stroke-width-outer-factor",
        0.11
      ),
      coreStrokeWidthCenterMin: readCssNumber(
        styles,
        "--chart-node-core-stroke-width-center-min",
        2.4
      ),
      coreStrokeWidthCenterFactor: readCssNumber(
        styles,
        "--chart-node-core-stroke-width-center-factor",
        0.08
      ),
      coreStrokeWidthOuter: readCssNumber(
        styles,
        "--chart-node-core-stroke-width-outer",
        1
      ),
      innerStrokeWidthCenter: readCssNumber(
        styles,
        "--chart-node-inner-stroke-width-center",
        1
      ),
      centerGradientStop1: readCssVar(
        styles,
        "--chart-center-gradient-stop-1",
        "rgba(246,237,255,0.98)"
      ),
      centerGradientStop2: readCssVar(
        styles,
        "--chart-center-gradient-stop-2",
        "rgba(222,193,255,0.96)"
      ),
      centerGradientStop4: readCssVar(
        styles,
        "--chart-center-gradient-stop-4",
        "rgba(52,17,100,1)"
      ),
      nameChipPaddingCenter: readCssNumberList(
        styles,
        "--chart-name-chip-padding-center",
        [2, 6, 3, 5]
      ),
      nameChipPaddingOuter: readCssNumberList(
        styles,
        "--chart-name-chip-padding-outer",
        [2, 4, 2, 4]
      ),
      nameChipBgCenter: readCssVar(
        styles,
        "--chart-name-chip-bg-center",
        "rgba(10,16,36,0.48)"
      ),
      nameChipBgOuter: readCssVar(
        styles,
        "--chart-name-chip-bg-outer",
        "rgba(33,41,55,0.94)"
      ),
      nameChipBorderWidth: readCssNumber(
        styles,
        "--chart-name-chip-border-width",
        1
      ),
      nameChipBorderRadius: readCssNumber(
        styles,
        "--chart-name-chip-border-radius",
        999
      ),
      nameChipBorderAlphaCenter: readCssNumber(
        styles,
        "--chart-name-chip-border-alpha-center",
        0.5
      ),
      nameChipBorderAlphaOuter: readCssNumber(
        styles,
        "--chart-name-chip-border-alpha-outer",
        0.38
      ),
      nameChipShadowBlurCenter: readCssNumber(
        styles,
        "--chart-name-chip-shadow-blur-center",
        10
      ),
      nameChipShadowBlurOuter: readCssNumber(
        styles,
        "--chart-name-chip-shadow-blur-outer",
        7
      ),
      nameChipShadowAlphaCenter: readCssNumber(
        styles,
        "--chart-name-chip-shadow-alpha-center",
        0.3
      ),
      nameChipShadowAlphaOuter: readCssNumber(
        styles,
        "--chart-name-chip-shadow-alpha-outer",
        0.22
      )
    },
    typography: {
      pos: {
        center: {
          weight: readCssNumber(styles, "--chart-pos-font-weight-center", 700),
          factor: readCssNumber(styles, "--chart-pos-font-factor-center", 0.31),
          min: readCssNumber(styles, "--chart-pos-font-min-center", 9.6),
          max: readCssNumber(styles, "--chart-pos-font-max-center", 12.3)
        },
        outer: {
          weight: readCssNumber(styles, "--chart-pos-font-weight-outer", 700),
          factor: readCssNumber(styles, "--chart-pos-font-factor-outer", 0.42),
          min: readCssNumber(styles, "--chart-pos-font-min-outer", 6.2),
          max: readCssNumber(styles, "--chart-pos-font-max-outer", 8.7)
        }
      },
      grade: {
        center: {
          weight: readCssNumber(styles, "--chart-grade-font-weight-center", 800),
          factor: readCssNumber(styles, "--chart-grade-font-factor-center", 0.74),
          min: readCssNumber(styles, "--chart-grade-font-min-center", 23),
          max: readCssNumber(styles, "--chart-grade-font-max-center", 32)
        },
        outer: {
          weight: readCssNumber(styles, "--chart-grade-font-weight-outer", 700),
          factor: readCssNumber(styles, "--chart-grade-font-factor-outer", 0.82),
          min: readCssNumber(styles, "--chart-grade-font-min-outer", 9.2),
          max: readCssNumber(styles, "--chart-grade-font-max-outer", 13.4)
        }
      },
      name: {
        weight: readCssNumber(styles, "--chart-name-font-weight", 400),
        center: {
          factor: readCssNumber(styles, "--chart-name-font-factor-center", 0.34),
          min: readCssNumber(styles, "--chart-name-font-min-center", 11),
          max: readCssNumber(styles, "--chart-name-font-max-center", 14.2)
        },
        outer: {
          factor: readCssNumber(styles, "--chart-name-font-factor-outer", 0.5),
          min: readCssNumber(styles, "--chart-name-font-min-outer", 6),
          max: readCssNumber(styles, "--chart-name-font-max-outer", 8.5),
          floor: readCssNumber(styles, "--chart-name-font-floor-outer", 5.7),
          midCutoff: readCssNumber(styles, "--chart-name-font-mid-cutoff", 10),
          midReduction: readCssNumber(
            styles,
            "--chart-name-font-mid-reduction",
            0.5
          ),
          longCutoff: readCssNumber(styles, "--chart-name-font-long-cutoff", 13),
          longReduction: readCssNumber(
            styles,
            "--chart-name-font-long-reduction",
            0.9
          )
        }
      }
    }
  };
}

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

function getOuterNameSize(player, nodeRadius, theme) {
  const nameTheme = theme.typography.name.outer;
  let size = clamp(nodeRadius * nameTheme.factor, nameTheme.min, nameTheme.max);

  if (player.shortName.length >= nameTheme.longCutoff) {
    size -= nameTheme.longReduction;
  } else if (player.shortName.length >= nameTheme.midCutoff) {
    size -= nameTheme.midReduction;
  }

  return Math.max(nameTheme.floor, size);
}

function buildRawLayout(width, height, theme) {
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
    width: band.width * scale
  }));

  const playerLayout = referencePlayers.map((player) => {
    const isCenter = player.tier === 1;
    const nodeRadius = player.nodeRadius * scale * (isCenter ? 1.05 : 1.08);
    const posType = isCenter ? theme.typography.pos.center : theme.typography.pos.outer;
    const gradeType = isCenter
      ? theme.typography.grade.center
      : theme.typography.grade.outer;
    const nameType = theme.typography.name.center;

    return {
      ...player,
      color: theme.tiers[player.tier].color,
      posColor: theme.positions[player.pos],
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
      posFontSize: clamp(nodeRadius * posType.factor, posType.min, posType.max),
      gradeFontSize: clamp(
        nodeRadius * gradeType.factor,
        gradeType.min,
        gradeType.max
      ),
      nameFontSize: isCenter
        ? clamp(nodeRadius * nameType.factor, nameType.min, nameType.max)
        : getOuterNameSize(player, nodeRadius, theme),
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

function computeLayout(width, height, theme) {
  const layout = buildRawLayout(width, height, theme);
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

function buildConnectorData(layout, theme) {
  return layout.outerPlayers.map((player) => {
    const direction = vectorFromAngle(player.angle);
    const connectorTheme = theme.connectors.tiers[player.tier];

    return {
      coords: [
        [
          layout.center.x + direction.x * (layout.centerPlayer.nodeRadius + Math.max(8, 12 * layout.scale)),
          layout.center.y + direction.y * (layout.centerPlayer.nodeRadius + Math.max(8, 12 * layout.scale))
        ],
        [player.x, player.y]
      ],
      lineStyle: {
        color: connectorTheme.color,
        width: Math.max(
          connectorTheme.widthMin,
          connectorTheme.widthScale * layout.scale
        ),
        opacity: theme.connectors.opacity,
        shadowColor: connectorTheme.color,
        shadowBlur: Math.max(
          theme.connectors.shadowBlurMin,
          theme.connectors.shadowBlurScale * layout.scale
        )
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

function buildGraphic(layout, theme) {
  const elements = [];
  const dashA = Math.max(
    theme.graphics.bandDashAMin,
    theme.graphics.bandDashAScale * layout.scale
  );
  const dashB = Math.max(
    theme.graphics.bandDashBMin,
    theme.graphics.bandDashBScale * layout.scale
  );
  const coreDashA = Math.max(
    theme.graphics.coreDashAMin,
    theme.graphics.coreDashAScale * layout.scale
  );
  const coreDashB = Math.max(
    theme.graphics.coreDashBMin,
    theme.graphics.coreDashBScale * layout.scale
  );
  const spokeWidthLarge = Math.max(
    theme.graphics.spokeLargeMin,
    theme.graphics.spokeLargeScale * layout.scale
  );
  const spokeWidthSmall = Math.max(
    theme.graphics.spokeSmallMin,
    theme.graphics.spokeSmallScale * layout.scale
  );

  elements.push(
    makeGraphicCircle(
      layout.center.x,
      layout.center.y,
      layout.outerBackdropRadius,
      theme.graphics.outerBackdropFill,
      theme.graphics.outerBackdropStroke,
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
      theme.graphics.outerAccentStroke,
      1
    )
  );

  layout.bands.forEach((band) => {
    const bandTheme = theme.bands[band.tier];

    elements.push(
      makeGraphicCircle(
        layout.center.x,
        layout.center.y,
        band.radius,
        "transparent",
        bandTheme.fillColor,
        band.width
      )
    );
    elements.push(
      makeGraphicCircle(
        layout.center.x,
        layout.center.y,
        band.radius,
        "transparent",
        bandTheme.ringColor,
        Math.max(
          theme.graphics.bandRingLineMin,
          theme.graphics.bandRingLineScale * layout.scale
        ),
        { style: { lineDash: [dashA, dashB] } }
      )
    );
    elements.push(
      makeGraphicCircle(
        layout.center.x,
        layout.center.y,
        band.radius - band.width / 2,
        "transparent",
        theme.graphics.bandEdgeInner,
        1
      )
    );
    elements.push(
      makeGraphicCircle(
        layout.center.x,
        layout.center.y,
        band.radius + band.width / 2,
        "transparent",
        theme.graphics.bandEdgeOuter,
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
      theme.graphics.coreOrbit1Stroke,
      1.1
    )
  );
  elements.push(
    makeGraphicCircle(
      layout.center.x,
      layout.center.y,
      layout.coreOrbitRadii[1],
      "transparent",
      theme.graphics.coreOrbit2Stroke,
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
      theme.graphics.coreOrbit3Stroke,
      1,
      {
        style: {
          lineDash: [
            Math.max(
              theme.graphics.coreOrbit3DashAMin,
              theme.graphics.coreOrbit3DashAScale * layout.scale
            ),
            Math.max(
              theme.graphics.coreOrbit3DashBMin,
              theme.graphics.coreOrbit3DashBScale * layout.scale
            )
          ]
        }
      }
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
        stroke: theme.graphics.coreSpokeStroke,
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
      theme.graphics.coreRingOuterStroke,
      Math.max(
        theme.graphics.coreRingOuterLineMin,
        theme.graphics.coreRingOuterLineScale * layout.scale
      ),
      { style: { lineDash: [coreDashA, coreDashB] } }
    )
  );
  elements.push(
    makeGraphicCircle(
      layout.center.x,
      layout.center.y,
      layout.coreRingInner,
      "transparent",
      theme.graphics.coreRingInnerStroke,
      Math.max(
        theme.graphics.coreRingInnerLineMin,
        theme.graphics.coreRingInnerLineScale * layout.scale
      ),
      {
        style: {
          lineDash: [
            Math.max(
              theme.graphics.coreRingInnerDashAMin,
              theme.graphics.coreRingInnerDashAScale * layout.scale
            ),
            Math.max(
              theme.graphics.coreRingInnerDashBMin,
              theme.graphics.coreRingInnerDashBScale * layout.scale
            )
          ]
        }
      }
    )
  );

  return elements;
}

function gradientForCenterNode(color, theme) {
  return new echarts.graphic.RadialGradient(0.5, 0.42, 0.74, [
    { offset: 0, color: theme.nodes.centerGradientStop1 },
    { offset: 0.24, color: theme.nodes.centerGradientStop2 },
    { offset: 0.58, color: color },
    { offset: 1, color: theme.nodes.centerGradientStop4 }
  ]);
}

function buildNodeSeries(data, isCenter, theme) {
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
      const nodeTheme = theme.nodes;
      const posTypography = isCenter
        ? theme.typography.pos.center
        : theme.typography.pos.outer;
      const gradeTypography = isCenter
        ? theme.typography.grade.center
        : theme.typography.grade.outer;
      const strokeWidth = isCenter
        ? Math.max(
            nodeTheme.shellStrokeWidthCenterMin,
            item.nodeRadius * nodeTheme.shellStrokeWidthCenterFactor
          )
        : Math.max(
            nodeTheme.shellStrokeWidthOuterMin,
            item.nodeRadius * nodeTheme.shellStrokeWidthOuterFactor
          );

      const children = [
        {
          type: "circle",
          shape: { cx: x, cy: y, r: item.haloRadius },
          silent: true,
          style: {
            fill: item.color,
            opacity: isCenter ? nodeTheme.haloOpacityCenter : nodeTheme.haloOpacityOuter,
            shadowBlur: isCenter ? nodeTheme.haloBlurCenter : nodeTheme.haloBlurOuter,
            shadowColor: item.color
          }
        },
        {
          type: "circle",
          shape: { cx: x, cy: y, r: item.shellRadius },
          silent: true,
          style: {
            fill: isCenter ? nodeTheme.shellFillCenter : nodeTheme.shellFillOuter,
            stroke: isCenter ? nodeTheme.shellStrokeCenter : item.color,
            lineWidth: strokeWidth
          }
        },
        {
          type: "circle",
          shape: { cx: x, cy: y, r: item.coreRadius },
          silent: true,
          style: {
            fill: isCenter
              ? gradientForCenterNode(item.color, theme)
              : nodeTheme.coreFillOuter,
            stroke: isCenter ? item.color : nodeTheme.coreStrokeOuter,
            lineWidth: isCenter
              ? Math.max(
                  nodeTheme.coreStrokeWidthCenterMin,
                  item.nodeRadius * nodeTheme.coreStrokeWidthCenterFactor
                )
              : nodeTheme.coreStrokeWidthOuter
          }
        }
      ];

      if (isCenter) {
        children.push({
          type: "circle",
          shape: { cx: x, cy: y, r: item.innerRadius },
          silent: true,
          style: {
            fill: nodeTheme.innerFillCenter,
            stroke: nodeTheme.innerStrokeCenter,
            lineWidth: nodeTheme.innerStrokeWidthCenter
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
            font: `${posTypography.weight} ${item.posFontSize}px ${theme.fontFamily}`,
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
            fill: theme.text.strong,
            font: `${gradeTypography.weight} ${item.gradeFontSize}px ${theme.fontFamily}`,
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
            fill: theme.text.name,
            font: `${theme.typography.name.weight} ${item.nameFontSize}px ${theme.fontFamily}`,
            padding: isCenter
              ? nodeTheme.nameChipPaddingCenter
              : nodeTheme.nameChipPaddingOuter,
            backgroundColor: isCenter
              ? nodeTheme.nameChipBgCenter
              : nodeTheme.nameChipBgOuter,
            borderColor: echarts.color.modifyAlpha(
              item.color,
              isCenter
                ? nodeTheme.nameChipBorderAlphaCenter
                : nodeTheme.nameChipBorderAlphaOuter
            ),
            borderWidth: nodeTheme.nameChipBorderWidth,
            borderRadius: nodeTheme.nameChipBorderRadius,
            shadowBlur: isCenter
              ? nodeTheme.nameChipShadowBlurCenter
              : nodeTheme.nameChipShadowBlurOuter,
            shadowColor: echarts.color.modifyAlpha(
              item.color,
              isCenter
                ? nodeTheme.nameChipShadowAlphaCenter
                : nodeTheme.nameChipShadowAlphaOuter
            ),
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
          <div style="font-family:${theme.fontFamily}; min-width:128px;">
            <div style="font-size:13px; font-weight:700; margin-bottom:5px;">${item.name}</div>
            <div style="font-size:11px; color:${theme.tooltip.muted};">${tierMeta[item.tier].label} · ${item.pos}</div>
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

  const theme = readChartTheme();
  const layout = computeLayout(width, height, theme);

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
        backgroundColor: theme.tooltip.background,
        borderColor: theme.tooltip.border,
        borderWidth: 1,
        textStyle: {
          color: theme.text.strong,
          fontFamily: theme.fontFamily
        },
        extraCssText:
          `box-shadow:${theme.tooltip.shadow}; border-radius:${theme.tooltip.radius}; padding:${theme.tooltip.padding};`
      },
      graphic: buildGraphic(layout, theme),
      series: [
        {
          type: "lines",
          coordinateSystem: "cartesian2d",
          polyline: false,
          silent: true,
          z: 2,
          data: buildConnectorData(layout, theme)
        },
        buildNodeSeries(layout.outerPlayers, false, theme),
        buildNodeSeries([layout.centerPlayer], true, theme)
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
