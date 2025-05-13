export const decompileBytecode = async (bytecode) => {
    try {
        const response = await fetch('/api/decompile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bytecode })
        });

        const rawText = await response.text(); // get raw response
        console.log('Raw Response:', rawText);

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(rawText); // try to parse error body
            } catch {
                throw new Error('Server error: ' + rawText);
            }
            throw new Error(errorData.error || 'Decompilation failed');
        }

        return JSON.parse(rawText);

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
