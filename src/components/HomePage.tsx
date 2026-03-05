import { useState, useMemo } from 'react';
import { getImoveis } from '../data/database';
import { Imovel, TipoImovel, StatusImovel } from '../types';
import { ImovelCard } from './ImovelCard';
import { Input } from '../app/components/ui/input';
import { Button } from '../app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import { Label } from '../app/components/ui/label';
import { Slider } from '../app/components/ui/slider';
import { Switch } from '../app/components/ui/switch';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '../app/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../app/components/ui/collapsible';

interface HomePageProps {
  onImovelClick: (imovel: Imovel) => void;
}

export function HomePage({ onImovelClick }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<TipoImovel | 'todos'>('todos');
  const [statusFiltro, setStatusFiltro] = useState<StatusImovel | 'todos'>('todos');
  const [precoMax, setPrecoMax] = useState([5000]);
  const [mobiliado, setMobiliado] = useState<boolean | null>(null);
  const [aceitaPet, setAceitaPet] = useState<boolean | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(true);

  const imoveisFiltrados = useMemo(() => {
    return getImoveis().filter((imovel) => {
      const matchSearch =
        imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.endereco.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.endereco.cidade.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipo = tipoFiltro === 'todos' || imovel.tipo === tipoFiltro;
      const matchStatus = statusFiltro === 'todos' || imovel.status === statusFiltro;
      const matchPreco = imovel.preco <= precoMax[0];
      const matchMobiliado = mobiliado === null || imovel.mobiliado === mobiliado;
      const matchPet = aceitaPet === null || imovel.aceitaPet === aceitaPet;

      return (
        matchSearch &&
        matchTipo &&
        matchStatus &&
        matchPreco &&
        matchMobiliado &&
        matchPet
      );
    });
  }, [searchTerm, tipoFiltro, statusFiltro, precoMax, mobiliado, aceitaPet]);

  const limparFiltros = () => {
    setSearchTerm('');
    setTipoFiltro('todos');
    setStatusFiltro('todos');
    setPrecoMax([5000]);
    setMobiliado(null);
    setAceitaPet(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Encontre seu imóvel ideal
          </h1>
          <p className="text-gray-600">
            {imoveisFiltrados.length} {imoveisFiltrados.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por título, descrição ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Collapsible open={filtrosAbertos} onOpenChange={setFiltrosAbertos}>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <span className="font-semibold">Filtros</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {filtrosAbertos ? 'Ocultar' : 'Mostrar'}
                  </span>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label>Tipo de Imóvel</Label>
                    <Select value={tipoFiltro} onValueChange={(value) => setTipoFiltro(value as TipoImovel | 'todos')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="republica">República</SelectItem>
                        <SelectItem value="kitnet">Kitnet</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={statusFiltro} onValueChange={(value) => setStatusFiltro(value as StatusImovel | 'todos')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="disponivel">Disponível</SelectItem>
                        <SelectItem value="alugado">Alugado</SelectItem>
                        <SelectItem value="reservado">Reservado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Preço Máximo: R$ {precoMax[0].toLocaleString('pt-BR')}</Label>
                    <Slider
                      value={precoMax}
                      onValueChange={setPrecoMax}
                      max={5000}
                      min={0}
                      step={100}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="mobiliado"
                      checked={mobiliado === true}
                      onCheckedChange={(checked) => setMobiliado(checked ? true : null)}
                    />
                    <Label htmlFor="mobiliado" className="cursor-pointer">
                      Apenas mobiliados
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pet"
                      checked={aceitaPet === true}
                      onCheckedChange={(checked) => setAceitaPet(checked ? true : null)}
                    />
                    <Label htmlFor="pet" className="cursor-pointer">
                      Aceita pet
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={limparFiltros}>
                    Limpar filtros
                  </Button>
                </div>
              </CollapsibleContent>
            </CardContent>
          </Card>
        </Collapsible>

        {imoveisFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhum imóvel encontrado com os filtros selecionados.
            </p>
            <Button variant="link" onClick={limparFiltros} className="mt-2">
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveisFiltrados.map((imovel) => (
              <ImovelCard
                key={imovel.id}
                imovel={imovel}
                onClick={() => onImovelClick(imovel)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
