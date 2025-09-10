// Static content extracted from original monolith for re-use across section components
export const requirements = ['World in Conflict (Steam/Retail)','Windows 7/8/10/11 (64-bit)','2GB RAM minimum','Broadband internet','8GB free disk space'];
export const versions = ['Steam version','Retail DVD','Complete Edition','Soviet Assault (optional)'];
export const steps = [
  {n:1,t:'Install World in Conflict',c:'Install from Steam or retail DVD. Lost your CD key? Join our Discord for a free replacement.'},
  {n:2,t:'Download WICGATE Client',c:'Get our lightweight client (15MB) that patches your game for our servers.'},
  {n:3,t:'Fix Common Issues',c:'For crashes: Edit Documents/World in Conflict/Game Options.txt and set myDX10Flag 0'},
  {n:4,t:'Create Account & Play',c:'Launch the game, click Multiplayer, create your account, and jump into battle!'}
];
export interface CommunityCard {cls:string;title:string;members:string;online:string;desc:string;link:string;action:string;icon:string;stat1:string;stat2:string}
export const communityCards: CommunityCard[] = [
  {cls:'discord',title:'Discord Server',members:'287',online:'42',desc:'Main community hub with voice channels, matchmaking, tournaments, and tech support.',link:'https://discord.gg/wicgate',action:'Join Server',icon:'💬',stat1:'Members',stat2:'Online Now'},
  {cls:'youtube',title:'YouTube Channel',members:'1.2K',online:'156',desc:'Tutorials, tournament VODs, gameplay highlights, and strategy guides.',link:'https://youtube.com/@wicgate',action:'Watch Videos',icon:'▶',stat1:'Subscribers',stat2:'Videos'},
  {cls:'twitch',title:'Twitch Streams',members:'3',online:'89',desc:'Watch live gameplay, tournaments, and community events.',link:'https://twitch.tv/directory/game/World%20in%20Conflict',action:'View Streams',icon:'📺',stat1:'Live Now',stat2:'Viewers'}
];
export const faq = [
  {cat:'Getting Started',items:[{q:'What exactly is WICGATE?',a:'WICGATE is a community-run multiplayer server infrastructure for World in Conflict.'}]}
];
