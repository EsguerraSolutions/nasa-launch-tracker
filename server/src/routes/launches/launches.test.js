const request = require('supertest');
const app = require('../../app');
const { mongoConnect , mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {

    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    
    describe('Test POST /launches', () => {
        const dataWithLaunchDate = {
            mission : 'USS Enterprise',
            rocket : 'NCC 1701-D',
            destination : 'Kepler-62 f',
            launchDate : 'January 04,2028' 
        }
    
        const dataWithoutLaunchDate = {
            mission : 'USS Enterprise',
            rocket : 'NCC 1701-D',
            destination : 'Kepler-62 f'
        }
        
        const dataWithInvalidDate = {
            mission : 'USS Enterprise',
            rocket : 'NCC 1701-D',
            destination : 'Kepler-62 f',
            launchDate : 'dogs' 
        }
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(dataWithLaunchDate)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(dataWithLaunchDate.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(requestDate).toBe(responseDate);
    
            expect(response.body).toMatchObject(dataWithoutLaunchDate);
        });
        test('It should catch missing properties', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(dataWithoutLaunchDate)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body).toStrictEqual({
                error : 'Missing property'
            });
        });
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(dataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body).toStrictEqual({
                error : 'Invalid Date'
            });       
            
        });
    });
});
