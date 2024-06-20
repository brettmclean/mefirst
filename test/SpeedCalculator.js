const {describe, it} = require("node:test");
const assert = require('node:assert');

const { PokemonSpeedTestSet, PokemonSpeedSpec } = require("../src/models");
const SpeedCalculator = require("../src/SpeedCalculator");


describe("Speed calculator", () => {
		it("should return the Pokemon's name in the result", () => {
			const expected = "Magnemite";
			
			let sc = new SpeedCalculator();
			
			let psrs = sc.getResults(getPokemonSpeedTestSetWithASingleFullSpeedTest({pokemonName: expected}));
			let actual = psrs[0].pokemonName;
			
			assert.strictEqual(actual, expected);
		});
		
		it("should include the Pokemon's base speed in the result spec description", () => {
			const expectedPattern = /115/;
			
			let sc = new SpeedCalculator();
			
			let psrs = sc.getResults(getPokemonSpeedTestSetWithASingleFullSpeedTest({
				pokemonName: "Azelf",
				baseSpeed: 115
			}));
			let actual = psrs[0].specDescription;
			
			assert.match(actual, expectedPattern);
		});
		
		it("should calculate correct speed for min speed Urshifu", () => {
			testCalculatedActualSpeedIsCorrect({
				pokemonName: "Urshifu-Rapid-Strike",
				baseSpeed: 97,
				ivs: 0,
				evs: 0,
				natureEffect: -1
			}, 91);
		});
		
		it("should calculate correct speed for mid speed Urshifu", () => {
			testCalculatedActualSpeedIsCorrect({
				pokemonName: "Urshifu-Rapid-Strike",
				baseSpeed: 97,
				ivs: 31,
				evs: 0,
				natureEffect: 0
			}, 117);
		});
		
		it("should calculate correct speed for high speed Urshifu", () => {
			testCalculatedActualSpeedIsCorrect({
				pokemonName: "Urshifu-Rapid-Strike",
				baseSpeed: 97,
				ivs: 31,
				evs: 252,
				natureEffect: 0
			}, 149);
		});
		
		it("should calculate correct speed for full speed Urshifu", () => {
			testCalculatedActualSpeedIsCorrect({
				pokemonName: "Urshifu-Rapid-Strike",
				baseSpeed: 97,
				ivs: 31,
				evs: 252,
				natureEffect: 1
			}, 163);
		});
		
		it("should calculate correct speed for full speed Choice Scarf Urshifu", () => {
			testCalculatedActualSpeedIsCorrect({
				pokemonName: "Urshifu-Rapid-Strike",
				baseSpeed: 97,
				ivs: 31,
				evs: 252,
				natureEffect: 1,
				boostFactor: 1.5
			}, 244);
		});
		
		it("should calculate correct speed for full speed Urshifu in Tailwind", () => {
			testCalculatedActualSpeedIsCorrect({
				pokemonName: "Urshifu-Rapid-Strike",
				baseSpeed: 97,
				ivs: 31,
				evs: 252,
				natureEffect: 1,
				boostFactor: 2
			}, 326);
		});
		
		it("should calculate correct speed for min speed Torkoal", () => {
			testCalculatedActualSpeedIsCorrect({
				pokemonName: "Torkoal",
				baseSpeed: 20,
				ivs: 0,
				evs: 0,
				natureEffect: -1
			}, 22);
		});
		
		it("should calculate correct 'outspeed point' in Tailwind against opponents with odd-numbered speed", () => {
			testCalculatedTailwindOutspeedPointIsCorrect({
				pokemonName: "Landorus-Incarnate",
				baseSpeed: 101,
				ivs: 31,
				evs: 0,
				natureEffect: 1
			}, 67); // Landorus actual speed is 133
		});
		
		it("should calculate correct 'outspeed point' in Tailwind against opponents with even-numbered speed", () => {
			testCalculatedTailwindOutspeedPointIsCorrect({
				pokemonName: "Landorus-Incarnate",
				baseSpeed: 101,
				ivs: 31,
				evs: 4,
				natureEffect: 1
			}, 68); // Landorus actual speed is 134
		});
		
		it("should calculate correct 'outspeed point' with one stage speed boost against opponents with speed mod 3 = 0", () => {
			testCalculatedOneStageBoostOutspeedPointIsCorrect({
				pokemonName: "Landorus-Incarnate",
				baseSpeed: 101,
				ivs: 31,
				evs: 12,
				natureEffect: 1
			}, 91); // Landorus actual speed is 135
		});
		
		it("should calculate correct 'outspeed point' with one stage speed boost against opponents with speed mod 3 = 1", () => {
			testCalculatedOneStageBoostOutspeedPointIsCorrect({
				pokemonName: "Landorus-Incarnate",
				baseSpeed: 101,
				ivs: 31,
				evs: 20,
				natureEffect: 1
			}, 92); // Landorus actual speed is 136
		});
		
		it("should calculate correct 'outspeed point' with one stage speed boost against opponents with speed mod 3 = 2", () => {
			testCalculatedOneStageBoostOutspeedPointIsCorrect({
				pokemonName: "Landorus-Incarnate",
				baseSpeed: 101,
				ivs: 31,
				evs: 28,
				natureEffect: 1
			}, 92); // Landorus actual speed is 137
		});

		it("should calculate correct speed when provided custom Pokemon level in options", () => {
			const expectedCalculatedSpeed = 225;
			let sc = new SpeedCalculator({ pokemonLevel: 79 });

			const psts = getPokemonSpeedTestSetWithASingleFullSpeedTest({ pokemonName: "Altaria", baseSpeed: 80 });
			let psrs = sc.getResults(psts);
			let actualCalculatedSpeed = psrs[0].actualSpeed;

			assert.strictEqual(actualCalculatedSpeed, expectedCalculatedSpeed);
		});
});

