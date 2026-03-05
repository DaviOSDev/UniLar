import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '../app/components/ui/radio-group';
import { toast } from 'sonner';
import logo from '../assets/images/logo.png';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, register } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [registerNome, setRegisterNome] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerSenha, setRegisterSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'locador' | 'locatario'>('locatario');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginEmail, loginSenha);
    if (success) {
      toast.success('Login realizado com sucesso!');
      onSuccess();
    } else {
      toast.error('Email ou senha incorretos');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const success = register(registerNome, registerEmail, registerSenha, tipoUsuario);
    if (success) {
      toast.success('Cadastro realizado com sucesso!');
      onSuccess();
    } else {
      toast.error('Email já cadastrado');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <img src={logo} alt="UniLar" className="h-12 w-12 object-contain" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo</CardTitle>
          <CardDescription>
            Encontre o imóvel perfeito ou anuncie o seu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-senha">Senha</Label>
                  <Input
                    id="login-senha"
                    type="password"
                    placeholder="••••••••"
                    value={loginSenha}
                    onChange={(e) => setLoginSenha(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Contas iniciais (db.json): joao@email.com, maria@email.com, carlos@email.com — senha: 123456
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-nome">Nome completo</Label>
                  <Input
                    id="register-nome"
                    type="text"
                    placeholder="Seu nome"
                    value={registerNome}
                    onChange={(e) => setRegisterNome(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-senha">Senha</Label>
                  <Input
                    id="register-senha"
                    type="password"
                    placeholder="••••••••"
                    value={registerSenha}
                    onChange={(e) => setRegisterSenha(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de usuário</Label>
                  <RadioGroup
                    value={tipoUsuario}
                    onValueChange={(value) => setTipoUsuario(value as 'locador' | 'locatario')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="locatario" id="locatario" />
                      <Label htmlFor="locatario" className="font-normal">
                        Procuro imóvel (Locatário)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="locador" id="locador" />
                      <Label htmlFor="locador" className="font-normal">
                        Tenho imóvel para alugar (Locador)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full">
                  Cadastrar
                </Button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  A nova conta será salva no sistema e você poderá entrar com email e senha.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
