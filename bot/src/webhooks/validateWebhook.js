import crypto from 'crypto';

export const isFlutterwaveSignatureValid = (rawBody, signature, secretHash) => {
    const hash = crypto
                    .createHmac('sha256', secretHash)
                    .update(rawBody)
                    .digest('base64');
    return hash === signature;
}