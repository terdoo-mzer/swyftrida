/**
 * This class is responsible for requesting and caching authentication tokens for all
 * downstream API calls to Flutterwave.
 *
 * This implementation is 'lazy' — it only requests a new token when the current one
 * is missing or expired, rather than refreshing on a fixed schedule.
 *
 * NOTE: This version does not yet handle concurrent calls arriving before a token
 * exists (see request-coalescing / single-flight pattern — to be added separately).
 */
// import dotenv from "dotenv";
const TOKEN_EXPIRY_BUFFER_SECONDS = 60; // refresh this many seconds before actual expiry

// dotenv.config();

class FlutterwaveClient {
  #accessToken = null;
  #tokenExpiresAt = 0; // absolute timestamp (ms since epoch), not a duration
  #pendingTokenRequest = null;

  #requestAuthToken = async () => {
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        "Flutterwave authentication token request failed: " +
          data.error_description,
      );
    }

    this.#accessToken = data.access_token;
    this.#tokenExpiresAt =
      Date.now() + (data.expires_in - TOKEN_EXPIRY_BUFFER_SECONDS) * 1000;

    console.log("Flutterwave: new token generated");
    return this.#accessToken;
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
      return this.#accessToken;
    }
    if(this.#pendingTokenRequest) {
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