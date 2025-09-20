import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import useViaCep from '@/hooks/useViaCep';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { validateCPF } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Step1 = ({ nextStep, handleInputChange, formData, errors }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 50 }}
    transition={{ duration: 0.3 }}
    className="space-y-4"
  >
    <div>
      <Label htmlFor="full_name">Nome completo</Label>
      <Input id="full_name" placeholder="Seu nome completo" value={formData.full_name} onChange={handleInputChange} required />
      {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
    </div>
    <div>
      <Label htmlFor="doc">CPF</Label>
      <Input id="doc" placeholder="000.000.000-00" value={formData.doc} onChange={handleInputChange} required />
      {errors.doc && <p className="text-red-500 text-xs mt-1">{errors.doc}</p>}
    </div>
    <div>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleInputChange} required />
      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" value={formData.password} onChange={handleInputChange} required />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>
    </div>
    <Button onClick={nextStep} className="w-full">Continuar</Button>
  </motion.div>
);

const Step2 = ({ prevStep, handleInputChange, formData, handleSubmit, loading, isCepLoading }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
    className="space-y-4"
  >
    <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 sm:col-span-1 relative">
            <Label htmlFor="zipCode">CEP</Label>
            <Input id="zipCode" value={formData.zipCode} onChange={handleInputChange} />
            {isCepLoading && <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin" />}
        </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-3 sm:col-span-2">
        <Label htmlFor="street">Rua</Label>
        <Input id="street" value={formData.street} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="number">Número</Label>
        <Input id="number" value={formData.number} onChange={handleInputChange} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
        <div>
            <Label htmlFor="complement">Complemento</Label>
            <Input id="complement" value={formData.complement} onChange={handleInputChange} />
        </div>
        <div>
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input id="neighborhood" value={formData.neighborhood} onChange={handleInputChange} />
        </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="city">Cidade</Label>
        <Input id="city" value={formData.city} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="state">UF</Label>
        <Input id="state" value={formData.state} onChange={handleInputChange} />
      </div>
    </div>
    <div className="flex gap-4">
      <Button variant="outline" onClick={prevStep} className="w-full">Voltar</Button>
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Finalizar Cadastro
      </Button>
    </div>
  </motion.div>
);


const Register = () => {
  const [step, setStep] = useState(1);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [affiliateId, setAffiliateId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    doc: '',
    email: '',
    password: '',
    confirmPassword: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const affiliateToken = searchParams.get('afiliado');
    if (affiliateToken) {
      setAffiliateId(affiliateToken);
      toast({
        title: "Você foi indicado!",
        description: "Continue seu cadastro para se juntar ao Guia Local.",
      });
    }
  }, [location.search, toast]);

   const { loading: isCepLoading } = useViaCep(formData.zipCode, {
        onSuccess: (data) => {
             setFormData(prev => ({
                ...prev,
                street: data.logradouro || prev.street,
                neighborhood: data.bairro || prev.neighborhood,
                city: data.localidade || prev.city,
                state: data.uf || prev.state,
            }));
        },
        onError: () => {
             toast({ variant: "destructive", title: "CEP não encontrado", description: "Verifique o CEP digitado." });
        }
    });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
        setErrors(prev => ({...prev, [id]: null}));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = "Nome é obrigatório.";
    if (!formData.email) newErrors.email = "Email é obrigatório.";
    if (!validateCPF(formData.doc)) newErrors.doc = "CPF inválido.";
    if (formData.password.length < 6) newErrors.password = "Senha deve ter no mínimo 6 caracteres.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) {
        setStep(1);
        return;
    }
    setLoading(true);

    try {
        const { data, error } = await signUp(formData.email, formData.password, {
            full_name: formData.full_name,
            doc: formData.doc.replace(/\D/g, ''),
            zipCode: formData.zipCode,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            role: 'client',
            affiliate_id: affiliateId,
        });

        if (error) {
            if (error.message.includes('User already registered')) {
                setErrors(prev => ({...prev, email: 'Este e-mail já está cadastrado. Tente fazer login.'}));
                setStep(1);
            } else {
                 toast({
                    variant: "destructive",
                    title: "Erro no cadastro.",
                    description: error.message || "Por favor, verifique seus dados e tente novamente.",
                });
            }
            return;
        }

        toast({
            title: "Cadastro realizado com sucesso!",
            description: "Bem-vindo(a) ao Guia Local! Faça seu login para continuar.",
        });
        navigate('/login');

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro inesperado no cadastro.",
            description: error.message || "Por favor, verifique seus dados e tente novamente.",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Crie sua Conta - Guia Local</title>
        <meta name="description" content="Cadastre-se no Guia Local e comece a divulgar seu negócio hoje mesmo." />
      </Helmet>
      <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[380px] gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">Crie sua conta</h1>
                  <p className="text-balance text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="underline">
                      Faça login
                    </Link>
                  </p>
                </div>

                <div className="relative h-[420px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" className="absolute w-full">
                                <Step1 nextStep={nextStep} handleInputChange={handleInputChange} formData={formData} errors={errors} />
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div key="step2" className="absolute w-full">
                                <Step2 prevStep={prevStep} handleInputChange={handleInputChange} formData={formData} handleSubmit={handleSubmit} loading={loading} isCepLoading={isCepLoading}/>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
        <div className="hidden bg-muted lg:block">
            <img 
              alt="Banner de cadastro com imagem de um ambiente de trabalho moderno"
              className="h-full w-full object-cover dark:brightness-[0.7]"
             src="https://images.unsplash.com/photo-1598737129494-69cb30f96a73" />
        </div>
      </div>
    </>
  );
};

export default Register;