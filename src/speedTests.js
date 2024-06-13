const { PokemonSpeedSpec } = require("./models");

class SpeedTestBase {
	getPokemonSpeedSpec() {}
}

class MinSpeedTest extends SpeedTestBase {
	getPokemonSpeedSpec() {
		return new PokemonSpeedSpec(0, 0, -1, 1);
	}
}

class MidSpeedTest extends SpeedTestBase {
	getPokemonSpeedSpec() {
		return new PokemonSpeedSpec(31, 0, 0, 1);
	}
}

class HighSpeedTest extends SpeedTestBase {
	getPokemonSpeedSpec() {
		return new PokemonSpeedSpec(31, 252, 0, 1);
	}
}

class FullSpeedTest extends SpeedTestBase {
	getPokemonSpeedSpec() {
		return new PokemonSpeedSpec(31, 252, 1, 1);
	}
}

class FullSpeed50PercentBoostTest extends SpeedTestBase {
	getPokemonSpeedSpec() {
		return new PokemonSpeedSpec(31, 252, 1, 1.5);
	}
}

class FullSpeed100PercentBoostTest extends SpeedTestBase {
	getPokemonSpeedSpec() {
		return new PokemonSpeedSpec(31, 252, 1, 2);
	}
}

class CustomTest extends SpeedTestBase {
	#specDescriptor;
	static #IVS_PART_REGEX = /\/\IV(\d+)\//i;
	static #EVS_NATURE_PART_REGEX = /\/EV(\d+)([-+]?)\//i;
	static #BOOST_PART_REGEX = /\/BST(\d+\.?\d*)x\//i;

	constructor(specDescriptor) {
		super(specDescriptor);
		this.#specDescriptor = this.#transformSpecDescriptor(specDescriptor);
	}

	getPokemonSpeedSpec() {
		let ivs = 31, evs = 0, natureEffect = 0, boostFactor = 1;

		let matches = this.#specDescriptor.match(CustomTest.#IVS_PART_REGEX);
		if(matches) {
			ivs = parseInt(matches[1]);
		}

		matches = this.#specDescriptor.match(CustomTest.#EVS_NATURE_PART_REGEX);
		if(matches) {
			evs = parseInt(matches[1]);
			natureEffect = matches[2] === "+" ? 1 : (matches[2] === "-" ? -1 : 0);
		}

		matches = this.#specDescriptor.match(CustomTest.#BOOST_PART_REGEX);
		if(matches) {
			boostFactor = parseFloat(matches[1]);
		}

		return new PokemonSpeedSpec(ivs, evs, natureEffect, boostFactor);
	}
	
	#transformSpecDescriptor(specDescriptor) {
		return "/" + specDescriptor.replace(/\s+/g, "") + "/";
	}
}

module.exports = { MinSpeedTest, MidSpeedTest, HighSpeedTest, FullSpeedTest, FullSpeed50PercentBoostTest, FullSpeed100PercentBoostTest, CustomTest };