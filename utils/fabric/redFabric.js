'use strict';
var fabricClient = require('./FabricClient');

module.exports = class RedFabric {

  constructor(user) {
    this.currentUser;
    this.issuer;
    this.userName = user;
    this.connection = fabricClient;
  }

  init() {
    var isUser1 = false;
    if (this.userName == "user1") {
      isUser1 = true;
    }
    return this.connection.initCredentialStores().then(() => {
      return this.connection.getUserContext(this.userName, true)
    }).then((user) => {
      this.issuer = user;
      if (isUser1) {
        return user;
      }
      return this.ping();
    }).then((user) => {
      this.currentUser = user;
      return user;
    })
  }

  queryAllDatos() {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      chaincodeId: 'mycontract',
      fcn: 'queryAllDatos',
      args: [],
      txId: tx_id
    };
    return this.connection.query(requestData);
  }

  queryHistory(id) {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      chaincodeId: 'mycontract',
      fcn: 'getDatoHistory',
      args: [id],
      txId: tx_id
    };
    return this.connection.query(requestData);
  }

  fantasticQuery(query) {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      chaincodeId: 'mycontract',
      fcn: 'queryDatoCouchDB',
      args: [query],
      txId: tx_id
    };
    return this.connection.query(requestData);
  }
  
}


