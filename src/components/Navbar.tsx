import { useAuth } from '../contexts/AuthContext';
import { Button } from '../app/components/ui/button';
import { LogOut, MessageSquare, Plus, Home } from 'lucide-react';
import { toast } from 'sonner';
import logo from '../assets/images/logo.png';
import { Avatar, AvatarFallback } from '../app/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../app/components/ui/dropdown-menu';

interface NavbarProps {
  onNavigate: (page: 'home' | 'mensagens' | 'cadastrar' | 'meus-imoveis') => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Você saiu da conta. Faça login novamente para continuar.');
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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <img src={logo} alt="UniLar" className="h-8 w-8 object-contain" />
            <span className="text-xl font-semibold text-gray-900">UniLar</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('home')}
            >
              <Home className="h-4 w-4 mr-2" />
              Início
            </Button>

            <Button
              variant={currentPage === 'mensagens' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('mensagens')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensagens
            </Button>

            {usuario?.tipoUsuario === 'locador' && (
              <>
                <Button
                  variant={currentPage === 'cadastrar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('cadastrar')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Anunciar
                </Button>
                <Button
                  variant={currentPage === 'meus-imoveis' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('meus-imoveis')}
                >
                  Meus Imóveis
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Deslogar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getInitials(usuario?.nome || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{usuario?.nome}</p>
                    <p className="text-xs text-gray-500">{usuario?.email}</p>
                    <p className="text-xs text-blue-600 capitalize">
                      {usuario?.tipoUsuario}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleLogout}
                  className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Deslogar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
