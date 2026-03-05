import { useState } from 'react';
import { Imovel } from '../types';
import { getUsuarioById } from '../data/database';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../app/components/ui/button';
import { Card, CardContent } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Separator } from '../app/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../app/components/ui/dialog';
import { Textarea } from '../app/components/ui/textarea';
import { toast } from 'sonner';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Check,
  X,
  ArrowLeft,
  MessageSquare,
  Home,
  Phone,
  Mail,
} from 'lucide-react';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';

interface DetalhesImovelProps {
  imovel: Imovel;
  onVoltar: () => void;
}

export function DetalhesImovel({ imovel, onVoltar }: DetalhesImovelProps) {
  const { usuario } = useAuth();
  const [imagemSelecionada, setImagemSelecionada] = useState(0);
  const [mensagem, setMensagem] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);

  const proprietario = getUsuarioById(imovel.proprietarioId);

  const statusColors = {
    disponivel: 'bg-green-500',
    alugado: 'bg-red-500',
    reservado: 'bg-yellow-500',
  };

  const statusLabels = {
    disponivel: 'Disponível',
    alugado: 'Alugado',
    reservado: 'Reservado',
  };

  const tipoLabels = {
    apartamento: 'Apartamento',
    casa: 'Casa',
    republica: 'República',
    kitnet: 'Kitnet',
    studio: 'Studio',
  };

  const handleEnviarMensagem = () => {
    if (!mensagem.trim()) {
      toast.error('Digite uma mensagem');
      return;
    }
    toast.success('Mensagem enviada com sucesso!');
    setMensagem('');
    setDialogAberto(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={onVoltar} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <ImageWithFallback
                    src={imovel.imagens[imagemSelecionada]}
                    alt={imovel.titulo}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className={statusColors[imovel.status]}>
                      {statusLabels[imovel.status]}
                    </Badge>
                    <Badge className="bg-blue-600">{tipoLabels[imovel.tipo]}</Badge>
                  </div>
                </div>

                {imovel.imagens.length > 1 && (
                  <div className="p-4 grid grid-cols-4 gap-4">
                    {imovel.imagens.map((img, idx) => (
                      <div
                        key={idx}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          imagemSelecionada === idx
                            ? 'border-blue-600'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => setImagemSelecionada(idx)}
                      >
                        <ImageWithFallback
                          src={img}
                          alt={`${imovel.titulo} - Foto ${idx + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {imovel.titulo}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>
                      {imovel.endereco.rua}, {imovel.endereco.numero} - {imovel.endereco.bairro},{' '}
                      {imovel.endereco.cidade}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Descrição</h2>
                  <p className="text-gray-700 leading-relaxed">{imovel.descricao}</p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Características</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imovel.quartos && (
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-500">Quartos</p>
                          <p className="font-semibold">{imovel.quartos}</p>
                        </div>
                      </div>
                    )}
                    {imovel.banheiros && (
                      <div className="flex items-center gap-2">
                        <Bath className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-500">Banheiros</p>
                          <p className="font-semibold">{imovel.banheiros}</p>
                        </div>
                      </div>
                    )}
                    {imovel.area && (
                      <div className="flex items-center gap-2">
                        <Maximize className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-500">Área</p>
                          <p className="font-semibold">{imovel.area}m²</p>
                        </div>
                      </div>
                    )}
                    {imovel.tipo === 'republica' && imovel.quantidadeMoradores && (
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-500">Moradores</p>
                          <p className="font-semibold">{imovel.quantidadeMoradores}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Comodidades</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      {imovel.mobiliado ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                      <span className={imovel.mobiliado ? 'text-gray-900' : 'text-gray-400'}>
                        Mobiliado
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {imovel.aceitaPet ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                      <span className={imovel.aceitaPet ? 'text-gray-900' : 'text-gray-400'}>
                        Aceita pet
                      </span>
                    </div>
                  </div>
                </div>

                {imovel.tipo === 'republica' && imovel.regrasCasa && (
                  <>
                    <Separator />
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Regras da Casa</h2>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {imovel.regrasCasa.map((regra, idx) => (
                          <li key={idx}>{regra}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Valor do aluguel</p>
                  <p className="text-4xl font-bold text-blue-600">
                    R$ {imovel.preco.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-gray-600">/mês</p>
                </div>

                <Separator />

                {proprietario && (
                  <div>
                    <h3 className="font-semibold mb-3">Informações do Proprietário</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{proprietario.nome}</span>
                      </div>
                      {proprietario.telefone && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{proprietario.telefone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {usuario?.tipoUsuario === 'locatario' && imovel.status === 'disponivel' && (
                  <>
                    <Separator />
                    <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          <MessageSquare className="mr-2 h-5 w-5" />
                          Enviar Mensagem
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar mensagem para o proprietário</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Digite sua mensagem..."
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            rows={5}
                          />
                          <Button onClick={handleEnviarMensagem} className="w-full">
                            Enviar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
