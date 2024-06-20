class CliHelpProvider {
	printHelp() {
		console.log("Usage: mefirst -c data.csv [-s | -n] [-d]");
		console.log("    or mefirst -h");
		console.log();
		console.log("Options: ");
		console.log("  -c, --csv filename	select Pokemon and speed test CSV file");
		console.log("  -l, --level		set the level shared by all Pokemon in battle (default 50)");
		console.log("  -s, --by-speed	output results sorted by effective speed");
		console.log("  -n, --by-name		output results sorted by Pokemon name");
		console.log("  -d, --condense	provide condensed results output");
		console.log("  -h, --help		show this help screen");
	}
}

module.exports = CliHelpProvider;