export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'GymPoint <noreply@gympoint.com>',
  },
};
// Existem diversos serviços para envio de e-mail,
// mas iremos utilizar o Mailtrap que só serve para ambiente
// de desenvolviment.
//  https://mailtrap.io/
