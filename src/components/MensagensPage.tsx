import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getMensagensByUsuario,
  getImovelById,
  getUsuarioById,
  addMensagem,
  nextId,
} from '../data/database';
import { Mensagem } from '../types';
import { Card, CardContent } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Avatar, AvatarFallback } from '../app/components/ui/avatar';
import { ScrollArea } from '../app/components/ui/scroll-area';
import { Separator } from '../app/components/ui/separator';
import { Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function MensagensPage() {
  const { usuario } = useAuth();
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(null);
  const [novaMensagem, setNovaMensagem] = useState('');

  const minhasMensagens = getMensagensByUsuario(usuario?.id ?? '');

  const conversas = Array.from(
    new Map(
      minhasMensagens.map((m) => {
        const outroUsuarioId =
          m.remetenteId === usuario?.id ? m.destinatarioId : m.remetenteId;
        const imovelId = m.imovelId;
        const key = `${imovelId}-${outroUsuarioId}`;
        return [key, { imovelId, outroUsuarioId }];
      })
    ).values()
  );

  const mensagensDaConversa = conversaSelecionada
    ? minhasMensagens
        .filter((m) => {
          const [imovelId, outroUsuarioId] = conversaSelecionada.split('-');
          return (
            m.imovelId === imovelId &&
            ((m.remetenteId === usuario?.id && m.destinatarioId === outroUsuarioId) ||
              (m.destinatarioId === usuario?.id && m.remetenteId === outroUsuarioId))
          );
        })
        .sort((a, b) => a.dataEnvio.getTime() - b.dataEnvio.getTime())
    : [];

  const conversaAtual = conversaSelecionada
    ? (() => {
        const [imovelId, outroUsuarioId] = conversaSelecionada.split('-');
        return {
          imovel: getImovelById(imovelId),
          outroUsuario: getUsuarioById(outroUsuarioId),
        };
      })()
    : null;

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim() || !conversaSelecionada) return;

    const [imovelId, destinatarioId] = conversaSelecionada.split('-');

    const mensagem: Mensagem = {
      id: nextId('mensagens'),
      texto: novaMensagem,
      dataEnvio: new Date(),
      remetenteId: usuario!.id,
      destinatarioId,
      imovelId,
      lida: false,
    };

    addMensagem(mensagem);
    setNovaMensagem('');
  };

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mensagens</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <Card className="lg:col-span-1">
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Conversas</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-280px)]">
                {conversas.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Nenhuma conversa ainda</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {conversas.map((conv) => {
                      const imovel = getImovelById(conv.imovelId);
                      const outroUsuario = getUsuarioById(conv.outroUsuarioId);
                      const key = `${conv.imovelId}-${conv.outroUsuarioId}`;
                      const ultimaMensagem = minhasMensagens
                        .filter(
                          (m) =>
                            m.imovelId === conv.imovelId &&
                            (m.remetenteId === conv.outroUsuarioId ||
                              m.destinatarioId === conv.outroUsuarioId)
                        )
                        .sort((a, b) => b.dataEnvio.getTime() - a.dataEnvio.getTime())[0];

                      return (
                        <div
                          key={key}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            conversaSelecionada === key ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setConversaSelecionada(key)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-600 text-white">
                                {getInitials(outroUsuario?.nome || 'U')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {outroUsuario?.nome}
                              </p>
                              <p className="text-xs text-gray-600 truncate">{imovel?.titulo}</p>
                              {ultimaMensagem && (
                                <p className="text-xs text-gray-500 truncate mt-1">
                                  {ultimaMensagem.texto}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-0 flex flex-col h-full">
              {!conversaSelecionada ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>Selecione uma conversa para começar</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getInitials(conversaAtual?.outroUsuario?.nome || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{conversaAtual?.outroUsuario?.nome}</p>
                        <p className="text-sm text-gray-600">{conversaAtual?.imovel?.titulo}</p>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {mensagensDaConversa.map((mensagem) => {
                        const isMinha = mensagem.remetenteId === usuario?.id;
                        return (
                          <div
                            key={mensagem.id}
                            className={`flex ${isMinha ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isMinha
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{mensagem.texto}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isMinha ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                {format(mensagem.dataEnvio, "dd/MM/yyyy 'às' HH:mm", {
                                  locale: ptBR,
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  <Separator />

                  <div className="p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleEnviarMensagem();
                          }
                        }}
                      />
                      <Button onClick={handleEnviarMensagem}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
