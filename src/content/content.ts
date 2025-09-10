// Static content extracted from original monolith for re-use across section components
export const requirements = ['World in Conflict (Steam/Retail)', 'Windows 7/8/10/11 (64-bit)', '2GB RAM minimum', 'Broadband internet', '8GB free disk space'];
export const versions = ['Steam version', 'Retail DVD', 'Complete Edition', 'Soviet Assault (optional)'];
export const steps = [
  { n: 1, t: 'Install World in Conflict', c: 'Install from Steam or retail DVD. Lost your CD key? Join our Discord for a free replacement.' },
  { n: 2, t: 'Download WICGATE Client', c: 'Get our lightweight client (15MB) that patches your game for our servers. <br><a href="#" class="btn btn-p mt-sm" id="downloadClientBtn">Download WICGATE</a>' },
  { n: 3, t: 'Fix Common Issues', c: 'For crashes: Edit Documents/World in Conflict/Game Options.txt and set myDX10Flag 0' },
  { n: 4, t: 'Create Account & Play', c: 'Launch the game, click Multiplayer, create your account, and jump into battle!' }
];
export interface CommunityCard { cls: string; title: string; members: string; online: string; desc: string; link: string; action: string; icon: string; stat1: string; stat2: string }
export const communityCards: CommunityCard[] = [
  { cls: 'discord', title: 'Discord Server', members: '287', online: '42', desc: 'Main community hub with voice channels, matchmaking, tournaments, and tech support.', link: 'https://discord.gg/wicgate', action: 'Join Server', icon: '💬', stat1: 'Members', stat2: 'Online Now' },
  { cls: 'youtube', title: 'YouTube Channel', members: '1.2K', online: '156', desc: 'Tutorials, tournament VODs, gameplay highlights, and strategy guides.', link: 'https://youtube.com/@wicgate', action: 'Watch Videos', icon: '▶', stat1: 'Subscribers', stat2: 'Videos' },
  { cls: 'twitch', title: 'Twitch Streams', members: '3', online: '89', desc: 'Watch live gameplay, tournaments, and community events.', link: 'https://twitch.tv/directory/game/World%20in%20Conflict', action: 'View Streams', icon: '📺', stat1: 'Live Now', stat2: 'Viewers' }
];
export interface FaqItem { q: string; a: string }
export interface FaqCategory { cat: string; items: FaqItem[] }
export const faq: FaqCategory[] = [
  {
    cat: 'Getting Started',
    items: [
      {
        q: 'What exactly is WICGATE?',
        a: 'WICGATE is a community-run multiplayer server infrastructure for World in Conflict. When Ubisoft shut down the original Massgate servers, they released the source code. We used that official code to rebuild the entire backend, meaning this isn\'t an emulator or reverse-engineered solution - it\'s the real Massgate experience with all features intact: friends lists, clans, leaderboards, matchmaking, and every game mode.'
      },
      {
        q: 'Do I need to own World in Conflict?',
        a: 'Yes, you need a legitimate copy of World in Conflict. The game is available on Steam, GOG, and you can still use retail DVD versions. WICGATE only provides the multiplayer server infrastructure - we don\'t distribute the game itself. The Complete Edition (which includes Soviet Assault) is recommended but not required.'
      },
      {
        q: 'I lost my CD key. Can I still play?',
        a: 'Yes! If you own the game but lost your CD key, we can help. Join our Discord server and contact a moderator in the #cd-key-support channel. Provide proof of ownership (Steam library screenshot, photo of retail box, receipt, etc.) and we\'ll issue you a replacement key. We have a pool of unused keys specifically for helping legitimate owners get back into the game.'
      },
      {
        q: 'How do I connect to WICGATE servers?',
        a: 'Download and run the WICGATE client installer. It automatically detects your WiC installation and patches it to connect to our servers instead of the defunct Ubisoft ones. After installation, just launch World in Conflict normally, go to Multiplayer, and create your WICGATE account. The server browser will show all available games.'
      }
    ]
  },
  {
    cat: 'Technical Issues',
    items: [
      {
        q: 'The game crashes on startup. How do I fix it?',
        a: 'This is usually a DirectX compatibility issue with modern systems. Navigate to Documents/World in Conflict/ and open "Game Options.txt" in notepad. Find the line "myDX10Flag" and change its value to 0. Also: 1) Right-click wic.exe, go to Properties > Compatibility, 2) Check "Run as administrator", 3) Check "Disable fullscreen optimizations", 4) Set compatibility mode to Windows 7. This fixes 90% of crash issues.'
      },
      {
        q: 'I can\'t see any servers in the browser',
        a: 'First, make sure you\'ve installed the WICGATE client. Then: 1) Check Windows Firewall - add wic.exe as an exception, 2) Reset your server filters by clicking "Reset Filter" in the server browser, 3) Verify your internet connection isn\'t blocking port 1066, 4) Try running the game as administrator. If you still see no servers, join our Discord for live support.'
      },
      {
        q: 'The game runs poorly on my modern PC',
        a: 'WiC wasn\'t optimized for modern multi-core CPUs. Try these fixes: 1) In Game Options.txt, set "myDX10Flag 0" to use DX9 mode, 2) Disable V-Sync in game settings, 3) Set wic.exe CPU affinity to 2 cores only (Task Manager > Details > Set Affinity), 4) Update graphics drivers, 5) Disable any overlay software (Discord, Steam, etc.). The game should run smoothly even on modest modern hardware with these tweaks.'
      },
      {
        q: 'Black screen but audio still plays',
        a: 'This is a fullscreen issue with Windows 10/11. Solutions: 1) Press Alt+Enter to switch to windowed mode, then back to fullscreen, 2) In your graphics card control panel, disable GPU scaling, 3) Set your desktop resolution to match your in-game resolution before launching, 4) Try borderless windowed mode instead of exclusive fullscreen.'
      }
    ]
  },
  {
    cat: 'Gameplay & Features',
    items: [
      {
        q: 'Do all game modes work?',
        a: 'Yes! All multiplayer modes work exactly as they did on original Massgate: Domination, Assault, Tug of War, and all their variants. Ranked matches, custom games, clan matches - everything is fully functional. Even the less common modes like Dual Assault work perfectly. Soviet Assault content is also fully supported for those who own it.'
      },
      {
        q: 'Can I play with friends using different versions?',
        a: 'Yes! WICGATE ensures compatibility between all versions: Steam, GOG, retail DVD, Complete Edition, with or without Soviet Assault. Everyone just needs the WICGATE client installed. The only limitation is that Soviet Assault maps require all players to have that expansion.'
      },
      {
        q: 'Do my old stats and rank transfer?',
        a: 'No, original Massgate statistics were permanently deleted when Ubisoft shut down the servers. There\'s no way to recover them. Everyone starts fresh on WICGATE with new accounts. Think of it as a new competitive season - it gives newer players a fair chance to compete on the leaderboards alongside veterans.'
      },
      {
        q: 'How does ranking work?',
        a: 'The ranking system works identically to original Massgate. You gain or lose points based on match results, with the amount depending on your opponent\'s rank. Win against higher-ranked players for more points. Ranks range from Private to General, with subdivisions in between. Your rank is separate for each game mode.'
      }
    ]
  },
  {
    cat: 'Server & Community',
    items: [
      {
        q: 'Why WICGATE instead of other WiC servers?',
        a: 'WICGATE uses the actual Massgate source code released by Ubisoft, not reverse-engineered emulation. This means: 1) 100% feature parity with original servers, 2) No missing functionality or workarounds, 3) Proper friends lists, clans, and matchmaking, 4) Better stability and performance, 5) Active development with community input. Other servers use emulators that can\'t fully replicate the original experience.'
      },
      {
        q: 'How many players are online?',
        a: 'We typically have 30-60 players online during peak hours (evenings EU/US time), with more on weekends. While smaller than the original community, games are easy to find and the skill level is generally higher since most players are experienced. Our Discord helps coordinate games when server population is lower.'
      },
      {
        q: 'Are there tournaments?',
        a: 'Yes! We run regular tournaments: weekly 2v2 events, monthly championships, and special holiday tournaments. Prizes include Steam gift cards and custom forum/Discord roles. Tournament announcements are posted in Discord and on the website. Both competitive and casual skill brackets ensure everyone can participate.'
      },
      {
        q: 'Can I host my own server?',
        a: 'Yes! You can host dedicated servers through the game interface just like in the original. We also provide dedicated server files for 24/7 hosting. Server requirements are minimal - any modern PC or VPS can handle it. Check our Discord\'s #server-hosting channel for setup guides and the community helps with configuration.'
      }
    ]
  }
];
