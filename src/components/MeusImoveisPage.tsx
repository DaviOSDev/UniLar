import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getImoveisByProprietarioId,
  updateImovelStatus,
  deleteImovel,
} from '../data/database';
import { Imovel, StatusImovel } from '../types';
import { ImovelCard } from './ImovelCard';
import { Button } from '../app/components/ui/button';
import { Card, CardContent } from '../app/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import { Label } from '../app/components/ui/label';
import { toast } from 'sonner';
import { Pencil, Trash2, Home } from 'lucide-react';

interface MeusImoveisPageProps {
  onImovelClick: (imovel: Imovel) => void;
}

export function MeusImoveisPage({ onImovelClick }: MeusImoveisPageProps) {
  const { usuario } = useAuth();
  const [imovelParaEditar, setImovelParaEditar] = useState<Imovel | null>(null);
  const [novoStatus, setNovoStatus] = useState<StatusImovel>('disponivel');
  const [imovelParaExcluir, setImovelParaExcluir] = useState<Imovel | null>(null);

  const meusImoveis = getImoveisByProprietarioId(usuario?.id ?? '');

  const handleAtualizarStatus = () => {
    if (!imovelParaEditar) return;

    if (updateImovelStatus(imovelParaEditar.id, novoStatus)) {
      toast.success('Status atualizado com sucesso!');
      setImovelParaEditar(null);
    }
  };

  const handleExcluir = () => {
    if (!imovelParaExcluir) return;

    if (deleteImovel(imovelParaExcluir.id)) {
      toast.success('Imóvel excluído com sucesso!');
      setImovelParaExcluir(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Imóveis</h1>
        <p className="text-gray-600 mb-8">
          {meusImoveis.length} {meusImoveis.length === 1 ? 'imóvel cadastrado' : 'imóveis cadastrados'}
        </p>

        {meusImoveis.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Home className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum imóvel cadastrado
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Você ainda não cadastrou nenhum imóvel. Clique no botão "Anunciar" para começar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meusImoveis.map((imovel) => (
              <div key={imovel.id} className="relative">
                <ImovelCard imovel={imovel} onClick={() => onImovelClick(imovel)} />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImovelParaEditar(imovel);
                      setNovoStatus(imovel.status);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white hover:bg-red-50 text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImovelParaExcluir(imovel);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={!!imovelParaEditar} onOpenChange={() => setImovelParaEditar(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Status do Imóvel</DialogTitle>
              <DialogDescription>
                Altere o status do imóvel "{imovelParaEditar?.titulo}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={novoStatus}
                  onValueChange={(value) => setNovoStatus(value as StatusImovel)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="alugado">Alugado</SelectItem>
                    <SelectItem value="reservado">Reservado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setImovelParaEditar(null)}>
                Cancelar
              </Button>
              <Button onClick={handleAtualizarStatus}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!imovelParaExcluir} onOpenChange={() => setImovelParaExcluir(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o imóvel "{imovelParaExcluir?.titulo}"? Esta ação
                não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setImovelParaExcluir(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleExcluir}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
