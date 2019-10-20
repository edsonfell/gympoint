import jwt from 'jsonwebtoken';

// O promisify transforma uma função de callback
// e transforma em uma função que pode ser usada como async
import { promisify } from 'util';
// O auth da pasta config possui o segredo do nosso token
import auth from '../../config/auth';

class AuthMiddleware {
  // Checar autenticação de usuários comuns
  async defaultAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token not provided' });
    }
    // Como é retornado a palavra Bearer junto com o JWT,
    // damos um split por espaço e com a desestruturação do JS
    // nós pegamos apenas a posição 1 do array
    // retornado pelo split
    const [, token] = authHeader.split(' ');

    try {
      // Abaixo chamamos o promisify para executar
      // a função de callback retornada pelo jwt.verify como async/await.
      // O segundo parenteses '(token)' é a chamada de execução da função
      // de callback que foi retornada pelo jwt.verify
      const decoded = await promisify(jwt.verify)(token, auth.secret);

      // Aqui gravamos o id do usuario que foi decodificado
      // para que ele possa ser usado nas rotas.
      // Por exemplo: Na rota de update dos usuários,
      // por padrão o usuário deveria passar o :id pela URL,
      // porém se já conseguimos o id via JWT, não há necessidade
      // de receber o :id via URL.
      req.userId = decoded.id;

      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Token invalid' });
    }
  }
}
export default new AuthMiddleware();
