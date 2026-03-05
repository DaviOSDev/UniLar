import { Imovel } from '../types';
import { Card, CardContent } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { MapPin, Bed, Bath, Maximize, Check, X } from 'lucide-react';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';

interface ImovelCardProps {
  imovel: Imovel;
  onClick: () => void;
}

export function ImovelCard({ imovel, onClick }: ImovelCardProps) {
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

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={imovel.imagens[0]}
          alt={imovel.titulo}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-3 right-3 ${statusColors[imovel.status]}`}>
          {statusLabels[imovel.status]}
        </Badge>
        <Badge className="absolute top-3 left-3 bg-blue-600">
          {tipoLabels[imovel.tipo]}
        </Badge>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{imovel.titulo}</h3>
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {imovel.endereco.bairro}, {imovel.endereco.cidade}
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{imovel.descricao}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          {imovel.quartos && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {imovel.quartos}
            </div>
          )}
          {imovel.banheiros && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {imovel.banheiros}
            </div>
          )}
          {imovel.area && (
            <div className="flex items-center">
              <Maximize className="h-4 w-4 mr-1" />
              {imovel.area}m²
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center text-gray-600">
            {imovel.mobiliado ? (
              <Check className="h-4 w-4 mr-1 text-green-600" />
            ) : (
              <X className="h-4 w-4 mr-1 text-red-600" />
            )}
            Mobiliado
          </div>
          <div className="flex items-center text-gray-600">
            {imovel.aceitaPet ? (
              <Check className="h-4 w-4 mr-1 text-green-600" />
            ) : (
              <X className="h-4 w-4 mr-1 text-red-600" />
            )}
            Pet
          </div>
        </div>

        <div className="pt-2 border-t">
          <span className="text-2xl font-bold text-blue-600">
            R$ {imovel.preco.toLocaleString('pt-BR')}
          </span>
          <span className="text-gray-600">/mês</span>
        </div>
      </CardContent>
    </Card>
  );
}
