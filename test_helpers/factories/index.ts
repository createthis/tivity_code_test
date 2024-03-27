import fs from 'fs';
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
export default function (factory: any, Models: any) {
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const normalizedPath = require('path').join(__dirname, '.');

  fs.readdirSync(normalizedPath).forEach(function (file: string) {
    if (file !== 'index.ts' && !file.endsWith('.swp')) {
      /* eslint-disable-next-line @typescript-eslint/no-var-requires */
      const fileObject = require('./' + file);
      fileObject.default(factory, Models);
    }
  });
}
