import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // O parametro 'sequelize' representa
  // a conexão com a base
  static init(sequelize) {
    super.init(
      {
        // Os campos abaixo não precisam
        // ser um reflexo da nossa base
        // Campos do tipo Virtual são
        // só usados do lado do backend
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // Hooks são trechos de códigos executados automaticamente
    // após determinados eventos
    this.addHook('beforeSave', async user => {
      if (user.password) {
        // Passamos 8 como segundo parametro para o Bcrypt
        // sendo como o nível da criptografia.
        // Poderíamos usar um número maior como 100, mas
        // ficaria muito pesado e custoso.
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  async checkAdmin(id) {
    const user = await User.findByPk(id, {
      where: { admin: true },
    });

    if (user) return true;
    return false;
  }
}

export default User;
