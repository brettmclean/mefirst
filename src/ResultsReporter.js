class ResultsGroup {
	pokemonSpeedResults = [];
}

class ResultsReporter {

	#sortBySpeed;
	#sortByPokemonName;
	#condenseOutput;

	constructor(options) {
		this.#sortBySpeed = options.sortBySpeed;
		this.#sortByPokemonName = options.sortByPokemonName;
		this.#condenseOutput = options.condenseOutput;
	}

	writeReport(pokemonSpeedResults) {
		
		if(this.#sortBySpeed) {
			this.#writeReportSortedBySpeed(pokemonSpeedResults);
		} else if(this.#sortByPokemonName) {
			this.#writeReportSortedByPokemonName(pokemonSpeedResults);
		} else {
			throw new Error("Cannot write report - no valid sort option was provided")
		}
	}

	#writeReportSortedBySpeed(pokemonSpeedResults) {
		let resultsGroups = this.#groupByActualSpeed(pokemonSpeedResults);

		if(this.#condenseOutput) {
			this.#outputCondensedReportSortedBySpeed(resultsGroups);
		} else {
			this.#outputFullReportSortedBySpeed(resultsGroups);
		}
	}

	#writeReportSortedByPokemonName(pokemonSpeedResults) {
		let resultsGroups = this.#groupByPokemonName(pokemonSpeedResults);

		if(this.#condenseOutput) {
			this.#outputCondensedReportSortedByPokemonName(resultsGroups);
		} else {
			this.#outputFullReportSortedByPokemonName(resultsGroups);
		}
	}

	#outputFullReportSortedBySpeed(resultsGroups) {
		resultsGroups.forEach((rg) => {
			rg.pokemonSpeedResults.forEach((psr) => {
				console.log(`${psr.actualSpeed} speed - ${psr.pokemonName} (${psr.specDescription})`);
			});			

			let firstSpeedResult = rg.pokemonSpeedResults[0];
			console.log(`  ${firstSpeedResult.outspeedPointWithTailwind} to outspeed in Tailwind`);
			console.log(`  ${firstSpeedResult.outspeedPointWithOneStageBoost} to outspeed with +1 boost`);
			console.log();
		});
	}

	#outputCondensedReportSortedBySpeed(resultsGroups) {
		resultsGroups.forEach((rg) => {
			rg.pokemonSpeedResults.forEach((psr) => {
				console.log(`${psr.actualSpeed} - ${psr.pokemonName} (${psr.specDescription})`);
			});			

			let firstSpeedResult = rg.pokemonSpeedResults[0];
			console.log(`  ${firstSpeedResult.outspeedPointWithTailwind} in TW or ${firstSpeedResult.outspeedPointWithOneStageBoost} with +1`);
		});
	}

	#outputFullReportSortedByPokemonName(resultsGroups) {
		resultsGroups.forEach((rg) => {
			rg.pokemonSpeedResults.forEach((psr) => {
				console.log(`${psr.pokemonName} - ${psr.actualSpeed} speed (${psr.specDescription})`);
				console.log(`  ${psr.outspeedPointWithTailwind} to outspeed in Tailwind`);
				console.log(`  ${psr.outspeedPointWithOneStageBoost} to outspeed with +1 boost`);
			});
			console.log();
		});
	}

	#outputCondensedReportSortedByPokemonName(resultsGroups) {
		resultsGroups.forEach((rg) => {
			rg.pokemonSpeedResults.forEach((psr) => {
				console.log(`${psr.pokemonName} - ${psr.actualSpeed} (${psr.specDescription}) -> ${psr.outspeedPointWithTailwind} in TW or ${psr.outspeedPointWithOneStageBoost} with +1`);
			});
		});
	}

	#groupByActualSpeed(pokemonSpeedResults) {
		const resultsGroups = [];

		pokemonSpeedResults = this.#sortResultsByActualSpeed(pokemonSpeedResults);

		let lastActualSpeed = 0;
		pokemonSpeedResults.forEach((psr) => {
			if(lastActualSpeed !== psr.actualSpeed) {
				resultsGroups.push(new ResultsGroup());
			}

			resultsGroups[resultsGroups.length - 1].pokemonSpeedResults.push(psr);

			lastActualSpeed = psr.actualSpeed;
		});

		resultsGroups.forEach((rg) => {
			if(rg.pokemonSpeedResults.length > 1) {
				rg.pokemonSpeedResults = this.#sortResultsByPokemonName(rg.pokemonSpeedResults);
			}
		});

		return resultsGroups;
	}

	#groupByPokemonName(pokemonSpeedResults) {
		const resultsGroups = [];

		pokemonSpeedResults = this.#sortResultsByPokemonName(pokemonSpeedResults);

		let lastPokemonName = null;
		pokemonSpeedResults.forEach((psr) => {
			if(lastPokemonName !== psr.pokemonName) {
				resultsGroups.push(new ResultsGroup());
			}

			resultsGroups[resultsGroups.length - 1].pokemonSpeedResults.push(psr);

			lastPokemonName = psr.pokemonName;
		});

		resultsGroups.forEach((rg) => {
			if(rg.pokemonSpeedResults.length > 1) {
				rg.pokemonSpeedResults = this.#sortResultsByActualSpeed(rg.pokemonSpeedResults);
			}
		});

		return resultsGroups;
	}

	#sortResultsByActualSpeed(pokemonSpeedResults) {
		return pokemonSpeedResults.sort((a, b) => b.actualSpeed - a.actualSpeed);
	}

	#sortResultsByPokemonName(pokemonSpeedResults) {
		return pokemonSpeedResults.sort((a, b) => a.pokemonName.localeCompare(b.pokemonName));
	}
}

module.exports = ResultsReporter;
