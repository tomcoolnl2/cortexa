import { USER_ROLES } from '@cortexa/types';
import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = (await req.json().catch(() => ({}))) as {
        scenarioRole?: string;
    };

    const scenarioRole =
        USER_ROLES.find((role) => role === body.scenarioRole) ?? undefined;

    const res = NextResponse.json({ ok: true, scenarioRole });

    if (!scenarioRole) {
        res.cookies.delete('cortexa_role_scenario');
        return res;
    }

    res.cookies.set('cortexa_role_scenario', scenarioRole, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    });

    return res;
}
