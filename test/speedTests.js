const {describe, it} = require("node:test");
const assert = require('node:assert');

const { CustomTest } = require("../src/speedTests");

describe("Custom test", () => {
    it("should provide a reasonable default value", async () => {
        const speedSpec = getCustomTestSpeedSpec("");

        await it("for IVs", () => {
            assert.strictEqual(speedSpec.ivs, 31);
        });

        await it("for EVs", () => {
            assert.strictEqual(speedSpec.evs, 0);
        });

        await it("for nature effect", () => {
            assert.strictEqual(speedSpec.natureEffect, 0);
        });

        await it("for boost factor", () => {
            assert.strictEqual(speedSpec.boostFactor, 1);
        });
    });

    it("should parse spec descriptor strings correctly", async () => {
        const speedSpec = getCustomTestSpeedSpec("IV11/EV64-/BST2.25x");

        await it("for IV values", () => {
            assert.strictEqual(speedSpec.ivs, 11);
        });

        await it("for EV values", () => {
            assert.strictEqual(speedSpec.evs, 64);
        });

        await it("for nature effect values", () => {
            assert.strictEqual(speedSpec.natureEffect, -1);
        });

        await it("for boost factor values", () => {
            assert.strictEqual(speedSpec.boostFactor, 2.25);
        });
    });
	
	it("is tolerant of whitespace", async () => {
		const speedSpec = getCustomTestSpeedSpec("  IV 43 / EV 112  +/ BST 3.5 x ");
		
		assert.strictEqual(speedSpec.ivs, 43);
		assert.strictEqual(speedSpec.evs, 112);
		assert.strictEqual(speedSpec.natureEffect, 1);
		assert.strictEqual(speedSpec.boostFactor, 3.5);
	});
	
	it("parses spec descriptors in a case-insensitive manner", async () => {
		const speedSpec = getCustomTestSpeedSpec("iv19/ev200/bst1.5X");
		
		assert.strictEqual(speedSpec.ivs, 19);
		assert.strictEqual(speedSpec.evs, 200);
		assert.strictEqual(speedSpec.natureEffect, 0);
		assert.strictEqual(speedSpec.boostFactor, 1.5);
	});
	
	it("supports spec descriptors with components listed in different order", async () => {
		const speedSpec = getCustomTestSpeedSpec("BST1.5x/EV244-/IV23");
		
		assert.strictEqual(speedSpec.ivs, 23);
		assert.strictEqual(speedSpec.evs, 244);
		assert.strictEqual(speedSpec.natureEffect, -1);
		assert.strictEqual(speedSpec.boostFactor, 1.5);
	});
	
	it("supports spec descriptors with only IV given and provides defaults for rest", async () => {
		const speedSpec = getCustomTestSpeedSpec("IV13");
		
		assert.strictEqual(speedSpec.ivs, 13);
		assert.strictEqual(speedSpec.evs, 0);
		assert.strictEqual(speedSpec.natureEffect, 0);
		assert.strictEqual(speedSpec.boostFactor, 1);
	});
	
	it("supports spec descriptors with only EV given and provides defaults for rest", async () => {
		const speedSpec = getCustomTestSpeedSpec("EV123");
		
		assert.strictEqual(speedSpec.ivs, 31);
		assert.strictEqual(speedSpec.evs, 123);
		assert.strictEqual(speedSpec.natureEffect, 0);
		assert.strictEqual(speedSpec.boostFactor, 1);
	});
	
	it("supports spec descriptors with only boost factor given and provides defaults for rest", async () => {
		const speedSpec = getCustomTestSpeedSpec("BST2x");
		
		assert.strictEqual(speedSpec.ivs, 31);
		assert.strictEqual(speedSpec.evs, 0);
		assert.strictEqual(speedSpec.natureEffect, 0);
		assert.strictEqual(speedSpec.boostFactor, 2);
	});

});

function getCustomTestSpeedSpec(specDescriptor) {
    const test = new CustomTest(specDescriptor);
    return test.getPokemonSpeedSpec();
}