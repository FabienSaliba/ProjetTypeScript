import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GareApi } from './gareApi';
import { GareResume } from './gareResume';

@Injectable()
export class GareService implements OnModuleInit {
    private gares: Map<string, GareResume>;


    constructor(private readonly httpService: HttpService) {
        this.gares = new Map();

    }

    addGare(gare: GareResume) {
        this.gares.set(gare.id, gare);
    }

    getGareById(id: string): GareResume | undefined {
        return this.gares.get(id);
    }

    getResumeGares(): GareResume[] {
        return Array.from(this.gares.values());
    }

    getTotalNumberOfGares(): number {
        return this.gares.size;
    }

    setFavorite(id: string, favorite: boolean): boolean {
        const gare = this.gares.get(id);
        if (!gare) return false;
        gare.favorite = favorite;
        this.gares.set(id, gare);
        return true;
    }

    async onModuleInit() {
        await this.loadGaresFromAPI(
            'https://data.sncf.com/api/explore/v2.1/catalog/datasets/gares-de-voyageurs/records?limit=100',
        );
    }

    private async loadGaresFromAPI(url: string) {
        try {
            const response = await firstValueFrom(
                this.httpService.get<{ results: GareApi[] }>(url),
            );

            response.data.results.forEach(gare => {
                const gareR: GareResume = {
                    id: gare.codes_uic,
                    name: gare.nom,
                    latitude: gare.position_geographique.lat,
                    longitude: gare.position_geographique.lon,
                    favorite: false,
                };
                this.addGare(gareR);
            });

        } catch (error) {
            console.error(error);
        }
    }

    private normalize(text: string): string {
        return (text || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // supprime accents
    }

    searchGares(term: string): GareResume[] {
        const t = this.normalize(term);
        const results = Array.from(this.gares.values()).filter(g =>
            this.normalize(g.name).includes(t) || g.id.includes(term)
        );
        console.log(`[searchGares] term="${term}" -> ${results.length} résultat(s)`);
        return results;
    }
}