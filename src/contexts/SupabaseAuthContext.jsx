import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { useNavigate } from 'react-router-dom';
    
    export const AuthContext = createContext(undefined);
    
    export const AuthProvider = ({ children }) => {
      const { toast } = useToast();
      const navigate = useNavigate();
    
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
    
      const serviceUserSignIn = useCallback(async () => {
        const serviceEmail = "ricardofrdrc@gmail.com";
        const servicePassword = "Rifre0X1@";
    
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: serviceEmail,
          password: servicePassword,
        });
    
        if (signInError) {
          console.error("Critical Error: Could not sign in service user.", signInError);
          toast({
            variant: "destructive",
            title: "Erro Crítico de Serviço",
            description: "Não foi possível conectar ao serviço de dados. Tente novamente mais tarde.",
          });
        }
      }, [toast]);
    
      useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            const savedUser = localStorage.getItem('platform_user');
            if (savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                } catch (e) {
                    localStorage.removeItem('platform_user');
                }
            }

            await serviceUserSignIn();
            
            const { data: authListener } = supabase.auth.onAuthStateChange(
              async (event, session) => {
                 if (event === 'PASSWORD_RECOVERY') {
                    setIsPasswordRecovery(true);
                 } else if (event === 'SIGNED_OUT' && !localStorage.getItem('platform_user')) {
                    setUser(null);
                    setIsPasswordRecovery(false);
                 } else if (event === 'SIGNED_IN' && session?.user?.email !== 'ricardofrdrc@gmail.com') {
                    // This case is handled by platformSignIn logic
                 } else if (!session) {
                    await serviceUserSignIn();
                 }
              }
            );
            
            setLoading(false);
            
            return () => {
              authListener?.subscription.unsubscribe();
            };
        };

        initializeAuth();
      }, [serviceUserSignIn]);
    
    
      const platformSignIn = useCallback(async (email, password) => {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if(signInError){
           toast({
            variant: "destructive",
            title: "Falha no login",
            description: "E-mail ou senha inválidos.",
          });
          return { success: false, error: signInError };
        }

        if (!signInData.user) {
            toast({
              variant: "destructive",
              title: "Falha no login",
              description: "Usuário não encontrado após o login.",
            });
            await serviceUserSignIn();
            return { success: false, error: new Error("User not found post-signin") };
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signInData.user.id)
          .single();
    
        if (profileError || !profile) {
          toast({
            variant: "destructive",
            title: "Falha no login",
            description: "Perfil de usuário não encontrado.",
          });
          await supabase.auth.signOut();
          await serviceUserSignIn();
          return { success: false, error: profileError || new Error("Profile not found") };
        }
    
        const loggedInUser = {
          id: profile.id,
          email: profile.email,
          profile: profile,
          accessToken: signInData.session.access_token,
        };
        
        setUser(loggedInUser);
        localStorage.setItem('platform_user', JSON.stringify(loggedInUser));
    
        const targetPath = profile.role === 'admin' ? '/admin' : '/client';
        navigate(targetPath, { replace: true });
    
        return { success: true };
      }, [toast, navigate, serviceUserSignIn]);
    
      const platformSignOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error);
        }
        setUser(null);
        localStorage.removeItem('platform_user');
        await serviceUserSignIn();
        navigate('/', { replace: true });
      }, [navigate, serviceUserSignIn]);

      const fetchProfile = useCallback(async (id) => {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) return null;
        const localUser = JSON.parse(localStorage.getItem('platform_user'));
        if (localUser && localUser.id === id) {
           setUser(prev => ({...prev, profile: data}));
           localStorage.setItem('platform_user', JSON.stringify({...localUser, profile: data}));
        }
        return data;
      }, []);

      const refreshUserProfile = useCallback(async () => {
          const localUser = JSON.parse(localStorage.getItem('platform_user'));
          if (!localUser?.id) return;
          const { data, error } = await supabase.from('profiles').select('*').eq('id', localUser.id).single();
          if (error) {
              console.error("Failed to refresh user profile:", error);
              return;
          }
          const updatedUser = {...localUser, profile: data};
          setUser(updatedUser);
          localStorage.setItem('platform_user', JSON.stringify(updatedUser));
      }, []);
    
      const signUp = useCallback(async (email, password, metaData) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            return { data: null, error: authError };
        }

        if(authData.user) {
            let planId = metaData.plan_id;
            if (metaData.role === 'client' && !planId) {
                const { data: freePlan, error: planError } = await supabase
                    .from('plans')
                    .select('id')
                    .eq('name', 'Plano Gratuito')
                    .single();
                
                if (planError || !freePlan) {
                    console.error("Error fetching free plan:", planError);
                } else {
                    planId = freePlan.id;
                }
            }

            const profileData = {
                id: authData.user.id,
                email,
                full_name: metaData.full_name,
                role: metaData.role,
                plan_id: planId,
                doc: metaData.doc,
                zipCode: metaData.zipCode,
                street: metaData.street,
                number: metaData.number,
                complement: metaData.complement,
                neighborhood: metaData.neighborhood,
                city: metaData.city,
                state: metaData.state,
                affiliate_id: metaData.affiliate_id || null,
            };

            const { data, error } = await supabase.from('profiles').insert([profileData]).select().single();
        
            if (error) {
              const { error: deleteError } = await supabase.auth.admin.deleteUser(authData.user.id);
              if (deleteError) {
                console.error("Failed to delete user after profile creation failed:", deleteError);
              }
              return { data: null, error };
            }
            return { data, error: null };
        }
        return { data: null, error: new Error('Usuário não criado na autenticação.')};
      }, []);
      
      const updateUserPassword = useCallback(async (password) => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            toast({
                variant: "destructive",
                title: "Falha ao atualizar senha",
                description: error.message,
            });
            return { error };
        }
        toast({ title: "Senha atualizada com sucesso!" });
        return { error: null };
      }, [toast]);

      const updateUserPasswordByToken = useCallback(async (token, password) => {
        const { error: sessionError } = await supabase.auth.setSession({ refresh_token: token });
        if (sessionError) {
            toast({ variant: "destructive", title: "Token inválido", description: "O link de redefinição pode ter expirado." });
            return { error: sessionError };
        }

        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) {
            toast({ variant: "destructive", title: "Falha ao atualizar senha", description: updateError.message });
            return { error: updateError };
        }

        await supabase.auth.signOut();
        await serviceUserSignIn();
        return { error: null };
      }, [toast, serviceUserSignIn]);

      const updateUserById = useCallback(async(userId, userData) => {
        const localUser = JSON.parse(localStorage.getItem('platform_user'));
        if (!localUser || !localUser.accessToken) {
            const error = new Error("Usuário admin não autenticado.");
            toast({ variant: "destructive", title: "Erro de Autenticação", description: error.message });
            return { data: null, error };
        }

        const { data, error } = await supabase.functions.invoke('update-user-password-admin', {
            headers: {
                Authorization: `Bearer ${localUser.accessToken}`,
            },
            body: { userId, password: userData.password },
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Falha ao atualizar usuário",
                description: error.message,
            });
            return { data: null, error };
        }
        toast({ title: "Usuário atualizado com sucesso!" });
        return { data, error: null };
      }, [toast]);

      const sendPasswordResetEmail = useCallback(async (email) => {
        const { data, error } = await supabase.functions.invoke('send-reset-password-email', {
          body: { email },
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao enviar e-mail",
                description: data?.error || "Não foi possível enviar o e-mail de recuperação. Verifique o endereço e tente novamente.",
            });
            return { error: data?.error || error };
        }

        toast({
            title: "E-mail enviado!",
            description: "Verifique sua caixa de entrada para o link de redefinição de senha.",
        });
        return { error: null };
      }, [toast]);
    
      const value = useMemo(() => ({
        user,
        loading,
        isPasswordRecovery,
        signIn: platformSignIn,
        signOut: platformSignOut,
        signUp,
        updateUserPassword,
        updateUserPasswordByToken,
        updateUserById,
        fetchProfile,
        refreshUserProfile,
        sendPasswordResetEmail,
      }), [user, loading, isPasswordRecovery, platformSignIn, platformSignOut, signUp, updateUserPassword, updateUserPasswordByToken, updateUserById, fetchProfile, refreshUserProfile, sendPasswordResetEmail]);
    
      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };
    
    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
      }
      return context;
    };