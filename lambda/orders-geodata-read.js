
/*
    - Receive params that send in the orderid and transtimestamp
    - Read an item from the orders-geodata from DynamoDB
    - if not found, return 404 and err
    - if found, return 200 and item in json format
*/
// const AWSXRay = require('aws-xray-sdk-core');
// const AWSXRay = require('aws-xray-sdk');
// const AWS = AWSXRay.captureAWS(require('aws-sdk')); 

const AWS = require('aws-sdk'); 

// const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

// Redefine incoming event.body or event depending upon invocation
let eventBody;

// Define and populate lookup keys
let keyorderid;
let keytranstimestamp;

// Monitor performance
let startingMsRemaining;

// Generate the response format required by API Gateway Lambda Proxy Integration
function GenerateResponse(statusCode, body) {
    let response = {
        statusCode,
        headers: {
            'Access-Control-Allow-Methods' : 'OPTIONS,POST,GET',
            'Access-Control-Allow-Origin' : '*'
        },        
        body
    };
    
    return response;
}


exports.handler = (event, context, callback) => {

    // Capture Monitoring info
    startingMsRemaining = context.getRemainingTimeInMillis();
    
    console.log('\n Context: \n', context);
    console.log('\n Incoming Event Data: \n', JSON.stringify(event));
    
    
    /*
        Notice how we need to distinguish between the lambda function being invoked
        via the API vs the SDK or CLI even though all three provide the same payload as input
    */
    if (event.body) eventBody = JSON.parse(event.body);    // Coming in via API
    else            eventBody = event;                     // Coming in via Javascript Browser SDK or CLI
    
    
    // Establish the table lookup keys sent in via the client request
    if (eventBody.orderid !== null)         keyorderid = eventBody.orderid;
    else                                    keyorderid = '0';    // will result in 404
    
    
    if (eventBody.transtimestamp !== null)  keytranstimestamp = eventBody.transtimestamp;    // will position to specific sortkey of orderid
    else                                    keytranstimestamp = '0';                         // will position to first sortkey of orderid




    
    // Setup query parameters
    const queryParams = {
        TableName: 'orders-geodata',
        Limit: 1,
        KeyConditionExpression: 'orderid = :orderid and transtimestamp > :transtimestamp',
        ExpressionAttributeValues: {
            ':orderid': {'S': keyorderid},
            ':transtimestamp': {'S': keytranstimestamp}
        },
        ConsistentRead: false,
        ReturnConsumedCapacity: 'TOTAL',
        Select: 'ALL_ATTRIBUTES'
    };

    // Invoke the query
    dynamodb.query(queryParams, function (err, data) {
        if (err) {
            console.log('Error retrieving dynamodb data: \n', err);
            let msg = `An error occurred while retrieving data from "${queryParams.TableName}"`;
            let body = JSON.stringify({
                err,
                msg,
                startingMsRemaining,
                endingMsRemaining: context.getRemainingTimeInMillis(),
                incomingClient: eventBody.incomingClient        // echo back the client that made the request
            });
            callback(null, GenerateResponse(500, body));
        } else {
            if (data.Count === 0 ) {
                console.log('Item not found: \n', data);
                let msg = `No items found for key: "${keyorderid}" : "${keytranstimestamp}"`;
                let body = JSON.stringify({
                    data,
                    msg,
                    startingMsRemaining,
                    endingMsRemaining: context.getRemainingTimeInMillis(),
                    incomingClient: eventBody.incomingClient    // echo back the client that made the request
                });
                callback(null, GenerateResponse(404, body));

            } else
                console.log('Successful retrieval of dynamodab data: \n', data);
            let msg = `Item successfully retrieved for key: "${keyorderid}" : "${keytranstimestamp}"`;
            let body = JSON.stringify({
                data,
                msg,
                startingMsRemaining,
                endingMsRemaining: context.getRemainingTimeInMillis(),
                incomingClient: eventBody.incomingClient    // echo back the client that made the request
            });
            console.log('\n Response: \n', body);
            callback(null, GenerateResponse(200, body));
        }

    });
    
};