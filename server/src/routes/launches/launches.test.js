const request = require('supertest')
const app = require('../../app')

describe("Test GET / launches", () => {
    test('It should respond with status code 200', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})


describe("Test POST / launches", () => {

    let completeLaunchData = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-186 f",
        launchDate: "January 4,2028"
    }

    let launchDataWithoutDate = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-186 f",
    }

    let launchData_incorrectDate = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-186 f",
        launchDate: "Hello World"
    }

    test('It should respond with error code 201', async () => {
        const response = await request(app)
            .post('/launches')
            .send(
                completeLaunchData
            )
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf()
        const responseDate = new Date(response.body.launchDate).valueOf()

        expect(responseDate).toBe(requestDate)
        //Jest assertion    
        expect(response.body).toMatchObject(
            launchDataWithoutDate
        )
    })

    test('It should catch missing required properties', async () => {
        const response = await request(app)
            .post('/launches')
            .send(
                launchDataWithoutDate
            )
            .expect(400)
            .expect('Content-Type', /json/)

        expect(response.body).toStrictEqual({
            error: "Missing required launch property"
        })
    })
    test('It should catch invalid dates', async () => {
        const response = await request(app)
            .post('/launches')
            .send(
                launchData_incorrectDate
            )
            .expect(400)
            .expect('Content-Type', /json/)

        expect(response.body).toStrictEqual({
            error: "Invalid launch Date "
        })
    })
})