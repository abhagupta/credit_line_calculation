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
            return callback(new Error("File not found"));
        } 

        var array=[];
        var invalidLines = [];
        var isValid = true;
        var instream = fs.createReadStream(file)
            .pipe(es.split())
            .pipe(es.mapSync(function(line){
                array = line.split(' ');
                if(!validateArray(array)){
                    invalidLines.push(line);
                    isValid = false;
                }
            }))
            .on('error', function(err) {
            callback(err);
            })
            .on('end', function(){
            callback(null, {
                result: isValid,
                invalidLines: invalidLines
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
    
    extractMortgageTradeLines: function(file, callback){
        var mortgageLines = [];
        var mortgageAmount = 0.0;
        var array=[];
        var instream = fs.createReadStream(file)
        .pipe(es.split())
        .pipe(es.mapSync(function(line){
            var code = getCode(line);
            var subCode = getSubCode(line);
            var amount = getPaymentAmount(line);
            
            if (code === constants.CODE_MORTGAGE_LINE){
                if(constants.SUBCODE_MORTGAGE_LINE.includes(subCode)){
                    mortgageLines.push(line);
                    mortgageAmount = mortgageAmount + parseFloat(amount);
                }
            }
        }))
        .on('error', function(err) {
          callback(err);
        })
        .on('end', function(){
            if(mortgageLines.length === 0){
                mortgageAmount = parseFloat(constants.RENTAL_MORTGAGE_AMOUNT);
            }
            callback(null, {
                lines: mortgageLines,
                amount: mortgageAmount
            });
        });

    },

    extractNonHousingTradeLines: function (file, callback) {
        var nonHousingLines = [];
        var nonHousingAmount = 0.0;
        var array=[];
        var instream = fs.createReadStream(file)
        .pipe(es.split())
        .pipe(es.mapSync(function(line){
            var code = getCode(line);
            var subCode = getSubCode(line);
            var amount = getPaymentAmount(line);
            if (code !== constants.CODE_MORTGAGE_LINE && code !== constants.CODE_STUDENT_LINE) {
                nonHousingLines.push(line);
                nonHousingAmount = nonHousingAmount + parseFloat(amount);
            }
            
        }))
        .on('error', function(err) {
          callback(err);
        })
        .on('end', function(){
            callback(null, {
                lines: nonHousingLines,
                amount: nonHousingAmount
            });
        });
    },


    extractNonMortgageTradeLines: function (file, callback) {
        var nonMortgageLines = [];
        var nonMortGageAmount = 0.0;
        var array=[];
        var instream = fs.createReadStream(file)
        .pipe(es.split())
        .pipe(es.mapSync(function(line){
            var code = getCode(line);
            var subCode = getSubCode(line);
            var amount = getPaymentAmount(line);
            if (code !== constants.CODE_MORTGAGE_LINE) {
                nonMortgageLines.push(line);
                nonMortGageAmount = nonMortGageAmount + parseFloat(amount);
            }
            
        }))
        .on('error', function(err) {
          callback(err);
        })
        .on('end', function(){
            callback(null, {
                lines: nonMortgageLines,
                amount: nonMortGageAmount
            });
        });
    },

    convertToNonDecimalForHundred: function(amount){
        return amount * 100;
    }
    
    // extractStudentLoadCreditLines: function(file, callback){
    //     var studentLoanLines = [];
    //     var studentLoanAmount = 0.0;
    //     var array=[];
    //     var instream = fs.createReadStream(file)
    //     .pipe(es.split())
    //     .pipe(es.mapSync(function(line){
    //         var code = getCode(line);
    //         var subCode = getSubCode(line);
    //         var amount = getPaymentAmount(line);
    //         if (code !== constants.CODE_STUDENT_LINE) {
    //             studentLoanLines.push(line);
    //             studentLoanAmount = studentLoanAmount + parseFloat(amount.substring(1));
    //         }
            
    //     }))
    //     .on('error', function(err) {
    //       callback(err);
    //     })
    //     .on('end', function(){
    //         callback(null, {
    //             lines: studentLoanLines,
    //             amount: studentLoanAmount
    //         });
    //     });
    // }

}


function validateArray(array){
  if(array.length !== 5){
      return false;
  } 
  return true;
}


function getCode(line){
    return line.trim().split(' ')[1];
}

 function getSubCode(line){
    
    return line.trim().split(' ')[2];
}

 function getPaymentAmount(line){
    // console.log("line:", line.split(' ')[3]);
    return line.trim().split(' ')[3].substring(1);
}

function getCurrentBalance(line){
    return line.trim().split(' ')[4].substring(1);
}




