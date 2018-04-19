const rp = require('request-promise');


module.exports = function (app) {
    // Enable CORS
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
      
    app.get('/api/geodata/:orderid/:timestamp', (req, res) => {

        const geodata = {
            'orderid': req.params.orderid,
            'transtimestamp': req.params.timestamp
        };

        // Access geographic location via API G/W
        const uri = 'https://dde7i2es4g.execute-api.us-west-2.amazonaws.com/v1/api/orders-geodata-read';
        const options = {
            method: 'POST',
            uri: uri,
            body: geodata,
            json: true,
            headers: {
                'Content-Type': 'application/json'
            }


        };

        rp(options)
            .then(function (response) {
                // POST succeeded...
                let item;
                console.log(response);
                if(response.data.Items) {
                    item = response.data.Items[0];
                } else {
                    item = '';
                }

                res.json({
                    item: item
                });
            })
            .catch(function (err) {
                // POST failed...
                console.log(err);
                res.json({
                    msg: 'An error occurred',
                    err: err
                });
            });

    });
};