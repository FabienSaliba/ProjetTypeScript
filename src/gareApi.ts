export interface GareApi {
    nom: string;
    libellecourt: string;
    segment_drg: string;
    position_geographique: {
        lon: number;
        lat: number;
    };
    codeinsee: string;
    codes_uic: string;
}