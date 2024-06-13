# mefirst

A Node.js application for calculating effective speed of Pokemon in VGC/Smogon-style competitive play.

Provide a CSV file of Pokemon and various builds/scenarios that you want to plan for (IVs/EVs/speed boosts) and it will output a list of their effective speeds. Great for building competitive teams that can outspeed specific threats as well as creating reference sheets for use during play.

## Installation

You can install mefirst globally from the GitHub repository using

`npm install -g git+https://github.com/brettmclean/mefirst.git`

and then run it with

`mefirst`

If you don't want to install it globally, you can install mefirst into a local directory using

`npm install git+https://github.com/brettmclean/mefirst.git`

and then run it with

`npx mefirst`

## Usage

Mefirst requires a CSV file containing a list of one or more opposing Pokemon and speed tests to run against those Pokemon.

`mefirst -c ./data/pokemonlist.csv`

This outputs a list of effective speed(s) for each opposing Pokemon in the CSV file (assumes all Pokemon are level 50). It also shows the minimum speed required for your Pokemon to outspeed each opponent when your team has Tailwind set or when you have a +1 speed boost advantage.

By default, output will be grouped and sorted by speed - this is valuable when building a team and you want to know which opponents your Pokemon could outspeed with just a little more speed investment.

To instead group and sort the output by Pokemon name, supply the `-n` switch. This is valuable for creating gameplay reference sheets as all common configurations for a current opposing Pokemon are grouped together.

You can find sample CSV files in [the data directory](data).

### Command-line switches

`-c, --csv filename.csv` - provide path to CSV file containing list of opposing Pokemon  
`-s, --by-speed` - output results sorted and grouped by effective speed  
`-n, --by-name` - output results sorted and grouped by Pokemon name  
`-d, --condense` - provide output in a condensed format  
`-h, --help` - display a help screen  

## Input CSV file format

See sample CSV files in [the data directory](data).

The CSV file provided must have the following columns:
* `POKEMON_NAME` - the name of the opposing Pokemon species
* `BASE_SPEED` - the base speed of the opposing Pokemon species
* `CALC_MIN_SPEED` - put 1 in this column to calculate speed of opposing Pokemon when it has 0 speed IVs, 0 speed EVs, and a speed-reducing nature
* `CALC_MID_SPEED` - put 1 in this column to calculate speed of opposing Pokemon when it has 31 speed IVs, 0 speed EVs, and a speed-neutral nature
* `CALC_HIGH_SPEED` - put 1 in this column to calculate speed of opposing Pokemon when it has 31 speed IVs, 252 speed EVs, and a speed-neutral nature
* `CALC_FULL_SPEED` - put 1 in this column to calculate speed of opposing Pokemon when it has 31 speed IVs, 252 speed EVs, and a speed-increasing nature
* `CALC_FULL_SPEED_1_5x_BOOST` - put 1 in this column to calculate speed of opposing Pokemon when it has 31 speed IVs, 252 speed EVs, a speed-increasing nature, and a 1.5x speed boost (e.g. +1 speed stage, Protosynthesis/Quark Drive speed boost, Choice Scarf, etc.)
* `CALC_FULL_SPEED_2x_BOOST` - put 1 in this column to calculate speed when pokemon has 31 speed IVs, 252 speed EVs, a speed-increasing nature, and a 2x speed boost (e.g. +2 speed stage, Tailwind, Chlorophyll/Swift Swim, etc.)
* `CALC_CUSTOM` - see below

### Custom calculations

The CALC_CUSTOM column allows you to specify one or more custom calculations for an opposing Pokemon. Each calculation is separated by a semicolon (;) and each component of each calculation is separated by a forward slash (/). Some examples:
* EV4-;EV68;EV124+
    * This calculates effective speed for this Pokemon when it has 4 speed EVs and a speed-reducing nature; when it has 68 speed EVs and a speed-neutral nature; and when it has 124 speed EVs and a speed-increasing nature. In each case, it is assumed the Pokemon has 31 speed IVs.
* IV16/EV0-;IV24/EV4
    * This calculates effective speed for this Pokemon when it has 16 speed IVs, 0 speed EVs, and a speed-reducing nature; and when it has 24 speed IVs, 4 speed EVs, and a speed-neutral nature.
* IV31/EV212/BST1.5x;IV31/EV252/BST1.5x
    * This calculates effective speed for this Pokemon when it has 31 speed IVs, 212 speed EVs, a speed-neutral nature, and a 1.5x speed boost (e.g. from Choice Scarf or +1 speed stage); and when it has 31 speed IVs, 252 speed EVs, a speed-neutral nature, and a 1.5x speed boost
* EV252+/BST2.25x
    * This calculates effective speed for this Pokemon when it has 252 speed EVs, a speed-increasing nature, and a 2.25x speed boost (e.g. from holding Choice Scarf and receiving a Quark Drive speed boost). It is assumed the Pokemon has 31 speed IVs.

#### Default values

If a CALC_CUSTOM calculation string,
* does not specify IVs, the Pokemon is assumed to have 31 speed IVs
* does not specify EVs, the Pokemon is assumed to have 0 speed EVs with a speed-neutral nature
* does not specify BST, the Pokemon is assumed to have no additional speed boost

## Other Notes

* If your Pokemon outspeeds an opponent when you are at +1 speed stage and they are at 0 speed stage, then you also outspeed them when you are at 0 speed stage and they are at -1 speed stage. Take note, Icy Wind and Electroweb users.
* This does not necessarily hold true for every scenario where your speed stage is one higher than your opponent's. When you're at +1 speed stage and they are at 0, you're at 150% your original speed and they're at 100% their original speed. Your +1 speed boost is making you 50% faster than theirs is. When you're at +3 speed stages and they are at +2, you're at 250% your original speed and they're at 200% their original speed. In this case, your +3 speed boost is only making you (250 / 200 = 1.25) 25% faster than their +2 speed boost is making them. This software only gives you outspeed points for the +1/0 and 0/-1 speed stage scenarios.

## License

This software is licensed under the [MIT license](LICENSE).