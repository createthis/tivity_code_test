export default function (factory: any, Models: any) {
  let normalizedPath = require('path').join(__dirname, '.');

  require('fs').readdirSync(normalizedPath).forEach(function (file: string) {
    if (file !== 'index.ts' && !file.endsWith('.swp')) {
      const fileObject = require('./' + file);
      fileObject.default(factory, Models);
    }
  });
};
