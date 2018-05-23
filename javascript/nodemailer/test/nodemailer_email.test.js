const chai = require('chai');
const nodemailer = require('nodemailer');

const expect = chai.expect;

describe('nodemailer', () => {
    xit('can send email using sample code from documentation', done => {
        // Use at least Nodemailer v4.1.0

        // Generate SMTP service account from ethereal.email
        nodemailer.createTestAccount(async (err, account) => {
            if (err) {
                console.error('Failed to create a testing account. ' + err.message);
                return process.exit(1);
            }

            console.log('account', account);
            console.log('Credentials obtained, sending message...');

            // Create a SMTP transporter object
            let transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                },
                debug: true,
                logger: true
            });

            console.log('transporter', transporter);

            const verifyRes = await transporter.verify();
            console.log('verify result', verifyRes);

            // Message object
            let message = {
                from: 'Sender Name <sender@example.com>',
                to: 'Recipient <recipient@example.com>',
                subject: 'Nodemailer is unicode friendly ✔',
                text: 'Hello to myself!',
                html: '<p><b>Hello</b> to myself!</p>'
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log('Error occurred. ' + err.message);
                    return process.exit(1);
                }

                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                done();
            });
        });
    }).timeout(40000);

    xit('can send email with a dynamic test account', done => {
        nodemailer.createTestAccount((err, account) => {
            console.log(account);
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user, // generated ethereal user
                    pass: account.pass // generated ethereal password
                }
            });

            const mailOptions = {
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: 'bar@example.com, baz@example.com', // list of receivers
                subject: 'Hello ✔', // Subject line
                text: 'Hello world?', // plain text body
                html: '<b>Hello world?</b>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                console.log('sendMail#callback');
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

                done();
            });
        });
    }).timeout(40000);

    xit('can send email with a dynamic test account using async/await', async done => {
        // generate test account
        const testAccount = await nodemailer.createTestAccount();

        // create transporter
        const transporter = await nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass // generated ethereal password
            }
        });

        const mailOptions = {
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: 'bar@example.com, baz@example.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: '<b>Hello world?</b>' // html body
        };

        const result = await transporter.sendMail(mailOptions);

        console.log(JSON.stringify(result));
    }).timeout(10000);

    xit('can send email using a custom test account', async done => {
        // Arrange
        const email = 'izuloofxnoh52ktz@ethereal.email';
        const password = 'password';

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: email,
                pass: password
            }
        });

        const mailOptions = {
            from: 'Fred <foo@example.com',
            to: 'bar@example.com',
            subject: 'Hello',
            text: 'Hello world',
            html: '<p>Hello world</p>'
        };

        // Act
        const result = await transporter.sendMail(mailOptions);

        // Assert
        expect(result).to.be.true;
        done();
    });
});
