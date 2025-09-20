import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';

    export const useSystemLogs = () => {
        const [logs, setLogs] = useState([]);
        const [loading, setLoading] = useState(true);

        const fetchLogs = useCallback(async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('system_logs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching system logs:", error);
                setLogs([]);
            } else {
                setLogs(data);
            }
            setLoading(false);
        }, []);

        useEffect(() => {
            fetchLogs();
        }, [fetchLogs]);

        return { logs, loading, refreshLogs: fetchLogs };
    };