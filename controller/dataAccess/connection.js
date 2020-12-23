const axios = require('axios');
const { json } = require('body-parser');

function connection(){

  async function makeRequest(url, method, headers, content){

    try {
      
      const result = await axios({
        method: method,
        url: url,
        data: content,
        headers: headers
      });

      return result;

    } catch (error) {
      return error; 
    }
  }

  return {
    makeRequest
  }
}

module.exports = connection;