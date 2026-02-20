import type { ThemeConfig } from './types';

export const kami: ThemeConfig = {
    id: 'kami',
    name: 'Kami',
    nameKanji: '紙',
    description: 'Warm cream, aged paper, dark ink text, wax-seal accents. A sunlit reading desk.',
    decorations: {
        cardSpineEffect: true,
        sectionTitlePrefix: 'dash',
        dividerStyle: 'line',
        pageGrainTexture: true
    },
    layout: {
        cardFocus: 'soft',
        componentVariant: 'rounded',
        listVariant: 'gap',
        navDesign: {
            mobile: 'bottom',
            tablet: 'side',
            desktop: 'side'
        }
    }
};
