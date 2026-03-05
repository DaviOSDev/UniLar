/**
 * Camada de acesso a dados (Repository pattern).
 * Fonte única: db.json como seed + localStorage para persistência no MVP.
 * Datas são serializadas como ISO string no armazenamento e convertidas para Date na API.
 */

import type { Usuario, Imovel, Mensagem, StatusImovel } from '../types';

const STORAGE_KEY = 'unilar_db';

/** Formato armazenado (JSON/localStorage): datas como string ISO */
interface ImovelRaw extends Omit<Imovel, 'createdAt'> {
  createdAt: string;
}
interface MensagemRaw extends Omit<Mensagem, 'dataEnvio'> {
  dataEnvio: string;
}
interface DbSchema {
  usuarios: Usuario[];
  imoveis: ImovelRaw[];
  mensagens: MensagemRaw[];
}

function parseImovel(raw: ImovelRaw): Imovel {
  return { ...raw, createdAt: new Date(raw.createdAt) };
}
function parseMensagem(raw: MensagemRaw): Mensagem {
  return { ...raw, dataEnvio: new Date(raw.dataEnvio) };
}
function toRawImovel(imovel: Imovel): ImovelRaw {
  return { ...imovel, createdAt: imovel.createdAt.toISOString() };
}
function toRawMensagem(mensagem: Mensagem): MensagemRaw {
  return { ...mensagem, dataEnvio: mensagem.dataEnvio.toISOString() };
}

// Seed inicial do db.json (fonte única de dados iniciais)
import seedData from './db.json';

const seed = seedData as DbSchema;

function load(): DbSchema {
  if (typeof window === 'undefined') {
    return JSON.parse(JSON.stringify(seed));
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as DbSchema;
    }
  } catch {
    // fallback para seed
  }
  return JSON.parse(JSON.stringify(seed));
}

function persist(data: DbSchema): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignorar falha de quota etc.
  }
}

// Estado em memória (single source of truth na sessão)
let state: DbSchema = load();

// --- API pública (somente leitura e escritas através do repositório) ---

export function getUsuarios(): Usuario[] {
  return state.usuarios;
}

export function getUsuarioById(id: string): Usuario | undefined {
  return state.usuarios.find((u) => u.id === id);
}

export function getUsuarioByEmail(email: string): Usuario | undefined {
  return state.usuarios.find((u) => u.email === email);
}

export function getUsuarioByEmailAndPassword(
  email: string,
  senha: string
): Usuario | undefined {
  return state.usuarios.find((u) => u.email === email && u.senha === senha);
}

export function addUsuario(usuario: Usuario): void {
  state.usuarios.push(usuario);
  persist(state);
}

export function getImoveis(): Imovel[] {
  return state.imoveis.map(parseImovel);
}

export function getImovelById(id: string): Imovel | undefined {
  const raw = state.imoveis.find((i) => i.id === id);
  return raw ? parseImovel(raw) : undefined;
}

export function getImoveisByProprietarioId(proprietarioId: string): Imovel[] {
  return state.imoveis
    .filter((i) => i.proprietarioId === proprietarioId)
    .map(parseImovel);
}

export function addImovel(imovel: Imovel): void {
  state.imoveis.push(toRawImovel(imovel));
  persist(state);
}

export function updateImovelStatus(id: string, status: StatusImovel): boolean {
  const index = state.imoveis.findIndex((i) => i.id === id);
  if (index === -1) return false;
  state.imoveis[index].status = status;
  persist(state);
  return true;
}

export function deleteImovel(id: string): boolean {
  const index = state.imoveis.findIndex((i) => i.id === id);
  if (index === -1) return false;
  state.imoveis.splice(index, 1);
  persist(state);
  return true;
}

export function getMensagens(): Mensagem[] {
  return state.mensagens.map(parseMensagem);
}

export function getMensagensByUsuario(usuarioId: string): Mensagem[] {
  return state.mensagens
    .filter(
      (m) => m.remetenteId === usuarioId || m.destinatarioId === usuarioId
    )
    .map(parseMensagem);
}

export function addMensagem(mensagem: Mensagem): void {
  state.mensagens.push(toRawMensagem(mensagem));
  persist(state);
}

/** Gera próximo ID numérico para uma entidade (evita colisão no MVP) */
export function nextId(collection: 'usuarios' | 'imoveis' | 'mensagens'): string {
  const arr = state[collection];
  const max = arr.reduce((acc, item) => {
    const n = parseInt(item.id, 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return String(max + 1);
}
