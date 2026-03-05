import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addImovel, nextId } from '../data/database';
import { TipoImovel } from '../types';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Textarea } from '../app/components/ui/textarea';
import { Label } from '../app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import { Switch } from '../app/components/ui/switch';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

interface CadastroImovelProps {
  onSuccess: () => void;
}

export function CadastroImovel({ onSuccess }: CadastroImovelProps) {
  const { usuario } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [tipo, setTipo] = useState<TipoImovel>('apartamento');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [quartos, setQuartos] = useState('');
  const [banheiros, setBanheiros] = useState('');
  const [area, setArea] = useState('');
  const [mobiliado, setMobiliado] = useState(false);
  const [aceitaPet, setAceitaPet] = useState(false);
  const [quantidadeMoradores, setQuantidadeMoradores] = useState('');
  const [regrasCasa, setRegrasCasa] = useState<string[]>(['']);
  const [urlImagem, setUrlImagem] = useState('');

  const handleAdicionarRegra = () => {
    setRegrasCasa([...regrasCasa, '']);
  };

  const handleRemoverRegra = (index: number) => {
    setRegrasCasa(regrasCasa.filter((_, i) => i !== index));
  };

  const handleAlterarRegra = (index: number, valor: string) => {
    const novasRegras = [...regrasCasa];
    novasRegras[index] = valor;
    setRegrasCasa(novasRegras);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !descricao || !preco || !cidade || !bairro || !rua) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const novoImovel = {
      id: nextId('imoveis'),
      titulo,
      descricao,
      preco: parseFloat(preco),
      tipo,
      status: 'disponivel' as const,
      endereco: {
        cidade,
        bairro,
        rua,
        numero,
        cep,
      },
      proprietarioId: usuario!.id,
      imagens: urlImagem
        ? [urlImagem]
        : ['https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzI2NDk1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080'],
      quartos: quartos ? parseInt(quartos) : undefined,
      banheiros: banheiros ? parseInt(banheiros) : undefined,
      area: area ? parseInt(area) : undefined,
      mobiliado,
      aceitaPet,
      quantidadeMoradores:
        tipo === 'republica' && quantidadeMoradores ? parseInt(quantidadeMoradores) : undefined,
      regrasCasa: tipo === 'republica' ? regrasCasa.filter((r) => r.trim()) : undefined,
      createdAt: new Date(),
    };

    addImovel(novoImovel);
    toast.success('Imóvel cadastrado com sucesso!');
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Novo Imóvel</CardTitle>
            <CardDescription>
              Preencha as informações do imóvel que você deseja anunciar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informações Básicas</h3>

                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Anúncio *</Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Apartamento moderno no centro"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva seu imóvel..."
                    rows={4}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Imóvel *</Label>
                    <Select value={tipo} onValueChange={(value) => setTipo(value as TipoImovel)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="republica">República</SelectItem>
                        <SelectItem value="kitnet">Kitnet</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$/mês) *</Label>
                    <Input
                      id="preco"
                      type="number"
                      placeholder="1500"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urlImagem">URL da Imagem (opcional)</Label>
                  <Input
                    id="urlImagem"
                    type="url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={urlImagem}
                    onChange={(e) => setUrlImagem(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Endereço</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      placeholder="São Paulo"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      placeholder="Centro"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rua">Rua *</Label>
                    <Input
                      id="rua"
                      placeholder="Rua das Flores"
                      value={rua}
                      onChange={(e) => setRua(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      placeholder="123"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="01234-567"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Detalhes do Imóvel</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quartos">Quartos</Label>
                    <Input
                      id="quartos"
                      type="number"
                      placeholder="2"
                      value={quartos}
                      onChange={(e) => setQuartos(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banheiros">Banheiros</Label>
                    <Input
                      id="banheiros"
                      type="number"
                      placeholder="1"
                      value={banheiros}
                      onChange={(e) => setBanheiros(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="65"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mobiliado" className="cursor-pointer">
                      Mobiliado
                    </Label>
                    <Switch
                      id="mobiliado"
                      checked={mobiliado}
                      onCheckedChange={setMobiliado}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="aceitaPet" className="cursor-pointer">
                      Aceita Pet
                    </Label>
                    <Switch
                      id="aceitaPet"
                      checked={aceitaPet}
                      onCheckedChange={setAceitaPet}
                    />
                  </div>
                </div>
              </div>

              {tipo === 'republica' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações da República</h3>

                  <div className="space-y-2">
                    <Label htmlFor="quantidadeMoradores">Quantidade de Moradores</Label>
                    <Input
                      id="quantidadeMoradores"
                      type="number"
                      placeholder="5"
                      value={quantidadeMoradores}
                      onChange={(e) => setQuantidadeMoradores(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Regras da Casa</Label>
                    {regrasCasa.map((regra, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Ex: Silêncio após 22h"
                          value={regra}
                          onChange={(e) => handleAlterarRegra(index, e.target.value)}
                        />
                        {regrasCasa.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoverRegra(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAdicionarRegra}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Regra
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Cadastrar Imóvel
                </Button>
                <Button type="button" variant="outline" onClick={onSuccess} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
