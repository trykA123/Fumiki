import { sumi } from './sumi';
import { kami } from './kami';
import { mori } from './mori';
import type { ThemeConfig } from './types';

export const themes: Record<ThemeConfig['id'], ThemeConfig> = {
    sumi,
    kami,
    mori
};

export type { ThemeConfig, ThemeDecorations, ThemeLayout } from './types';
