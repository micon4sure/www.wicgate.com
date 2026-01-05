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
// FAQ content moved to src/content/faq/index.ts
export { faq, faqCategories } from './faq';
export type { FaqItem, FaqCategory } from './faq';

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
    c: 'Download the WICGATE Dedicated Server package. Choose <a href="#" target="_blank" class="download-link" title="Download Match Mode Server">Match Mode Server</a> for casual servers or <a href="#" target="_blank" class="download-link" title="Download Ranked Edition">Ranked Edition</a> for public ranked servers (requires CD key from <a href="https://discord.gg/Udbv9UDBBb" target="_blank" class="external-link" title="Join Discord for CD key (opens in new tab)">Discord</a>).',
  },
  {
    n: 2,
    t: 'Extract Server Package',
    c: 'Extract <span class="text-bold">MatchMode.zip</span> or <span class="text-bold">Ranked.zip</span> to your chosen directory.',
  },
  {
    n: 3,
    t: 'Install Hosts File',
    c: 'Copy the <a href="#" target="_blank" class="download-link" title="Download hosts file">hosts file</a> to <span class="text-bold">C:\\Windows\\System32\\drivers\\etc</span> (requires administrator rights).',
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
    c: 'Download the <a href="#" target="_blank" class="download-link" title="Download Standalone Multiplayer Update">Standalone Multiplayer Update</a> and <a href="#" target="_blank" class="download-link" title="Download hosts file">hosts file</a> required for manual installation.',
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
    c: 'Download additional <a href="#" target="_blank" class="download-link" title="Download community maps">community maps</a> created by the community to expand your gameplay experience.',
  },
];

export const manualInstallWarning = {
  title: 'Important Notice',
  message:
    'This installation method is unsupported and provided "as-is". For a streamlined experience, we recommend using the <a href="/downloads#quick-install" class="internal-link">WIC LIVE</a> installer.',
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
