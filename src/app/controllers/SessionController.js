import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // Colocar Yup
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Data validation failed' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // 401 - Not Authorized
      return res.status(401).send({ error: 'User not found' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).send({ error: 'Wrong Password.' });
    }

    // Após consistir a senha acima, iremos retornar
    // as info do usuário e o token
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      // Abaixo estamos passando as informações que serão
      // enviadas junto ao payload do token.
      // Enviamos também uma privateKey que é o nosso Hash MD5
      // Abaixo definimos o tempo de validade do token (7 dias)
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
