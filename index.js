#!/usr/bin/env node
const fs = require("fs");
const { ConfigError } = require('./src/errors');
const OptionsParser = require("./src/OptionsParser");
const CsvParser = require("./src/CsvParser");
const SpeedCalculator = require("./src/SpeedCalculator");
const ResultsReporter = require("./src/ResultsReporter");
const CliHelpProvider = require("./src/CliHelpProvider");

const cliHelpProvider = new CliHelpProvider();
const optionsParser = new OptionsParser();

let options;
try {
	options = optionsParser.parse(process.argv.slice(2));
} catch (ex) {
	if(ex instanceof ConfigError) {
		console.log(ex.message + "\n");
		cliHelpProvider.printHelp();
		process.exitCode = 1;
		return;
	}
	throw ex;
}

if(options.displayHelp) {
	cliHelpProvider.printHelp();
} else {
	calculateAndOutputSpeeds(options);
}

	
function calculateAndOutputSpeeds(options) {
	const csvParser = new CsvParser();
	const calculator = new SpeedCalculator(options);
	const reporter = new ResultsReporter(options);

	csvParser.parseFromStream(fs.createReadStream(options.csvFilePath))
		.then((speedTestSets) => calculator.getResults(speedTestSets))
		.then((pokemonSpeedResults) => reporter.writeReport(pokemonSpeedResults));
}