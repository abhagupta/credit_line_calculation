'use strict'
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var es = require('event-stream');
var constants = require('./constants');
var utils = require('./utils');

module.exports = {

    calculateCreditOutPut: function (file, callback) {

        utils.readInputFileAndValidate(file, function (err, data) {
            if (err) {
               // throw Error(err);
            } else {
                if (!data.result) {
                    callback(null, {
                        error: "Error detected in the file",
                        invalidLines: data.invalidLines
                    });
                }
            }
        });

        //calculate housing tradeline amount
        var fixedExpensesBeforeEducation = 0.0;
        utils.extractMortgageTradeLines(file, function (err, amount) {
            fixedExpensesBeforeEducation = fixedExpensesBeforeEducation + amount.amount;
            utils.extractNonHousingTradeLines(file, function (err, amountNonHousing) {
                fixedExpensesBeforeEducation = fixedExpensesBeforeEducation + amountNonHousing.amount;
                fixedExpensesBeforeEducation = utils.convertToNonDecimalForHundred(utils.roundUpInDecimals(fixedExpensesBeforeEducation, 2));
                var tradeLines = [];
                var instream = fs.createReadStream(file)
                    .pipe(es.split())
                    .pipe(es.mapSync(function (line) {
                        var code = utils.getCode(line);
                        var subCode = utils.getSubCode(line);
                        var monthly_payment = utils.getPaymentAmount(line);
                        var current_balance = utils.getCurrentBalance(line);
                        var type = utils.identifyCreditCode(code);

                        var creditTradeLine = {
                            type: type,
                            monthly_payment: utils.convertToNonDecimalForHundred(monthly_payment),
                            current_balance: utils.convertToNonDecimalForHundred(current_balance)
                        };

                        tradeLines.push(creditTradeLine);

                    }))
                    .on('error', function (err) {
                        console.log("Error thrown ", err);
                    })
                    .on('end', function () {
                        //console.log("Finished reading file");
                        //console.log(tradeLines);
                        var result = {
                            fixed_expenses_before_education: fixedExpensesBeforeEducation,
                            tradeLines: tradeLines
                        }
                        return callback(null, result);
                    });
            })
        });


    }
}

