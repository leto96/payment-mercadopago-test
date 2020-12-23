const connectionFactory = require('./dataAccess/connection');

function user(){

  const connection = connectionFactory();

  async function createTestUser(token){
    const endpointToCreate = 'https://api.mercadopago.com/users/test_user';
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
    const body = '{"site_id":"MLB"}';

    const createResult = await connection.makeRequest(endpointToCreate, 'POST', headers, body);
    if(createResult.status === 200 || createResult.status === 201)
    return createResult.data;
  }

  return {
    createTestUser
  }
}

module.exports = user;