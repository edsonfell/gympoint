import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enroll from '../app/models/Enroll';

const models = [User, Student, Plan, Enroll];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Criação da conexão com a base
    this.connection = new Sequelize(databaseConfig);
    // Abaixo passamos a conexão para cada um dos models
    // que temos em nossa aplicação
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}
export default new Database();
