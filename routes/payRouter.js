const express = require('express');
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');
const pay_controller = require('../controllers/pay_controller');
// const fs = require('fs');
// const { userInfo } = require('os');

// FETCH BILL INDEX
router.get('/fetch_bill', pay_controller.index);

router.post('/fetch_bill', pay_controller.conf_biller);

router.post('/get_params', pay_controller.get_params);

router.post('/get_bill', pay_controller.fetch_bill);

router.post('/conf_bill', pay_controller.conf_bill);

router.post('/quick_pay', pay_controller.conf_quick_pay);

router.post('/pay_bill', pay_controller.pay_bill);

router.get('/receipt', (req, res) => {
    console.log(req.query);
    var { trns_id, trns_dt, msg, BillarName, CustomerName, BillNumber, BillPeriod, BillDate, DueDate, BASE_BILL_AMOUNT, AppRefNumber, PayeePhoneNo, BlrId, PayMode } = req.query;
    res.render('pay/receipt', { trns_id, trns_dt, msg, BillarName, CustomerName, BillNumber, BillPeriod, BillDate, DueDate, BASE_BILL_AMOUNT, AppRefNumber, PayeePhoneNo, BlrId, PayMode })
});
// router.get('/test', (req, res) => {
//     function between(min, max) {  
//         return Math.floor(
//             Math.random() * (max - min + 1) + min
//         )
//     }
//     console.log('INTB' + between(111111111111111, 999999999999999));
// })

router.get('/get_biller_catagory', async (req, res, next) => {
    try {
        var category = {
            'method': 'POST',
            'url': 'https://apig.indusind.com/ibl/prod/COUHubAPI/GetBillerCategories',
            'headers': {
                'X-IBM-Client-Secret': 'oQ7iX8fN3hA0jQ6vI5sO2bE3hU4dR5iJ6bA5cM6kK6oA2bM0rM',
                'X-IBM-Client-Id': 'ec9370b4-dd3b-4f58-8c33-6f6e104ab642',
                'Content-Type': 'application/xml',
                'Cookie': 'ASP.NET_SessionId=eprlnvyulnga5rpjvsbqovt1'
            },
            body: '<root><AgntId>IN01IN20INTU00000001</AgntId><Keyword>21835678617541456491</Keyword></root>'

        };
        await request(category, function (error, catResponse) {
            if (error) throw new Error(error);
            const cat_xml = catResponse.body;
            xml2js.parseString(cat_xml, (err, result) => {
                if (err) {
                    throw err;
                }
                // console.log(result);
                // const data = JSON.stringify(result, null, 4);
                const category_data = JSON.stringify(result.Response.Msg[0].BillerCategories[0].Category);
                res.send(category_data);
                // res.render('pay/index', { states });

            });
        });
    } catch (err) {
        console.log({ "msg": err });
    }
});

router.get('/get_state', async (req, res, next) => {
    try {
		var cat_id = req.query.cat_id;
        var options = {
            'method': 'POST',
            'url': 'https://apig.indusind.com/ibl/prod/COUHubAPI/GetLocations',
            'headers': {
                'X-IBM-Client-Secret': 'oQ7iX8fN3hA0jQ6vI5sO2bE3hU4dR5iJ6bA5cM6kK6oA2bM0rM',
                'X-IBM-Client-Id': 'ec9370b4-dd3b-4f58-8c33-6f6e104ab642',
                'Content-Type': 'application/xml',
                'Cookie': 'ASP.NET_SessionId=eprlnvyulnga5rpjvsbqovt1'
            },
            body: '<root><AgntId>IN01IN20INTU00000001</AgntId><Keyword>21835678617541456491</Keyword><CategoryID>'+ cat_id +'</CategoryID></root>'

        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            const xml = response.body;
            xml2js.parseString(xml, (err, result) => {
                if (err) {
                    throw err;
                }
                const data = JSON.stringify(result, null, 4);
                const states = JSON.stringify(result.Response.Msg[0].root[0].Location);
                res.send(states);

            });
        });
    } catch (err) {
        console.log({ "msg": err });
    }
});

router.get('/get_city', async (req, res, next) => {
    try {
        var options = {
            'method': 'POST',
            'url': 'https://ibluatapig.indusind.com/app/uat/HubComfort/BBPSHubComfort/GetCities',
            'headers': {
                'X-IBM-Client-Secret': 'uQ1cQ3qB0jG6rP0qY1pF2wB8eQ1lO6oJ0eJ7pK1eG2bB0iD3kV',
                'X-IBM-Client-Id': '3b67954e-0045-4455-9a94-2b98a82c07d7',
                'Content-Type': 'application/xml',
                'Cookie': 'ASP.NET_SessionId=eprlnvyulnga5rpjvsbqovt1'
            },
            body: '<root><AgntId>IN01IN03AGT000000002</AgntId><Keyword>AIAGT$20170704</Keyword><StId>' + req.query.StId + '</StId></root>'

        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            const xml = response.body;
            xml2js.parseString(xml, (err, result) => {
                if (err) {
                    throw err;
                }
                const data = JSON.stringify(result, null, 4);
                // console.log(result);
                // const states = JSON.stringify(result.Response.Msg[0].States[0].State);
                res.send(data);
            });
        });
    } catch (err) {
        console.log({ "msg": err });
    }
});

router.get('/get_biller_by_cov', async (req, res, next) => {
    try {
		var cat_id = req.query.cat_id,
			cov = req.query.cov;
        var options = {
            'method': 'POST',
            'url': 'https://apig.indusind.com/ibl/prod/COUHubAPI/GetBillers',
            'headers': {
                'X-IBM-Client-Secret': 'oQ7iX8fN3hA0jQ6vI5sO2bE3hU4dR5iJ6bA5cM6kK6oA2bM0rM',
                'X-IBM-Client-Id': 'ec9370b4-dd3b-4f58-8c33-6f6e104ab642',
                'Content-Type': 'application/xml',
                'Cookie': 'ASP.NET_SessionId=eprlnvyulnga5rpjvsbqovt1'
            },
            body: '<root><AgntId>IN01IN20INTU00000001</AgntId><Keyword>21835678617541456491</Keyword><CatId>'+ cat_id +'</CatId><Coverage>'+ cov +'</Coverage></root>'

        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            const xml = response.body;
            xml2js.parseString(xml, (err, result) => {
                if (err) {
                    throw err;
                }
                const data = JSON.stringify(result, null, 4);
                // console.log(result);
                const states = JSON.stringify(result.Response.Msg[0].Billers[0].Biller);
                res.send(states);
            });
        });
    } catch (err) {
        console.log({ "msg": err });
    }
});

router.get('/testPaySave', pay_controller.pay_bill)

module.exports = router;