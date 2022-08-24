export default class MyWallet {
  static wallet = null;

  static getWallet() {
    return this.wallet;
  }

  static setWallet(wallet: any) {
    this.wallet = wallet;
  }
}
