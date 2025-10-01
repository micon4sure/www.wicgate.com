// Static content extracted from original monolith for re-use across section components
export const requirements = [
  'World in Conflict (Steam/Retail)',
  'Windows 7/8/10/11 (64-bit)',
  '2GB RAM minimum',
  'Broadband internet',
  '8GB free disk space',
];
export const versions = [
  'Steam version',
  'Retail DVD',
  'Complete Edition',
  'Soviet Assault (optional)',
];
export const steps = [
  {
    n: 1,
    t: 'Install World in Conflict',
    c: 'Install from GOG, Steam, UPlay or retail DVD. If you do not already own a copy of World in Conflict, we recommend buying one from GOG.',
  },
  {
    n: 2,
    t: 'Download WIC LIVE',
    c: 'WIC LIVE updates your game for our servers, allows you to install community maps and installs quality of life fixes that allow you to play the game on modern systems. <br><a href="https://github.com/micon4sure/WICLIVE/releases/latest/download/wiclive_x64-setup.exe" class="btn btn-download mt-md" id="downloadClientBtn">Download WIC LIVE</a>',
  },
  {
    n: 3,
    t: 'Install & Run WIC LIVE',
    c: 'After installation process has finished, find and click the "INSTALL UPDATE" button in WIC LIVE.',
  },
  {
    n: 4,
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
    link: 'https://discord.gg/WnxwfMTyBe',
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
  q: string;
  a: string;
}
export interface FaqCategory {
  cat: string;
  items: FaqItem[];
}

// About section content
export interface TeamMember {
  name: string;
  role: string;
  description: string;
  avatar?: string;
}

export const aboutProject = {
  mission:
    "WICGATE is a community-driven initiative to preserve and revitalize World in Conflict multiplayer. Using the official Massgate source code released by Ubisoft, we've rebuilt the complete server infrastructure to ensure the authentic multiplayer experience lives on for current and future generations of players.",

  story:
    'When Ubisoft shut down the original Massgate servers in 2015, they made the unprecedented decision to open-source the server code. Our community saw an opportunity to not just emulate, but fully restore the multiplayer experience using the actual production codebase that powered millions of matches.',

  approach:
    "Unlike other revival projects that rely on reverse-engineering or emulation, WICGATE uses Ubisoft's official Massgate source code. This means 100% feature parity: complete friends lists, clan systems, matchmaking, leaderboards, and every game mode functions exactly as intended.",
};

export const teamMembers: TeamMember[] = [
  {
    name: 'micon4sure',
    role: 'Lead Developer & Infrastructure',
    description:
      'Project founder and lead developer responsible for server architecture, game client integration, and community infrastructure.',
  },
  {
    name: 'Community Team',
    role: 'Moderation & Events',
    description:
      'Dedicated volunteers who manage Discord, organize tournaments, provide player support, and maintain the competitive community.',
  },
  {
    name: 'Contributors',
    role: 'Development & Testing',
    description:
      'Community developers contributing bug fixes, feature improvements, and extensive testing to ensure server stability.',
  },
];

export const projectValues = [
  {
    title: 'Authentic Experience',
    description:
      'Using official Massgate code ensures every feature works exactly as originally designed.',
    icon: 'fa-solid fa-shield-check',
  },
  {
    title: 'Community Driven',
    description:
      'All decisions and development priorities are guided by active community feedback.',
    icon: 'fa-solid fa-users',
  },
  {
    title: 'Fair Competition',
    description:
      'Fresh start for all players with transparent ranking system and regular tournaments.',
    icon: 'fa-solid fa-trophy',
  },
  {
    title: 'Open Source Spirit',
    description:
      "Following Ubisoft's example of open-sourcing Massgate, we believe in transparent development.",
    icon: 'fa-solid fa-code',
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
    c: 'Download the WICGATE Dedicated Server package. Choose <a href="#" target="_blank">Match Mode Server</a> for casual servers or <a href="#" target="_blank">Ranked Edition</a> for public ranked servers (requires CD key from <a href="https://discord.gg/WnxwfMTyBe" target="_blank">Discord</a>).',
  },
  {
    n: 2,
    t: 'Extract Server Package',
    c: 'Extract <span class="text-bold">MatchMode.zip</span> to your chosen directory.',
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

const dedicatedServerStepsHtml = dedicatedServerSteps
  .map((step) => `<li><strong>${step.t}</strong><p>${step.c}</p></li>`)
  .join('');

const networkPortsHtml = networkPorts
  .map((port) => {
    const description = port.description
      ? `<span class="port-desc">${port.description}</span>`
      : '';
    return `<li><span class="port-number">${port.port}</span><span class="port-protocol">${port.protocol}</span>${description}`;
  })
  .join('');

const manualInstallStepsHtml = manualInstallSteps
  .map((step) => `<li><strong>${step.t}</strong><p>${step.c}</p></li>`)
  .join('');

export const dedicatedServerFaqAnswer = `
  <p>Yes. Hosting a dedicated server gives you full control over map rotation, gameplay settings, and availability. Follow these steps:</p>
  <ol class="faq-steps">${dedicatedServerStepsHtml}</ol>
  <p>Make sure the following ports are forwarded to your host machine:</p>
  <ul class="faq-ports">${networkPortsHtml}</ul>
  <p class="text-muted">Need help sourcing a CD key for ranked servers? Hop into the <strong>#server-hosting</strong> channel on Discord.</p>
`;

export const manualInstallFaqAnswer = `
  <p>If WIC LIVE is not an option for your setup, you can complete the patch manually. It takes longer and should only be used when the installer is blocked by group policy or unsupported hardware.</p>
  <div class="warning-box">
    <div class="warning-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
    <div class="warning-content">
      <h4>${manualInstallWarning.title}</h4>
      <p>${manualInstallWarning.message}</p>
    </div>
  </div>
  <ol class="faq-steps">${manualInstallStepsHtml}</ol>
`;

export const faq: FaqCategory[] = [
  {
    cat: 'Getting Started',
    items: [
      {
        q: 'Do I need to own World in Conflict?',
        a: "Yes, you need a legitimate copy of World in Conflict. The game is available on Steam, GOG, and you can still use retail DVD versions. WICGATE only provides the multiplayer server infrastructure - we don't distribute the game itself. The Complete Edition (which includes Soviet Assault) is recommended but not required.",
      },
      {
        q: 'I lost my CD key. Can I still play?',
        a: "Yes! If you own the game but lost your CD key, we can help. Join our Discord server and contact a moderator in the #cd-key-support channel. Provide proof of ownership (Steam library screenshot, photo of retail box, receipt, etc.) and we'll issue you a replacement key. We have a pool of unused keys specifically for helping legitimate owners get back into the game.",
      },
      {
        q: 'How do I connect to WICGATE servers?',
        a: 'Download and run the WICGATE client installer. It automatically detects your WiC installation and patches it to connect to our servers instead of the defunct Ubisoft ones. After installation, just launch World in Conflict normally, go to Multiplayer, and create your WICGATE account. The server browser will show all available games.',
      },
    ],
  },
  {
    cat: 'Technical Issues',
    items: [
      {
        q: 'The game crashes on startup. How do I fix it?',
        a: 'This is usually a DirectX compatibility issue with modern systems. Navigate to Documents/World in Conflict/ and open "Game Options.txt" in notepad. Find the line "myDX10Flag" and change its value to 0. Also: 1) Right-click wic.exe, go to Properties > Compatibility, 2) Check "Run as administrator", 3) Check "Disable fullscreen optimizations", 4) Set compatibility mode to Windows 7. This fixes 90% of crash issues.',
      },
      {
        q: "I can't see any servers in the browser",
        a: 'First, make sure you\'ve installed the WICGATE client. Then: 1) Check Windows Firewall - add wic.exe as an exception, 2) Reset your server filters by clicking "Reset Filter" in the server browser, 3) Verify your internet connection isn\'t blocking port 1066, 4) Try running the game as administrator. If you still see no servers, join our Discord for live support.',
      },
      {
        q: 'The game runs poorly on my modern PC',
        a: 'WiC wasn\'t optimized for modern multi-core CPUs. Try these fixes: 1) In Game Options.txt, set "myDX10Flag 0" to use DX9 mode, 2) Disable V-Sync in game settings, 3) Set wic.exe CPU affinity to 2 cores only (Task Manager > Details > Set Affinity), 4) Update graphics drivers, 5) Disable any overlay software (Discord, Steam, etc.). The game should run smoothly even on modest modern hardware with these tweaks.',
      },
      {
        q: 'Black screen but audio still plays',
        a: 'This is a fullscreen issue with Windows 10/11. Solutions: 1) Press Alt+Enter to switch to windowed mode, then back to fullscreen, 2) In your graphics card control panel, disable GPU scaling, 3) Set your desktop resolution to match your in-game resolution before launching, 4) Try borderless windowed mode instead of exclusive fullscreen.',
      },
    ],
  },
  {
    cat: 'Gameplay & Features',
    items: [
      {
        q: 'Do all game modes work?',
        a: 'Yes! All multiplayer modes work exactly as they did on original Massgate: Domination, Assault, Tug of War, and all their variants. Ranked matches, custom games, clan matches - everything is fully functional. Even the less common modes like Dual Assault work perfectly. Soviet Assault content is also fully supported for those who own it.',
      },
      {
        q: 'Can I play with friends using different versions?',
        a: 'Yes! WICGATE ensures compatibility between all versions: Steam, GOG, retail DVD, Complete Edition, with or without Soviet Assault. Everyone just needs the WICGATE client installed. The only limitation is that Soviet Assault maps require all players to have that expansion.',
      },
      {
        q: 'Do my old stats and rank transfer?',
        a: "No, original Massgate statistics were permanently deleted when Ubisoft shut down the servers. There's no way to recover them. Everyone starts fresh on WICGATE with new accounts. Think of it as a new competitive season - it gives newer players a fair chance to compete on the leaderboards alongside veterans.",
      },
      {
        q: 'How does ranking work?',
        a: "The ranking system works identically to original Massgate. You gain or lose points based on match results, with the amount depending on your opponent's rank. Win against higher-ranked players for more points. Ranks range from Private to General, with subdivisions in between. Your rank is separate for each game mode.",
      },
    ],
  },
  {
    cat: 'Advanced Setup',
    items: [
      {
        q: 'How do I host a dedicated server?',
        a: dedicatedServerFaqAnswer,
      },
      {
        q: 'Can I install WICGATE manually without WIC LIVE?',
        a: manualInstallFaqAnswer,
      },
    ],
  },
  {
    cat: 'Server & Community',
    items: [
      {
        q: 'What are the technical advantages of WICGATE?',
        a: 'WICGATE uses the official Massgate source code released by Ubisoft, ensuring: 1) 100% feature parity with original servers, 2) Proper friends lists, clans, and matchmaking, 3) Better stability and performance than emulated servers, 4) No missing functionality or workarounds. For more about our project and mission, see the About section.',
      },
      {
        q: 'How many players are online?',
        a: 'We typically have 30-60 players online during peak hours (evenings EU/US time), with more on weekends. While smaller than the original community, games are easy to find and the skill level is generally higher since most players are experienced. Our Discord helps coordinate games when server population is lower.',
      },
      {
        q: 'Are there tournaments?',
        a: 'Yes! We run regular tournaments: weekly 2v2 events, monthly championships, and special holiday tournaments. Prizes include Steam gift cards and custom forum/Discord roles. Tournament announcements are posted in Discord and on the website. Both competitive and casual skill brackets ensure everyone can participate.',
      },
      {
        q: 'Can I host my own server?',
        a: "Yes! You can host dedicated servers through the game interface just like in the original. We also provide dedicated server files for 24/7 hosting. Server requirements are minimal - any modern PC or VPS can handle it. Check the Advanced Setup section below for the full walkthrough or hop into Discord's #server-hosting channel for live configuration help.",
      },
    ],
  },
];

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
  about: {
    id: 'about',
    title: 'About WICGATE - Official Massgate Server Revival',
    description:
      'Learn about the community-driven initiative to preserve World in Conflict multiplayer using official Massgate source code.',
    keywords: 'massgate, wic revival, world in conflict servers, massgate source code',
  },
  faq: {
    id: 'faq',
    title: 'FAQ - Help & Troubleshooting',
    description:
      'Frequently asked questions about installing, troubleshooting, and playing World in Conflict on WICGATE servers.',
    keywords:
      'wic help, world in conflict troubleshooting, wic faq, wic crashes, world in conflict support',
  },
};
