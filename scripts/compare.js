const path = require('path');

const imagemagick = require('imagemagick');
const rimraf = require('util').promisify(require('rimraf'));

const savePDF = require('./savePDF');

const resumePDF = path.resolve(__dirname, '../resume.pdf');
const compareTargetPDF = path.resolve(
  __dirname,
  '../resume-compare-target.pdf'
);

const getSignature = filePath =>
  new Promise((resolve, reject) => {
    imagemagick.identify(filePath, (err, metadata) => {
      if (err) {
        throw err;
      }

      if (!((metadata || {}).properties || {}).signature) {
        throw new Error(`Could not get signature from ${filePath}`);
      }

      resolve(metadata.properties.signature);
    });
  });

const compare = async () => {
  await savePDF({ outfile: compareTargetPDF });
  const [sig1, sig2] = await Promise.all([
    getSignature(compareTargetPDF),
    getSignature(resumePDF),
  ]);

  await rimraf(compareTargetPDF);

  if (sig1 !== sig2) {
    throw new Error(`PDF is not up to date. Try running 'npm run pdf'`);
  }
};

compare()
  .then(() => {
    console.log('resume.pdf is up to date');
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
