const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  const filesToWrite = [
    {
      path: './src/environments/productionEnvironment.ts',
      content: `
      import {Environment} from "./environment";

      export const productionEnvironment: Environment | undefined = {
  baseUrl: "${process.env.BASE_URL}",
  apiUrl: "${process.env.API_URL}",
  authUrl: "${process.env.AUTH_URL}",
  clientId: "${process.env.CLIENT_ID}",
};`,
    }
  ];
  filesToWrite.forEach((file) => {
    writeFile(file.path, file.content, (err) => {
      if (err) {
        console.error(err);
        throw err;
      } else {
        console.log(`Angular ${file.path} file generated correctly \n`);
      }
    });
  });
};

setEnv();
