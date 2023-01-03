/**
 * Bid Calculator class
 */
export class BidCalculator {
  _budget;
  _moneyPrecision;

  /**
   * Constructor
   * @param {Number} budget Target budget
   * @param {Number} moneyPrecision Decimals for currency calculations (10^n)
   */
  constructor(budget, moneyPrecision) {
    this._budget = budget;
    this._moneyPrecision = moneyPrecision;
  }

  /**
   * Calculate the basic fee for a given bid
   * @param {Number} x Target bid
   * @returns Fee
   */
  _getBasicFee(x) {
    const percentage = x * 0.1;
    return percentage <= 10 ? 10 : percentage < 50 ? percentage : 50;
  }

  /**
   * Calculate the special fee for a given bid
   * @param {Number} x Target bid
   * @returns Fee
   */
  _getSpecialFee(x) {
    return Math.round(x * 0.02 * this._moneyPrecision) / this._moneyPrecision;
  }

  /**
   * Calculate the association fee for a given bid
   * @param {Number} x Target bid
   * @returns Fee
   */
  _getAssociationFee(x) {
    return x < 1
      ? 0
      : x >= 1 && x <= 500
      ? 5
      : x <= 1000
      ? 10
      : x <= 3000
      ? 15
      : 20;
  }

  /**
   * Calculates the total expenses for a given bid
   * @param {Number} x Target bid
   * @returns Object with calculated expenses
   */
  calculateExpenses(x) {
    return {
      bid: x,
      basicFee: this._getBasicFee(x),
      specialFee: this._getSpecialFee(x),
      associationFee: this._getAssociationFee(x),
      storageFee: 100,
    };
  }

  /**
   * Numerical method to find the optimal bid
   * @param {Number} iterations Max iterations to search
   * @param {Number} precision Decimal precision (1x10^n)
   * @returns Optimal bid with calculated expenses
   */
  calculate(iterations, precision) {
    try {
      // A numerical method should do a binary search on the error function for
      // the problem:
      // I use a binary method instead of, say, regula falsi, to force boundaries on both sides of
      // the error function to come close to it, in case the closest approach has a negative error.
      // A negative error means you spend more than the budget, even if it is a decimal part.
      const [x, error] = bisect(
        // This is the error function: The difference between the total spent and the budget
        (x) => this._budget - getTotalSpent(this.calculateExpenses(x)),
        iterations,
        precision,
        this._moneyPrecision,
        precision,
        this._budget
      );

      console.log(x);
      return this.calculateExpenses(x);
    } catch (error) {
      console.error(`No solutions where found for Budget ${this.budget}`);
      return {
        bid: 0,
        basicFee: 0,
        specialFee: 0,
        associationFee: 0,
        storageFee: 0,
      };
    }
  }
}

/**
 * Adds up all expenses to get a total
 * @param {Object} expenses Expenses object
 * @returns Total spent
 */
export function getTotalSpent(expenses) {
  return (
    expenses.bid +
    expenses.basicFee +
    expenses.specialFee +
    expenses.storageFee +
    expenses.associationFee
  );
}

/**
 * A numerical bisection method to perform a binary search on continuous functions inside an interval
 * @see https://en.wikipedia.org/wiki/Bisection_method
 * @param {Function} func Target function
 * @param {Number} iterations Max iterations to search
 * @param {Number} precision Decimal precision (1x10^n)
 * @param {Number} xPrecision Precision for x axis values (10^n)
 * @param {Number} a Interval start
 * @param {Number} b Interval end
 * @returns Closest x value to a root, and error for x value
 */
function bisect(func, iterations, precision, xPrecision, a, b) {
  let error_a = func(a);
  let error_b = func(b);
  if (error_a * error_b >= 0) throw 'You have not assumed right a and b\n';

  // Initialize result
  let c;
  let error_c;

  for (let i = 0; i < iterations; i++) {
    // Find the point that touches x axis
    c = Math.round(((a + b) / 2) * xPrecision) / xPrecision;
    error_c = func(c);

    // Check if the above found point is root
    if (c === a || c === b || error_c == 0 || Math.abs(error_c) <= precision)
      break;

    // Decide the side to repeat the steps
    if (error_c * error_a < 0) {
      b = c;
      error_b = error_c;
    } else {
      a = c;
      error_a = error_c;
    }
  }

  // Although a root with a negative error could be more precise, the required problem
  // mandates not to over spend. Therefore, the x value with the smallest positive error
  // is to be returned
  return error_c >= 0
    ? [c, error_c]
    : error_a !== error_c && error_a >= 0
    ? [a, error_a]
    : [b, error_b];
}
