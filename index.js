var creditLines = require('./creditLines');
var path = require('path');

// process.on('uncaughtException', function (err) {
//     console.log('Caught exception: ' + err);
// });

creditLines.calculateCreditOutPut(path.resolve(__dirname, "input/input.txt"), function(err, result){
 if(err){
     console.log(err);
 } else {
     if(result.error){
        console.log(result.error +" : " +  result.invalidLines);
     } else {
         console.log(result);
     }
 }
 
});