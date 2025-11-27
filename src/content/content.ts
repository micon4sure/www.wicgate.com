// Static content extracted from original monolith for re-use across section components
export const versions = [
  'Steam version',
  'Retail DVD',
  'Complete Edition',
  'Soviet Assault (optional)',
];
export const steps = [
  {
    n: 1,
    t: 'Get World in Conflict',
    c: 'Purchase from GOG, Steam, or UPlay, or use your retail DVD (Windows 7/8/10/11, 64-bit, 8GB disk space). We recommend GOG for the best experience.',
  },
  {
    n: 2,
    t: 'Install & Run WIC LIVE',
    c: 'WIC LIVE updates your game for WICGATE servers, installs community maps, and adds quality of life fixes for modern systems. After installation, click the "INSTALL UPDATE" button.',
  },
  {
    n: 3,
    t: 'Create Account & Play',
    c: 'Launch the game and create an account. From the main menu, click <span class="text-bold">Multiplayer</span> -> <span class="text-bold">Online</span> and then <span class="text-bold">Create Account</span> in the bottom center of the screen. Then, join us in multiplayer!',
  },
];
export interface CommunityCard {
  cls: string;
  title: string;
  members: string;
  online: string;
  desc: string;
  link: string;
  action: string;
  icon: string;
  stat1: string;
  stat2: string;
}
export const communityCards: CommunityCard[] = [
  {
    cls: 'discord',
    title: 'Discord Server',
    members: '287',
    online: '42',
    desc: 'Main community hub with voice channels, matchmaking, tournaments, and tech support.',
    link: 'https://discord.gg/Udbv9UDBBb',
    action: 'Join Server',
    icon: 'fa-brands fa-discord',
    stat1: 'Members',
    stat2: 'Online Now',
  },
  {
    cls: 'youtube',
    title: 'YouTube Channel',
    members: '1.2K',
    online: '156',
    desc: 'Tutorials, tournament VODs, gameplay highlights, and strategy guides.',
    link: 'https://youtube.com/@wicgate',
    action: 'Watch Videos',
    icon: 'fa-brands fa-youtube',
    stat1: 'Subscribers',
    stat2: 'Videos',
  },
  {
    cls: 'twitch',
    title: 'Twitch Streams',
    members: '3',
    online: '89',
    desc: 'Watch live gameplay, tournaments, and community events.',
    link: 'https://twitch.tv/directory/game/World%20in%20Conflict',
    action: 'View Streams',
    icon: 'fa-brands fa-twitch',
    stat1: 'Live Now',
    stat2: 'Viewers',
  },
];
export interface FaqItem {
  id: string;
  q: string;
  a: string;
}
export interface FaqCategory {
  cat: string;
  items: FaqItem[];
}
export const faq: FaqCategory[] = [
  {
    cat: 'About WICGATE',
    items: [
      {
        id: 'what-is-wicgate',
        q: 'What is WICGATE?',
        a: "WICGATE is a community-driven initiative to preserve and revitalize World in Conflict multiplayer. Using the official Massgate source code released by Ubisoft, we've rebuilt the complete server infrastructure to ensure the authentic multiplayer experience lives on for current and future generations of players.",
      },
      {
        id: 'how-did-wicgate-start',
        q: 'How did WICGATE start?',
        a: 'When Ubisoft shut down the original Massgate servers in 2015, they made the unprecedented decision to open-source the server code. Our community saw an opportunity to not just emulate, but fully restore the multiplayer experience using the actual production codebase that powered millions of matches.',
      },
      {
        id: 'core-values',
        q: "What are WICGATE's core values?",
        a: "WICGATE is built on four core principles: Authentic Experience - Using official Massgate code ensures every feature works exactly as originally designed. Community Driven - All decisions and development priorities are guided by active community feedback. Fair Competition - Fresh start for all players with transparent ranking system and regular tournaments. Open Source Spirit - Following Ubisoft's example of open-sourcing Massgate, we believe in transparent development.",
      },
      {
        id: 'who-maintains-wicgate',
        q: 'Who maintains WICGATE?',
        a: 'WICGATE is maintained by a dedicated team of World in Conflict veterans. We host the server infrastructure from massgate itself to a set of stable dedicated game servers. Come talk to us on <a href="https://discord.gg/Udbv9UDBBb" target="_blank" rel="noopener noreferrer" class="inline-link">Discord</a>!',
      },
      {
        id: 'host-own-server',
        q: 'Can I host my own server?',
        a: `Yes! You can host dedicated servers through the game interface just like in the original. We also provide dedicated server files for 24/7 hosting. Server requirements are minimal - any modern PC or VPS can handle it. Check our <a href="https://discord.gg/Udbv9UDBBb" target="_blank" rel="noopener noreferrer" class="inline-link">Discord's</a> #support channel for setup guides and the community helps with configuration.`,
      },
    ],
  },
  {
    cat: 'Getting Started',
    items: [
      {
        id: 'do-i-need-to-own-wic',
        q: 'Do I need to own World in Conflict?',
        a: 'Yes, you need a legitimate copy of World in Conflict. The game is available on Steam, <a href="https://www.gog.com/game/world_in_conflict_complete_edition" target="_blank" rel="noopener noreferrer" class="inline-link">GOG</a>, and you can still use retail DVD versions. WICGATE only provides the multiplayer server infrastructure - we don\'t distribute the game itself. The Complete Edition (which includes Soviet Assault) is recommended but not required.',
      },
      {
        id: 'lost-cd-key',
        q: 'I lost my CD key. Can I still play?',
        a: 'Yes! Just run WIC LIVE, it will sort it out any CD key related issues!',
      },
      {
        id: 'how-to-connect',
        q: 'How do I connect to WICGATE servers?',
        a: 'Run the steps outlined in the <a href="#downloads" class="internal-link">QUICK START</a> section and you\'re good to go!',
      },
    ],
  },
  {
    cat: 'Technical Issues',
    items: [
      {
        id: 'game-crashes-on-startup',
        q: 'The game crashes on startup. How do I fix it?',
        a: 'This is usually a DirectX compatibility issue with modern systems. Navigate to Documents/World in Conflict/ and open "Game Options.txt" in notepad. Find the line "myDX10Flag" and change its value to 0. Also: 1) Right-click wic.exe, go to Properties > Compatibility, 2) Check "Run as administrator", 3) Check "Disable fullscreen optimizations", 4) Set compatibility mode to Windows 7. This fixes 90% of crash issues.',
      },
      {
        id: 'cant-see-servers',
        q: "I can't see any servers in the browser",
        a: `<ol class="list-decimal list-inside mt-2 space-y-1">
  <li>Check Windows Firewall - add wic.exe as an exception</li>
  <li>Reset your server filters by clicking "Reset Filter" in the server browser</li>
  <li>Verify your internet connection isn't blocking port 1066</li>
  <li>Try running the game as administrator</li>
</ol>
If you still see no servers, join our <a href="https://discord.gg/Udbv9UDBBb" target="_blank" rel="noopener noreferrer" class="inline-link">Discord</a> for live support.`,
      },
      {
        id: 'poor-performance',
        q: 'The game runs poorly on my modern PC',
        a: `WiC wasn't optimized for modern multi-core CPUs. Try these fixes:
<ol class="list-decimal list-inside mt-2 space-y-1">
  <li>In Game Options.txt, set "myDX10Flag 0" to use DX9 mode</li>
  <li>Disable V-Sync in game settings</li>
  <li>Set wic.exe CPU affinity to 2 cores only (Task Manager > Details > Set Affinity)</li>
  <li>Update graphics drivers</li>
  <li>Disable any overlay software (Discord, Steam, etc.)</li>
</ol>
The game should run smoothly even on modest modern hardware with these tweaks.`,
      },
      {
        id: 'black-screen',
        q: 'Black screen but audio still plays',
        a: `This is a fullscreen issue with Windows 10/11. Solutions:
<ol class="list-decimal list-inside mt-2 space-y-1">
  <li>Press Alt+Enter to switch to windowed mode, then back to fullscreen</li>
  <li>In your graphics card control panel, disable GPU scaling</li>
  <li>Set your desktop resolution to match your in-game resolution before launching</li>
  <li>Try borderless windowed mode instead of exclusive fullscreen</li>
</ol>`,
      },
    ],
  },
  {
    cat: 'Gameplay & Features',
    items: [
      {
        id: 'version-compatibility',
        q: 'Can I play with friends using different versions?',
        a: 'Yes! WICGATE ensures compatibility between all versions: Steam, GOG, retail DVD, Complete Edition, with or without Soviet Assault. Everyone just needs the WICGATE client installed. The only limitation is that Soviet Assault maps require all players to have that expansion.',
      },
      {
        id: 'stats-transfer',
        q: 'Do my old stats and rank transfer?',
        a: "No, original Massgate statistics were permanently deleted when Ubisoft shut down the servers. There's no way to recover them. Everyone starts fresh on WICGATE with new accounts. Think of it as a new competitive season - it gives newer players a fair chance to compete on the leaderboards alongside veterans.",
      },
      {
        id: 'ranking-system',
        q: 'How does ranking work?',
        a: "The ranking system works identically to original Massgate. You gain or lose points based on match results, with the amount depending on your opponent's rank. Win against higher-ranked players for more points. Ranks range from Private to General, with subdivisions in between. Your rank is separate for each game mode.",
      },
    ],
  },
];

