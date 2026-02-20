import type { ThemeConfig } from './types';

export const sumi: ThemeConfig = {
    id: 'sumi',
    name: 'Sumi',
    nameKanji: '墨',
    description: 'Deep blacks, warm whites, vermillion red. The scholar\'s midnight desk.',
    decorations: {
        heroTopOrnament: true,
        heroBottomOrnament: true,
        cardTopAccent: true,
        sectionTitlePrefix: 'line',
        dividerStyle: 'line',
        ambientPattern: true,
        pageGlow: 'radial-red'
    },
    layout: {
        cardFocus: 'sharp',
        componentVariant: 'sharp',
        listVariant: 'border',
        navDesign: {
            mobile: 'bottom',
            tablet: 'top',
            desktop: 'top'
        }
    }
};
