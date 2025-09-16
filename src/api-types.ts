import type { Request, Response } from 'express';

export interface ServerEntry {
  serverName: string;
  serverId: number;
}

export interface LeaderboardEntry {
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

// base url is https://www.wicgate.com so data endpoint is https://www.wicgate.com/api/data

// Endpoint: GET /api/data
export type DataEndpointHandler = (
  req: Request,
  res: Response<DataResponse>
) => Promise<void> | void;

// Endpoint: GET /api/online
export type OnlineEndpointHandler = (
  req: Request,
  res: Response<OnlineResponse>
) => Promise<void> | void;

// Endpoint: GET /api/leaderboard/all
export type LeaderboardAllHandler = (
  req: Request,
  res: Response<LeaderboardAllResponse>
) => Promise<void> | void;

// Endpoint: GET /api/leaderboard/ladder
export type LeaderboardLadderHandler = (
  req: Request,
  res: Response<LeaderboardLadderResponse>
) => Promise<void> | void;

// Endpoint: GET /api/events
export type DiscordEndpointHandler = (
  req: Request,
  res: Response<DiscordEvent[]>
) => Promise<void> | void;
