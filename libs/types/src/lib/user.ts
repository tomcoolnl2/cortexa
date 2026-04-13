
export const USER_ROLES = ['admin', 'creator', 'reader'] as const;

export type UserRole = (typeof USER_ROLES)[number];

// ── User ──
export interface User {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    role?: UserRole;
}

export interface ApiAuthContext {
    token: string;
    scenarioRole?: UserRole;
}


export interface Viewer {
    authenticated: true;
    name: string | null;
    email: string | null;
    image: string | null;
    /** The real role from the database / session. */
    role: UserRole;
    /** Scenario override set by admin (if any). */
    scenarioRole: UserRole;
    /** The role currently in effect (scenario ?? real). */
    effectiveRole: UserRole;
    /** Signed JWT for API calls. */
    apiToken: string;
    /** Auth context object ready to pass to the API client. */
    authContext: ApiAuthContext;
    /** Permission helpers */
    canCreate: boolean;
    isAdmin: boolean;
}

export type MaybeViewer = Viewer | null;