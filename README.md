# credit_line_calculation

## Usage
``` 
git clone https://github.com/abhagupta/credit_line_calculation.git
cd credit_line_calculation
npm install
npm start
```

### Test
``` 
npm test
```

### Explanation

The input is assumed to be a file in txt format which matches the format provided in instructions.

The input files are located at `input/input.txt`. This is being read from `index.js` and passed along to `creditLines.js` which is the core of the project.  `creditLines.js` reads the file and runs the main logic with help of utility methods in `utils.js`.

Tests are located in `test\test.js`.
