const jwt = require('jsonwebtoken');

exports.handler = async event => {
  let encodedToken = getEncodedToken(event.authorizationToken);
  try {
    jwt.verify(encodedToken, 'your-256-bit-secret');
    return allowPolicy(event.methodArn);
  } catch (err) {
    console.log('incoming event', event);
    console.error(err);
    return denyAllPolicy();
  }
};

const getEncodedToken = header => {
  return header.split(' ')[1];
};

const denyAllPolicy = () => {
  return {
    principalId: '*',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: '*',
          Effect: 'Deny',
          Resource: '*'
        }
      ]
    }
  };
};

const allowPolicy = methodArn => {
  return {
    principalId: 'apigateway.amazonaws.com',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: methodArn
        }
      ]
    },
    context: {
      name: 'ali kadir',
      age: 31
    }
  };
};
