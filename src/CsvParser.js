const csv = require("csv-parser");
const fs = require("fs");
const models = require("./models");
const speedTests = require("./speedTests");

const PokemonSpeedTestSet = models.PokemonSpeedTestSet;

const { MinSpeedTest, MidSpeedTest, HighSpeedTest, FullSpeedTest, FullSpeed50PercentBoostTest, FullSpeed100PercentBoostTest, CustomTest } = speedTests;

const FIELD_NAMES = {
	POKEMON_NAME: "POKEMON_NAME",
	BASE_SPEED: "BASE_SPEED",
	CALC_MIN_SPEED: "CALC_MIN_SPEED",
	CALC_MID_SPEED: "CALC_MID_SPEED",
	CALC_HIGH_SPEED: "CALC_HIGH_SPEED",
	CALC_FULL_SPEED: "CALC_FULL_SPEED",
	CALC_FULL_SPEED_1_5x_BOOST: "CALC_FULL_SPEED_1_5x_BOOST",
	CALC_FULL_SPEED_2x_BOOST: "CALC_FULL_SPEED_2x_BOOST",
	CALC_CUSTOM: "CALC_CUSTOM"
};

class CsvParser {
	constructor() {
	}

	parseFromStream(stream) {
		return new Promise((resolve, reject) => this.#readCsvFromStream(stream, resolve, reject));
	}
	
	#readCsvFromStream(stream, promiseResolve, promiseReject) {
		let csvRowObjs = [];
		stream.pipe(csv())
			.on("data", (csvRowObj) => csvRowObjs.push(csvRowObj))
			.on("end", () => {
				promiseResolve(this.#convertRowsToSpeedTestSets(csvRowObjs));
			});
	}
	
	#convertRowsToSpeedTestSets(rowObjs) {
		let pokemonSpeedTestSets = [];
	
		rowObjs.forEach((rowObj) => {
			const psts = this.#convertRowToPokemonSpeedTestSet(rowObj);
			if(psts.speedSpecs.length > 0) {
				pokemonSpeedTestSets.push(psts);
			}
		});
		
		return pokemonSpeedTestSets;
	}
	
	#convertRowToPokemonSpeedTestSet(rowObj) {
		const pokemonName = rowObj[FIELD_NAMES.POKEMON_NAME];
		const pokemonBaseSpeed = parseInt(rowObj[FIELD_NAMES.BASE_SPEED]);
		const speedSpecs = this.#convertRowToPokemonSpeedSpecs(rowObj);
	
		return new PokemonSpeedTestSet(pokemonName, pokemonBaseSpeed, speedSpecs);
	}
	
	#convertRowToPokemonSpeedSpecs(rowObj) {
		let speedSpecs = [];
		
		speedSpecs = this.#addSpeedSpecForTestType(speedSpecs, rowObj[FIELD_NAMES.CALC_MIN_SPEED], MinSpeedTest);
		speedSpecs = this.#addSpeedSpecForTestType(speedSpecs, rowObj[FIELD_NAMES.CALC_MID_SPEED], MidSpeedTest);
		speedSpecs = this.#addSpeedSpecForTestType(speedSpecs, rowObj[FIELD_NAMES.CALC_HIGH_SPEED], HighSpeedTest);
		speedSpecs = this.#addSpeedSpecForTestType(speedSpecs, rowObj[FIELD_NAMES.CALC_FULL_SPEED], FullSpeedTest);
		speedSpecs = this.#addSpeedSpecForTestType(speedSpecs, rowObj[FIELD_NAMES.CALC_FULL_SPEED_1_5x_BOOST], FullSpeed50PercentBoostTest);
		speedSpecs = this.#addSpeedSpecForTestType(speedSpecs, rowObj[FIELD_NAMES.CALC_FULL_SPEED_2x_BOOST], FullSpeed100PercentBoostTest);
		speedSpecs = this.#addSpeedSpecsForCustomTests(speedSpecs, rowObj[FIELD_NAMES.CALC_CUSTOM]);
		
		return speedSpecs;
	}

	#addSpeedSpecForTestType(speedSpecs, csvValue, ctor) {
		if(csvValue !== "") {
			let speedTest = new ctor(csvValue);
			speedSpecs.push(speedTest.getPokemonSpeedSpec());
		}
		return speedSpecs;
	}
	
	#addSpeedSpecsForCustomTests(speedSpecs, csvValue) {
		if(csvValue !== "") {
			let parts = csvValue.split(";");
			parts.forEach((part) => {
				let speedTest = new CustomTest(part);
				speedSpecs.push(speedTest.getPokemonSpeedSpec());
			});
			
		}
		return speedSpecs;
	}
}

module.exports = CsvParser;
