
export const FRAME_CONFIG = {
  instax: {
    name: "Fujifilm Instax Mini",
    aspectRatio: 54 / 86, // width / height
    print: {
      width: 540,
      height: 860,
    },
    imageAreaPrint: {
      width: 460,
      height: 620
    },
    borderTop: 100 / 860,
    borderSides: 40 / 540,
    borderBottom: 140 / 860,
  },
  polaroid: {
    name: "Polaroid 600",
    aspectRatio: 88 / 107,
    print: {
      width: 880,
      height: 1070,
    },
    imageAreaPrint: {
      width: 790,
      height: 790,
    },
    borderTop: 40 / 1070,
    borderSides: 45 / 880,
    borderBottom: 240 / 1070,
  },
};

export type FrameType = keyof typeof FRAME_CONFIG;

export const IMAGE_FILTERS = {
  original: {
    name: "Original",
    value: "none",
  },
  bw: {
    name: "B&W",
    value: "grayscale(1) contrast(1.08)",
  },
  sepia: {
    name: "Sepia",
    value: "sepia(0.85) saturate(0.9) contrast(1.05)",
  },
  vintage: {
    name: "Vintage",
    value: "sepia(0.35) saturate(1.25) contrast(1.08) brightness(0.96)",
  },
  cool: {
    name: "Cool",
    value: "saturate(0.85) hue-rotate(12deg) brightness(1.04)",
  },
} as const;

export type ImageFilter = keyof typeof IMAGE_FILTERS;
