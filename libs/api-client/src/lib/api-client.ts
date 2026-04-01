import { Deck, CreateDeckDto, UpdateDeckDto } from '@cortexa/types';

const API_BASE =
    process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3333/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        throw new Error(`API ${res.status}: ${res.statusText}`);
    }
    return res.json() as Promise<T>;
}

export const api = {
    decks: {
        list: () => request<Deck[]>('/decks'),
        get: (id: string) => request<Deck>(`/decks/${encodeURIComponent(id)}`),
        create: (dto: CreateDeckDto) =>
            request<Deck>('/decks', {
                method: 'POST',
                body: JSON.stringify(dto),
            }),
        update: (id: string, dto: UpdateDeckDto) =>
            request<Deck>(`/decks/${encodeURIComponent(id)}`, {
                method: 'PATCH',
                body: JSON.stringify(dto),
            }),
        remove: (id: string) =>
            request<void>(`/decks/${encodeURIComponent(id)}`, {
                method: 'DELETE',
            }),
    },
};
