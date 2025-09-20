import React, { useState, useEffect, useMemo } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/hooks/useAuth';
    import { Button } from '@/components/ui/button';
    import { Label } from '@/components/ui/label';
    import { Input } from '@/components/ui/input';
    import { LogIn, Loader2 } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import Turnstile from 'react-turnstile';
    import { useSettings } from '@/contexts/SettingsContext';
    import { useToast } from '@/components/ui/use-toast';

    const Login = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [turnstileToken, setTurnstileToken] = useState('');
      const [turnstileReady, setTurnstileReady] = useState(false);
      const { signIn } = useAuth();
      const { getPublicSettings } = useSettings();
      const { toast } = useToast();
      const [publicSettings, setPublicSettings] = useState({});

      useEffect(() => {
        const loadSettings = async () => {
            const settings = await getPublicSettings();
            setPublicSettings(settings);
            if (settings.cloudflare?.enabled) {
                // If Turnstile is enabled, wait for it to be ready
            } else {
                // If not enabled, proceed without it
                setTurnstileReady(true);
            }
        };
        loadSettings();
      }, [getPublicSettings]);

      const isTurnstileEnabled = useMemo(() => publicSettings.cloudflare?.enabled, [publicSettings]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await signIn(email, password, isTurnstileEnabled ? turnstileToken : undefined);
        setIsLoading(false);
      };

      const canSubmit = useMemo(() => {
        if (!turnstileReady) return false;
        if (isTurnstileEnabled && !turnstileToken) return false;
        return !isLoading;
      }, [isLoading, turnstileToken, turnstileReady, isTurnstileEnabled]);
    
      return (
        <>
          <Helmet>
            <title>Login - Guia Local</title>
            <meta name="description" content="Acesse seu painel no Guia Local." />
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
                  <CardTitle className="text-3xl font-bold">Acesse sua Conta</CardTitle>
                  <CardDescription>
                    Não tem uma conta?{' '}
                    <Link to="/cadastro" className="font-medium text-primary hover:underline">
                      Cadastre-se
                    </Link>
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha</Label>
                            <Link to="/recuperar-senha" className="text-sm font-medium text-primary hover:underline">
                                Esqueceu a senha?
                            </Link>
                        </div>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {isTurnstileEnabled && publicSettings.cloudflare?.siteKey && (
                       <div className="flex justify-center">
                          <Turnstile
                              sitekey={publicSettings.cloudflare.siteKey}
                              onVerify={(token) => setTurnstileToken(token)}
                              onLoad={() => setTurnstileReady(true)}
                              onError={() => {
                                  toast({ variant: 'destructive', title: 'Erro no CAPTCHA', description: 'Não foi possível carregar o widget de verificação.' });
                                  setTurnstileReady(true); // Allow submit attempt even if it fails, server will validate
                              }}
                          />
                        </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={!canSubmit}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...</> : <> <LogIn className="mr-2 h-4 w-4" /> Entrar </>}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </div>
        </>
      );
    };
    
    export default Login;