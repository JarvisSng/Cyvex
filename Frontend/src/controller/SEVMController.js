import path from "../config/expressPath";

export const decompileBytecode = async (bytecode) => {
    try {
        const response = await fetch(`${path}/api/decompile/code`, {
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

export const decompileToOpcodes = async (bytecode) => {
    try {
        const response = await fetch(`${path}/api/decompile/opcode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bytecode })
        });

        const rawText = await response.text(); // get raw response
        console.log('Raw Opcode Response:', rawText);

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(rawText); // try to parse error body
            } catch {
                throw new Error('Server error: ' + rawText);
            }
            throw new Error(errorData.error || 'Opcode extraction failed');
        }

        return JSON.parse(rawText);

    } catch (error) {
        console.error('Opcode API Error:', error);
        throw error;
    }
};
