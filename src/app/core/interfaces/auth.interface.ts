export interface User {
    userId: string;
    username: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    userId: string;
    username: string;
    role: string;
}

export interface CompleteProfileData {
    role: string;
    bio?: string;
    avatarUrl?: string;
}

export interface ProfileResponse {
    username: string;
    avatarUrl?: string;
    bio?: string;
    role: string;
}
