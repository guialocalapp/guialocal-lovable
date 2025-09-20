import React, { useState, useEffect, useRef } from 'react';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const useViaCep = (cep, { onSuccess, onError } = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const lastRequestRef = useRef(null);

    const debouncedCep = useDebounce(cep, 300);

    useEffect(() => {
        const fetchAddress = async () => {
            const cepOnlyNumbers = debouncedCep?.replace(/\D/g, '') || '';

            if (cepOnlyNumbers.length !== 8) {
                // Clear errors if cep is not complete
                setError(null);
                return;
            }

            if (cepOnlyNumbers === lastRequestRef.current) {
                return;
            }

            setLoading(true);
            setError(null);
            lastRequestRef.current = cepOnlyNumbers;

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepOnlyNumbers}/json/`);
                if (!response.ok) throw new Error('Falha ao buscar o CEP.');
                
                const data = await response.json();
                if (data.erro) {
                    throw new Error('CEP não encontrado ou inválido.');
                }
                
                if (onSuccess) onSuccess(data);
            } catch (err) {
                setError(err.message);
                if (onError) onError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, [debouncedCep, onSuccess, onError]);

    return { loading, error };
};

export default useViaCep;