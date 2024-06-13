const {describe, it} = require("node:test");
const assert = require('node:assert');
const { Readable } = require('stream');

const CsvParser = require("../src/CsvParser");

const CSV_HEADER = "POKEMON_NAME,BASE_SPEED,CALC_MIN_SPEED,CALC_MID_SPEED,CALC_HIGH_SPEED,CALC_FULL_SPEED,CALC_FULL_SPEED_1_5x_BOOST,CALC_FULL_SPEED_2x_BOOST,CALC_CUSTOM";

describe("CSV parser", () => {
    it("should return one PokemonSpeedTestSet per data row", async () => {
        const expected = 3;
        const cp = new CsvParser();

        const dataRows = ["PokemonA,10,1,,,,,,", "PokemonB,10,1,,,,,,", "PokemonC,10,1,,,,,,"];

        let psts = await cp.parseFromStream(createStreamFromDataRows(dataRows));
        let actual = psts.length;
        
        assert.strictEqual(actual, expected);
    });
	
	it("should support min speed tests", async () => {
        const speedSpec = await getFirstSpeedSpecReturnedForDataRow("PokemonA,10,1,,,,,,");

		await it("and return a speed spec with 0 IVs", () => {
            assert.strictEqual(speedSpec.ivs, 0);
		});
		
		await it("and return a speed spec with 0 EVs", () => {
            assert.strictEqual(speedSpec.evs, 0);
		});
		
		await it("and return a speed spec with a negative nature", () => {
            assert.strictEqual(speedSpec.natureEffect, -1);
		});
		
		await it("and return a speed spec with no additional speed boost", () => {
            assert.strictEqual(speedSpec.boostFactor, 1);
		});
	});
	
	it("should support mid speed tests", async () => {
        const speedSpec = await getFirstSpeedSpecReturnedForDataRow("PokemonA,10,,1,,,,,");

		await it("and return a speed spec with 31 IVs", () => {
            assert.strictEqual(speedSpec.ivs, 31);
		});
		
		await it("and return a speed spec with 0 EVs", () => {
            assert.strictEqual(speedSpec.evs, 0);
		});
		
		await it("and return a speed spec with a neutral nature", () => {
            assert.strictEqual(speedSpec.natureEffect, 0);
		});
		
		await it("and return a speed spec with no additional speed boost", () => {
            assert.strictEqual(speedSpec.boostFactor, 1);
		});
	});

	it("should support high speed tests", async () => {
        const speedSpec = await getFirstSpeedSpecReturnedForDataRow("PokemonA,10,,,1,,,,");
        
		await it("and return a speed spec with 31 IVs", () => {
            assert.strictEqual(speedSpec.ivs, 31);
		});
		
		await it("and return a speed spec with 252 EVs", () => {
            assert.strictEqual(speedSpec.evs, 252);
		});
		
		await it("and return a speed spec with a neutral nature", () => {
            assert.strictEqual(speedSpec.natureEffect, 0);
		});
		
		await it("and return a speed spec with no additional speed boost", () => {
            assert.strictEqual(speedSpec.boostFactor, 1);
		});
	});

	it("should support full speed tests", async () => {
        const speedSpec = await getFirstSpeedSpecReturnedForDataRow("PokemonA,10,,,,1,,,");

		await it("and return a speed spec with 31 IVs", () => {
            assert.strictEqual(speedSpec.ivs, 31);
		});
		
		await it("and return a speed spec with 252 EVs", () => {
            assert.strictEqual(speedSpec.evs, 252);
		});
		
		await it("and return a speed spec with a positive nature", () => {
            assert.strictEqual(speedSpec.natureEffect, 1);
		});
		
		await it("and return a speed spec with no additional speed boost", () => {
            assert.strictEqual(speedSpec.boostFactor, 1);
		});
	});

	it("should support full speed with 1.5x boost tests", async () => {
        const speedSpec = await getFirstSpeedSpecReturnedForDataRow("PokemonA,10,,,,,1,,");

		await it("and return a speed spec with 31 IVs", () => {
            assert.strictEqual(speedSpec.ivs, 31);
		});
		
		await it("and return a speed spec with 252 EVs", () => {
            assert.strictEqual(speedSpec.evs, 252);
		});
		
		await it("and return a speed spec with a positive nature", () => {
            assert.strictEqual(speedSpec.natureEffect, 1);
		});
		
		await it("and return a speed spec with a 1.5x speed boost", () => {
            assert.strictEqual(speedSpec.boostFactor, 1.5);
		});
	});

	it("should support full speed with 2x boost tests", async () => {
        const speedSpec = await getFirstSpeedSpecReturnedForDataRow("PokemonA,10,,,,,,1,");

		await it("and return a speed spec with 31 IVs", () => {
            assert.strictEqual(speedSpec.ivs, 31);
		});
		
		await it("and return a speed spec with 252 EVs", () => {
            assert.strictEqual(speedSpec.evs, 252);
		});
		
		await it("and return a speed spec with a positive nature", () => {
            assert.strictEqual(speedSpec.natureEffect, 1);
		});
		
		await it("and return a speed spec with a 2x speed boost", () => {
            assert.strictEqual(speedSpec.boostFactor, 2);
		});
	});

	it("should support custom tests", async () => {
        const speedSpecs = await getSpeedSpecsReturnedForDataRow("PokemonA,10,,,,,,,EV12;EV20;EV28;EV36;EV42");

		await it("and return one speed spec per semicolon-delimited item", () => {
            assert.strictEqual(speedSpecs.length, 5);
		});
	});

	it("should return no speed test set if no tests are specified in a given row", async () => {
		const cp = new CsvParser();
	    const psts = await cp.parseFromStream(createStreamFromDataRows(["PokemonA,10,,,,,,,"]));
		assert.strictEqual(psts.length, 0);
	});

	it("should not throw an error if no data rows are provided", () => {
		const cp = new CsvParser();
	    assert.doesNotThrow(() => cp.parseFromStream(createStreamFromDataRows([])));
	});
});

async function getFirstSpeedSpecReturnedForDataRow(dataRow) {
	const speedSpecs = await getSpeedSpecsReturnedForDataRow(dataRow);
    return speedSpecs[0];
}

async function getSpeedSpecsReturnedForDataRow(dataRow) {
    const cp = new CsvParser();

    const psts = await cp.parseFromStream(createStreamFromDataRows([dataRow]));
    const speedSpecs = psts[0].speedSpecs;
    return speedSpecs;
}

function createStreamFromDataRows(dataRows) {
    let stream = new Readable();

    stream.push(CSV_HEADER + "\n");
    dataRows.forEach(row => stream.push(row + "\n"));

    stream.push(null);
    return stream;
}