import { describe, it, expect } from 'vitest';
import { usePlayerDisplay } from './usePlayerDisplay';
import type { OnlineProfile, ServerEntry } from '../api-types';

describe('usePlayerDisplay', () => {
  describe('groupPlayersByServer', () => {
    it('should display "Online" for serverId 0', () => {
      const { groupPlayersByServer } = usePlayerDisplay();

      const players: OnlineProfile[] = [
        {
          profileId: 1,
          serverId: 0,
          profileName: 'Player1',
          shortName: null,
          tagFormat: null,
        },
        {
          profileId: 2,
          serverId: 0,
          profileName: 'Player2',
          shortName: null,
          tagFormat: null,
        },
      ];

      const servers: ServerEntry[] = [];

      const groups = groupPlayersByServer(players, servers);

      expect(groups).toHaveLength(1);
      expect(groups[0]?.serverId).toBe('0');
      expect(groups[0]?.serverName).toBe('Online');
      expect(groups[0]?.players).toHaveLength(2);
    });

    it('should use server name from servers list when available', () => {
      const { groupPlayersByServer } = usePlayerDisplay();

      const players: OnlineProfile[] = [
        {
          profileId: 1,
          serverId: 1,
          profileName: 'Player1',
          shortName: null,
          tagFormat: null,
        },
      ];

      const servers: ServerEntry[] = [
        {
          serverId: 1,
          serverName: 'EU Server #1',
        },
      ];

      const groups = groupPlayersByServer(players, servers);

      expect(groups).toHaveLength(1);
      expect(groups[0]?.serverId).toBe('1');
      expect(groups[0]?.serverName).toBe('EU Server #1');
    });

    it('should fallback to "Server X" format for unknown server IDs', () => {
      const { groupPlayersByServer } = usePlayerDisplay();

      const players: OnlineProfile[] = [
        {
          profileId: 1,
          serverId: 5,
          profileName: 'Player1',
          shortName: null,
          tagFormat: null,
        },
      ];

      const servers: ServerEntry[] = [];

      const groups = groupPlayersByServer(players, servers);

      expect(groups).toHaveLength(1);
      expect(groups[0]?.serverId).toBe('5');
      expect(groups[0]?.serverName).toBe('Server 5');
    });

    it('should handle mixed server IDs including 0', () => {
      const { groupPlayersByServer } = usePlayerDisplay();

      const players: OnlineProfile[] = [
        {
          profileId: 1,
          serverId: 0,
          profileName: 'OnlinePlayer',
          shortName: null,
          tagFormat: null,
        },
        {
          profileId: 2,
          serverId: 1,
          profileName: 'ServerPlayer',
          shortName: null,
          tagFormat: null,
        },
      ];

      const servers: ServerEntry[] = [
        {
          serverId: 1,
          serverName: 'EU Server #1',
        },
      ];

      const groups = groupPlayersByServer(players, servers);

      expect(groups).toHaveLength(2);

      // Find the groups
      const onlineGroup = groups.find((g) => g.serverId === '0');
      const serverGroup = groups.find((g) => g.serverId === '1');

      expect(onlineGroup).toBeDefined();
      expect(serverGroup).toBeDefined();
      expect(onlineGroup?.serverName).toBe('Online');
      expect(serverGroup?.serverName).toBe('EU Server #1');
    });

    it('should sort players alphabetically within each group', () => {
      const { groupPlayersByServer } = usePlayerDisplay();

      const players: OnlineProfile[] = [
        {
          profileId: 1,
          serverId: 0,
          profileName: 'Zebra',
          shortName: null,
          tagFormat: null,
        },
        {
          profileId: 2,
          serverId: 0,
          profileName: 'Alpha',
          shortName: null,
          tagFormat: null,
        },
      ];

      const servers: ServerEntry[] = [];

      const groups = groupPlayersByServer(players, servers);

      expect(groups[0]?.players[0]?.profileName).toBe('Alpha');
      expect(groups[0]?.players[1]?.profileName).toBe('Zebra');
    });
  });

  describe('colorize', () => {
    it('should wrap plain text in neutral color span', () => {
      const { colorize } = usePlayerDisplay();

      const result = colorize('PlainName');

      expect(result).toBe('<span style="color:#f3f6f8">PlainName</span>');
    });

    it('should handle color tags', () => {
      const { colorize } = usePlayerDisplay();

      const result = colorize('<#ff0000>RedText</>');

      expect(result).toContain('color:#ff0000');
      expect(result).toContain('RedText');
    });

    it('should cache results for performance', () => {
      const { colorize, getCacheStats, clearColorizeCache } = usePlayerDisplay();

      // Clear module-level cache from previous tests
      clearColorizeCache();

      const name = 'TestPlayer';
      colorize(name);
      colorize(name);

      const stats = getCacheStats();
      expect(stats.colorizeSize).toBe(1);
    });
  });

  describe('parseClanTag', () => {
    it('should parse clan tag with square brackets', () => {
      const { parseClanTag } = usePlayerDisplay();

      const profile: OnlineProfile = {
        profileId: 1,
        serverId: 1,
        profileName: 'Player',
        shortName: 'CLAN',
        tagFormat: '[C]P',
      };

      const result = parseClanTag(profile);

      expect(result.clanTag).toBe('[CLAN]');
      expect(result.playerName).toBe('Player');
    });

    it('should handle players without clan tags', () => {
      const { parseClanTag } = usePlayerDisplay();

      const profile: OnlineProfile = {
        profileId: 1,
        serverId: 1,
        profileName: 'SoloPlayer',
        shortName: null,
        tagFormat: null,
      };

      const result = parseClanTag(profile);

      expect(result.clanTag).toBe('');
      expect(result.playerName).toBe('SoloPlayer');
    });
  });
});
