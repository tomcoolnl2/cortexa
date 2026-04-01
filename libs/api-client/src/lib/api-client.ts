import {
    Deck,
    CreateDeckDto,
    UpdateDeckDto,
    ApiAuthContext,
} from '@cortexa/types';

const API_BASE =
    process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3333/api';

async function request<T>(
    path: string,
    auth?: ApiAuthContext,
    options?: RequestInit,
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (auth?.token) {
        headers.Authorization = `Bearer ${auth.token}`;
    }
    if (auth?.scenarioRole) {
        headers['x-cortexa-role-scenario'] = auth.scenarioRole;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        headers,
        ...options,
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error(`API ${res.status}: ${res.statusText}`);
    }
    return res.json() as Promise<T>;
}

export const api = {
    decks: {
        list: (auth: ApiAuthContext) => request<Deck[]>('/decks', auth),
        listPublic: () => request<Deck[]>('/decks/public'),
        getPublic: (id: string) =>
            request<Deck>(`/decks/public/${encodeURIComponent(id)}`),
        get: (id: string, auth: ApiAuthContext) =>
            request<Deck>(`/decks/${encodeURIComponent(id)}`, auth),
        create: (dto: CreateDeckDto, auth: ApiAuthContext) =>
            request<Deck>('/decks', {
                ...auth,
            }, {
                method: 'POST',
                body: JSON.stringify(dto),
            }),
        update: (id: string, dto: UpdateDeckDto, auth: ApiAuthContext) =>
            request<Deck>(`/decks/${encodeURIComponent(id)}`, auth, {
                method: 'PATCH',
                body: JSON.stringify(dto),
            }),
        remove: (id: string, auth: ApiAuthContext) =>
            request<void>(`/decks/${encodeURIComponent(id)}`, auth, {
                method: 'DELETE',
            }),
    },
};
