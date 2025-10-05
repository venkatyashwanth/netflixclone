import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { token } = await request.json();

        const response = NextResponse.json({ success: true });

        // Set the token as an HTTP-only cookie for security
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 5, // 5 days
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Failed to set token' }, { status: 500 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('auth-token');
    return response;
}