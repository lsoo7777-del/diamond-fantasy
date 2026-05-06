// Mock / seed data — all real MLB teams, illustrative fantasy stats.
// When ESPN credentials are connected these are replaced by live API data.

export const TEAMS = {
  NYY: { name: "Yankees",   city: "New York",     primary: "#0c2340", secondary: "#c4ced4", abbr: "NYY" },
  LAD: { name: "Dodgers",   city: "Los Angeles",  primary: "#005a9c", secondary: "#ef3e42", abbr: "LAD" },
  ATL: { name: "Braves",    city: "Atlanta",      primary: "#13274f", secondary: "#ce1141", abbr: "ATL" },
  HOU: { name: "Astros",    city: "Houston",      primary: "#002d62", secondary: "#eb6e1f", abbr: "HOU" },
  PHI: { name: "Phillies",  city: "Philadelphia", primary: "#e81828", secondary: "#002d72", abbr: "PHI" },
  SDP: { name: "Padres",    city: "San Diego",    primary: "#2f241d", secondary: "#ffc425", abbr: "SDP" },
  BAL: { name: "Orioles",   city: "Baltimore",    primary: "#df4601", secondary: "#000000", abbr: "BAL" },
  TOR: { name: "Blue Jays", city: "Toronto",      primary: "#134a8e", secondary: "#1d2d5c", abbr: "TOR" },
  BOS: { name: "Red Sox",   city: "Boston",       primary: "#bd3039", secondary: "#0c2340", abbr: "BOS" },
  CHC: { name: "Cubs",      city: "Chicago",      primary: "#0e3386", secondary: "#cc3433", abbr: "CHC" },
  MIL: { name: "Brewers",   city: "Milwaukee",    primary: "#12284b", secondary: "#ffc52f", abbr: "MIL" },
  TEX: { name: "Rangers",   city: "Texas",        primary: "#003278", secondary: "#c0111f", abbr: "TEX" },
  ARI: { name: "D-backs",   city: "Arizona",      primary: "#a71930", secondary: "#e3d4ad", abbr: "ARI" },
  SEA: { name: "Mariners",  city: "Seattle",      primary: "#0c2c56", secondary: "#005c5c", abbr: "SEA" },
  DET: { name: "Tigers",    city: "Detroit",      primary: "#0c2340", secondary: "#fa4616", abbr: "DET" },
  NYM: { name: "Mets",      city: "New York",     primary: "#002d72", secondary: "#ff5910", abbr: "NYM" },
  CLE: { name: "Guardians", city: "Cleveland",    primary: "#00385d", secondary: "#e31937", abbr: "CLE" },
  SFG: { name: "Giants",    city: "San Francisco",primary: "#fd5a1e", secondary: "#27251f", abbr: "SFG" },
  OAK: { name: "Athletics", city: "Oakland",      primary: "#003831", secondary: "#efb21e", abbr: "OAK" },
  CIN: { name: "Reds",      city: "Cincinnati",   primary: "#c6011f", secondary: "#000000", abbr: "CIN" },
  KCR: { name: "Royals",    city: "Kansas City",  primary: "#004687", secondary: "#c09a5b", abbr: "KCR" },
};

export const LINEUP_SLOTS = ["C","1B","2B","3B","SS","OF","OF","OF","UTIL","SP","SP","SP","RP","RP","P"];

