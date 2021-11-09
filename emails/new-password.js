// eslint-disable-next-line node/no-unpublished-require
const security = require("../utils/security");

module.exports = (email) => {
 return {
  to: email,
  from: security.sendgrid.EMAIL,
  subject: `Пароль изменен`,
  html: `
    <h1>Вы изменили пароль</h1>
    <p>Пароль от вашего аккаунта ${email} изменен</p>
    <hr />
    <a href="${security.BASE_URL}">Maffin Check List</a>
  `
  };
};
