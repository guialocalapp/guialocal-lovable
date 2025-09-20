import React, { createContext, useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const DataContext = createContext(null);

const defaultData = {
    users: [
        { id: 'admin_1', fullName: 'Admin', email: 'admin@guialocal.com', password: 'admin', role: 'admin' },
        { id: 'client_1699999999999', fullName: 'João da Silva', email: 'joao.silva@example.com', password: 'password', role: 'client', planId: 'plan_2', phone: '51999998888', document: '12345678901', zipCode: '94000000', street: 'Rua das Flores', number: '123', neighborhood: 'Centro', city: 'Gravataí', state: 'RS' },
        { id: 'client_1699999999998', fullName: 'Maria Oliveira', email: 'maria.oliveira@example.com', password: 'password', role: 'client', planId: 'plan_3', phone: '51987654321', document: '98765432109', zipCode: '91000000', street: 'Avenida Principal', number: '456', neighborhood: 'Comercial', city: 'Porto Alegre', state: 'RS' },
    ],
    ads: [
        { id: 'ad_1', title: 'Hamburgueria Artesanal', slug: 'hamburgueria-artesanal', description: 'Os melhores hamburgueres da cidade, feitos com ingredientes frescos e selecionados.', userId: 'client_1699999999999', categoryId: 'cat_3', cityId: 'city_1', statusId: '1', images: [{ id: uuidv4(), url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" }], facilityIds: ['1', '2', '3'], paymentMethodIds: [], street: 'Rua das Flores', number: '123', neighborhood: 'Centro', zipCode: '94000-000', phone: '(51) 3333-4444', whatsapp: '(51) 99999-8888', email: 'contato@hamburgueria.com', website: 'https://hamburgueria.com' },
        { id: 'ad_2', title: 'Loja de Roupas Estilo & Cia', slug: 'loja-de-roupas-estilo-e-cia', description: 'Moda feminina e masculina com as últimas tendências. Venha conferir!', userId: 'client_1699999999998', categoryId: 'cat_5', cityId: 'city_2', statusId: '1', images: [{ id: uuidv4(), url: "https://images.unsplash.com/photo-1445205170230-053b83016050" }], facilityIds: ['3', '4'], paymentMethodIds: [], street: 'Avenida Principal', number: '456', neighborhood: 'Comercial', zipCode: '91000-000', phone: '(51) 3210-9876', whatsapp: '(51) 98765-4321', email: 'contato@estiloecia.com', website: 'https://estiloecia.com' },
    ],
    categories: [
        { id: 'cat_1', name: 'Restaurantes', slug: 'restaurantes' },
        { id: 'cat_2', name: 'Bares', slug: 'bares' },
        { id: 'cat_3', name: 'Lanches', slug: 'lanches' },
        { id: 'cat_4', name: 'Serviços', slug: 'servicos' },
        { id: 'cat_5', name: 'Lojas', slug: 'lojas' },
    ],
    plans: [
        { id: 'plan_1', name: 'Plano Básico', price: '29.90', adLimit: 1, imageLimit: 1, features: ['1 anúncio', '1 foto'] },
        { id: 'plan_2', name: 'Plano Intermediário', price: '59.90', adLimit: 5, imageLimit: 5, features: ['5 anúncios', '5 fotos por anúncio', 'Suporte prioritário'] },
        { id: 'plan_3', name: 'Plano Premium', price: '99.90', adLimit: -1, imageLimit: 10, features: ['Anúncios ilimitados', '10 fotos por anúncio', 'Suporte 24/7', 'Destaque na busca'] },
    ],
    adStatus: [
        { id: '1', name: 'Ativo' },
        { id: '2', name: 'Inativo' },
        { id: '3', name: 'Pendente' },
        { id: '4', name: 'Expirado' },
    ],
    facilities: [
      { id: '1', name: 'Wi-Fi', icon: 'Wifi' },
      { id: '2', name: 'Estacionamento', icon: 'Car' },
      { id: '3', name: 'Acessibilidade', icon: 'PersonStanding' },
      { id: '4', name: 'Ar Condicionado', icon: 'AirVent' },
    ],
    banners: [],
    menus: [],
    paymentMethods: [],
    cities: [
      { id: 'city_1', name: 'Gravataí', state: 'RS', slug: 'gravatai-rs' },
      { id: 'city_2', name: 'Porto Alegre', state: 'RS', slug: 'porto-alegre-rs' },
    ],
    settings: {
        asaasApiKey: '',
        smtp: { host: '', port: '', user: '', pass: '' }
    }
};

const DATA_STORAGE_KEY = 'guiaLocalData';

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(() => {
        try {
            const localData = localStorage.getItem(DATA_STORAGE_KEY);
            if (localData) {
                const parsedData = JSON.parse(localData);
                return { ...defaultData, ...parsedData };
            }
            return defaultData;
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
            return defaultData;
        }
    });

    useEffect(() => {
        try {
            const dataToStore = JSON.stringify(data);
            localStorage.setItem(DATA_STORAGE_KEY, dataToStore);
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [data]);
    
    const value = useMemo(() => ({ data, setData }), [data, setData]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};