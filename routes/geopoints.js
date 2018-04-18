const aws = require('aws-sdk');
const rp = require('request-promise');


module.exports = function (app) {
    app.get('/api/geodata/:orderid/:timestamp', (req, res) => {
        // res.json({
        //     msg: 'You have reached the order tracking application',
        //     orderid: req.params.orderid,
        //     timestamp: req.params.timestamp
        // });

        // let geodata = {
        //     'orderid': req.params.orderid,
        //     'transtimestamp': req.params.timestamp
        // };

        const geodata = {
            "orderid": "12345",
            "transtimestamp": "0"
        };

        const options = {
            method: 'POST',
            uri: 'https://dde7i2es4g.execute-api.us-west-2.amazonaws.com/v1/api/orders-geodata-read',
            body: geodata,
            json: true,
            headers: {
                'Content-Type': 'application/json'
            }


        };

        rp(options)
            .then(function (data) {
                // POST succeeded...
                let item = data.Items[0];

                res.json({
                    data: item
                });
            })
            .catch(function (err) {
                // POST failed...
                res.json({
                    msg: 'An error occurred',
                    err: err
                });
            });


        // $.ajax({
        //     type: 'POST',
        //     url: 'https://hxrwcabsx0.execute-api.us-west-2.amazonaws.com/v2/api/geodata-read',
        //     data: JSON.stringify(geodata),
        //     dataType: 'json',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }

        // }).done(function (data, status) {
        //     console.log('data: \n', data);
        //     let item = data.Items[0];
        //     let position = {
        //         latitude: Number(item.lat.S),
        //         longitude: Number(item.lon.S)
        //     };

        //     res.json({
        //         latitude: position.latitude,
        //         longitude: position.longitude
        //     });
        // });


    });
};