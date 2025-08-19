export const confirmEmailTemplate = (code) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Подтверждение почты</title>
</head>
<body>
  <p>Код для подтверждения Email</p>
  <p>код действителен 5 минут:</p>
  <p>${code}</p>
</body>
</html>
`