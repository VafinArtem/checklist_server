// eslint-disable-next-line node/no-unpublished-require
const security = require("../utils/security");

module.exports = (email) => {
 return {
  to: email,
  from: security.sendgrid.EMAIL,
  subject: `Аккаунт создан`,
  html: `
    <h1>Добро пожаловать</h1>
    <p>Вы успешно создали аккаунт с e-mail: ${email}</p>
    <hr>
    <a href="https://checklist.maffin.pw">Maffin Check List</a>
  `
  };
};
