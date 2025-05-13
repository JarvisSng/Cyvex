export const decompileBytecode = async (bytecode) => {
    try {
        const response = await fetch('/api/decompile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bytecode })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Decompilation failed');
        }

        return await response.json();
        
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};