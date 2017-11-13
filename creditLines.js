'use strict'
var fs = require('fs');
var readline = require('readline');
var constants = require('./constants');
var utils = require('./utils');

module.exports = {
    calculateCreditOutPut: function (file, callback) {
        utils.readInputFileAndValidate(file, function (err, data) {
            if (err) {
                throw Error(err);
            } else {
                if (!data.result) {
                    callback(null, {
                        error: "Error detected in the file",
                        invalidLines: data.invalidLines
                    });
                } else {
                    var fixedExpensesBeforeEducation = 0.0;
                    utils.extractMortgageTradeLines(data.tradeLines, function (err, amount) {
                        fixedExpensesBeforeEducation = fixedExpensesBeforeEducation + amount.amount;
                        utils.extractNonHousingTradeLines(data.tradeLines, function (err, amountNonHousing) {
                            fixedExpensesBeforeEducation = fixedExpensesBeforeEducation + amountNonHousing.amount;
                            fixedExpensesBeforeEducation = utils.convertToNonDecimalForHundred(utils.roundUpInDecimals(fixedExpensesBeforeEducation, 2));
                            
                            var outputTradeLines = [];
                            data.tradeLines.forEach(function(line){
                                var code = line.code;
                                var subCode = line.subCode;
                                var monthly_payment = line.paymentAmount;
                                var current_balance = line.currentBalance;
                                var type = utils.identifyCreditCode(code);

                                var creditTradeLine = {
                                    type: type,
                                    monthly_payment: utils.convertToNonDecimalForHundred(monthly_payment),
                                    current_balance: utils.convertToNonDecimalForHundred(current_balance)
                                };
                                outputTradeLines.push(creditTradeLine);
                            });

                            var result = {
                                fixed_expenses_before_education: fixedExpensesBeforeEducation,
                                tradeLines: outputTradeLines
                            }
                            return callback(null, result);
                        })
                    });
                }
            }
        });

    }
}

