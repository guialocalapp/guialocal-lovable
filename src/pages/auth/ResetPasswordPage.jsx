import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserPassword, isPasswordRecovery, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isPasswordRecovery) {
      toast({
        variant: 'destructive',
        title: 'Link inválido',
        description: 'O link de redefinição de senha é inválido ou expirou.',
      });
      navigate('/login');
    }
  }, [isPasswordRecovery, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    const { error } = await updateUserPassword(password);
    setIsLoading(false);

    if (!error) {
      toast({
        title: 'Senha redefinida com sucesso!',
        description: 'Você já pode fazer login com sua nova senha.',
      });
      await signOut();
      navigate('/login');
    }
  };

  if (!isPasswordRecovery) {
    return null;
  }

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
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
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
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;