// Advanced Setup Options
export interface DedicatedServerStep {
  n: number;
  t: string;
  c: string;
}

export interface NetworkPort {
  port: string;
  protocol: string;
  description?: string;
}

export const dedicatedServerSteps: DedicatedServerStep[] = [
  {
    n: 1,
    t: 'Download Server Files',
    c: 'Download the WICGATE Dedicated Server package. Choose <a href="#" target="_blank">Match Mode Server</a> for casual servers or <a href="#" target="_blank">Ranked Edition</a> for public ranked servers (requires CD key from <a href="https://discord.gg/Udbv9UDBBb" target="_blank">Discord</a>).',
  },
  {
    n: 2,
    t: 'Extract Server Package',
    c: 'Extract <span class="text-bold">MatchMode.zip</span> or <span class="text-bold">Ranked.zip</span> to your chosen directory.',
  },
  {
    n: 3,
    t: 'Install Hosts File',
    c: 'Copy the <a href="#" target="_blank">hosts file</a> to <span class="text-bold">C:\\Windows\\System32\\drivers\\etc</span> (requires administrator rights).',
  },
  {
    n: 4,
    t: 'Configure Server',
    c: 'Open <span class="text-bold">wic_ds.ini</span>, adjust settings as needed, and save the file.',
  },
  {
    n: 5,
    t: 'Launch Server',
    c: 'Start the server by running <span class="text-bold">wic_ds_wrapper.exe</span>.',
  },
];

