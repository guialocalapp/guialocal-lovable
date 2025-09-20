import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { KeyRound, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const RedefinePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const { updateUserPassword, isPasswordRecovery, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const verificationTimer = setTimeout(() => {
      setIsVerifying(false);
      if (!isPasswordRecovery) {
        setError('Token de redefinição inválido ou expirado. Por favor, solicite um novo link.');
      }
    }, 2000);

    return () => clearTimeout(verificationTimer);
  }, [isPasswordRecovery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordRecovery) {
      toast({
        variant: 'destructive',
        title: 'Sessão inválida',
        description: 'Não foi possível verificar a sessão de redefinição de senha.',
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'As senhas não coincidem',
        description: 'Por favor, verifique e tente novamente.',
      });
      return;
    }
    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Senha muito curta',
        description: 'A senha deve ter no mínimo 6 caracteres.',
      });
      return;
    }

    setIsLoading(true);
    const { error: updateError } = await updateUserPassword(password);
    setIsLoading(false);

    if (!updateError) {
      toast({
        title: 'Senha redefinida com sucesso!',
        description: 'Você já pode fazer login com sua nova senha.',
      });
      await signOut();
      navigate('/login');
    } else {
      setError(updateError.message || 'Ocorreu um erro ao redefinir a senha. O link pode ter expirado.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Redefinir Senha - Guia Local</title>
        <meta name="description" content="Crie uma nova senha para sua conta no Guia Local." />
      </Helmet>
      <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Crie uma Nova Senha</CardTitle>
              <CardDescription>
                Escolha uma senha forte e segura para sua conta.
              </CardDescription>
            </CardHeader>
            {isVerifying ? (
               <CardContent>
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Verificando token...</p>
                    </div>
               </CardContent>
            ) : error ? (
              <CardContent className="text-center">
                <div className="flex flex-col items-center gap-4 text-red-500">
                  <AlertTriangle className="w-12 h-12" />
                  <p className="text-destructive">{error}</p>
                  <Button asChild variant="link" className="mt-4">
                    <Link to="/recuperar-senha">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Solicitar Novo Link
                    </Link>
                  </Button>
                </div>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password">Nova Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                    ) : (
                      <><KeyRound className="mr-2 h-4 w-4" /> Salvar Nova Senha</>
                    )}
                  </Button>
                  <Button asChild variant="link" className="text-muted-foreground">
                      <Link to="/login">
                          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Login
                      </Link>
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default RedefinePasswordPage;