export const PLAYERS = [
  // Hitters
  { id:"judge",     name:"Aaron Judge",           pos:"OF",    team:"NYY", bats:"R", proj:18.4, today:12.6, week:64.2,  season:412.7, status:"active", trend:[4,8,2,12,9,11,12.6],   own:99.7, news:"2-HR night vs BOS",             img:"AJ" },
  { id:"ohtani",    name:"Shohei Ohtani",          pos:"DH/SP", team:"LAD", bats:"L", proj:22.1, today:18.9, week:71.4,  season:488.1, status:"active", trend:[10,14,6,11,18,7,18.9], own:100,  news:"Slated to throw Sunday",          img:"SO" },
  { id:"betts",     name:"Mookie Betts",           pos:"SS",    team:"LAD", bats:"R", proj:14.8, today:9.2,  week:41.0,  season:318.4, status:"active", trend:[6,9,4,11,7,8,9.2],     own:99.5, news:"—",                              img:"MB" },
  { id:"acuna",     name:"Ronald Acuña Jr.",       pos:"OF",    team:"ATL", bats:"R", proj:16.7, today:0,    week:22.1,  season:188.0, status:"il",     trend:[0,0,0,0,8,7,0],        own:96.2, news:"IL-10: knee, re-eval Friday",     img:"RA" },
  { id:"altuve",    name:"Jose Altuve",            pos:"2B",    team:"HOU", bats:"R", proj:11.6, today:7.4,  week:38.2,  season:264.5, status:"active", trend:[4,6,3,9,7,5,7.4],      own:94.4, news:"—",                              img:"JA" },
  { id:"harper",    name:"Bryce Harper",           pos:"1B",    team:"PHI", bats:"L", proj:15.9, today:11.0, week:52.7,  season:357.1, status:"active", trend:[6,5,8,10,9,12,11.0],   own:99.1, news:"Hot streak: 9-for-22 last 5",     img:"BH" },
  { id:"tatis",     name:"Fernando Tatis Jr.",     pos:"OF",    team:"SDP", bats:"R", proj:14.2, today:6.8,  week:33.4,  season:281.6, status:"active", trend:[3,7,4,8,6,5,6.8],      own:98.9, news:"—",                              img:"FT" },
  { id:"henderson", name:"Gunnar Henderson",       pos:"SS",    team:"BAL", bats:"L", proj:14.0, today:10.4, week:44.7,  season:309.5, status:"active", trend:[5,8,6,9,7,11,10.4],    own:97.3, news:"—",                              img:"GH" },
  { id:"guerrero",  name:"Vladimir Guerrero Jr.",  pos:"1B",    team:"TOR", bats:"R", proj:13.5, today:8.1,  week:36.9,  season:272.8, status:"active", trend:[5,7,4,8,6,9,8.1],      own:96.1, news:"—",                              img:"VG" },
  { id:"devers",    name:"Rafael Devers",          pos:"3B",    team:"BOS", bats:"L", proj:13.9, today:4.0,  week:28.3,  season:248.3, status:"dtd",    trend:[6,3,7,4,6,2,4.0],      own:95.0, news:"DTD: shoulder soreness",          img:"RD" },
  { id:"swanson",   name:"Dansby Swanson",         pos:"SS",    team:"CHC", bats:"R", proj:9.8,  today:5.2,  week:24.4,  season:188.7, status:"active", trend:[4,3,5,4,6,4,5.2],      own:71.4, news:"—",                              img:"DS" },
  { id:"yelich",    name:"Christian Yelich",       pos:"OF",    team:"MIL", bats:"L", proj:10.4, today:7.7,  week:31.0,  season:211.3, status:"active", trend:[4,5,6,4,6,5,7.7],      own:78.0, news:"—",                              img:"CY" },
  // Pitchers
  { id:"skubal",    name:"Tarik Skubal",           pos:"SP",    team:"DET", bats:"L", proj:24.0, today:0,    week:21.4,  season:271.6, status:"active", trend:[0,21,0,0,0,18,0],       own:100,  news:"Probable Saturday vs SEA",        img:"TS" },
  { id:"wheeler",   name:"Zack Wheeler",           pos:"SP",    team:"PHI", bats:"R", proj:21.1, today:26.4, week:26.4,  season:244.0, status:"active", trend:[22,0,0,18,0,0,26.4],    own:100,  news:"Cruising: 7 IP, 11 K (live)",     img:"ZW" },
  { id:"burnes",    name:"Corbin Burnes",          pos:"SP",    team:"BAL", bats:"R", proj:20.4, today:0,    week:24.1,  season:232.5, status:"active", trend:[0,0,24,0,0,0,0],        own:99.8, news:"—",                              img:"CB" },
  { id:"deGrom",    name:"Jacob deGrom",           pos:"SP",    team:"TEX", bats:"R", proj:22.6, today:0,    week:0,     season:161.4, status:"active", trend:[0,0,0,28,0,0,0],        own:99.6, news:"—",                              img:"JD" },
  { id:"diaz",      name:"Edwin Díaz",             pos:"RP",    team:"NYM", bats:"R", proj:6.8,  today:9.0,  week:19.7,  season:142.8, status:"active", trend:[3,0,7,0,5,0,9.0],       own:96.4, news:"Save (28)",                       img:"ED" },
  { id:"clase",     name:"Emmanuel Clase",         pos:"RP",    team:"CLE", bats:"R", proj:6.5,  today:0,    week:12.0,  season:138.4, status:"active", trend:[0,4,0,8,0,0,0],         own:96.0, news:"—",                              img:"EC" },
];

