import * as bcrypt from 'bcrypt';
import * as fs from 'fs/promises';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

interface UserData {
  username: string;
  passwordHash: string;
}

const USERS_FILE = 'users.json';
const rl = readline.createInterface({ input, output });

async function loadUsers(): Promise<UserData[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveUsers(users: UserData[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function register(): Promise<void> {
  const username = await rl.question('Digite o nome de usuário: ');
  const password = await rl.question('Digite a senha: ');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const users = await loadUsers();
  users.push({ username, passwordHash });
  await saveUsers(users);

  console.log('Usuário registrado com sucesso!');
}

async function login(): Promise<void> {
  const username = await rl.question('Digite o nome de usuário: ');
  const password = await rl.question('Digite a senha: ');

  const users = await loadUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    console.log('Usuário não encontrado.');
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  console.log(isMatch ? 'Login bem-sucedido!' : 'Senha incorreta.');
}

async function main(): Promise<void> {
  while (true) {
    console.log('\n1. Registrar\n2. Login\n3. Sair');
    const choice = await rl.question('Escolha uma opção: ');

    if (choice === '1') {
      await register();
    } else if (choice === '2') {
      await login();
    } else if (choice === '3') {
      console.log('Saindo...');
      rl.close();
      break;
    } else {
      console.log('Opção inválida.');
    }
  }
}

main().catch((error) => {
  console.error('Erro:', error);
  rl.close();
});