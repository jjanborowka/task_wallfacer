// Set up the test suite
import { describe, expect, it } from "vitest";
import { getRandomDate } from "./helper_functions";

describe("Math Functions", () => {
	// this are simple test that ensure our function works as expected
	it("should return a date between the start and end dates", () => {
		const start = new Date("2023-01-01");
		const end = new Date("2023-12-31");

		const randomDate = getRandomDate(start, end);

		expect(randomDate).toBeInstanceOf(Date);
		expect(randomDate.getTime()).toBeGreaterThanOrEqual(start.getTime()); // Compare timestamps
		expect(randomDate.getTime()).toBeLessThanOrEqual(end.getTime()); // Compare timestamps
	});

	it("should return a date when start and end are the same", () => {
		const date = new Date("2023-01-01");
		const randomDate = getRandomDate(date, date);

		expect(randomDate).toEqual(date);
	});

	// There is much more tests that can be included
	// 1. Each component should test it's functions separately
	// 2. There should be edge case tests example, test what happen if you query gets no data
	// 3. Integration tests will be crucial for this app , example backend-frontend, listener-db etc.
	// 4. For a real production app test db that will allow testing db process and also their interaction with the app
});
