import path from "../config/expressPath";

export const decompileByteCode = async (bytecode) => {
    try {
        const response = await fetch(`${path}/api/decompile/code/bytecode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bytecode })
        });

        const rawText = await response.text();
        console.debug('Decompilation Response:', rawText);

        if (!response.ok) {
            let errorData = { error: 'Unknown error', details: {} };
            try {
                errorData = JSON.parse(rawText);
            } catch (e) {
                console.warn('Failed to parse error response:', e);
            }
            
            const apiError = new Error(errorData.error || 'Decompilation failed');
            apiError.details = errorData.details || {};
            apiError.status = response.status;
            throw apiError;
        }

        const result = JSON.parse(rawText);
        
        if (!result.success) {
            const error = new Error(result.error || 'Decompilation unsuccessful');
            error.details = result.data || {};
            throw error;
        }

        return {
            ...result.data,
            rawResponse: rawText // Include raw response for debugging
        };

    } catch (error) {
        console.error('Decompilation Error:', {
            message: error.message,
            stack: error.stack,
            input: { bytecode: bytecode?.slice(0, 50) + (bytecode?.length > 50 ? '...' : '') }
        });
        
        // Enhance the error with additional context
        error.context = {
            endpoint: 'bytecode',
            inputType: 'bytecode',
            timestamp: new Date().toISOString()
        };
        throw error;
    }    
};

export const decompileAddress = async (address) => {
    try {
        const response = await fetch(`${path}/api/decompile/code/address`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
        });

        const rawText = await response.text();
        console.debug('Address Decompilation Response:', rawText);

        if (!response.ok) {
            let errorData = { error: 'Unknown error', details: {} };
            try {
                errorData = JSON.parse(rawText);
            } catch (e) {
                console.warn('Failed to parse error response:', e);
            }
            
            const apiError = new Error(errorData.error || 'Address decompilation failed');
            apiError.details = errorData.details || {};
            apiError.status = response.status;
            throw apiError;
        }

        const result = JSON.parse(rawText);
        
        if (!result.success) {
            const error = new Error(result.error || 'Address decompilation unsuccessful');
            error.details = result.data || {};
            throw error;
        }

        return {
            ...result.data,
            isContract: result.data.isContract !== false, // Default to true if not specified
            rawResponse: rawText
        };

    } catch (error) {
        console.error('Address Decompilation Error:', {
            message: error.message,
            stack: error.stack,
            input: { address }
        });
        
        // Enhance the error with additional context
        error.context = {
            endpoint: 'address',
            inputType: 'address',
            timestamp: new Date().toISOString()
        };
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