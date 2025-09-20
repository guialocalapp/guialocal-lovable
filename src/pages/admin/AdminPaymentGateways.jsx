
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const AdminPaymentGateways = () => {
    return (
        <>
            <Helmet>
                <title>Gateways de Pagamento - Admin</title>
            </Helmet>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Gateways de Pagamento</h1>
                </div>
                <div className="text-muted-foreground">
                    Esta página foi dividida. Por favor, use os links no menu lateral em Configurações &gt; Pagamentos para gerenciar:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><Link to="/admin/active-gateway" className="text-primary hover:underline">Gateway Ativo</Link></li>
                        <li><Link to="/admin/asaas-settings" className="text-primary hover:underline">Configurações do Asaas</Link></li>
                        <li><Link to="/admin/mercadopago-settings" className="text-primary hover:underline">Configurações do Mercado Pago</Link></li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AdminPaymentGateways;
  