export const MY_ROSTER = [
  { slot:"C",    pid:null,         empty:true },
  { slot:"1B",   pid:"harper" },
  { slot:"2B",   pid:"altuve" },
  { slot:"3B",   pid:"devers" },
  { slot:"SS",   pid:"henderson" },
  { slot:"OF",   pid:"judge" },
  { slot:"OF",   pid:"tatis" },
  { slot:"OF",   pid:"yelich" },
  { slot:"UTIL", pid:"ohtani" },
  { slot:"SP",   pid:"wheeler" },
  { slot:"SP",   pid:"skubal" },
  { slot:"SP",   pid:"burnes" },
  { slot:"RP",   pid:"diaz" },
  { slot:"RP",   pid:"clase" },
  { slot:"P",    pid:"deGrom" },
];

export const MY_BENCH = ["betts","guerrero","swanson","acuna"];

export const LEAGUE = {
  name: "Diamond Cartel",
  size: 12,
  scoring: "Points",
  week: 18,
  weekRange: "Aug 11 – Aug 17",
  matchupDay: 4,
  matchupOf: 7,
};

export const MY_TEAM  = { name:"Triple Plays",   abbr:"TRP", record:"11–6", rank:2, pts:2871.4 };
export const OPP_TEAM = { name:"Bunt Force One", abbr:"BFO", record:"9–8",  rank:5, pts:2614.0 };

export const MATCHUP = {
  me:  { name:"Triple Plays",   score:188.6, projected:274.1, playing:8, yetToPlay:5, finished:2, optimal:192.4 },
  opp: { name:"Bunt Force One", score:162.3, projected:248.7, playing:7, yetToPlay:6, finished:2, optimal:168.0 },
};

export const STANDINGS = [
  { rank:1,  abbr:"BBQ", name:"Backdoor Sliders",  w:13, l:4,  pf:3024.6, pa:2701.2, streak:"W4", owner:"Maya R."  },
  { rank:2,  abbr:"TRP", name:"Triple Plays",      w:11, l:6,  pf:2871.4, pa:2702.0, streak:"W2", owner:"You",    you:true },
  { rank:3,  abbr:"PIT", name:"Pitch Please",      w:11, l:6,  pf:2802.7, pa:2680.4, streak:"L1", owner:"Devon K." },
  { rank:4,  abbr:"FBL", name:"Field of Streams",  w:10, l:7,  pf:2766.0, pa:2700.1, streak:"W1", owner:"Priya S." },
  { rank:5,  abbr:"BFO", name:"Bunt Force One",    w:9,  l:8,  pf:2614.0, pa:2655.7, streak:"L2", owner:"Theo W."  },
  { rank:6,  abbr:"DUG", name:"Dugout Dynasty",    w:9,  l:8,  pf:2598.3, pa:2670.2, streak:"W3", owner:"Kara N."  },
  { rank:7,  abbr:"SAC", name:"Sacrifice Bunch",   w:8,  l:9,  pf:2540.8, pa:2611.6, streak:"L1", owner:"Jonas P." },
  { rank:8,  abbr:"BTB", name:"Below The Bag",     w:8,  l:9,  pf:2511.0, pa:2640.0, streak:"W2", owner:"Eli M."   },
  { rank:9,  abbr:"CRK", name:"Crack of the Bat",  w:7,  l:10, pf:2470.5, pa:2682.9, streak:"L3", owner:"Sasha O." },
  { rank:10, abbr:"WLD", name:"Wild Pitches",      w:6,  l:11, pf:2401.2, pa:2700.5, streak:"L1", owner:"Ravi C."  },
  { rank:11, abbr:"FLY", name:"Can of Corn",       w:6,  l:11, pf:2380.0, pa:2701.0, streak:"W1", owner:"Nora T."  },
  { rank:12, abbr:"BPN", name:"Bullpen Babies",    w:4,  l:13, pf:2188.4, pa:2812.5, streak:"L5", owner:"Hugo L."  },
];

