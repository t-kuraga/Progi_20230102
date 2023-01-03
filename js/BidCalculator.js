export class BidCalculator {
  budget;

  _bid = 0;
  get bid() {
    return this._bid;
  }
  _basicFee = 0;
  get basicFee() {
    return this._basicFee;
  }
  _specialFee = 0;
  get specialFee() {
    return this._specialFee;
  }
  _associationFee = 0;
  get associationFee() {
    return this._associationFee;
  }
  _storageFee = 100;
  get storageFee() {
    return this._storageFee;
  }

  constructor(budget) {
    this.budget = budget;
  }

  _setBasicFee(x) {
    const percentage = x * 0.1;
    this._basicFee = percentage <= 10 ? 10 : percentage >= 50 ? 50 : percentage;
  }

  _setSpecialFee(x) {
    this._specialFee = x * 0.02;
  }

  _setAssociationFee(x) {
    this._associationFee =
      x < 1 ? 0 : x >= 1 && x <= 500 ? 5 : x <= 1000 ? 10 : x <= 3000 ? 15 : 20;
  }

  calculateBid(x) {
    this._setBasicFee(x);
    this._setSpecialFee(x);
    this._setAssociationFee(x);
    this._bid =
      x +
      this._basicFee +
      this._specialFee +
      this._storageFee +
      this._associationFee -
      this.budget;
    return this._bid;
  }
}
