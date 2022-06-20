const { google } = require("googleapis");
const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

const path = require('path');
const util = require('util');
const stream = require('stream');

const pipeline = util.promisify(stream.pipeline);

const CLIENT_ID = '1092473087502-rjnc8ebhn9k5iup1ku4t4286bpu70sii.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04WEB4DlDr4LwCgYIARAAGAQSNwF-L9Irxg0D6yb7zDSPl9L_zZOIRIRdsmfw5AYIC6DYM-5ayLV8uAFbfcPZssR8dPAd9fthJ-I';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oAuth2Client });

async function upload(fileName, filePath) {
    const accessToken = await oAuth2Client.getAccessToken();
    oAuth2Client.setCredentials({ access_token: accessToken.token });
    const res = await drive.files.create({
        requestBody: {
            name: fileName,
        },
        media: {
            body: fs.createReadStream(path.join('.', filePath, '/', fileName))
        }
    })
    return res.data.id

}
async function download(fileId, fileName) {

    currentPath = path.join(__dirname, '../FileSystem/', fileId);
    if (!fs.existsSync(path.join(currentPath, '/', fileName))) {

        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
        const accessToken = await oAuth2Client.getAccessToken();

        oAuth2Client.setCredentials({ access_token: accessToken.token });


        const res = await drive.files.get({
            fileId: fileId,
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            alt: 'media'
        },
            { responseType: 'stream' });
        let dest = fs.createWriteStream(path.join(__dirname, '../FileSystem/', fileId, '/', fileName));
        await pipeline(res.data, dest)

    }
    return path.join(__dirname, '../FileSystem/', fileId, '/', fileName)


}
const driveUpload = upload
const driveDownload = download
module.exports = { driveUpload, driveDownload }