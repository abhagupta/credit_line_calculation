'use strict'
var fs = require('fs');
var readline = require('readline');
var stream  = require('stream');
var es = require('event-stream');
var constants = require('./constants');
var fs = require('fs');

module.exports  = {

    readInputFileAndValidate : function(file, callback) {

        if (!fs.existsSync(file)) {
            return callback(new Error("File " + file + " not found"));
        } 

        var lineItems = [];
        var allTradeLines = [];
        var invalidLines = [];
        var isValid = true;
        var instream = fs.createReadStream(file)
            .pipe(es.split())
            .pipe(es.mapSync(function(line){
                if(line.trim().length > 0){
                    lineItems = line.trim().split(' ');
                    if(!validateArray(lineItems)){
                        invalidLines.push(line);
                        isValid = false;
                    } else {
                        var jsonLine = convertLineItemsToJson(lineItems);
                        allTradeLines.push(jsonLine);
                    }
               }
            }))
            .on('error', function(err) {
             callback(err);
            })
            .on('end', function(){
                callback(null, {
                    result: isValid,
                    invalidLines: invalidLines,
                    tradeLines: allTradeLines
                });
           });
        
    },

    getCode: function(line){
        return getCode(line);
    },
    
     getSubCode: function(line){
        return getSubCode(line);
    },
    
     getPaymentAmount: function(line){
        return getPaymentAmount(line);
    },

    getCurrentBalance: function(line){
        return getCurrentBalance(line);
    },

    identifyCreditCode: function(code){
        if(code === constants.CODE_MORTGAGE_LINE) {
            return constants.TERM_MORTGAGE;
        } else if (code === constants.CODE_STUDENT_LINE) {
            return constants.TERM_STUDENT;
        } else{
            return constants.TERM_OTHER;
        }
    },

    roundUpInDecimals: function(value, decimals){
        if(arguments.length !== 2){
            return new Error("Arguments not enough");
        }
        return Number(Math.round(value + 'e' + decimals) + 'e-'+decimals);
    },
    
    extractMortgageTradeLines: function(tradeLines, callback){
        var mortgageLines = [];
        var mortgageAmount = 0.0;

        tradeLines.forEach(function(line){
            var code = line.code;
            var subCode = line.subCode;
            var amount = line.paymentAmount;
            if (code === constants.CODE_MORTGAGE_LINE){
                if(constants.SUBCODE_MORTGAGE_LINE.includes(subCode)){
                    mortgageLines.push(line);
                    mortgageAmount = mortgageAmount + parseFloat(amount);
                }
            }
        });

        if(mortgageLines.length === 0){
            mortgageAmount = parseFloat(constants.RENTAL_MORTGAGE_AMOUNT);
        }
        callback(null, {
            lines: mortgageLines,
            amount: mortgageAmount
        });
    },

    extractNonHousingTradeLines: function (tradeLines, callback) {
        var nonHousingLines = [];
        var nonHousingAmount = 0.0;
        var array=[];

        tradeLines.forEach(function(line){
            var code = line.code;
            var subCode = line.subCode;
            var amount = line.paymentAmount;
            if (code !== constants.CODE_MORTGAGE_LINE && code !== constants.CODE_STUDENT_LINE) {
                nonHousingLines.push(line);
                nonHousingAmount = nonHousingAmount + parseFloat(amount);
            }
        
        });
        callback(null, {
            lines: nonHousingLines,
            amount: nonHousingAmount
        });
    },

    convertToNonDecimalForHundred: function(amount){
        return amount * 100;
    }

}


function validateArray(array){
  if(array.length !== 5){
      return false;
  } 
  return true;
}

function convertLineItemsToJson(lineItems){
  var jsonLine = {
      code: lineItems[1].trim(),
      subCode: lineItems[2].trim(),
      paymentAmount: lineItems[3].trim().substring(1),
      currentBalance: lineItems[4].trim().substring(1)
  }

  return jsonLine;
}




