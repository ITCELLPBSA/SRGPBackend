const { ID_PREFIX } = require('../keys/constant');
const userModel = require('../model/user.model');

const serviceUtils = {};
const nodemailer = require('nodemailer');
const https = require('https');

const { google } = require('googleapis');
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

async function sendMail(mailOptions) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'itcellpbsa@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });



        const result = await transport.sendMail(mailOptions);
        console.log(result)
        return result;
    } catch (error) {
        return error;
    }
}
serviceUtils.sendMail = sendMail

serviceUtils.sendSMS = (to, text) => {
    var unirest = require("unirest");

    var req = unirest("GET", "https://www.fast2sms.com/dev/bulk");

    req.query({
        "authorization": "fR8XFz1DNA9aeMriqumBxyWZ4snPSCKb5vow3U26HVktLOhlIpy06SrTkpueci91wH8JQA7vVxqZaILP",
        "sender_id": "FSTSMS",
        "message": text,
        "language": "english",
        "route": "p",
        "numbers": to,
    });

    req.headers({
        "cache-control": "no-cache"
    });


    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        console.log(res.body);
    });

}
serviceUtils.sendOTP = (api_key, otp, phone_number) => {
    https.get(`https://2factor.in/API/V1/${api_key}/SMS/${phone_number}/${otp}`, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(JSON.parse(data).explanation);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

serviceUtils.mapProjectSummary = projects => {
    let result = [];
    if (projects.length > 0)
        result = projects.map(({
            projectId,
            projectTitle,
            projectSummary,
            team,
            remarks,
            projectDepartment,
            approved,
            keywords,
            visibility,
            isarchived,
            start,
            createdAt,
            updatedAt,
            status }) => ({
                projectId,
                projectTitle,
                projectSummary,
                team,
                remarks,
                projectDepartment,
                approved,
                keywords,
                visibility,
                isarchived,
                start,
                createdAt,
                updatedAt,
                status
            }));
    return result;
}

serviceUtils.mapIdToUser = team => {
    return team.map(id => {
        return userModel.getUserById(id).then(({ userId, userName }) => {
            return `${userId}-${userName}`;
        })
    })
}


serviceUtils.generateId = (prefix, count) => {
    count = String(count + 1).padStart(3, '0');

    refKey = { prefix: prefix.substring(prefix.length - 8), count: count };
    return refKey;
    switch (prefix) {
        case ID_PREFIX.NOTIFICATION: return `${ID_PREFIX.NOTIFICATION}${100000 + count + 1}`;
        default: return `${prefix.substring(prefix.length - 8)}-${count + 1}`;
    }
}

module.exports = serviceUtils;