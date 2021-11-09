// eslint-disable-next-line node/no-unpublished-require
const security = require("../utils/security");

module.exports = (email, token) => {
 return {
  to: email,
  from: security.sendgrid.EMAIL,
  subject: `Аккаунт создан`,
  html: `
    <h1>Вы забыли пароль?</h1>
    <p>Если нет, то проигнорируйте данное письмо</p>
    <p>Иначе нажмите на ссылку ниже:</p>
    <p><a href="${security.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
    <hr />
    <a href="${security.BASE_URL}">Maffin Check List</a>
  `
  };
};
