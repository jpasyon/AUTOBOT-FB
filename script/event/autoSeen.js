const axios = require('axios');
const path = require('path');
const fs = require('fs');
const request = require('request');

module.exports.config = {
  name: "autoSeen",
  version: "Juno",
  credits: "cttro",
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.body) {
    api.setMessageRead(event.messageID, () => {}, true);
  }
};
