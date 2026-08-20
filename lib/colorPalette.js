// Fixed decorative palette for elements that are NOT part of the admin
// theme system (WebsiteSettings/Theme only controls primary/secondary/accent
// etc.). Nav dropdown items, the homepage quick-link button row, and the
// info-grid category cards each show many colors at once, so they cycle
// through this curated Material-Design palette instead. Order matches the
// reference homepage design.
export const CATEGORY_PALETTE = [
  '#C62828', // Red 800
  '#6A1B9A', // Purple 800
  '#1565C0', // Blue 800
  '#2E7D32', // Green 800
  '#E65100', // Orange 900
  '#00695C', // Teal 800
  '#827717', // Lime 900
  '#4527A0', // Deep Purple 800
  '#37474F', // Blue Grey 800
  '#1B5E20', // Green 900
  '#4E342E', // Brown 800
  '#880E4F', // Pink 900
  '#0277BD', // Light Blue 800
  '#558B2F', // Light Green 800
];

// Same palette, reordered so it lines up with the reference design's exact
// nav-item sequence (About, Academic, Administration, Admission, Gallery, ...).
export const NAV_PALETTE = [
  '#6A1B9A', // Purple 800   — প্রতিষ্ঠান পরিচিতি
  '#1565C0', // Blue 800     — একাডেমিক
  '#C62828', // Red 800      — প্রশাসন
  '#E65100', // Orange 900   — ভর্তি
  '#00695C', // Teal 800     — গ্যালারি
  '#4527A0', // Deep Purple  — পরীক্ষা
  '#2E7D32', // Green 800    — নোটিশ
  '#37474F', // Blue Grey    — যোগাযোগ
  '#558B2F', // Light Green 800 (overflow items continue the cycle)
  '#880E4F', // Pink 900
  '#0277BD', // Light Blue 800
  '#827717', // Lime 900
  '#4E342E', // Brown 800
  '#1B5E20', // Green 900
];

export function paletteColor(index) {
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
}

export function navPaletteColor(index) {
  return NAV_PALETTE[index % NAV_PALETTE.length];
}
