// FAQ content organized by category
// Each category imports from an HTML file for better markup

import { GOG_URL, DISCORD_URL } from '@/constants';

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface FaqCategory {
  cat: string;
  slug: string;
  items: FaqItem[];
}

const currentYear = new Date().getFullYear();

// Base path for internal links (handles GitHub Pages deployment)
const basePath = import.meta.env.BASE_URL || '/';

// Helper to create WIC LIVE link (points to downloads section)
const wicLiveLink = `<a href="${basePath}downloads" class="internal-link">WIC LIVE</a>`;
const gogLink = `<a href="${GOG_URL}" target="_blank" rel="noopener noreferrer" class="external-link">GOG</a>`;
const discordLink = `<a href="${DISCORD_URL}" target="_blank" rel="noopener noreferrer" class="external-link">Discord server</a>`;

export const faqCategories: FaqCategory[] = [
  {
    cat: 'Technical Issues',
    slug: 'technical-issues',
    items: [
      {
        id: 'game-crashes-on-startup',
        q: 'The game crashes on startup. How do I fix it?',
        a: `<p>This is usually a DirectX compatibility issue with modern systems.</p>
<ol>
  <li>Navigate to <code>Documents/World in Conflict/</code> and open <code>Game Options.txt</code> in notepad</li>
  <li>Find the line <code>myDX10Flag</code> and change its value to <code>0</code></li>
  <li>Right-click <code>wic.exe</code>, go to <strong>Properties</strong> → <strong>Compatibility</strong></li>
  <li>Check <em>"Run as administrator"</em></li>
  <li>Check <em>"Disable fullscreen optimizations"</em></li>
  <li>Set compatibility mode to <em>Windows 7</em></li>
</ol>
<p>This fixes 90% of crash issues.</p>`,
      },
      {
        id: 'black-screen',
        q: 'Black screen but audio still plays',
        a: `<p>This is a fullscreen issue with Windows 10/11. Solutions:</p>
<ul>
  <li>Press <kbd>Alt</kbd>+<kbd>Enter</kbd> to switch to windowed mode, then back to fullscreen</li>
  <li>In your graphics card control panel, disable GPU scaling</li>
  <li>Set your desktop resolution to match your in-game resolution before launching</li>
  <li>Try borderless windowed mode instead of exclusive fullscreen</li>
</ul>`,
      },
      {
        id: 'vcredist-missing',
        q: 'VCRUNTIME140.dll, MSVCP140.dll or mss32.dll not found',
        a: `<p>This error means you're missing the Visual C++ Redistributable.</p>
<img src="/wic-vcredist-missing.png" alt="VCRedist error message" class="my-3 rounded border border-mg-muted max-w-md" />
<p>This is automatically fixed by ${wicLiveLink}.</p>`,
      },
      {
        id: 'faultrep-error',
        q: 'SymInitialize / FaultRep.dll Entry Point Not Found',
        a: `<p>This error occurs on systems with high core counts.</p>
<img src="/faultrep.png" alt="FaultRep.dll error message" class="my-3 rounded border border-mg-muted max-w-md" />
<p>This is automatically fixed by ${wicLiveLink}.</p>`,
      },
      {
        id: 'cant-see-servers',
        q: "I can't see any servers in the browser",
        a: `<ul>
  <li>Check Windows Firewall – add <code>wic.exe</code> as an exception</li>
  <li>Reset your server filters by clicking <strong>"Reset Filter"</strong> in the server browser</li>
  <li>Verify your internet connection isn't blocking port <code>1066</code></li>
  <li>Try running the game as administrator</li>
</ul>
<p>If you still see no servers, join our <a href="https://discord.gg/Udbv9UDBBb" target="_blank" rel="noopener noreferrer" class="external-link">Discord</a> for live support.</p>`,
      },
      {
        id: 'poor-performance',
        q: 'The game runs poorly on my modern PC',
        a: `<p>WiC wasn't optimized for modern multi-core CPUs. Try these fixes:</p>
<ul>
  <li>In <code>Game Options.txt</code>, set <code>myDX10Flag 0</code> to use DX9 mode</li>
  <li>Disable V-Sync in game settings</li>
  <li>Set <code>wic.exe</code> CPU affinity to 2 cores only (<em>Task Manager → Details → Set Affinity</em>)</li>
  <li>Update graphics drivers</li>
  <li>Disable any overlay software (Discord, Steam, etc.)</li>
</ul>
<p>The game should run smoothly even on modest modern hardware with these tweaks.</p>`,
      },
    ],
  },
  {
    cat: 'Gameplay & Features',
    slug: 'gameplay-features',
    items: [
      {
        id: 'campaign-differences',
        q: "What's the difference between Vanilla and Soviet Assault campaign?",
        a: `<p>The vanilla edition features the original US/NATO campaign following the Soviet invasion of America.</p>
<p>Soviet Assault adds additional missions interwoven into the main story, letting you experience key battles from the Russian perspective. These missions expand the narrative and provide context for the Soviet side of the conflict.</p>`,
      },
      {
        id: 'version-compatibility',
        q: 'Can I play with friends using different versions?',
        a: '<p>Yes! WICGATE ensures compatibility between all versions: Steam, GOG, retail DVD, Complete Edition, with or without Soviet Assault. Everyone just needs the WICGATE client installed. The only limitation is that Soviet Assault maps require all players to have that expansion.</p>',
      },
      {
        id: 'stats-transfer',
        q: 'Do my old stats and rank transfer?',
        a: "<p>No, original Massgate statistics were permanently deleted when Ubisoft shut down the servers. There's no way to recover them. Everyone starts fresh on WICGATE with new accounts. Think of it as a new competitive season – it gives newer players a fair chance to compete on the leaderboards alongside veterans.</p>",
      },
      {
        id: 'ranking-system',
        q: 'How does ranking work?',
        a: `<p>There are two progression systems:</p>
<ul>
  <li><strong>Player Rank:</strong> Ranges from Private to 4-Star General. You rank up by scoring points on public servers. Your rank reflects your overall experience and time played.</li>
  <li><strong>Leaderboard:</strong> A snapshot of the highest scorers over the past 2 weeks. Compete for top positions and prove you're the best in the current season.</li>
</ul>
<p>Both systems work exactly like they did on the original Massgate servers.</p>`,
      },
    ],
  },
  {
    cat: 'Getting Started',
    slug: 'getting-started',
    items: [
      {
        id: 'do-i-need-to-own-wic',
        q: 'Do I need to own World in Conflict?',
        a: `<p>Yes, you need a legitimate copy of World in Conflict. The game is available on Steam, ${gogLink}, and you can still use retail DVD versions. WICGATE only provides the multiplayer server infrastructure – we don't distribute the game itself. The Complete Edition (which includes Soviet Assault) is recommended but not required.</p>`,
      },
      {
        id: 'lost-cd-key',
        q: 'I lost my World in Conflict CD key. Can I still play?',
        a: `<p>Yes! Download and install ${wicLiveLink} – it automatically resolves CD key issues and connects you to our multiplayer servers.</p>
<p class="mt-4 text-t-secondary text-sm">Lost your World in Conflict CD key? No problem! Many players have misplaced their original World in Conflict serial key, product key, or CD key over the years. Whether you bought World in Conflict on DVD, through Steam, GOG, Uplay, or received it as a gift, losing your WiC CD key no longer prevents you from playing multiplayer. ${wicLiveLink} detects your World in Conflict installation, identifies the correct CD key format needed for your version, and configures your system automatically. No need to search for your original World in Conflict product key, serial number, or activation code.</p>`,
      },
      {
        id: 'how-to-connect',
        q: 'How do I connect to WICGATE servers?',
        a: `<p>Run the steps outlined in the <a href="${basePath}downloads" class="internal-link">Downloads</a> section and you're good to go!</p>`,
      },
      {
        id: 'campaign-only',
        q: 'I just want to play the campaign. What do I need to do?',
        a: `<p>Simply follow the same setup steps as for multiplayer – download and install ${wicLiveLink}, then enjoy the campaign! WIC LIVE ensures your game runs smoothly on modern systems regardless of whether you play single-player or multiplayer.</p>
<p class="mt-4 text-t-secondary text-sm">World in Conflict features an acclaimed single-player campaign set during a fictional Soviet invasion of the United States. The base game campaign follows American and NATO forces defending their homeland, while the Soviet Assault expansion adds interwoven missions from the Russian perspective, providing both sides of the conflict. ${wicLiveLink} handles all compatibility fixes for modern Windows systems, so whether you want to experience the World in Conflict story, replay the WiC campaign, or try World in Conflict Soviet Assault missions, you're ready to go.</p>`,
      },
    ],
  },
  {
    cat: 'About WICGATE',
    slug: 'about-wicgate',
    items: [
      {
        id: 'what-is-wicgate',
        q: 'What is WICGATE?',
        a: `<p>WICGATE is a community-driven initiative to preserve and revitalize World in Conflict multiplayer. Using the official Massgate source code released by Ubisoft, we've rebuilt the complete server infrastructure to ensure the authentic multiplayer experience lives on for current and future generations of players.</p>
<p class="mt-3">If you're searching for how to play World in Conflict online in ${currentYear}, you've found the right place. World in Conflict multiplayer is alive and well thanks to WICGATE. Whether you played WIC back in 2007-2015 and want to return, or you're discovering this classic RTS for the first time, our servers are ready for you. World in Conflict online play works seamlessly regardless of where you purchased the game – GOG, Steam, Uplay, or original retail DVD all work together on our servers.</p>`,
      },
      {
        id: 'how-did-wicgate-start',
        q: 'How did WICGATE start?',
        a: `<p>When Ubisoft shut down the original Massgate servers in 2015, they made the unprecedented decision to open-source the server code. Our community saw an opportunity to not just emulate, but fully restore the multiplayer experience using the actual production codebase that powered millions of matches.</p>
<p class="mt-3">The World in Conflict servers shutdown left many players wondering "can you still play World in Conflict multiplayer?" – WICGATE is the answer. We keep World in Conflict online multiplayer running in ${currentYear} and beyond, preserving this beloved RTS for the community.</p>`,
      },
      {
        id: 'wic-still-active',
        q: `Is World in Conflict multiplayer still active in ${currentYear}?`,
        a: `<p>Yes! World in Conflict is still active in ${currentYear}. Thanks to WICGATE, World in Conflict online multiplayer continues to thrive. Players regularly organize matches and tournaments through our ${discordLink}. Whether you want casual games or competitive ranked matches, WIC multiplayer ${currentYear} is very much alive. Download ${wicLiveLink} to join us!</p>`,
      },
      {
        id: 'crossplay',
        q: 'Can I play with friends who bought the game elsewhere?',
        a: "<p>Absolutely! WICGATE supports full crossplay between all versions of World in Conflict. It doesn't matter if you bought WIC on GOG, Steam, Uplay, or have an original retail DVD – everyone plays together on the same servers. Soviet Assault expansion is optional and only adds additional singleplayer campaign missions; all multiplayer maps including those introduced with Soviet Assault are available for vanilla edition owners too.</p>",
      },
      {
        id: 'core-values',
        q: "What are WICGATE's core values?",
        a: `<p>WICGATE is built on three core principles:</p>
<ul>
  <li><strong>Authentic Experience</strong> – Using official Massgate code ensures every feature works exactly as originally designed.</li>
  <li><strong>Community Driven</strong> – All decisions and development priorities are guided by active community feedback.</li>
  <li><strong>Fair Competition</strong> – Fresh start for all players with transparent ranking system and regular tournaments.</li>
</ul>`,
      },
      {
        id: 'who-maintains-wicgate',
        q: 'Who maintains WICGATE?',
        a: '<p>WICGATE is maintained by a dedicated team of World in Conflict veterans. We host the server infrastructure from massgate itself to a set of stable dedicated game servers. Come talk to us on <a href="https://discord.gg/Udbv9UDBBb" target="_blank" rel="noopener noreferrer" class="external-link">Discord</a>!</p>',
      },
      {
        id: 'host-own-server',
        q: 'Can I host my own server?',
        a: '<p>Yes! You can host dedicated servers through the game interface just like in the original. We also provide dedicated server files for 24/7 hosting. Server requirements are minimal – any modern PC or VPS can handle it. Check our <a href="https://discord.gg/Udbv9UDBBb" target="_blank" rel="noopener noreferrer" class="external-link">Discord\'s</a> #support channel for setup guides and the community helps with configuration.</p>',
      },
    ],
  },
];

// Re-export in the format the FAQ component expects
export const faq = faqCategories;
