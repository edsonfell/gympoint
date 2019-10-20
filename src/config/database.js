// Aqui estamos configurando o sequelize para
// ler a base do postgres
// Instalamos as dependências: yarn add pg pg-hstore
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',
  define: {
    // timestamps garante termos
    // colunas updatedAt e createdAt em todas as tabelas
    timestamps: true,
    // Padrão de nome de colunas e tabelas no formato com underscore
    underscored: true,
    underscoredAll: true,
  },
};
