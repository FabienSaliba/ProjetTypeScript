import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import type supertest from 'supertest';
import { GareModule } from '../src/gare.module';

describe('Gares API', () => {
    let app: INestApplication;
    let httpRequester: supertest.Agent;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [GareModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        httpRequester = request(app.getHttpServer());
    });

    it('GET /gares → should return an array of gares', async () => {
        const response = await httpRequester.get('/gares').expect(200);

        expect(response.body).toEqual(expect.any(Array));
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('latitude');
        expect(response.body[0]).toHaveProperty('longitude');
        expect(response.body[0]).toHaveProperty('favorite');
    });

    it('GET /gares?id= → should return a single gare', async () => {
        const all = await httpRequester.get('/gares').expect(200);
        const gareId = all.body[0].id;

        const response = await httpRequester
            .get('/gares')
            .query({ id: gareId })
            .expect(200);

        expect(response.body).toHaveProperty('id', gareId);
        expect(response.body).toHaveProperty('name');
    });

    it('PUT /gares/:id → should set a gare as favorite', async () => {
        const all = await httpRequester.get('/gares').expect(200);
        const gareId = all.body[0].id;

        const response = await httpRequester
            .put(`/gares/${gareId}`)
            .send({ favorite: true })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            message: 'Gare modifiée',
            id: gareId,
            favorite: true,
        });
    });

    it('GET /gares?term=paris → should return results for search', async () => {
        const response = await httpRequester
            .get('/gares')
            .query({ term: 'paris' })
            .expect(200);

        expect(response.body).toEqual(expect.any(Array));
        if (response.body.length > 0) {
            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0].name.toLowerCase()).toContain('paris');
        }
    });

    it('POST /gares → should add a new gare', async () => {
        const newGare = {
            id: '1234',
            name: 'Toulouse Matabiau',
            latitude: 45.0,
            longitude: 2.0,
            favorite: true,
        };

        const response = await httpRequester
            .post('/gares')
            .send(newGare)
            .expect(201);

        expect(response.body).toEqual({
            message: 'Gare ajoutée avec succès',
            gare: newGare,
        });

        // Vérifier qu’on la retrouve ensuite dans la liste
        const all = await httpRequester.get('/gares').expect(200);
        const found = all.body.find((g: any) => g.id === '1234');
        expect(found).toBeDefined();
        expect(found.name).toBe('Toulouse Matabiau');
    });
});