export const networkPorts: NetworkPort[] = [
  { port: '3004', protocol: 'TCP' },
  { port: '48000-49000', protocol: 'TCP & UDP' },
  {
    port: '52999',
    protocol: 'TCP & UDP',
    description: 'VoIP; if hosting multiple servers, open adjacent ports (52998, 52997, etc.)',
  },
  { port: '22993', protocol: 'UDP' },
  { port: '22996', protocol: 'UDP' },
];

export const manualInstallSteps: DedicatedServerStep[] = [
  {
    n: 1,
    t: 'Download Components',
    c: 'Download the <a href="#" target="_blank">Standalone Multiplayer Update</a> and <a href="#" target="_blank">hosts file</a> required for manual installation.',
  },
  {
    n: 2,
    t: 'Install Update',
    c: 'Run the Standalone Multiplayer Update installer and follow the installation process.',
  },
  {
    n: 3,
    t: 'Install Hosts File',
    c: 'Copy the downloaded <span class="text-bold">hosts</span> file to <span class="text-bold">C:\\Windows\\System32\\drivers\\etc</span> (requires administrator rights).',
  },
  {
    n: 4,
    t: 'Optional: Community Maps',
    c: 'Download additional <a href="#" target="_blank">community maps</a> created by the community to expand your gameplay experience.',
  },
];

export const manualInstallWarning = {
  title: 'Important Notice',
  message:
    'This installation method is unsupported and provided "as-is". For a streamlined experience, we recommend using the WIC LIVE installer above.',
};

// SEO Metadata for sections (used for SSG meta tags)
export interface SectionMeta {
  id: string;
  title: string;
  description: string;
  keywords: string;
}

export const sectionMeta: Record<string, SectionMeta> = {
  home: {
    id: 'home',
    title: 'WICGATE - World in Conflict Multiplayer Revival',
    description:
      'Play World in Conflict online with restored multiplayer servers. Join our active community in epic Cold War battles using the real Massgate code.',
    keywords:
      'world in conflict, wic multiplayer, massgate, wic online, world in conflict servers, wic revival',
  },
  'getting-started': {
    id: 'getting-started',
    title: 'Getting Started - Download & Install WiC Multiplayer',
    description:
      'Download and install World in Conflict multiplayer in minutes. Step-by-step guide to join WICGATE community servers.',
    keywords:
      'world in conflict download, wic install, wic multiplayer setup, wic live, how to play world in conflict online',
  },
  statistics: {
    id: 'statistics',
    title: 'Player Statistics & Leaderboards - WiC Rankings',
    description:
      'View World in Conflict player rankings, competitive leaderboards, and match statistics across all game modes.',
    keywords:
      'wic leaderboards, world in conflict rankings, wic stats, world in conflict player stats',
  },
  community: {
    id: 'community',
    title: 'Community & Events - Discord, Tournaments & Videos',
    description:
      'Join the World in Conflict community on Discord, watch tournaments on YouTube and Twitch, and participate in events.',
    keywords: 'wic discord, world in conflict community, wic tournaments, wic youtube, wic twitch',
  },
  faq: {
    id: 'faq',
    title: 'FAQ - Help, About & Troubleshooting',
    description:
      'Frequently asked questions about WICGATE, installing, troubleshooting, and playing World in Conflict. Learn about the project and get help.',
    keywords:
      'wic help, about wicgate, massgate, world in conflict troubleshooting, wic faq, wic crashes, world in conflict support',
  },
};
