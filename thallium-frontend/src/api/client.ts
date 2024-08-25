/*
TODO: Someday these methods should try pick out authentication from the Redux stores.
*/

const BASE_URL = THALLIUM_BASE_URL;

export class APIMissingTokenError extends Error {
    constructor() {
        super("No token available");
    }
}

interface APIErrorResponse {
    detail?: string;
}

export type APIRequestBody = Record<string, unknown>;

type APIResponseBody = Record<string, unknown>;

export class APIError extends Error {
    constructor(message: string, public status: number, public data: APIErrorResponse | null) {
        super(message);
    }
}

const request = async (url: string, options: RequestInit = {}): Promise<APIResponseBody> => {
    const response = await fetch(`${BASE_URL}${url}`, options);
    if (!response.ok) {
        let maybeData: APIErrorResponse | null;

        try {
            maybeData = await response.json() as APIErrorResponse;
        } catch (e) {
            maybeData = null;
        }

        throw new APIError(response.statusText, response.status, maybeData);
    }
    return response.json() as Promise<APIResponseBody>;
};

export const get = async (url: string, options: RequestInit = {}): Promise<APIResponseBody> => {
    return request(url, {
        ...options,
        method: "GET",
    });
};

export const post = async (url: string, data: APIRequestBody, options: RequestInit = {}): Promise<APIResponseBody> => {
    return request(url, {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};
