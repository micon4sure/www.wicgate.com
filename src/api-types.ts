import type { Request, Response } from 'express';

export interface ServerEntry {
  serverName: string;
  serverId: number;
}

export interface LeaderboardEntry {
  profileId?: number | string;
  rank: number;
  high: number;
  profileName: string;
  shortName?: string | null;
  tagFormat?: string | null;
}

export interface LadderEntry {
  profileId: number | string;
  rank?: number;
  profileName: string;
  high: number;
  shortName?: string | null;
  tagFormat?: string | null;
}

export interface ClanEntry {
  position: number;
  clanId: number;
  fullName: string;
  shortName: string;
  tagFormat: string;
  score: number;
  rating: number;
  deviation: number;
  gracePeriodEnd: number;
}

export interface ClanLeaderboardResponse {
  clans: ClanEntry[];
}

export interface OnlineProfile {
  profileId: number | string;
  serverId: number | string;
  profileName: string;
  rank?: number;
  shortName?: string | null;
  tagFormat?: string | null;
}

export interface DataResponse {
  servers: ServerEntry[];
  profiles: OnlineProfile[];
  ladder: LadderEntry[];
  lb_total: LeaderboardEntry[];
  lb_totinf: LeaderboardEntry[];
  lb_totarm: LeaderboardEntry[];
  lb_totair: LeaderboardEntry[];
  lb_totsup: LeaderboardEntry[];
  lb_high: LeaderboardEntry[];
  lb_highinf: LeaderboardEntry[];
  lb_higharm: LeaderboardEntry[];
  lb_highair: LeaderboardEntry[];
  lb_highsup: LeaderboardEntry[];
}

export interface OnlineResponse {
  servers: ServerEntry[];
  profiles: OnlineProfile[];
}

export interface LeaderboardAllResponse {
  lb_total: LeaderboardEntry[];
  lb_totinf: LeaderboardEntry[];
  lb_totarm: LeaderboardEntry[];
  lb_totair: LeaderboardEntry[];
  lb_totsup: LeaderboardEntry[];
  lb_high: LeaderboardEntry[];
  lb_highinf: LeaderboardEntry[];
  lb_higharm: LeaderboardEntry[];
  lb_highair: LeaderboardEntry[];
  lb_highsup: LeaderboardEntry[];
}

export interface LeaderboardLadderResponse {
  ladder: LadderEntry[];
}

export interface DiscordEvent {
  id: string;
  name: string;
  description: string;
  // ISO string or empty string when missing
  start: string;
  coverUrl?: string | null;
  status: 'ongoing' | 'upcoming';
}

export interface CommunityEvent {
  id: number | string;
  name: string;
  start: string;
  description: string;
  link?: string;
  coverUrl?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  updatedAt?: string;
  thumbnailUrl: string;
  videoUrl: string;
  author?: string;
  views?: number;
  channelId?: string;
}

// base url is https://www.wicgate.com so data endpoint is https://www.wicgate.com/api/data

// Endpoint: GET /api/data
export type DataEndpointHandler = (
  _req: Request,
  _res: Response<DataResponse>
) => Promise<void> | void;

// Endpoint: GET /api/online
export type OnlineEndpointHandler = (
  _req: Request,
  _res: Response<OnlineResponse>
) => Promise<void> | void;

// Endpoint: GET /api/leaderboard/all
export type LeaderboardAllHandler = (
  _req: Request,
  _res: Response<LeaderboardAllResponse>
) => Promise<void> | void;

// Endpoint: GET /api/leaderboard/ladder
export type LeaderboardLadderHandler = (
  _req: Request,
  _res: Response<LeaderboardLadderResponse>
) => Promise<void> | void;

// Endpoint: GET /api/events
export type DiscordEndpointHandler = (
  _req: Request,
  _res: Response<DiscordEvent[]>
) => Promise<void> | void;
