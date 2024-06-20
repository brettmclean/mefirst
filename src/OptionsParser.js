const { parseArgs } = require('node:util');
const { ConfigError } = require('./errors');

class OptionsParser {
    
    parse(args) {
        const parsedArgs = parseArgs({
            args: args,
            options: this.#parseArgsOptions
        });
        return new Config(parsedArgs.values);
    }

    get #parseArgsOptions() {
        return {
            "csv": {
                type: "string",
                short: "c"
            },
            "level": {
                type: "string",
                short: "l"
            },
            "by-speed": {
                type: "boolean",
                short: "s"
            },
            "by-name": {
                type: "boolean",
                short: "n"
            },
            "condense": {
                type: "boolean",
                short: "d"
            },
			"help": {
				type: "boolean",
				short: "h"
			}
        };
    }
}

class Config {
    csvFilePath;
    sortBySpeed;
    sortByPokemonName;
    condenseOutput;
    displayHelp;

    constructor(argValues) {
        this.csvFilePath = argValues.csv;
        this.pokemonLevel = typeof argValues.level !== "undefined" ? parseInt(argValues.level) : 50;
        this.sortBySpeed = argValues["by-speed"] || false;
        this.sortByPokemonName = argValues["by-name"] || false;
        this.condenseOutput = argValues.condense || false;
		this.displayHelp = argValues.help || false;

        this.#validate();
    }

    #validate() {
        if(!this.sortBySpeed && !this.sortByPokemonName) {
            this.sortBySpeed = true;
        }

        if(this.pokemonLevel < 1 || this.pokemonLevel > 100) {
            throw new ConfigError("Level provided via -l switch must be between 1 and 100");
        }

        if(this.sortBySpeed && this.sortByPokemonName) {
            throw new ConfigError("Cannot specify multiple sort switches at once (e.g. both -s and -n)");
        }

        if(!this.csvFilePath && !this.displayHelp) {
            throw new ConfigError("Must provide CSV file path via -c switch");
        }
    }
}

module.exports = OptionsParser;