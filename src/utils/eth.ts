import { bufferToHex } from 'ethereumjs-util';
import { recoverPersonalSignature } from 'eth-sig-util';


/**
 * Validates the signature of a given message.
 */
const isSignatureValid = (
    message: string,
    publicAddress: string,
    signature: string
): boolean => {
    const hex = bufferToHex(Buffer.from(message, 'utf-8'));
    const address = recoverPersonalSignature({
        data: hex,
        sig: signature
    });

    return address.toLowerCase() === publicAddress.toLowerCase();
};

export { isSignatureValid };