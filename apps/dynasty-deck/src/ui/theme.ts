import { createTheme, MantineColorsTuple } from '@mantine/core';
import { themeDarkColors } from '@cortexa/ui';

// Ancient (earth / bronze)
export const ancientColors: MantineColorsTuple = [
    '#2b2118','#3a2a1e','#4a3323','#5a3d28','#6b472d',
    '#a67c52',
    '#b68d65','#c79f7a','#d7b18f','#e6c3a6'
];

// Imperial (gold / authority)
export const imperialColors: MantineColorsTuple = [
    '#2a1f10','#3a2a14','#4a3518','#5a401c','#6b4c20',
    '#c9a227',
    '#d4b13f','#dfc058','#e9cf72','#f2de8d'
];

// Division (cold / fractured)
export const divisionColors: MantineColorsTuple = [
    '#1f2328','#2a2f36','#353b44','#404753','#4b5361',
    '#6c7a89',
    '#8090a0','#95a6b7','#abbccc','#c2d2e1'
];

// Reunification (flourishing)
export const reunificationColors: MantineColorsTuple = [
    '#1f2a1f','#2a3a2a','#354a35','#405a40','#4b6b4b',
    '#5f9f6f',
    '#74af82','#8abf96','#a1cfaa','#b8dfbf'
];

// Fragmentation (chaotic / transition)
export const fragmentationColors: MantineColorsTuple = [
    '#2a1f1f','#3a2a2a','#4a3535','#5a4040','#6b4b4b',
    '#a65f5f',
    '#b87171','#c98383','#da9696','#eba9a9'
];

// Later Imperial (refined / stable)
export const laterImperialColors: MantineColorsTuple = [
    '#1f2530','#2a3140','#353d50','#404960','#4b5570',
    '#5b7db1',
    '#6f8fc0','#84a1ce','#9ab3dc','#b1c6ea'
];

// Post-Imperial (modern)
export const postImperialColors: MantineColorsTuple = [
    '#1f1f2a','#2a2a3a','#35354a','#40405a','#4b4b6b',
    '#7a7ae6',
    '#8c8cf0','#9f9ff5','#b3b3fa','#c7c7ff'
];

export const themeColors: MantineColorsTuple = [
    '#2b2118',
    '#3a2a1e',
    '#4a3323',
    '#5a3d28',
    '#6b472d',
    '#cd853f', // base (Peru, for accents)
    '#d99657',
    '#e3a871',
    '#ecbb8c',
    '#f4cda8',
];

export const dynastyDeckTheme = createTheme({
    colors: {
        theme: themeColors,
        dark: themeDarkColors,
    },
    primaryColor: 'theme',
    defaultRadius: 'xs',
});