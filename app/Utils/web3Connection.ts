export default class Web3Connection {
  static connection: any = null;

  static getConnection(): any {
    return this.connection;
  }

  static setConnection(connection: any) {
    this.connection = connection;
  }
}
