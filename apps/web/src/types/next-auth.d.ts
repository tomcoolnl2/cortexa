import 'next-auth';
import { UserRole } from '@cortexa/models';

declare module 'next-auth' {
    interface User {
        role?: UserRole;
    }

    interface Session {
        user: {
            id: string;
            role: UserRole;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
        apiToken: string;
        scenarioRole?: UserRole;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: UserRole;
        scenarioRole?: UserRole;
    }
}
