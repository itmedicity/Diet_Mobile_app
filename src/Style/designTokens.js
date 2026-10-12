/*
    Design tokens shared by the redesigned mobile screens (login, dashboard, lists ...).
    One place for colour, type and shape so every screen reads as the same app.
    System fonts on purpose: ward phones on the hospital network may not reach a font server.
*/
export const COLORS = {
    ink: "#2A1038",        // text
    muted: "#5E4C6B",      // secondary text (7:1 on white)
    plum: "#6B2A8F",       // primary action, active state
    plumDark: "#55206F",   // pressed / hover
    wash: "#F1E6F8",       // page background behind white sheets
    surface: "#FBF8FD",    // quiet row / card background
    orchid: "#D9C3E8",     // inactive marks, focus halo
    line: "#E6DAEE",       // dividers, card outlines
    fieldBorder: "#B9A2CC",
    focus: "#C58AEA",
    success: "#2F7D4F",
    warning: "#8A5A00",
    error: "#B3261E",
    white: "#FFFFFF",
};

export const FONT = `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

export const RADIUS = { control: "12px", card: "16px", sheet: 28 };

// visible keyboard focus on anything tappable
export const focusRing = {
    "&:focus-visible": {
        outline: `3px solid ${COLORS.focus}`,
        outlineOffset: 2,
    },
};

// minimum comfortable touch target
export const TOUCH = 48;
