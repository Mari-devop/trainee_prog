import { google } from 'googleapis';
import fs from 'fs';

export default function uploadFile(auth, filePath, fileName, callback) {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    'name': fileName,
    'parents': ['1DTfXijX5F_ziN2nEtWsfQouc7I89a1MI'] 
  };
  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(filePath),
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  }, (err, file) => {
    if (err) {
      console.error(err);
      return callback(err);
    } else {
      console.log('File Id: ', file.data.id);
    
      drive.permissions.create({
        fileId: file.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      }, (err, res) => {
        if (err) {
          console.error('Failed to update permissions:', err);
          return callback(err);
        } else {
          callback(null, file.data.id);
        }
      });
    }
  });
}
