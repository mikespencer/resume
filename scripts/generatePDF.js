const path = require('path');

const savePDF = require('./savePDF');

const outfile = path.join(__dirname, '../resume.pdf');

savePDF({ outfile })
  .then(pdf => console.log(`Saved PDF to ${pdf}`))
  .catch(err => console.log(err));
