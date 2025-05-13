import path from "../config/expressPath";

export const decompileByteCode = async (bytecode) => {
    try {
        const response = await fetch(`${path}/api/decompile/code/bytecode`, {
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
}

export const decompileAddress = async (address) => {
    try {
        const response = await fetch(`${path}/api/decompile/code/address`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
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

export const AddressDecompileToOpcodes = async (address) => {
    try {
        const response = await fetch(`${path}/api/decompile/opcode/address`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
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

export const ByteCodeDecompileToOpcodes = async (bytecode) => {
    try {
        const response = await fetch(`${path}/api/decompile/opcode/bytecode`, {
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

export const getByteCode = async (address) => {
    try {
        const response = await fetch(`${path}/api/decompile/getByteCode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
        });

        const rawText = await response.text(); // get raw response
        console.log('Raw bytecode Response:', rawText);

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(rawText); // try to parse error body
            } catch {
                throw new Error('Server error: ' + rawText);
            }
            throw new Error(errorData.error || 'Bytecode extraction failed');
        }

        return JSON.parse(rawText);

    } catch (error) {
        console.error('Bytecode API Error:', error);
        throw error;
    }
};