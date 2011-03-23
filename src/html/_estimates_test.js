/*global TestCase, assertSame, assertEquals, assertTrue, assertFalse */

(function() {
	var Test = new TestCase("EstimateTest");
	var estimates;
	var config;

	Test.prototype.setUp = function() {
		config = {
			name: "My name",
			updated: "5 Jan 2011",
			riskMultipliers: [1, 2, 4],
			currentIterationStarted: "1 Jan 2011",
			iterationLength: 7,
			velocity: 10,
			features: [
				["feature A", 10],
				["feature B", 20],
				["feature C", 70]
			]
		};
		estimates = new rabu_ns.Estimates(config);
	};

	Test.prototype.test_bareData = function() {
		assertEquals("My name", estimates.name());
		assertEquals(new Date("5 Jan 2011"), estimates.updated());
		assertEquals(new Date("1 Jan 2011"), estimates.currentIterationStarted());
		assertEquals(7, estimates.iterationLength());
		assertEquals(10, estimates.velocity());
	};

	Test.prototype.test_riskMultipliers = function() {
		assertEquals(1, estimates.tenPercentMultiplier());
		assertEquals(2, estimates.fiftyPercentMultiplier());
		assertEquals(4, estimates.ninetyPercentMultiplier());
	};

	Test.prototype.test_effortRemaining_isSumOfFeatureEstimates = function() {
		assertEquals(100, estimates.totalEstimate());

		config.features = [["feature A", 10]];
		assertEquals("one feature", 10, estimates.totalEstimate());

		config.features = [];
		assertEquals("no feature", 0, estimates.totalEstimate());
	};

	Test.prototype.test_features = function() {
		function assertFeatureEquals(name, expected, actual) {
			assertEquals(name + " name", expected.name(), actual.name());
			assertEquals(name + " estimate", expected.estimate(), actual.estimate());
		}

		var actual = estimates.features();
		assertEquals("length", 3, actual.length);
		assertFeatureEquals("feature 1", new rabu_ns.Feature(["feature A", 10]), actual[0]);
		assertFeatureEquals("feature 2", new rabu_ns.Feature(["feature B", 20]), actual[1]);
		assertFeatureEquals("feature 3", new rabu_ns.Feature(["feature C", 70]), actual[2]);
	};
}());

(function() {
	var Test = new TestCase("FeatureTest");

	Test.prototype.test_bareData = function() {
		var feature = new rabu_ns.Feature(["feature name", 33]);
		assertEquals("name", "feature name", feature.name());
		assertEquals("estimate", 33, feature.estimate());
	};

	Test.prototype.test_done = function() {
		assertTrue("done", new rabu_ns.Feature(["done", 0]).isDone());
		assertFalse("not done", new rabu_ns.Feature(["not done", 10]).isDone());
	};
}());