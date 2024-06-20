const { PokemonSpeedResult } = require("./models");

class SpeedCalculator {
	#pokemonLevel;
	#condenseOutput;
	#results;
	
	constructor(options) {
		options = options || {};
		this.#pokemonLevel = options.pokemonLevel || 50;
		this.#condenseOutput = options.condenseOutput || false;
	}
	
	getResults(speedTestSets) {
		this.#results = [];
		
		speedTestSets.forEach((speedTestSet) => this.#calculateRequestSetAndAddToResults(speedTestSet));
		
		return this.#results;
	}
	
	#calculateRequestSetAndAddToResults(speedTestSet) {
		let pokemonName = speedTestSet.pokemonName;
		let pokemonBaseSpeed = speedTestSet.pokemonBaseSpeed;
		let speedSpecs = speedTestSet.speedSpecs;
		
		let speedResults = speedSpecs.map((speedSpec) => this.#calculateSpeedResult(pokemonName, pokemonBaseSpeed, speedSpec));
		
		this.#results.push(...speedResults);
	}
	
	#calculateSpeedResult(pokemonName, pokemonBaseSpeed, speedSpec) {
		const specDescription = this.#getSpecDescription(pokemonBaseSpeed, speedSpec);
		const actualSpeed = this.#calculateActualSpeed(pokemonBaseSpeed, speedSpec);
		const outspeedPointWithTailwind = this.#calculateOutspeedPointWithTailwind(actualSpeed);
		const outspeedPointWithOneStageBoost = this.#calculateOutspeedPointWithOneStageBoost(actualSpeed);
	
		return new PokemonSpeedResult(pokemonName, specDescription, actualSpeed, outspeedPointWithTailwind, outspeedPointWithOneStageBoost);
	}
	
	#getSpecDescription(pokemonBaseSpeed, speedSpec) {
		if(this.#condenseOutput) {
			return this.#getCondensedSpecDescription(pokemonBaseSpeed, speedSpec);
		} else {
			return this.#getFullSpecDescription(pokemonBaseSpeed, speedSpec);
		}
	}

	#getFullSpecDescription(pokemonBaseSpeed, speedSpec) {
		const { ivs, evs, natureEffect, boostFactor } = speedSpec;

		let descParts = [];
		descParts.push(`Base ${pokemonBaseSpeed}`);

		if(ivs !== 31) {
			descParts.push(`${ivs} IVs`);
		}

		let natureSign = (natureEffect === -1 ? "-" : (natureEffect === 1 ? "+" : ""));
		descParts.push(`${evs}${natureSign} EVs`);

		if(boostFactor !== 1) {
			descParts.push(`${boostFactor}x boost`);
		}

		return descParts.join(" / ");
	}

	#getCondensedSpecDescription(pokemonBaseSpeed, speedSpec) {
		const { ivs, evs, natureEffect, boostFactor } = speedSpec;

		let descParts = [];
		descParts.push(`Base ${pokemonBaseSpeed}`);

		if(ivs !== 31) {
			descParts.push(`IV ${ivs}`);
		}

		let natureSign = (natureEffect === -1 ? "-" : (natureEffect === 1 ? "+" : ""));
		descParts.push(`EV ${evs}${natureSign}`);

		if(boostFactor !== 1) {
			descParts.push(`${boostFactor}x`);
		}

		return descParts.join(" / ");
	}
	
	#calculateActualSpeed(pokemonBaseSpeed, speedSpec) {
		const { ivs, evs, natureEffect, boostFactor } = speedSpec;
		
		let actualSpeed = 2 * pokemonBaseSpeed + ivs + Math.floor(evs / 4);
		actualSpeed = Math.floor(actualSpeed * this.#pokemonLevel / 100) + 5;
		actualSpeed = Math.floor(actualSpeed * (1 + (natureEffect / 10)));
		actualSpeed = Math.floor(actualSpeed * boostFactor);
	
		return actualSpeed;
	}
	
	#calculateOutspeedPointWithTailwind(actualOpponentSpeed) {
		return Math.floor(actualOpponentSpeed / 2) + 1;
	}

	#calculateOutspeedPointWithOneStageBoost(actualOpponentSpeed) {
		let outspeedPoint = Math.floor(actualOpponentSpeed * 2 / 3) + 1;
		while(Math.floor(outspeedPoint * 3 / 2) <= actualOpponentSpeed) {
			outspeedPoint++;
		}
		return outspeedPoint;
	}
}

module.exports = SpeedCalculator;
