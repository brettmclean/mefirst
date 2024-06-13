class PokemonSpeedSpec {
	ivs;
	evs;
	natureEffect;
	boostFactor;
	
	constructor(ivs, evs, natureEffect, boostFactor) {
		this.ivs = ivs;
		this.evs = evs;
		this.natureEffect = natureEffect || 0;
		this.boostFactor = boostFactor || 1;
	}
}

class PokemonSpeedTestSet {
	#pokemonName;
	#pokemonBaseSpeed;
	#speedSpecs;
	
	constructor(pokemonName, pokemonBaseSpeed, speedSpecs) {
		this.#pokemonName = pokemonName;
		this.#pokemonBaseSpeed = pokemonBaseSpeed;
		this.#speedSpecs = speedSpecs;
	}
	
	get pokemonName() {
		return this.#pokemonName;
	}
	
	get pokemonBaseSpeed() {
		return this.#pokemonBaseSpeed;
	}
	
	get speedSpecs() {
		return this.#speedSpecs;
	}
}

class PokemonSpeedResult {
	#pokemonName;
	#specDescription;
	#actualSpeed;
	#outspeedPointWithTailwind;
	#outspeedPointWithOneStageBoost;
	
	constructor(pokemonName, specDescription, actualSpeed, outspeedPointWithTailwind, outspeedPointWithOneStageBoost) {
		this.#pokemonName = pokemonName;
		this.#specDescription = specDescription;
		this.#actualSpeed = actualSpeed;
		this.#outspeedPointWithTailwind = outspeedPointWithTailwind;
		this.#outspeedPointWithOneStageBoost = outspeedPointWithOneStageBoost;
	}
	
	get pokemonName() {
		return this.#pokemonName;
	}
	
	get specDescription() {
		return this.#specDescription;
	}
	
	get actualSpeed() {
		return this.#actualSpeed;
	}
	
	get outspeedPointWithTailwind() {
		return this.#outspeedPointWithTailwind;
	}
	
	get outspeedPointWithOneStageBoost() {
		return this.#outspeedPointWithOneStageBoost;
	}
}

module.exports = { PokemonSpeedSpec, PokemonSpeedTestSet, PokemonSpeedResult };
