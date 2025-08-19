export const resetPasswordEmailTemplate = (token) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Восстановление пароля</title>
</head>
<body>
  <p>Вы запросили восстановление пароля для вашего аккаунта.</p>
  <p>Нажмите на ссылку ниже, чтобы сбросить пароль (ссылка действительна 5 минут):</p>
  <p><a href="${token}">Сбросить пароль</a></p>
  <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
</body>
</html>
`