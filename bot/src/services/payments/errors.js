export class FlutterwavePaymentPipelineError extends Error {
    constructor(message, {sourceFunction, isRetryable, cause} = {}) {
        super(message, {cause})

        this.name = 'FlutterwavePaymentPipelineError';
        this.isRetryable = isRetryable;
        this.sourceFunction = sourceFunction;
        
    }
}
