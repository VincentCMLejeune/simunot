export interface HeirShares {
    pleinePropriete: string;
    nuePropriete: string;
    usufruit: string;
}

export interface Heir {
    id: string;
    name: string;
    relationship: string;
    shares: HeirShares;
}

export interface SuccessionData {
    ayantsDroit: Heir[];
}
