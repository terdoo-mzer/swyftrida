import { FlutterwavePaymentPipelineError } from "./errors.js";
import { PAYMENT_STEP } from "./constants.js";
/**
 * This class is responsible for requesting and caching authentication tokens for all
 * downstream API calls to Flutterwave.
 *
 * This implementation is 'lazy' — it only requests a new token when the current one
 * is missing or expired, rather than refreshing on a fixed schedule.
 *
 * This class futher implements a Single Flight Pattern (SFP) to avoid making multiple
 * concurrent token requests when the cached token is missing or expired.
 * In a concurrent requests scenario where a token is expired or not existing, and requiring
 * a new token to be requested, only the one request proceeds to request for the token,
 * while the rest `wait` for the network request to be completed, and a token handed to them.
 */

class FlutterwaveClient {
  #accessToken = null;
  #tokenExpiresAt = 0; // absolute timestamp (ms since epoch), not a duration
  #pendingTokenRequest = null;

  #requestAuthToken = async () => {
    try {
      const response = await fetch(process.env.FLW_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.FLW_CLIENT_ID,
          client_secret: process.env.FLW_CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      });

      if (!response.ok) {
        console.error(
          "Flutterwave OAUTH request failed: No token returned",
          response
        );
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      this.#accessToken = data.access_token;
      this.#tokenExpiresAt =
        Date.now() +
        (data.expires_in - process.env.TOKEN_EXPIRY_BUFFER_SECONDS) * 1000;
      return this.#accessToken;
    } catch (err) {
        throw new FlutterwavePaymentPipelineError(
          "Flutterwave OAUTH token API request failed",
          {
            isRetryable: true,
            sourceFunction: PAYMENT_STEP.OATH_TOKEN_REQUEST,
            cause: err,
          },
        );
    }
  };

  #isTokenValid = () => {
    return this.#accessToken && Date.now() < this.#tokenExpiresAt;
  };

  /**
   * Returns a valid Flutterwave access token, fetching a new one if the
   * cached token is missing or expired. This is the only method other
   * modules should call.
   */
  getToken = async () => {
    if (this.#isTokenValid()) {
      console.log("Flutterwave: using existing token");
      // return "token generated"
      return this.#accessToken;
    }
    if (this.#pendingTokenRequest) {
      console.log("Flutterwave: waiting for pending token request");
      return this.#pendingTokenRequest;
    }

    this.#pendingTokenRequest = this.#requestAuthToken();
    try {
      return await this.#pendingTokenRequest;
    } finally {
      this.#pendingTokenRequest = null;
    }
  };
}

export const flutterwaveClient = new FlutterwaveClient();
