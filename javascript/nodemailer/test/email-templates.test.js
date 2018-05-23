const Email = require('email-templates');

describe('email-templates package', () => {
    it('should send email', () => {
        const email = new Email({
            message: {
                from: 'niftylettuce@gmail.com'
            },
            transport: {
                jsonTransport: true
            }
        });

        email
            .send({
                template: 'mars',
                message: {
                    to: 'elon@spacex.com'
                },
                locals: {
                    name: 'Elon'
                }
            })
            .then(res => {
                console.log(res);
            })
            .catch(console.error);
    });
});
