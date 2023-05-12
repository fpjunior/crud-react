import Dexie from 'dexie';

const db = new Dexie('myDatabase'); // Defina o nome do seu banco de dados

db.version(1).stores({
  expenses: '++id,description,category,date,amount', // Crie uma tabela para as despesas
  revenues: '++id,description,category,date,amount', // Crie uma tabela para as receitas
});

export default db;
