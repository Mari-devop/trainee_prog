import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { authorize } from './auth.js';
import uploadFile from './upload.js';
import tinyurl from 'tinyurl';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

async function main() {
  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Drag and drop your image file path here:',
    },
  ]);

  const cleanedFilePath = filePath.replace(/^['"](.+)['"]$/, '$1');
  const fileName = path.basename(cleanedFilePath);

  const { newFileName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'newFileName',
      message: 'Edit the image name (press enter to keep the original name):',
      default: fileName,
    },
  ]);

  const { confirmUpload } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmUpload',
      message: 'Do you want to upload this image?',
    },
  ]);

  if (!confirmUpload) {
    console.log('Upload cancelled.');
    return;
  }

  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  fs.renameSync(cleanedFilePath, path.join('uploads', newFileName));

  const credentials = JSON.parse(fs.readFileSync('credentials.json'));
  authorize(credentials, (auth) => {
    uploadFile(auth, path.join('uploads', newFileName), newFileName, async (err, fileId) => {
      if (err) {
        console.error('Failed to upload file:', err);
        return;
      }

      const { shortUrl } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shortUrl',
          message: 'Do you want to shorten the file URL?',
        },
      ]);

      if (shortUrl) {
        const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
        tinyurl.shorten(fileUrl, function(res) {
          console.log('Shortened URL: ', res);
        });
      }
    });
  });
}

main();
