export type TipoUsuario = 'locador' | 'locatario';

export type TipoImovel = 'apartamento' | 'casa' | 'republica' | 'kitnet' | 'studio';

export type StatusImovel = 'disponivel' | 'alugado' | 'reservado';

export interface Endereco {
  cidade: string;
  bairro: string;
  rua: string;
  numero?: string;
  cep?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: TipoUsuario;
  telefone?: string;
  avatar?: string;
}

export interface Imovel {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  tipo: TipoImovel;
  status: StatusImovel;
  endereco: Endereco;
  proprietarioId: string;
  imagens: string[];
  quartos?: number;
  banheiros?: number;
  area?: number;
  mobiliado?: boolean;
  aceitaPet?: boolean;
  // Específico para repúblicas
  quantidadeMoradores?: number;
  regrasCasa?: string[];
  createdAt: Date;
}

export interface Mensagem {
  id: string;
  texto: string;
  dataEnvio: Date;
  remetenteId: string;
  destinatarioId: string;
  imovelId: string;
  lida: boolean;
}

export interface Conversa {
  id: string;
  imovelId: string;
  imovel: Imovel;
  usuarioId: string;
  usuario: Usuario;
  ultimaMensagem?: Mensagem;
  mensagensNaoLidas: number;
}
