import { BidCalculator, getTotalSpent } from './js/BidCalculator.js';
import initialTestData from './data/tests.json';

// Load initial test data
const testDataArea = document.getElementById('testdata');
testDataArea.value = JSON.stringify(initialTestData);

document.getElementById('calculateBtn').addEventListener('click', (e) => {
  // Get values from page
  const iterations = parseInt(document.getElementById('iterations').value);
  const decimals = document.getElementById('precisiondecimals').value;
  const precision = parseFloat(`1e-${decimals}`);
  const moneyDecimals = parseInt(
    document.getElementById('moneydecimals').value
  );
  const moneyPrecision = Math.pow(10, moneyDecimals);
  const testData = JSON.parse(testDataArea.value);

  // Get the optimal expenses
  console.log(
    `Starting calculations with ${iterations} iterations and ${decimals} decimals of precision...`
  );
  const results = getResults(testData, iterations, precision, moneyPrecision);
  console.log(results);

  // Create a table and present the results
  createTable('test_results', testData, results, moneyPrecision);
});

/**
 * Calculate results for all test scenarios
 * @param {Array} testData Target test data
 * @param {Number} iterations Max iterations to search
 * @param {Number} precision Decimal precision (1x10^n)
 * @param {Number} moneyPrecision Decimals for currency calculations (10^n)
 * @returns Array with optimal expenses per test case scenario
 */
const getResults = (testData, iterations, precision, moneyPrecision) => {
  const results = [];
  for (let i = 0; i < testData.length; i++)
    results.push(
      new BidCalculator(testData[i].budget, moneyPrecision).calculate(
        iterations,
        precision
      )
    );

  return results;
};

/**
 * Creates a result table for test results
 * @param {string} tableId Table id
 * @param {Array} testData Target test data
 * @param {Array} results Test results
 * @param {Number} moneyPrecision Decimals for currency calculations (10^n)
 */
const createTable = (tableId, testData, results, moneyPrecision) => {
  // Map all the data into a single data set
  const data = testData.map((t, i) => ({
    budget: t.budget,
    expectedBid: t.expected.bid,
    expectedBasicFee: t.expected.basicFee,
    expectedSpecialFee: t.expected.specialFee,
    expectedAssociationFee: t.expected.associationFee,
    expectedStorageFee: t.expected.storageFee,
    actualBid: results[i].bid,
    actualBasicFee: results[i].basicFee,
    actualSpecialFee: results[i].specialFee,
    actualAssociationFee: results[i].associationFee,
    actualStorageFee: results[i].storageFee,
    match: assertEqual(t.expected, results[i], moneyPrecision),
    expectedSum: getTotalSpent(t.expected),
    actualSum: getTotalSpent(results[i]),
  }));

  // Create the table
  const table = $('#' + tableId);
  table.bootstrapTable?.('destroy'); // Destroy the table if already created
  table.bootstrapTable({
    data,
    pagination: true,
    columns: [
      {
        field: 'budget',
        title: 'Budget',
      },
      {
        field: 'expectedBid',
        title: 'Expected Bid',
      },
      {
        field: 'actualBid',
        title: 'Actual Bid',
      },
      {
        field: 'expectedBasicFee',
        title: 'Expected Basic Fee',
      },
      {
        field: 'actualBasicFee',
        title: 'Actual Basic Fee',
      },
      {
        field: 'expectedSpecialFee',
        title: 'Expected Special Fee',
      },
      {
        field: 'actualSpecialFee',
        title: 'Actual Special Fee',
      },
      {
        field: 'expectedAssociationFee',
        title: 'Expected Association Fee',
      },
      {
        field: 'actualAssociationFee',
        title: 'Actual Association Fee',
      },
      {
        field: 'expectedStorageFee',
        title: 'Expected Storage Fee',
      },
      {
        field: 'actualStorageFee',
        title: 'Actual Storage Fee',
      },
      {
        field: 'match',
        title: 'Match (Result rounded to 2 decimals)',
      },
      {
        field: 'expectedSum',
        title: 'Expected Total Spent',
      },
      {
        field: 'actualSum',
        title: 'Actual Total Spent',
      },
    ],
  });
};

/**
 * Assert whether a set of expenses comply with their expected values
 * @param {Object} expected
 * @param {Object} actual
 * @param {Number} moneyPrecision Decimals for currency calculations (10^n)
 * @returns Whether a set of expenses comply with their expected values
 */
const assertEqual = (expected, actual, moneyPrecision) =>
  Object.keys(expected).reduce(
    (a, k) =>
      a &&
      parseFloat(expected[k]) ===
        Math.round(actual[k] * moneyPrecision) / moneyPrecision,
    true
  );
