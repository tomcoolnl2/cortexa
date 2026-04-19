
export type DynastyId = string;

export type DynastyFounder = { 
    name: string; 
    avatar: URL['href'];
}

export type Dynasty = {
    id: DynastyId;
    name: string;
    era: DynastyEra;
    eraIndex: number; // for UI grouping
    founder: DynastyFounder;
    capital: string;
    facts: string[];
    start: number;
    end: number;
    precededBy?: DynastyId;
    followedBy?: DynastyId;
};

export enum DynastyEra { 
    Ancient = 'Early & Ancient China', 
    Imperial = 'Imperial China (Unified Dynasties)', 
    Division = 'Period of Division', 
    Reunification = 'Reunification & Golden Ages', 
    Fragmentation = 'Fragmentation Again', 
    LaterImperial = 'Later Imperial Dynasties',
    PostImperial = 'Post-Imperial',
}

export const eraIndexMap: Record<DynastyEra, number> = {
    [DynastyEra.Ancient]: 0,
    [DynastyEra.Imperial]: 1,
    [DynastyEra.Division]: 2,
    [DynastyEra.Reunification]: 3,
    [DynastyEra.Fragmentation]: 4,
    [DynastyEra.LaterImperial]: 5,
    [DynastyEra.PostImperial]: 6,
};