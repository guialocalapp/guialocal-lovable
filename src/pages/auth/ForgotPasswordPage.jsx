import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { sendPasswordResetEmail } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await sendPasswordResetEmail(email);
    if (!error) {
      setIsSent(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Recuperar Senha - Guia Local</title>
        <meta name="description" content="Recupere o acesso à sua conta no Guia Local." />
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
              <CardTitle className="text-3xl font-bold">Recuperar Senha</CardTitle>
              <CardDescription>
                {isSent
                  ? "Um e-mail foi enviado com as instruções."
                  : "Digite seu e-mail para receber o link de redefinição."}
              </CardDescription>
            </CardHeader>
            {isSent ? (
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Se o e-mail estiver correto, você receberá um link para criar uma nova senha. O link é válido por 60 minutos.
                </p>
                <Button asChild variant="link" className="mt-4">
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Login
                  </Link>
                </Button>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                    ) : (
                      <><Mail className="mr-2 h-4 w-4" /> Enviar Link</>
                    )}
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link to="/login">
                      Cancelar
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

export default ForgotPasswordPage;