function getPokemonSpeedTestSetWithASingleTest(params) {
	const { pokemonName, baseSpeed, ivs, evs, natureEffect, boostFactor } = params;

	return [ new PokemonSpeedTestSet(pokemonName, baseSpeed, [ new PokemonSpeedSpec(ivs, evs, natureEffect, boostFactor) ]) ];
}

function getPokemonSpeedTestSetWithASingleFullSpeedTest(overrideParams) {
	overrideParams = overrideParams || {};

	const params = {
		pokemonName: overrideParams.pokemonName || "Pikachu",
		baseSpeed: overrideParams.baseSpeed || 90,
		ivs: 31,
		evs: 252,
		natureEffect: 1,
		boostFactor: 1
	};
	
	return getPokemonSpeedTestSetWithASingleTest(params);
}

function testCalculatedActualSpeedIsCorrect(params, expectedCalculatedSpeed) {
	let sc = new SpeedCalculator();
	
	const psts = getPokemonSpeedTestSetWithASingleTest(params);			
	let psrs = sc.getResults(psts);
	let actualCalculatedSpeed = psrs[0].actualSpeed;
			
	assert.strictEqual(actualCalculatedSpeed, expectedCalculatedSpeed);
}

function testCalculatedTailwindOutspeedPointIsCorrect(params, expectedTailwindOutspeedPoint) {
	let sc = new SpeedCalculator();
	
	const psts = getPokemonSpeedTestSetWithASingleTest(params);			
	let psrs = sc.getResults(psts);
	let actualCalculatedSpeed = psrs[0].outspeedPointWithTailwind;
			
	assert.strictEqual(actualCalculatedSpeed, expectedTailwindOutspeedPoint);
}

function testCalculatedOneStageBoostOutspeedPointIsCorrect(params, expectedOneStageBoostOutspeedPoint) {
	let sc = new SpeedCalculator();
	
	const psts = getPokemonSpeedTestSetWithASingleTest(params);			
	let psrs = sc.getResults(psts);
	let actualCalculatedSpeed = psrs[0].outspeedPointWithOneStageBoost;
			
	assert.strictEqual(actualCalculatedSpeed, expectedOneStageBoostOutspeedPoint);
}
