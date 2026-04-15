import { MantineColorsTuple } from "@mantine/core";

export const themeColors: MantineColorsTuple = [
    '#fdfcf0',
    '#f6f2d6',
    '#ebe4b3',
    '#dfd58f',
    '#d4c871',
    '#cabd5c',
    '#b2a64f',
    '#948a41',
    '#766f34',
    '#5c5728',
];

export const themeDarkColors: MantineColorsTuple = [
    '#C1C2C5', // 0: Text color (brightest)
    '#A6A7AB', // 1: Secondary text
    '#909296', // 2: Disabled text, icons
    '#5c5f66', // 3: Borders, subtle separators
    '#373A40', // 4: Card backgrounds, hover
    '#2C2E33', // 5: Input backgrounds, UI elements
    '#232429', // 6: Sidebar, navbar backgrounds
    '#1A1B1E', // 7: Main background (single source of truth)
    '#141517', // 8: Deepest background, modals
    '#101113', // 9: Popovers, tooltips, overlays
];

export const COLORS = {
    background: themeDarkColors[7],
};