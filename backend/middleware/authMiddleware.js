const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Obter o token do cabeçalho
  const token = req.header('x-auth-token');

  // 2. Verificar se o token existe
  if (!token) {
    console.error('>>> ERRO DE AUTENTICAÇÃO: Token não encontrado no cabeçalho.');
    return res.status(401).json({ msg: 'Sem token, autorização negada' });
  }

  // 3. Verificar o token
  try {
    // Adicionado log para depuração:
    if (!process.env.JWT_SECRET) {
        console.error('>>> ERRO CRÍTICO: A variável JWT_SECRET não está definida no backend!');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    // Adicionado log para depuração:
    console.error('>>> ERRO DE AUTENTICAÇÃO: A verificação do token falhou.', e.message);
    res.status(400).json({ msg: 'Token inválido' });
  }
};
