import { createInterface } from 'readline';

const rl = createInterface({ input: process.stdin, output: process.stdout });

function cleanCpf(cpf: string): string { return cpf.replace(/[^\d]/g, ''); }

function isValidLength(cpf: string): boolean { return cpf.length === 11;}

function hasRepeatedDigits(cpf: string): boolean {  return /^(\d)\1+$/.test(cpf);}

function calculateDigit(cpf: string, start: number, end: number): number { let sum = 0;
  for (let i = start; i < end; i++) sum += parseInt(cpf[i]) * (end + 1 - i);
  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;}

function isValidCpf(cpf: string): boolean {cpf = cleanCpf(cpf);
  if (!isValidLength(cpf) || hasRepeatedDigits(cpf)) return false;
  const digit1 = calculateDigit(cpf, 0, 9);
  const digit2 = calculateDigit(cpf, 0, 10);
  return parseInt(cpf[9]) === digit1 && parseInt(cpf[10]) === digit2;}

const cpfArg = process.argv[2];
if (cpfArg) {
  console.log(isValidCpf(cpfArg) ? 'CPF válido' : 'CPF inválido');
  process.exit(0);}
rl.question('Digite o CPF: ', (cpf) => { console.log(isValidCpf(cpf) ? 'CPF válido' : 'CPF inválido'); 
    rl.close();});