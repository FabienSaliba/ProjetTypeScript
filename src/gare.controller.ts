import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import { GareService } from './gare.service';
import { GareResume } from './gareResume';
import {GareApi} from "./gareApi";

@Controller()
export class GareController {
    constructor(private readonly gareService: GareService) {}

    @Get('/gares')
    getAll(
        @Query('id') id?: string,
        @Query('term') term?: string,
    ): GareResume | GareResume[] {
        if (id) {
            return this.gareService.getGareById(id);
        } else if (term && term.trim().length > 0) {
            return this.gareService.searchGares(term);
        } else {
            return this.gareService.getResumeGares();
        }
    }

    // Ajouter une gare manuellement
    @Post('/gares')
    create(@Body() gare: GareResume) {
        this.gareService.addGare(gare);
        return {
            message: 'Gare ajoutée avec succès',
            gare: gare,
        };
    }

    // Marquer une gare comme favorite ou non
    @Put('/gares/:id')
    setFavorite(
        @Param('id') id: string,
        @Body('favorite') favorite: boolean,
    ): { success: boolean; message: string; id: string; favorite: boolean } {
        const success = this.gareService.setFavorite(id, favorite);
        return { success, message: 'Gare modifiée', id, favorite };
    }



}