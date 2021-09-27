const request = require("supertest");
const app = require("../../app");
// const api = require(".")
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');

describe("Testing the API for v1",()=>{

	beforeAll(async()=>{
		await mongoConnect();
	});

	afterAll(async()=>{
		mongoDisconnect();
	})

	describe("Test GET /launches", () => {
		test("It should respond with 200 success and Content-Type: JSON", async () => {
			const response = await request(app)
				.get("/v1/launches")
				.expect("Content-Type", /json/)
				.expect(200);
		});
	});

	describe("Test POST /launches", () => {
		const launchData = {
			mission: "Test Mission",
			rocket: "Test Rocket",
			destination: "Kepler-1410 b",
			launchDate: "January 4, 2028",
		};
		const launchDataWithoutDate = {
			mission: "Test Mission",
			rocket: "Test Rocket",
			destination: "Kepler-1410 b",
		};

		const missinglaunchData = {
			mission: "Test Mission",
			rocket: "Test Rocket",
			launchDate: "January 4, 2028",
		};
		const invalidlaunchDate = {
			mission: "Test Mission",
			rocket: "Test Rocket",
			destination: "Kepler-1410 b",
			launchDate: "January 4th, 2028",
		};
		test("It should response with 201 created", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(launchData)
				.expect("Content-Type", /json/)
				.expect(201);

			const launchDate = new Date(launchData.launchDate).valueOf();
			const responseDate = new Date(response.body.launchDate).valueOf();

			expect(launchDate).toBe(responseDate);

			expect(response.body).toMatchObject(launchDataWithoutDate);
		});

		test("It should catch missing  required properties", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(missinglaunchData)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toEqual({
				error: "Invalid Data",
			});
		});
		test("It should catch invalid date", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(invalidlaunchDate)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toEqual({
				error: "Invalid Launch date",
			});
		});
	});
})


