export type VoteType = 'upvote' | 'downvote';

export interface Track {
    id: string;
    title: string;
    artistId: string;
    artistName: string;
    genre: string;
    audioUrl: string;
    playCount: number;
    votesCount: number;
    score: number;
    isFavorite?: boolean;
    userVote?: VoteType;
}

export interface Comment {
    id: string;
    trackId: string;
    userId: string;
    username: string;
    text: string;
    createdAt: Date;
}

export interface Vote {
    id: string;
    trackId: string;
    userId: string;
    voteType: VoteType;
    scoreImpact: number;
    createdAt: Date;
}

export interface VoteResponse {
    trackId: string;
    newScore: number;
    newVotesCount: number;
    voteId: string | null;
}

export interface FavoriteToggleResponse {
    trackId: string;
    isFavorite: boolean;
}
