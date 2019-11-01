// Aqui estamos configurando o sequelize para
// ler a base do postgres
// Instalamos as dependências: yarn add pg pg-hstore
require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    // timestamps garante termos
    // colunas updatedAt e createdAt em todas as tabelas
    timestamps: true,
    // Padrão de nome de colunas e tabelas no formato com underscore
    underscored: true,
    underscoredAll: true,
  },
};