export const GAMES = [
  { id:"phi-nyy", away:"PHI", home:"NYY", awayR:5, homeR:3, inning:"T8",      state:"live",     outs:1, bases:[1,0,1], count:"2-1", broadcast:"FOX"  },
  { id:"lad-sdp", away:"LAD", home:"SDP", awayR:2, homeR:2, inning:"B6",      state:"live",     outs:2, bases:[0,1,0], count:"1-2", broadcast:"ESPN" },
  { id:"bal-tor", away:"BAL", home:"TOR", awayR:7, homeR:4, inning:"F",       state:"final"  },
  { id:"hou-sea", away:"HOU", home:"SEA", awayR:0, homeR:0, inning:"9:40 PM", state:"upcoming" },
  { id:"atl-mil", away:"ATL", home:"MIL", awayR:0, homeR:0, inning:"8:10 PM", state:"upcoming" },
  { id:"bos-tex", away:"BOS", home:"TEX", awayR:1, homeR:6, inning:"F",       state:"final"  },
];

export const LIVE_FEED = [
  { ts:"T8 1o", team:"PHI", text:"Harper singles to right, scoring 1.",       impact:"+3.4", who:"harper",  kind:"hit" },
  { ts:"T8 1o", team:"PHI", text:"Schwarber walks. Runners on 1st & 3rd.",   impact:"+0.5",               kind:"bb"  },
  { ts:"T8 0o", team:"PHI", text:"Stott pops out to second base.",            impact:"-0.3",               kind:"out" },
  { ts:"T7 3o", team:"NYY", text:"Judge HR (38) to left-center.",             impact:"+13.2",who:"judge",   kind:"hr"  },
  { ts:"T7 2o", team:"NYY", text:"Soto strikes out swinging.",                impact:"-0.5",               kind:"k"   },
  { ts:"T7 1o", team:"NYY", text:"Volpe lines out to short.",                 impact:"-0.3",               kind:"out" },
  { ts:"B6 2o", team:"SDP", text:"Tatís Jr. doubles down the line.",          impact:"+2.1", who:"tatis",   kind:"hit" },
  { ts:"T6 3o", team:"PHI", text:"Wheeler strikes out the side. 11 K.",      impact:"+4.0", who:"wheeler", kind:"k"   },
];

export const FREE_AGENTS = [
  { name:"Spencer Steer",   pos:"3B", team:"CIN", proj14:148, ros:62, trend:"+24", owned:48, news:"Hitting 4th vs LHP",      img:"SS" },
  { name:"Jonathan India",  pos:"2B", team:"KCR", proj14:131, ros:58, trend:"+14", owned:36, news:"—",                        img:"JI" },
  { name:"Heliot Ramos",    pos:"OF", team:"SFG", proj14:142, ros:71, trend:"+18", owned:54, news:"Power surge: 5 HR/14d",   img:"HR" },
  { name:"Brent Rooker",    pos:"OF", team:"OAK", proj14:158, ros:68, trend:"+9",  owned:62, news:"—",                        img:"BR" },
  { name:"Reese Olson",     pos:"SP", team:"DET", proj14:96,  ros:54, trend:"+12", owned:31, news:"Two-start week vs CWS/COL",img:"RO" },
  { name:"Mason Miller",    pos:"RP", team:"OAK", proj14:88,  ros:74, trend:"+5",  owned:67, news:"Locked in as closer",     img:"MM" },
  { name:"Lawrence Butler", pos:"OF", team:"OAK", proj14:128, ros:60, trend:"+22", owned:44, news:"5-game hit streak",        img:"LB" },
  { name:"Colton Cowser",   pos:"OF", team:"BAL", proj14:120, ros:64, trend:"+8",  owned:55, news:"—",                        img:"CC" },
];
