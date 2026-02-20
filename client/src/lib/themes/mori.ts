import type { ThemeConfig } from './types';

export const mori: ThemeConfig = {
    id: 'mori',
    name: 'Mori',
    nameKanji: '森',
    description: 'Deep greens, moss, warm wood tones, amber light through leaves.',
    decorations: {
        dividerStyle: 'dots',
        cardWoodTexture: true,
        pageGlow: 'radial-amber'
    },
    layout: {
        cardFocus: 'organic',
        componentVariant: 'organic',
        listVariant: 'loose',
        navDesign: {
            mobile: 'bottom',
            tablet: 'floating',
            desktop: 'floating'
        }
    }
};
