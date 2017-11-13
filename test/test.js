var path = require('path');
var utils = require('../utils');
var expect = require('chai').expect;
var creditlines = require('../creditLines');

var tradeLinesJson = [{
    code: '10',
    subCode: '12',
    paymentAmount: '1470.31',
    currentBalance: '659218.00'
},
{
    code: '5',
    subCode: '1',
    paymentAmount: '431.98',
    currentBalance: '51028.00'
},
{
    code: '8',
    subCode: '15',
    paymentAmount: '340.12',
    currentBalance: '21223.20'
},
{
    code: '10',
    subCode: '15',
    paymentAmount: '930.12',
    currentBalance: '120413.00'
},
{
    code: '12',
    subCode: '5',
    paymentAmount: '150.50',
    currentBalance: '6421.21'
}
];

var tradeLinesJsonWithNoMortgageLines = [{
    code: '11',
    subCode: '12',
    paymentAmount: '1470.31',
    currentBalance: '659218.00'
},
{
    code: '5',
    subCode: '1',
    paymentAmount: '431.98',
    currentBalance: '51028.00'
},
{
    code: '8',
    subCode: '15',
    paymentAmount: '340.12',
    currentBalance: '21223.20'
},
{
    code: '11',
    subCode: '15',
    paymentAmount: '930.12',
    currentBalance: '120413.00'
},
{
    code: '12',
    subCode: '5',
    paymentAmount: '150.50',
    currentBalance: '6421.21'
}
]

var tradeLines = [ 
    [ '2015-10-10', '10', '12', '$1470.31', '$659218.00' ],
    [ '2015-10-10', '5', '1', '$431.98', '$51028.00' ],
    [ '2015-10-09', '8', '15', '$340.12', '$21223.20' ],
    [ '2015-10-10', '10', '15', '$930.12', '$120413.00' ],
    [ '2015-10-09', '12', '5', '$150.50', '$6421.21' ]
 ];

 var tradeLinesWithNoMortageLines = [ 
    [ '2015-10-10', '11', '12', '$1470.31', '$659218.00' ],
    [ '2015-10-10', '5', '1', '$431.98', '$51028.00' ],
    [ '2015-10-09', '8', '15', '$340.12', '$21223.20' ],
    [ '2015-10-10', '11', '15', '$930.12', '$120413.00' ],
    [ '2015-10-09', '12', '5', '$150.50', '$6421.21' ]
 ];

describe("Utils Test", function () {
    it("should be able to read a valid file successfully", function (done) {
        utils.readInputFileAndValidate(__dirname + "/../input/input.txt", function (err, result) {
            expect(err).to.be.null;
            expect(result.result).to.be.true;
            done();
        });
    });
    it("should be able throw an invalid file with errored lines", function (done) {
        utils.readInputFileAndValidate(__dirname + "/../input/input_incorrect.txt", function (err, result) {
            expect(err).to.be.null;
            expect(result.invalidLines).to.have.lengthOf(2);
            done();
        });
    });

    it("should be able extract mortgage lines from file", function (done) {
        utils.extractMortgageTradeLines(tradeLinesJson, function (err, result) {
            expect(err).to.be.null;
            expect(result.lines).to.have.lengthOf(2);
            expect(result.amount).to.equal(2400.43);
            done();
        });
    });

    it("should be able show default mortgage amount if no mortgage lines are found", function (done) {
        utils.extractMortgageTradeLines(tradeLinesJsonWithNoMortgageLines, function (err, result) {
            expect(err).to.be.null;
            expect(result.lines).to.have.lengthOf(0);
            expect(result.amount).to.equal(1021.00);
            done();
        });
    });

    it("should be able to round up decimal to reqd format", function(done){
        expect(utils.roundUpInDecimals(24.37788,2)).to.equal(24.38);
        done();
    });

    it("should be throw an error when not enough arguments are provided ", function(done){
        expect(utils.roundUpInDecimals(24.37788)).to.be.an('error');
        done();
    });

    it("should be able extract non housing lines from file", function (done) {
        utils.extractNonHousingTradeLines(tradeLinesJson, function (err, result) {
            expect(err).to.be.null;
            expect(result.lines).to.have.lengthOf(2);
            expect(result.amount).to.equal(490.62);
            done();
        });
    });

    it("should get a valid array for output creditlines", function (done) {
        creditlines.calculateCreditOutPut(path.resolve(__dirname, "../input/input.txt"), function (err, result) {
            expect(err).to.be.null;
            expect(result.tradeLines).to.have.lengthOf(5);
            expect(result.fixed_expenses_before_education).to.equal(289105);
            done();
        });
    });
})