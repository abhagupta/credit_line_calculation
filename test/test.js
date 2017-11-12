var path = require('path');
var utils = require('../utils');
var expect = require('chai').expect;
var creditlines = require('../creditLines');

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
        utils.extractMortgageTradeLines(__dirname + "/../input/input.txt", function (err, result) {
            expect(err).to.be.null;
            expect(result.lines).to.have.lengthOf(2);
            expect(result.amount).to.equal(2400.43);
            done();
        });
    });

    it("should be able show default mortgage amount if no mortgage lines are found", function (done) {
        utils.extractMortgageTradeLines(__dirname + "/../input/input_no_mortgage_lines.txt", function (err, result) {
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
        utils.extractNonHousingTradeLines(__dirname + "/../input/input.txt", function (err, result) {
            expect(err).to.be.null;
            expect(result.lines).to.have.lengthOf(2);
            expect(result.amount).to.equal(490.62);
            done();
        });
    });

    it("should be able extract non mortgae lines from file", function (done) {
        utils.extractNonMortgageTradeLines(__dirname + "/../input/input.txt", function (err, result) {
            expect(err).to.be.null;
            expect(result.lines).to.have.lengthOf(3);
            expect(result.amount).to.equal(922.6);
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