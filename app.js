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
      gradientStartAlpha: readCssNumber(
        styles,
        "--connector-gradient-start-alpha",
        0.04
      ),
      gradientMidAlpha: readCssNumber(
        styles,
        "--connector-gradient-mid-alpha",
        0.46
      ),
      gradientEndAlpha: readCssNumber(
        styles,
        "--connector-gradient-end-alpha",
        0.96
      ),
      gradientTailAlpha: readCssNumber(
        styles,
        "--connector-gradient-tail-alpha",
        0.38
      ),
      highlightWidthFactor: readCssNumber(
        styles,
        "--connector-highlight-width-factor",
        0.42
      ),
      highlightStartAlpha: readCssNumber(
        styles,
        "--connector-highlight-start-alpha",
        0.02
      ),
      highlightMidAlpha: readCssNumber(
        styles,
        "--connector-highlight-mid-alpha",
        0.18
      ),
      highlightEndAlpha: readCssNumber(
        styles,
        "--connector-highlight-end-alpha",
        0.42
      ),
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
      haloBlurByTier: {
        2: readCssNumber(
          styles,
          "--chart-node-halo-blur-tier-2",
          readCssNumber(styles, "--chart-node-halo-blur-outer", 18)
        ),
        3: readCssNumber(
          styles,
          "--chart-node-halo-blur-tier-3",
          readCssNumber(styles, "--chart-node-halo-blur-outer", 18)
        ),
        4: readCssNumber(
          styles,
          "--chart-node-halo-blur-tier-4",
          readCssNumber(styles, "--chart-node-halo-blur-outer", 18)
        )
      },
      haloSpread: {
        center: {
          min: readCssNumber(styles, "--chart-node-halo-spread-center-min", 16),
          scale: readCssNumber(styles, "--chart-node-halo-spread-center-scale", 34)
        },
        2: {
          min: readCssNumber(styles, "--chart-node-halo-spread-tier-2-min", 7),
          scale: readCssNumber(styles, "--chart-node-halo-spread-tier-2-scale", 15)
        },
        3: {
          min: readCssNumber(styles, "--chart-node-halo-spread-tier-3-min", 7),
          scale: readCssNumber(styles, "--chart-node-halo-spread-tier-3-scale", 15)
        },
        4: {
          min: readCssNumber(styles, "--chart-node-halo-spread-tier-4-min", 7),
          scale: readCssNumber(styles, "--chart-node-halo-spread-tier-4-scale", 15)
        }
      },
      shellFillCenter: readCssVar(
        styles,
        "--chart-node-shell-fill-center",
        "rgba(255,255,255,0.04)"
      ),
      fillByTier: {
        2: readCssVar(styles, "--chart-node-fill-tier-2", "#8d63ff18"),
        3: readCssVar(styles, "--chart-node-fill-tier-3", "#25f4c518"),
        4: readCssVar(styles, "--chart-node-fill-tier-4", "#48d1ff18")
      },
      outerFillAlpha: readCssNumber(styles, "--chart-node-fill-outer-alpha", 0.1),
      sphereShadowFill: readCssVar(
        styles,
        "--chart-node-sphere-shadow-fill",
        "rgba(4,10,24,0.48)"
      ),
      sphereShadowOffsetCenter: readCssNumber(
        styles,
        "--chart-node-sphere-shadow-offset-center",
        0.08
      ),
      sphereShadowOffsetOuter: readCssNumber(
        styles,
        "--chart-node-sphere-shadow-offset-outer",
        0.12
      ),
      shellHighlightAlpha: {
        center: readCssNumber(
          styles,
          "--chart-node-shell-highlight-alpha-center",
          0.2
        ),
        outer: readCssNumber(
          styles,
          "--chart-node-shell-highlight-alpha-outer",
          0.12
        )
      },
      shellEdgeAlpha: {
        center: readCssNumber(styles, "--chart-node-shell-edge-alpha-center", 0.42),
        outer: readCssNumber(styles, "--chart-node-shell-edge-alpha-outer", 0.3)
      },
      rim: {
        alpha: {
          center: readCssNumber(styles, "--chart-node-rim-alpha-center", 0.96),
          outer: readCssNumber(styles, "--chart-node-rim-alpha-outer", 0.88)
        },
        width: {
          center: {
            min: readCssNumber(
              styles,
              "--chart-node-rim-width-center-min",
              2.4
            ),
            factor: readCssNumber(
              styles,
              "--chart-node-rim-width-center-factor",
              0.082
            )
          },
          outer: {
            min: readCssNumber(styles, "--chart-node-rim-width-outer-min", 1.2),
            factor: readCssNumber(
              styles,
              "--chart-node-rim-width-outer-factor",
              0.094
            )
          }
        },
        innerColor: readCssVar(
          styles,
          "--chart-node-inner-rim-color",
          "rgba(255,255,255,1)"
        ),
        innerAlpha: {
          center: readCssNumber(
            styles,
            "--chart-node-inner-rim-alpha-center",
            0.18
          ),
          outer: readCssNumber(
            styles,
            "--chart-node-inner-rim-alpha-outer",
            0.12
          )
        },
        innerWidth: {
          center: readCssNumber(
            styles,
            "--chart-node-inner-rim-width-center",
            1.35
          ),
          outer: readCssNumber(
            styles,
            "--chart-node-inner-rim-width-outer",
            0.9
          )
        }
      },
      sphereEdgeShadow: readCssVar(
        styles,
        "--chart-node-sphere-edge-shadow",
        "rgba(6,10,24,0.94)"
      ),
      sphereSpecularCore: readCssVar(
        styles,
        "--chart-node-sphere-specular-core",
        "rgba(255,255,255,0.98)"
      ),
      sphereSpecularSoft: readCssVar(
        styles,
        "--chart-node-sphere-specular-soft",
        "rgba(255,255,255,0.46)"
      ),
      sphereSpecularGlint: readCssVar(
        styles,
        "--chart-node-sphere-specular-glint",
        "rgba(255,255,255,0.72)"
      ),
      sphereHighlightFade: readCssVar(
        styles,
        "--chart-node-sphere-highlight-fade",
        "rgba(255,255,255,0)"
      ),
      sphereColorAlphaInner: readCssNumber(
        styles,
        "--chart-node-sphere-color-alpha-inner",
        0.22
      ),
      sphereColorAlphaMid: readCssNumber(
        styles,
        "--chart-node-sphere-color-alpha-mid",
        0.58
      ),
      sphereColorAlphaEdge: readCssNumber(
        styles,
        "--chart-node-sphere-color-alpha-edge",
        0.96
      ),
      specular: {
        offset: {
          center: {
            x: readCssNumber(
              styles,
              "--chart-node-specular-offset-x-center",
              -0.22
            ),
            y: readCssNumber(
              styles,
              "--chart-node-specular-offset-y-center",
              -0.32
            )
          },
          outer: {
            x: readCssNumber(
              styles,
              "--chart-node-specular-offset-x-outer",
              -0.2
            ),
            y: readCssNumber(
              styles,
              "--chart-node-specular-offset-y-outer",
              -0.3
            )
          }
        },
        radius: {
          center: readCssNumber(
            styles,
            "--chart-node-specular-radius-center",
            0.56
          ),
          outer: readCssNumber(
            styles,
            "--chart-node-specular-radius-outer",
            0.48
          )
        },
        opacity: {
          center: readCssNumber(
            styles,
            "--chart-node-specular-opacity-center",
            0.34
          ),
          outer: readCssNumber(
            styles,
            "--chart-node-specular-opacity-outer",
            0.26
          )
        }
      },
      glint: {
        offset: {
          center: {
            x: readCssNumber(
              styles,
              "--chart-node-glint-offset-x-center",
              -0.13
            ),
            y: readCssNumber(
              styles,
              "--chart-node-glint-offset-y-center",
              -0.38
            )
          },
          outer: {
            x: readCssNumber(
              styles,
              "--chart-node-glint-offset-x-outer",
              -0.12
            ),
            y: readCssNumber(
              styles,
              "--chart-node-glint-offset-y-outer",
              -0.36
            )
          }
        },
        size: {
          center: readCssNumber(styles, "--chart-node-glint-size-center", 0.15),
          outer: readCssNumber(styles, "--chart-node-glint-size-outer", 0.12)
        },
        alpha: {
          center: readCssNumber(styles, "--chart-node-glint-alpha-center", 0.72),
          outer: readCssNumber(styles, "--chart-node-glint-alpha-outer", 0.58)
        }
      },
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
      stackGap: {
        center: readCssNumber(styles, "--chart-pos-grade-gap-center", 1.6),
        outer: readCssNumber(styles, "--chart-pos-grade-gap-outer", 1.2)
      },
      posLift: {
        center: readCssNumber(styles, "--chart-pos-label-lift-center", 0),
        outer: readCssNumber(styles, "--chart-pos-label-lift-outer", 0)
      },
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
          max: readCssNumber(styles, "--chart-pos-font-max-outer", 8.7),
          bumpByTier: {
            2: readCssNumber(styles, "--chart-pos-font-bump-tier-2", 0),
            3: readCssNumber(styles, "--chart-pos-font-bump-tier-3", 0),
            4: readCssNumber(styles, "--chart-pos-font-bump-tier-4", 0)
          }
        }
      },
      posShadow: {
        color: readCssVar(
          styles,
          "--chart-pos-shadow-color",
          "rgba(0,0,0,0.58)"
        ),
        blur: {
          center: readCssNumber(
            styles,
            "--chart-pos-shadow-blur-center",
            3.2
          ),
          outer: readCssNumber(
            styles,
            "--chart-pos-shadow-blur-outer",
            2.2
          )
        },
        offsetX: readCssNumber(styles, "--chart-pos-shadow-offset-x", 0),
        offsetY: readCssNumber(styles, "--chart-pos-shadow-offset-y", 0.7)
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
          max: readCssNumber(styles, "--chart-grade-font-max-outer", 13.4),
          bumpByTier: {
            2: readCssNumber(styles, "--chart-grade-font-bump-tier-2", 0),
            3: readCssNumber(styles, "--chart-grade-font-bump-tier-3", 0),
            4: readCssNumber(styles, "--chart-grade-font-bump-tier-4", 0)
          }
        }
      },
      gradeShadow: {
        centerColor: readCssVar(
          styles,
          "--chart-grade-shadow-color-center",
          "rgba(0,0,0,0.66)"
        ),
        centerBlur: readCssNumber(
          styles,
          "--chart-grade-shadow-blur-center",
          4.4
        ),
        centerOffsetX: readCssNumber(
          styles,
          "--chart-grade-shadow-offset-x-center",
          0
        ),
        centerOffsetY: readCssNumber(
          styles,
          "--chart-grade-shadow-offset-y-center",
          0.9
        ),
        centerUnderlayColor: readCssVar(
          styles,
          "--chart-grade-underlay-color-center",
          "rgba(13,6,27,0.92)"
        ),
        centerUnderlaySizeBump: readCssNumber(
          styles,
          "--chart-grade-underlay-size-bump-center",
          1.5
        ),
        centerUnderlayOffsetX: readCssNumber(
          styles,
          "--chart-grade-underlay-offset-x-center",
          0.15
        ),
        centerUnderlayOffsetY: readCssNumber(
          styles,
          "--chart-grade-underlay-offset-y-center",
          0.8
        )
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

function getHaloRadius(player, nodeRadius, scale, theme) {
  if (player.tier === 1) {
    const centerHalo = theme.nodes.haloSpread.center;

    return nodeRadius + Math.max(centerHalo.min, centerHalo.scale * scale);
  }

  const tierHalo = theme.nodes.haloSpread[player.tier];

  return nodeRadius + Math.max(tierHalo.min, tierHalo.scale * scale);
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
    const posFontBump =
      !isCenter && posType.bumpByTier ? posType.bumpByTier[player.tier] || 0 : 0;
    const gradeFontBump =
      !isCenter && gradeType.bumpByTier
        ? gradeType.bumpByTier[player.tier] || 0
        : 0;
    const posFontSize =
      clamp(nodeRadius * posType.factor, posType.min, posType.max) + posFontBump;
    const gradeFontSize =
      clamp(nodeRadius * gradeType.factor, gradeType.min, gradeType.max) +
      gradeFontBump;
    const posGradeGap = isCenter
      ? theme.typography.stackGap.center
      : theme.typography.stackGap.outer;
    const gradeOffsetY = isCenter ? -nodeRadius * 0.01 : nodeRadius * 0.04;
    const posVisualHeight = posFontSize * (isCenter ? 0.58 : 0.54);
    const gradeVisualHeight = gradeFontSize * (isCenter ? 0.62 : 0.58);
    const posGradeSeparation = Math.round(
      (posVisualHeight + gradeVisualHeight) / 2 + posGradeGap
    );
    const posOffsetY =
      gradeOffsetY -
      posGradeSeparation -
      (isCenter ? theme.typography.posLift.center : theme.typography.posLift.outer);

    return {
      ...player,
      color: theme.tiers[player.tier].color,
      posColor: theme.positions[player.pos],
      x: center.x + (player.x - REFERENCE_CENTER_X) * scale,
      y: center.y + (player.y - REFERENCE_CENTER_Y) * scale,
      nodeRadius,
      haloRadius: getHaloRadius(player, nodeRadius, scale, theme),
      shellRadius: isCenter ? nodeRadius + Math.max(7, 10 * scale) : nodeRadius,
      innerRadius: isCenter ? Math.max(14, nodeRadius - Math.max(4, 14 * scale)) : 0,
      posFontSize,
      gradeFontSize,
      posGradeSeparation,
      nameFontSize: isCenter
        ? clamp(nodeRadius * nameType.factor, nameType.min, nameType.max)
        : getOuterNameSize(player, nodeRadius, theme),
      posOffsetY,
      gradeOffsetY,
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

function makeConnectorGradient(start, end, color, theme, isHighlight = false) {
  if (isHighlight) {
    return new echarts.graphic.LinearGradient(
      start[0],
      start[1],
      end[0],
      end[1],
      [
        {
          offset: 0,
          color: echarts.color.modifyAlpha(
            theme.text.strong,
            theme.connectors.highlightStartAlpha
          )
        },
        {
          offset: 0.36,
          color: echarts.color.modifyAlpha(
            theme.text.strong,
            theme.connectors.highlightMidAlpha
          )
        },
        {
          offset: 0.84,
          color: echarts.color.modifyAlpha(color, theme.connectors.highlightEndAlpha)
        },
        {
          offset: 1,
          color: echarts.color.modifyAlpha(color, 0)
        }
      ],
      true
    );
  }

  return new echarts.graphic.LinearGradient(
    start[0],
    start[1],
    end[0],
    end[1],
    [
      {
        offset: 0,
        color: echarts.color.modifyAlpha(
          theme.text.strong,
          theme.connectors.gradientStartAlpha
        )
      },
      {
        offset: 0.24,
        color: echarts.color.modifyAlpha(
          theme.text.strong,
          theme.connectors.gradientStartAlpha * 0.72
        )
      },
      {
        offset: 0.52,
        color: echarts.color.modifyAlpha(color, theme.connectors.gradientMidAlpha)
      },
      {
        offset: 0.86,
        color: echarts.color.modifyAlpha(color, theme.connectors.gradientEndAlpha)
      },
      {
        offset: 1,
        color: echarts.color.modifyAlpha(color, theme.connectors.gradientTailAlpha)
      }
    ],
    true
  );
}

function gradientForGlassShell(color, fillColor, theme, isCenter) {
  const highlightAlpha = isCenter
    ? theme.nodes.shellHighlightAlpha.center
    : theme.nodes.shellHighlightAlpha.outer;
  const edgeAlpha = isCenter
    ? theme.nodes.shellEdgeAlpha.center
    : theme.nodes.shellEdgeAlpha.outer;

  return new echarts.graphic.RadialGradient(0.28, 0.24, 1, [
    {
      offset: 0,
      color: echarts.color.modifyAlpha(theme.text.strong, highlightAlpha)
    },
    {
      offset: 0.22,
      color: echarts.color.modifyAlpha(color, theme.nodes.sphereColorAlphaInner * 0.52)
    },
    { offset: 0.74, color: fillColor },
    {
      offset: 1,
      color: echarts.color.modifyAlpha(color, edgeAlpha)
    }
  ]);
}

function gradientForOuterNode(color, fillColor, theme) {
  return new echarts.graphic.RadialGradient(0.34, 0.26, 0.94, [
    {
      offset: 0,
      color: echarts.color.modifyAlpha(theme.text.strong, 0.12)
    },
    {
      offset: 0.16,
      color: echarts.color.modifyAlpha(color, theme.nodes.sphereColorAlphaInner)
    },
    {
      offset: 0.48,
      color: echarts.color.modifyAlpha(color, theme.nodes.sphereColorAlphaMid)
    },
    { offset: 0.8, color: fillColor },
    {
      offset: 0.96,
      color: echarts.color.modifyAlpha(color, theme.nodes.sphereColorAlphaEdge)
    },
    { offset: 1, color: theme.nodes.sphereEdgeShadow }
  ]);
}

function gradientForHighlight(theme, isCenter) {
  return new echarts.graphic.RadialGradient(0.34, 0.28, 1, [
    {
      offset: 0,
      color: echarts.color.modifyAlpha(
        theme.nodes.sphereSpecularCore,
        isCenter ? 0.54 : 0.42
      )
    },
    {
      offset: 0.34,
      color: echarts.color.modifyAlpha(
        theme.nodes.sphereSpecularSoft,
        isCenter ? 0.28 : 0.22
      )
    },
    { offset: 1, color: theme.nodes.sphereHighlightFade }
  ]);
}

function buildConnectorData(layout, theme, isHighlight = false) {
  return layout.outerPlayers.map((player) => {
    const direction = vectorFromAngle(player.angle);
    const connectorTheme = theme.connectors.tiers[player.tier];
    const nodeEdgePoint = [
      player.x - direction.x * player.shellRadius,
      player.y - direction.y * player.shellRadius
    ];

    return {
      coords: [
        [
          layout.center.x + direction.x * (layout.centerPlayer.nodeRadius + Math.max(8, 12 * layout.scale)),
          layout.center.y + direction.y * (layout.centerPlayer.nodeRadius + Math.max(8, 12 * layout.scale))
        ],
        nodeEdgePoint
      ],
      lineStyle: {
        color: makeConnectorGradient(
          [
            layout.center.x +
              direction.x * (layout.centerPlayer.nodeRadius + Math.max(8, 12 * layout.scale)),
            layout.center.y +
              direction.y * (layout.centerPlayer.nodeRadius + Math.max(8, 12 * layout.scale))
          ],
          nodeEdgePoint,
          connectorTheme.color,
          theme,
          isHighlight
        ),
        width:
          Math.max(
          connectorTheme.widthMin,
          connectorTheme.widthScale * layout.scale
        ) * (isHighlight ? theme.connectors.highlightWidthFactor : 1),
        opacity: isHighlight ? 1 : theme.connectors.opacity,
        shadowColor: connectorTheme.color,
        shadowBlur: isHighlight
          ? 0
          : Math.max(
              theme.connectors.shadowBlurMin,
              theme.connectors.shadowBlurScale * layout.scale
            ),
        cap: "round"
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
      1
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
  return new echarts.graphic.RadialGradient(0.3, 0.24, 1, [
    {
      offset: 0,
      color: echarts.color.modifyAlpha(theme.text.strong, 0.18)
    },
    { offset: 0.08, color: theme.nodes.centerGradientStop1 },
    { offset: 0.24, color: theme.nodes.centerGradientStop2 },
    {
      offset: 0.54,
      color: echarts.color.modifyAlpha(
        color,
        Math.max(0.68, theme.nodes.sphereColorAlphaMid)
      )
    },
    { offset: 0.8, color: color },
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
      const gradeTextY = Math.round(y + item.gradeOffsetY);
      const posLift = isCenter
        ? theme.typography.posLift.center
        : theme.typography.posLift.outer;
      const posTextY = Math.round(gradeTextY - item.posGradeSeparation - posLift);
      const nodeTheme = theme.nodes;
      const posTypography = isCenter
        ? theme.typography.pos.center
        : theme.typography.pos.outer;
      const gradeTypography = isCenter
        ? theme.typography.grade.center
        : theme.typography.grade.outer;
      const posShadow = {
        color: theme.typography.posShadow.color,
        blur: isCenter
          ? theme.typography.posShadow.blur.center
          : theme.typography.posShadow.blur.outer,
        offsetX: theme.typography.posShadow.offsetX,
        offsetY: theme.typography.posShadow.offsetY
      };
      const gradeShadow = {
        color: theme.typography.gradeShadow.centerColor,
        blur: theme.typography.gradeShadow.centerBlur,
        offsetX: theme.typography.gradeShadow.centerOffsetX,
        offsetY: theme.typography.gradeShadow.centerOffsetY
      };
      const rimWidth = isCenter
        ? Math.max(
            nodeTheme.rim.width.center.min,
            item.nodeRadius * nodeTheme.rim.width.center.factor
          )
        : Math.max(
            nodeTheme.rim.width.outer.min,
            item.nodeRadius * nodeTheme.rim.width.outer.factor
          );
      const shadowOffsetFactor = isCenter
        ? nodeTheme.sphereShadowOffsetCenter
        : nodeTheme.sphereShadowOffsetOuter;
      const shadowOffsetX = Math.round(item.nodeRadius * shadowOffsetFactor * 0.72);
      const shadowOffsetY = Math.round(item.nodeRadius * shadowOffsetFactor);
      const shellFill = isCenter
        ? nodeTheme.shellFillCenter
        : nodeTheme.fillByTier[item.tier] ||
          echarts.color.modifyAlpha(item.color, nodeTheme.outerFillAlpha);
      const bodyRadius = item.shellRadius - Math.max(0.7, rimWidth * 0.72);
      const coreFill = isCenter
        ? gradientForCenterNode(item.color, theme)
        : gradientForOuterNode(item.color, shellFill, theme);
      const innerRimAlpha = isCenter
        ? nodeTheme.rim.innerAlpha.center
        : nodeTheme.rim.innerAlpha.outer;
      const innerRimWidth = isCenter
        ? nodeTheme.rim.innerWidth.center
        : nodeTheme.rim.innerWidth.outer;
      const specularOffset = isCenter
        ? nodeTheme.specular.offset.center
        : nodeTheme.specular.offset.outer;
      const specularOpacity = isCenter
        ? nodeTheme.specular.opacity.center
        : nodeTheme.specular.opacity.outer;
      const highlightRadius =
        bodyRadius *
        (isCenter ? nodeTheme.specular.radius.center : nodeTheme.specular.radius.outer);
      const highlightX = x + bodyRadius * specularOffset.x;
      const highlightY = y + bodyRadius * specularOffset.y;
      const glintOffset = isCenter
        ? nodeTheme.glint.offset.center
        : nodeTheme.glint.offset.outer;
      const glintRadius =
        bodyRadius * (isCenter ? nodeTheme.glint.size.center : nodeTheme.glint.size.outer);
      const glintAlpha = isCenter
        ? nodeTheme.glint.alpha.center
        : nodeTheme.glint.alpha.outer;
      const glintX = x + bodyRadius * glintOffset.x;
      const glintY = y + bodyRadius * glintOffset.y;

      const children = [
        {
          type: "circle",
          shape: {
            cx: x + shadowOffsetX,
            cy: y + shadowOffsetY,
            r: item.shellRadius * (isCenter ? 1.08 : 1.05)
          },
          silent: true,
          style: {
            fill: nodeTheme.sphereShadowFill,
            opacity: isCenter ? 0.92 : 0.82
          }
        },
        {
          type: "circle",
          shape: { cx: x, cy: y, r: item.haloRadius },
          silent: true,
          style: {
            fill: item.color,
            opacity: isCenter ? nodeTheme.haloOpacityCenter : nodeTheme.haloOpacityOuter,
            shadowBlur: isCenter
              ? nodeTheme.haloBlurCenter
              : nodeTheme.haloBlurByTier[item.tier] ?? nodeTheme.haloBlurOuter,
            shadowColor: item.color
          }
        },
        {
          type: "circle",
          shape: { cx: x, cy: y, r: item.shellRadius },
          silent: true,
          style: {
            fill: gradientForGlassShell(item.color, shellFill, theme, isCenter)
          }
        },
        {
          type: "circle",
          shape: { cx: x, cy: y, r: item.shellRadius - rimWidth * 0.5 },
          silent: true,
          style: {
            stroke: echarts.color.modifyAlpha(
              item.color,
              isCenter ? nodeTheme.rim.alpha.center : nodeTheme.rim.alpha.outer
            ),
            lineWidth: rimWidth,
            fill: "transparent"
          }
        },
        {
          type: "circle",
          shape: { cx: x, cy: y, r: bodyRadius },
          silent: true,
          style: {
            fill: coreFill,
            stroke: "transparent",
            lineWidth: 0
          }
        },
        {
          type: "circle",
          shape: { cx: highlightX, cy: highlightY, r: highlightRadius },
          silent: true,
          style: {
            fill: gradientForHighlight(theme, isCenter),
            opacity: specularOpacity
          }
        },
        {
          type: "circle",
          shape: { cx: glintX, cy: glintY, r: glintRadius },
          silent: true,
          style: {
            fill: echarts.color.modifyAlpha(
              theme.nodes.sphereSpecularGlint,
              glintAlpha
            )
          }
        }
      ];

      if (isCenter) {
        children.push({
          type: "circle",
          shape: { cx: x, cy: y, r: item.innerRadius },
          silent: true,
          style: {
            fill: new echarts.graphic.RadialGradient(0.34, 0.28, 0.98, [
              {
                offset: 0,
                color: echarts.color.modifyAlpha(theme.text.strong, 0.14)
              },
              { offset: 0.26, color: nodeTheme.innerFillCenter },
              {
                offset: 1,
                color: echarts.color.modifyAlpha(item.color, 0.24)
              }
            ]),
            stroke: nodeTheme.innerStrokeCenter,
            lineWidth: nodeTheme.innerStrokeWidthCenter
          }
        });
      }

      children.push({
        type: "circle",
        shape: {
          cx: x,
          cy: y,
          r: bodyRadius + Math.max(0.2, rimWidth * 0.12)
        },
        silent: true,
        style: {
          stroke: echarts.color.modifyAlpha(
            nodeTheme.rim.innerColor,
            innerRimAlpha
          ),
          lineWidth: innerRimWidth,
          fill: "transparent"
        }
      });

      children.push(
        {
          type: "text",
          x,
          y: posTextY,
          silent: true,
          style: {
            text: item.pos,
            fill: item.posColor,
            font: `${posTypography.weight} ${item.posFontSize}px ${theme.fontFamily}`,
            shadowColor: posShadow.color,
            shadowBlur: posShadow.blur,
            shadowOffsetX: posShadow.offsetX,
            shadowOffsetY: posShadow.offsetY,
            textAlign: "center",
            textVerticalAlign: "middle"
          }
        },
        ...(isCenter
          ? [
              {
                type: "text",
                x: x + gradeShadow.centerUnderlayOffsetX,
                y: gradeTextY + gradeShadow.centerUnderlayOffsetY,
                silent: true,
                style: {
                  text: String(item.grade),
                  fill: gradeShadow.centerUnderlayColor,
                  font: `${gradeTypography.weight} ${
                    item.gradeFontSize + gradeShadow.centerUnderlaySizeBump
                  }px ${theme.fontFamily}`,
                  shadowColor: gradeShadow.color,
                  shadowBlur: gradeShadow.blur,
                  shadowOffsetX: gradeShadow.offsetX,
                  shadowOffsetY: gradeShadow.offsetY,
                  textAlign: "center",
                  textVerticalAlign: "middle"
                }
              }
            ]
          : []),
        {
          type: "text",
          x,
          y: gradeTextY,
          silent: true,
          style: {
            text: String(item.grade),
            fill: theme.text.strong,
            font: `${gradeTypography.weight} ${item.gradeFontSize}px ${theme.fontFamily}`,
            ...(isCenter
              ? {
                  shadowColor: gradeShadow.color,
                  shadowBlur: gradeShadow.blur * 0.45,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0.15
                }
              : {}),
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
        {
          type: "lines",
          coordinateSystem: "cartesian2d",
          polyline: false,
          silent: true,
          z: 3,
          data: buildConnectorData(layout, theme, true)
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
