import { BidCalculator } from './js/BidCalculator.js';
import testData from './data/tests.json';

document.getElementById('calculateBtn').addEventListener('click', (e) => {
  const iterations = document.getElementById('iterations').value;
  const decimals = document.getElementById('decimals').value;

  console.log(
    `Starting calculations with ${iterations} iterations and ${decimals} decimals of precision...`
  );
  for (let i = 0; i < testData.length; i++) {
    const calculator = new BidCalculator(testData[i].budget);
    var x = calculator.calculateBid(x);
    console.log(x);
  }
});
