export interface Track {
    id: string;
    title: string;
    artistId: string;
    artistName: string;
    genre: string;
    audioUrl: string;
    eloScore: number;
    userVote?: boolean;
}

export interface VoteResponse {
    voteId: string | null;
    newEloScore: number;
}
