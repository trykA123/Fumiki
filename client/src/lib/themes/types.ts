export interface ThemeDecorations {
    heroTopOrnament?: boolean;
    heroBottomOrnament?: boolean;
    cardTopAccent?: boolean;
    cardSpineEffect?: boolean;
    sectionTitlePrefix?: string;
    dividerStyle: 'line' | 'dots' | 'space';
    pageGrainTexture?: boolean;
    cardWoodTexture?: boolean;
    ambientPattern?: boolean;
    pageGlow?: string;
}

export interface ThemeLayout {
    cardFocus: 'sharp' | 'soft' | 'organic';
    componentVariant: 'sharp' | 'rounded' | 'organic';
    listVariant: 'border' | 'gap' | 'loose';
    navDesign: {
        mobile: 'bottom';
        tablet: 'top' | 'side' | 'floating';
        desktop: 'top' | 'side' | 'floating';
    };
}

export interface ThemeConfig {
    id: 'sumi' | 'kami' | 'mori';
    name: string;
    nameKanji: string;
    description: string;
    decorations: ThemeDecorations;
    layout: ThemeLayout;
}
