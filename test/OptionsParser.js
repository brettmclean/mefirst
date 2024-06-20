const {describe, it} = require("node:test");
const assert = require('node:assert');

const OptionsParser = require("../src/OptionsParser");

describe("Options parser", () => {
    it("supports a --csv argument providing the CSV file path", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "path/to/my/file.csv"]);
        assert.strictEqual(options.csvFilePath, "path/to/my/file.csv");
    });

    it("supports a -c argument providing the CSV file path", () => {
        const op = new OptionsParser();
        const options = op.parse(["-c", "path/to/my/other/file.csv"]);
        assert.strictEqual(options.csvFilePath, "path/to/my/other/file.csv");
    });

    it("supports a --level argument for specifying the level of Pokemon in battle", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "--level", "76"]);
        assert.strictEqual(options.pokemonLevel, 76);
    });

    it("supports an -l argument for specifying the level of Pokemon in battle", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "-l", "76"]);
        assert.strictEqual(options.pokemonLevel, 76);
    });

    it("supports a --by-speed argument for specifying to sort output by speed", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "--by-speed"]);
        assert.strictEqual(options.sortBySpeed, true);
    });

    it("supports an -s argument for specifying to sort output by speed", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "-s"]);
        assert.strictEqual(options.sortBySpeed, true);
    });

    it("supports a --by-name argument for specifying to sort output by Pokemon name", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "--by-name"]);
        assert.strictEqual(options.sortByPokemonName, true);
    });

    it("supports an -n argument for specifying to sort output by Pokemon name", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "-n"]);
        assert.strictEqual(options.sortByPokemonName, true);
    });

    it("supports a --condense argument for specifying to provide a denser output", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "--condense"]);
        assert.strictEqual(options.condenseOutput, true);
    });

    it("supports a -d argument for specifying to provide a denser output", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "-d"]);
        assert.strictEqual(options.condenseOutput, true);
    });
	
	it("supports an -h argument to request help screen", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "-h"]);
        assert.strictEqual(options.displayHelp, true);
    });
	
	it("supports a --help argument to request a help screen", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "--help"]);
        assert.strictEqual(options.displayHelp, true);
    });

    it("assumes Pokemon level is 50 when no level is provided", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv"]);
        assert.strictEqual(options.pokemonLevel, 50);
    });

    it("sorts output by speed when no sort option is provided", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", ]);
        assert.strictEqual(options.sortBySpeed, true);
    });

    it("does not sort by speed when sort by Pokemon name is specified", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "--by-name"]);
        assert.strictEqual(options.sortBySpeed, false);
    });

    it("does not sort by Pokemon name when sort by speed is specified", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv", "--by-speed"]);
        assert.strictEqual(options.sortByPokemonName, false);
    });

    it("does not condense output when --condense argument is not provided", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv"]);
        assert.strictEqual(options.condenseOutput, false);
    });

    it("does not display help screen when --help argument is not provided", () => {
        const op = new OptionsParser();
        const options = op.parse(["--csv", "file.csv"]);
        assert.strictEqual(options.displayHelp, false);
    });

    it("throws an error if --csv switch is not provided", () => {
        const op = new OptionsParser();
        assert.throws(() => op.parse([]));
    });
	
	it("does not throw an error if --csv switch is not provided but --help switch is", () => {
        const op = new OptionsParser();
        const options = op.parse(["--help"]);
    });

    it("throws an error if CSV file path is not provided to --csv switch", () => {
        const op = new OptionsParser();
        assert.throws(() => op.parse(["--csv"]));
    });

    it("throws an error if provided level is below 1", () => {
        const op = new OptionsParser();
        assert.throws(() => op.parse(["--csv", "file.csv", "--level", "0"]));
    });

    it("throws an error if provided level is above 100", () => {
        const op = new OptionsParser();
        assert.throws(() => op.parse(["--csv", "file.csv", "--level", "101"]));
    });

    it("throws an error if both sort by speed and sort by Pokemon name are specified", () => {
        const op = new OptionsParser();
        assert.throws(() => op.parse(["--by-name", "--by-speed"]));
    });
});