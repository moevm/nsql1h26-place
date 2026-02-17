export type Request = {
    uri: string;
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit;
}

const request = async (request: Request) => {
    return fetch(
        request.uri,
        {
            method: request.method,
            headers: request.headers,
            body: request.body,
        }
    );
}

export default request;