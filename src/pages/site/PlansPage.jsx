import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { usePlans } from '@/hooks/usePlans';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
const formatCurrency = value => {
  if (typeof value !== 'number') return 'R$ 0,00';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};
const PlansPage = () => {
  const {
    plans,
    loading
  } = usePlans();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const handleChoosePlan = planId => {
    if (user) {
      navigate(`/checkout/${planId}`);
    } else {
      navigate(`/login?redirect=/checkout/${planId}`);
    }
  };
  if (loading) {
    return <div className="text-center py-20">Carregando planos...</div>;
  }
  const sortedPlans = [...plans].sort((a, b) => a.monthlyPrice - b.monthlyPrice);
  return <>
            <Helmet>
                <title>Planos - Guia Local</title>
                <meta name="description" content="Escolha o plano perfeito para seu negócio e comece a anunciar no Guia Local. Preços flexíveis para todos os tamanhos de empresa." />
            </Helmet>
            <div className="bg-background">
                <div className="pt-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl sm:tracking-tight lg:text-6xl">Planos</h1>
                        <p className="mt-5 max-w-xl mx-auto text-xl text-muted-foreground">
                            Escolha o plano perfeito para destacar seu negócio em nossa plataforma.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="relative rounded-full p-1 bg-secondary flex">
                                <button onClick={() => setBillingCycle('monthly')} className={cn("relative w-1/2 rounded-full py-2 text-sm font-medium text-foreground whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background", billingCycle === 'monthly' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')}>    Plano Mensal    </button>
                                <button onClick={() => setBillingCycle('annually')} className={cn("relative w-1/2 rounded-full py-2 text-sm font-medium text-foreground whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background", billingCycle === 'annually' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')}>Plano Anual     </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:flex-col sm:align-center">
                            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
                                {sortedPlans.map(plan => {
                const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
                const adLimitText = plan.adLimit === -1 ? 'Ilimitados' : plan.adLimit === 0 ? '0' : plan.adLimit;
                const imageLimitText = plan.imageLimit === -1 ? 'Ilimitadas' : plan.imageLimit === 0 ? '0' : plan.imageLimit;
                const videoLimitText = plan.videoLimit === -1 ? 'Ilimitados' : plan.videoLimit === 0 ? '0' : plan.videoLimit;
                const features = [{
                  text: `${adLimitText} anúncios`,
                  included: true
                }, {
                  text: `${imageLimitText} imagens por anúncio`,
                  included: true
                }, {
                  text: `Suporte prioritário`,
                  included: price > 20
                }, {
                  text: `Destaque na busca`,
                  included: price > 50
                }];
                return <div key={plan.id} className="border-2 border-border rounded-lg shadow-sm divide-y divide-border bg-card">
                                            <div className="p-6">
                                                <h2 className="text-lg leading-6 font-medium text-foreground">{plan.name}</h2>
                                                <p className="mt-4 text-sm text-muted-foreground" dangerouslySetInnerHTML={{
                      __html: plan.description
                    }} />
                                                <p className="mt-8">
                                                    <span className="text-4xl font-extrabold text-foreground">
                                                        {price === 0 ? "Gratuito" : formatCurrency(price)}
                                                    </span>
                                                    {price !== 0 && <span className="text-base font-medium text-muted-foreground">/{billingCycle === 'monthly' ? 'mês' : 'ano'}</span>}
                                                </p>
                                                <Button className="mt-8 block w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background" onClick={() => handleChoosePlan(plan.id)}>
                                                    Assinar {plan.name}
                                                </Button>
                                            </div>
                                            <div className="pt-6 pb-8 px-6">
                                                <h3 className="text-xs font-medium text-muted-foreground tracking-wide uppercase">O que está incluso</h3>
                                                <ul role="list" className="mt-6 space-y-4">
                                                    {features.map(feature => <li key={feature.text} className="flex space-x-3">
                                                            {feature.included ? <Check className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" /> : <X className="flex-shrink-0 h-5 w-5 text-destructive" aria-hidden="true" />}
                                                            <span className="text-sm text-muted-foreground">{feature.text}</span>
                                                        </li>)}
                                                </ul>
                                            </div>
                                        </div>;
              })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>;
};
export default PlansPage;