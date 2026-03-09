import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const ADMIN_USERNAME = "RebelWasTakenAway";
const ADMIN_PASS = "Retou29";

const GAMES = [
  { id: "bgmi", name: "BGMI", icon: "🪖" },
  { id: "cod", name: "Call of Duty", icon: "🔫" },
  { id: "minecraft", name: "Minecraft", icon: "⛏️" },
  { id: "freefire", name: "Free Fire", icon: "🔥" },
  { id: "fortnite", name: "Fortnite", icon: "🏗️" },
  { id: "valorant", name: "Valorant", icon: "🎯" },
  { id: "pubg", name: "PUBG", icon: "🪂" },
  { id: "apex", name: "Apex Legends", icon: "🚀" },
  { id: "roblox", name: "Roblox", icon: "🧱" },
  { id: "coc", name: "Clash of Clans", icon: "⚔️" },
  { id: "cr", name: "Clash Royale", icon: "👑" },
  { id: "among", name: "Among Us", icon: "👾" },
];

const AVATARS = ["🦅","🐺","🔥","👻","⚙️","♠️","⚡","🌩️","🦁","🐉","🦊","🐻","🦈","🦋","🌟","🎯","💀","🏹"];

const LEVEL_TITLES = [
  { min: 0, title: "Rookie", color: "#9CA3AF" },
  { min: 5, title: "Challenger", color: "#60A5FA" },
  { min: 15, title: "Veteran", color: "#34D399" },
  { min: 25, title: "Elite", color: "#F59E0B" },
  { min: 35, title: "Master", color: "#F97316" },
  { min: 45, title: "Grandmaster", color: "#EF4444" },
  { min: 55, title: "Legend", color: "#A855F7" },
  { min: 70, title: "Mythic", color: "#EC4899" },
];

function getLevelTitle(level) {
  let t = LEVEL_TITLES[0];
  for (let lt of LEVEL_TITLES) { if ((level || 1) >= lt.min) t = lt; }
  return t;
}

function getRespectRank(r) {
  if (r >= 9000) return { rank: "S+", color: "#FFD700" };
  if (r >= 7000) return { rank: "S", color: "#F97316" };
  if (r >= 5000) return { rank: "A", color: "#EF4444" };
  if (r >= 3000) return { rank: "B", color: "#A855F7" };
  if (r >= 1000) return { rank: "C", color: "#60A5FA" };
  return { rank: "D", color: "#9CA3AF" };
}

function Avatar({ user, size = 40 }) {
  const style = {
    width: size, height: size, borderRadius: "50%", objectFit: "cover",
    fontSize: size * 0.5, display: "flex", alignItems: "center",
    justifyContent: "center", background: "var(--s3)", flexShrink: 0
  };
  if (user?.photo_url) return <img src={user.photo_url} alt="" style={style} />;
  return <div style={style}>{user?.avatar || "🦅"}</div>;
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#0D0D0F;--s1:#141417;--s2:#1C1C21;--s3:#242429;--bd:#2A2A32;
  --gold:#D4A843;--gold2:#F0C866;--acc:#C8832A;
  --tx:#F0EDE8;--tx2:#8A8582;--tx3:#4C4A48;
  --green:#3DDC84;--red:#FF5C5C;--pur:#9B72CF;
  --r:14px;--rs:8px;
}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--tx);min-height:100vh;overflow-x:hidden;}
h1,h2,h3{font-family:'Syne',sans-serif;}
.app{display:flex;flex-direction:column;min-height:100vh;max-width:480px;margin:0 auto;background:var(--bg);}
.scroll{overflow-y:auto;padding-bottom:90px;min-height:100vh;}
.auth{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:radial-gradient(ellipse at 50% 0%,#2A1F0A 0%,var(--bg) 65%);}
.auth-logo{text-align:center;margin-bottom:44px;}
.auth-logo-icon{font-size:60px;margin-bottom:10px;display:block;}
.auth-logo h1{font-size:38px;font-weight:800;letter-spacing:-1px;background:linear-gradient(135deg,var(--gold2),var(--acc));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.auth-logo p{color:var(--tx2);font-size:12px;letter-spacing:2.5px;text-transform:uppercase;margin-top:4px;}
.auth-card{width:100%;background:var(--s1);border:1px solid var(--bd);border-radius:20px;padding:28px 24px;}
.auth-tabs{display:flex;gap:4px;background:var(--bg);border-radius:var(--rs);padding:4px;margin-bottom:24px;}
.auth-tab{flex:1;padding:9px;text-align:center;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;border:none;background:transparent;color:var(--tx2);transition:all .2s;font-family:'DM Sans',sans-serif;}
.auth-tab.active{background:var(--s3);color:var(--tx);}
.fg{margin-bottom:13px;}
.flbl{display:block;font-size:11px;font-weight:600;color:var(--tx2);letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;}
.finp{width:100%;padding:13px 15px;background:var(--s2);border:1.5px solid var(--bd);border-radius:var(--rs);color:var(--tx);font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s;}
.finp:focus{border-color:var(--gold);}
.finp::placeholder{color:var(--tx3);}
.finp option{background:var(--s2);}
.btn-p{width:100%;padding:14px;background:linear-gradient(135deg,var(--gold),var(--acc));border:none;border-radius:var(--rs);color:#0D0D0F;font-size:15px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;transition:opacity .2s;margin-top:6px;}
.btn-p:hover{opacity:.88;}
.btn-p:disabled{opacity:.5;cursor:not-allowed;}
.btn-s{padding:10px 16px;background:var(--s3);border:1.5px solid var(--bd);border-radius:var(--rs);color:var(--tx);font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;}
.btn-s:hover{border-color:var(--gold);color:var(--gold);}
.err{color:var(--red);font-size:12px;margin-top:10px;text-align:center;padding:8px 12px;background:rgba(255,92,92,.1);border-radius:6px;}
.av-grid{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px;}
.av-opt{width:40px;height:40px;border-radius:8px;background:var(--s2);border:2px solid transparent;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;transition:all .2s;}
.av-opt.sel{border-color:var(--gold);background:rgba(212,168,67,.15);}
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--s1);border-top:1px solid var(--bd);display:flex;z-index:100;padding:8px 0 18px;}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;cursor:pointer;border:none;background:transparent;color:var(--tx3);transition:color .2s;}
.ni.active{color:var(--gold);}
.ni-icon{font-size:21px;}
.ni-lbl{font-size:10px;font-weight:500;}
.ph{padding:20px 20px 0;display:flex;align-items:center;justify-content:space-between;}
.ph-t{font-size:25px;font-weight:800;letter-spacing:-.5px;}
.ph-s{color:var(--tx2);font-size:13px;margin-top:2px;}
.cbadge{display:flex;align-items:center;gap:6px;background:var(--s2);border:1px solid var(--bd);padding:7px 13px;border-radius:20px;}
.cam{font-size:14px;font-weight:700;color:var(--gold);font-family:'Syne',sans-serif;}
.hero{margin:16px 20px 0;background:linear-gradient(135deg,#1E1508,#2A1F0A 50%,#1E1508);border:1px solid rgba(212,168,67,.3);border-radius:20px;padding:22px;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-20px;right:-20px;width:100px;height:100px;background:radial-gradient(circle,rgba(212,168,67,.25) 0%,transparent 70%);border-radius:50%;}
.hero-g{font-size:13px;color:var(--gold);font-weight:500;margin-bottom:6px;}
.hero-n{font-size:22px;font-weight:800;letter-spacing:-.5px;display:flex;align-items:center;gap:10px;}
.hero-st{display:flex;gap:20px;margin-top:14px;flex-wrap:wrap;}
.hst-v{font-size:20px;font-weight:700;font-family:'Syne',sans-serif;}
.hst-l{font-size:10px;color:var(--tx2);text-transform:uppercase;letter-spacing:.5px;}
.stitle{font-size:15px;font-weight:700;padding:0 20px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;}
.sa{font-size:12px;color:var(--gold);font-weight:500;cursor:pointer;}
.gscroll{display:flex;gap:10px;padding:0 20px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;}
.gscroll::-webkit-scrollbar{display:none;}
.gc{min-width:82px;background:var(--s2);border:1.5px solid var(--bd);border-radius:var(--r);padding:14px 10px;text-align:center;cursor:pointer;transition:all .2s;flex-shrink:0;}
.gc.af{border-color:var(--gold);background:rgba(212,168,67,.1);}
.gc-icon{font-size:26px;margin-bottom:5px;}
.gc-name{font-size:10px;font-weight:600;color:var(--tx2);}
.tlist{padding:0 20px;display:flex;flex-direction:column;gap:10px;}
.tc{background:var(--s1);border:1.5px solid var(--bd);border-radius:var(--r);padding:16px;cursor:pointer;transition:all .2s;}
.tc:hover{border-color:rgba(212,168,67,.4);}
.tch{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;}
.tcgb{display:flex;align-items:center;gap:5px;}
.tcgi{font-size:17px;}
.tcgn{font-size:11px;color:var(--tx2);font-weight:500;}
.tcs{padding:4px 9px;border-radius:20px;font-size:11px;font-weight:600;}
.tcs.open{background:rgba(61,220,132,.15);color:var(--green);}
.tcs.live{background:rgba(255,92,92,.15);color:var(--red);animation:pulse 1.5s infinite;}
.tcs.ended{background:var(--s3);color:var(--tx3);}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.55;}}
.tcname{font-size:16px;font-weight:700;margin-bottom:7px;letter-spacing:-.3px;}
.tcmeta{display:flex;gap:12px;flex-wrap:wrap;}
.tcmi{font-size:11px;color:var(--tx2);}
.tcf{margin-top:12px;display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--bd);}
.tcp{font-size:18px;font-weight:800;color:var(--gold);font-family:'Syne',sans-serif;}
.tce{font-size:11px;color:var(--tx2);}
.jbtn{padding:8px 16px;background:linear-gradient(135deg,var(--gold),var(--acc));border:none;border-radius:7px;color:#0D0D0F;font-size:12px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;}
.jbtn:disabled{background:var(--s3);color:var(--tx3);cursor:not-allowed;background-image:none;}
.bc-box{background:var(--s1);border:1px solid var(--bd);border-radius:20px;padding:22px 18px;margin:16px 20px 0;}
.bc-title{font-size:12px;font-weight:600;color:var(--tx2);text-align:center;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:22px;}
.bc{display:flex;align-items:flex-end;justify-content:center;gap:6px;height:190px;margin-bottom:14px;}
.bw{display:flex;flex-direction:column;align-items:center;gap:5px;}
.bar{border-radius:8px 8px 0 0;min-width:54px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:8px;}
.bval{font-size:10px;font-weight:700;margin-top:3px;}
.busr{font-size:10px;font-weight:600;color:var(--tx2);max-width:60px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.upc{background:linear-gradient(135deg,#1E1508,#2A1F0A);border:1px solid rgba(212,168,67,.4);border-radius:var(--r);padding:14px;display:flex;align-items:center;gap:12px;}
.upc-rp{font-size:19px;font-weight:800;color:var(--gold);font-family:'Syne',sans-serif;}
.upc-rb{font-size:11px;font-weight:700;padding:2px 7px;border-radius:4px;display:inline-block;margin-top:2px;}
.lblist{padding:0 20px;display:flex;flex-direction:column;gap:7px;margin-top:14px;}
.lbi{display:flex;align-items:center;gap:11px;background:var(--s1);border:1.5px solid var(--bd);border-radius:var(--rs);padding:12px 14px;}
.lbi.hl{border-color:rgba(212,168,67,.5);background:rgba(212,168,67,.04);}
.lb-rank{font-size:15px;font-weight:800;width:26px;text-align:center;font-family:'Syne',sans-serif;}
.lb-rp{text-align:right;}
.lb-rpv{font-size:15px;font-weight:700;font-family:'Syne',sans-serif;}
.lb-rpl{font-size:10px;color:var(--tx3);}
.pr-hero{margin:16px 20px 0;background:var(--s1);border:1px solid var(--bd);border-radius:20px;padding:26px 22px;text-align:center;}
.pr-name{font-size:22px;font-weight:800;letter-spacing:-.5px;}
.pr-lbadge{display:inline-flex;align-items:center;gap:5px;margin:7px 0;padding:3px 11px;border-radius:20px;font-size:12px;font-weight:600;}
.pr-chips{display:flex;gap:7px;justify-content:center;flex-wrap:wrap;margin-bottom:14px;}
.chip{display:inline-flex;align-items:center;gap:3px;padding:4px 9px;border-radius:20px;font-size:11px;font-weight:600;background:var(--s3);color:var(--tx2);}
.pr-sgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--bd);border-radius:var(--rs);overflow:hidden;}
.pr-stat{background:var(--s2);padding:14px 8px;text-align:center;}
.pr-stv{font-size:19px;font-weight:800;font-family:'Syne',sans-serif;color:var(--gold);}
.pr-stl{font-size:10px;color:var(--tx2);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;}
.mh{padding:0 20px;}
.mi{background:var(--s1);border:1px solid var(--bd);border-radius:var(--rs);padding:12px 14px;margin-bottom:7px;display:flex;align-items:center;gap:11px;}
.mr{width:34px;height:34px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;}
.mr.win{background:rgba(61,220,132,.2);color:var(--green);}
.mr.loss{background:rgba(255,92,92,.2);color:var(--red);}
.mi-rp{text-align:right;font-weight:700;font-family:'Syne',sans-serif;font-size:14px;}
.ai-card{margin:14px 20px 0;background:linear-gradient(135deg,#0F0A1E,#1A0F2E);border:1px solid rgba(155,114,207,.3);border-radius:var(--r);padding:14px;}
.ai-lbl{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--pur);font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:7px;}
.ai-t{font-size:13px;color:var(--tx2);line-height:1.6;}
.crpage{padding:20px 20px 100px;}
.crform{background:var(--s1);border:1px solid var(--bd);border-radius:20px;padding:22px;}
.fst{font-size:11px;font-weight:600;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin:18px 0 10px;}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.gsel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;}
.gso{background:var(--s2);border:1.5px solid var(--bd);border-radius:var(--rs);padding:10px 6px;text-align:center;cursor:pointer;transition:all .2s;}
.gso.sel{border-color:var(--gold);background:rgba(212,168,67,.1);}
.gso-icon{font-size:20px;}
.gso-name{font-size:9px;font-weight:600;color:var(--tx2);margin-top:3px;}
.adpage{padding:20px 20px 100px;}
.ad-hdr{background:linear-gradient(135deg,#1A0505,#2A0808);border:1px solid rgba(255,92,92,.3);border-radius:var(--r);padding:18px;margin-bottom:18px;}
.sgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:18px;}
.scard{background:var(--s1);border:1px solid var(--bd);border-radius:var(--rs);padding:18px;text-align:center;}
.scard-v{font-size:26px;font-weight:800;color:var(--gold);font-family:'Syne',sans-serif;}
.scard-l{font-size:10px;color:var(--tx2);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;}
.atable{background:var(--s1);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;margin-bottom:14px;}
.atblh{padding:12px 14px;border-bottom:1px solid var(--bd);font-size:11px;font-weight:600;color:var(--tx2);text-transform:uppercase;letter-spacing:.5px;display:flex;justify-content:space-between;}
.arow{padding:11px 14px;border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:9px;}
.arow:last-child{border-bottom:none;}
.abtn{padding:4px 10px;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;}
.abtn.d{background:rgba(255,92,92,.2);color:var(--red);}
.abtn.g{background:rgba(61,220,132,.2);color:var(--green);}
.mov{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(5px);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.mod{background:var(--s1);border:1px solid var(--bd);border-radius:22px 22px 0 0;padding:26px 22px 40px;width:100%;max-width:480px;max-height:80vh;overflow-y:auto;}
.mod-h{width:34px;height:3px;background:var(--bd);border-radius:2px;margin:0 auto 18px;}
.mod-t{font-size:19px;font-weight:800;margin-bottom:18px;}
.toast{position:fixed;bottom:88px;left:50%;transform:translateX(-50%);background:var(--s3);border:1px solid var(--bd);padding:11px 18px;border-radius:20px;font-size:13px;font-weight:500;z-index:999;animation:tIn .28s ease;white-space:nowrap;max-width:90%;}
@keyframes tIn{from{opacity:0;transform:translateX(-50%) translateY(16px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
.loading{min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;background:var(--bg);}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
.spin{animation:spin 1.5s linear infinite;display:inline-block;}
.es{text-align:center;padding:40px 20px;color:var(--tx3);}
.es-i{font-size:44px;margin-bottom:10px;}
`;

export default function RetouApp() {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [toast, setToast] = useState(null);
  const [gameFilter, setGameFilter] = useState("all");
  const [selectedT, setSelectedT] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [authErr, setAuthErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [lf, setLf] = useState({ username: "", password: "" });
  const [rf, setRf] = useState({ username: "", email: "", password: "", avatar: "🦅" });
  const [cf, setCf] = useState({ name: "", game: "bgmi", entryFee: "100", prize: "500", maxPlayers: "32", mode: "Squad", description: "" });
  const photoRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadUserData(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadUserData(session.user.id);
      else { setUserData(null); setIsAdmin(false); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (uid) => {
    const { data } = await supabase.from("users").select("*").eq("id", uid).single();
    if (data) {
      setUserData(data);
      setIsAdmin(data.username === ADMIN_USERNAME);
    }
    setLoading(false);
  };

  // Real-time players
  useEffect(() => {
    if (!session) return;
    const channel = supabase.channel('users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        supabase.from("users").select("*").then(({ data }) => { if (data) setPlayers(data); });
      }).subscribe();
    supabase.from("users").select("*").then(({ data }) => { if (data) setPlayers(data); });
    return () => supabase.removeChannel(channel);
  }, [session]);

  // Real-time tournaments
  useEffect(() => {
    if (!session) return;
    const channel = supabase.channel('tournaments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, () => {
        supabase.from("tournaments").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setTournaments(data); });
      }).subscribe();
    supabase.from("tournaments").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setTournaments(data); });
    return () => supabase.removeChannel(channel);
  }, [session]);

  // Sync userData when players update
  useEffect(() => {
    if (userData && session) {
      const updated = players.find(p => p.id === userData.id);
      if (updated) setUserData(updated);
    }
  }, [players]);

  // LOGIN
  const handleLogin = async () => {
    setAuthErr(""); setAuthBusy(true);
    if (lf.username === ADMIN_USERNAME && lf.password === ADMIN_PASS) {
      // Admin - sign in with special email
      const adminEmail = "admin@retou.internal";
      let res = await supabase.auth.signInWithPassword({ email: adminEmail, password: ADMIN_PASS });
      if (res.error) {
        // Create admin account first
        const reg = await supabase.auth.signUp({ email: adminEmail, password: ADMIN_PASS });
        if (!reg.error && reg.data.user) {
          await supabase.from("users").insert({ id: reg.data.user.id, username: ADMIN_USERNAME, avatar: "🔐", coins: 999999, respect: 99999, level: 99, games_played: 0, wins: 0, match_history: [] });
          await supabase.auth.signInWithPassword({ email: adminEmail, password: ADMIN_PASS });
        }
      }
      setActiveTab("admin");
      setAuthBusy(false); return;
    }
    // Find user by username
    const { data: users } = await supabase.from("users").select("*").ilike("username", lf.username);
    if (!users || users.length === 0) { setAuthErr("Username not found."); setAuthBusy(false); return; }
    const user = users[0];
    const { error } = await supabase.auth.signInWithPassword({ email: user.email, password: lf.password });
    if (error) setAuthErr("Wrong password. Try again.");
    else setActiveTab("home");
    setAuthBusy(false);
  };

  // REGISTER
  const handleRegister = async () => {
    setAuthErr(""); setAuthBusy(true);
    if (!rf.username.trim() || rf.username.length < 3) { setAuthErr("Username must be 3+ characters."); setAuthBusy(false); return; }
    if (!rf.email.includes("@")) { setAuthErr("Enter a valid email."); setAuthBusy(false); return; }
    if (rf.password.length < 6) { setAuthErr("Password must be 6+ characters."); setAuthBusy(false); return; }
    const { data: existing } = await supabase.from("users").select("id").ilike("username", rf.username);
    if (existing && existing.length > 0) { setAuthErr("Username taken. Choose another."); setAuthBusy(false); return; }
    const { data, error } = await supabase.auth.signUp({ email: rf.email, password: rf.password });
    if (error) { setAuthErr(error.message); setAuthBusy(false); return; }
    if (data.user) {
      await supabase.from("users").insert({ id: data.user.id, username: rf.username.trim(), email: rf.email, avatar: rf.avatar, photo_url: null, coins: 2000, respect: 100, level: 1, games_played: 0, wins: 0, match_history: [] });
      setActiveTab("home");
      showToast("Welcome to Retou! 🏆");
    }
    setAuthBusy(false);
  };

  // SIGN OUT
  const handleSignOut = async () => { await supabase.auth.signOut(); };

  // PHOTO UPLOAD
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !session) return;
    if (file.size > 5 * 1024 * 1024) { showToast("Photo must be under 5MB"); return; }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${session.user.id}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      await supabase.from("users").update({ photo_url: publicUrl }).eq("id", session.user.id);
      setUserData(prev => ({ ...prev, photo_url: publicUrl }));
      showToast("Profile photo updated! 📸");
    } catch (e) { showToast("Upload failed. Try again."); }
    setUploading(false);
  };

  // SIMULATE MATCH
  const handleSimMatch = async () => {
    if (!userData || isAdmin) return;
    const win = Math.random() > 0.42;
    const rpBase = win ? Math.floor(Math.random() * 130) + 70 : Math.floor(Math.random() * 45) + 10;
    const kills = Math.floor(Math.random() * 14);
    const placement = win ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 15) + 4;
    const rpChange = win ? rpBase : -Math.floor(rpBase / 3);
    const game = GAMES[Math.floor(Math.random() * GAMES.length)];
    const match = { id: Date.now(), game: game.name, result: win ? "win" : "loss", rpChange, kills, placement, date: new Date().toLocaleDateString() };
    const newHistory = [match, ...(userData.match_history || [])].slice(0, 25);
    const newRespect = Math.max(0, (userData.respect || 0) + rpChange);
    const newLevel = Math.max(1, Math.floor(newRespect / 200) + 1);
    await supabase.from("users").update({ respect: newRespect, games_played: (userData.games_played || 0) + 1, wins: win ? (userData.wins || 0) + 1 : (userData.wins || 0), level: newLevel, match_history: newHistory }).eq("id", session.user.id);
    showToast(win ? `Victory! +${rpBase} Respect 🏆` : `Defeated. ${rpChange} RP`);
  };

  // JOIN TOURNAMENT
  const handleJoin = async (t) => {
    if (!userData) return;
    const players_list = t.players || [];
    if (players_list.includes(userData.id)) { showToast("Already joined!"); return; }
    if ((userData.coins || 0) < t.entry_fee) { showToast("Not enough Retou Coins!"); return; }
    if (players_list.length >= t.max_players) { showToast("Tournament is full!"); return; }
    await supabase.from("tournaments").update({ players: [...players_list, userData.id] }).eq("id", t.id);
    await supabase.from("users").update({ coins: (userData.coins || 0) - t.entry_fee }).eq("id", userData.id);
    showToast(`Joined ${t.name}! -${t.entry_fee} coins`);
    setSelectedT(null);
  };

  // CREATE TOURNAMENT
  const handleCreate = async () => {
    if (!cf.name.trim()) { showToast("Enter a tournament name."); return; }
    if ((userData?.coins || 0) < 500) { showToast("Need 500 coins to host."); return; }
    await supabase.from("tournaments").insert({ name: cf.name, game: cf.game, host: userData.username, host_id: userData.id, prize: parseInt(cf.prize) || 500, entry_fee: parseInt(cf.entryFee) || 100, max_players: parseInt(cf.maxPlayers) || 32, players: [userData.id], status: "open", start_time: "TBD", mode: cf.mode, description: cf.description });
    await supabase.from("users").update({ coins: (userData.coins || 0) - 500 }).eq("id", userData.id);
    showToast("Tournament created! 🎉");
    setActiveTab("tournaments");
    setCf({ name: "", game: "bgmi", entryFee: "100", prize: "500", maxPlayers: "32", mode: "Squad", description: "" });
  };

  const sorted = [...players].sort((a, b) => (b.respect || 0) - (a.respect || 0));
  const top3 = sorted.slice(0, 3);
  const userRank = sorted.findIndex(p => p.id === userData?.id) + 1;
  const filteredTs = gameFilter === "all" ? tournaments : tournaments.filter(t => t.game === gameFilter);
  const aiInsights = ["Your win rate is climbing. Enter higher-stake tournaments for max Respect.", "BGMI tournaments are trending. Battle Royale pays 3x more Respect.", "Players who compete daily gain Respect 2.4x faster.", "High kill games reward bonus RP multipliers. Aggressive play pays.", "Hosting tournaments earns passive Respect from every match.", "Consistency is key — the more you play the faster you rank up!"];
  const [aiText] = useState(() => aiInsights[Math.floor(Math.random() * aiInsights.length)]);

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading">
        <div style={{ fontSize: 52 }} className="spin">🏆</div>
        <div style={{ color: "var(--tx2)", fontFamily: "Syne", fontWeight: 700, fontSize: 18 }}>RETOU</div>
      </div>
    </>
  );

  if (!session) return (
    <>
      <style>{css}</style>
      <div className="auth">
        <div className="auth-logo">
          <span className="auth-logo-icon">🏆</span>
          <h1>RETOU</h1>
          <p>Tournaments Arena</p>
        </div>
        <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab${authMode === "login" ? " active" : ""}`} onClick={() => { setAuthMode("login"); setAuthErr(""); }}>Sign In</button>
            <button className={`auth-tab${authMode === "register" ? " active" : ""}`} onClick={() => { setAuthMode("register"); setAuthErr(""); }}>New Account</button>
          </div>
          {authMode === "login" ? <>
            <div className="fg"><label className="flbl">Username</label><input className="finp" placeholder="Your username" value={lf.username} onChange={e => setLf(p => ({ ...p, username: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} /></div>
            <div className="fg"><label className="flbl">Password</label><input className="finp" type="password" placeholder="Your password" value={lf.password} onChange={e => setLf(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} /></div>
            {authErr && <div className="err">{authErr}</div>}
            <button className="btn-p" onClick={handleLogin} disabled={authBusy}>{authBusy ? "Signing in..." : "Enter the Arena →"}</button>
          </> : <>
            <div className="fg"><label className="flbl">Username</label><input className="finp" placeholder="Choose a warrior name" value={rf.username} onChange={e => setRf(p => ({ ...p, username: e.target.value }))} /></div>
            <div className="fg"><label className="flbl">Email</label><input className="finp" type="email" placeholder="your@email.com" value={rf.email} onChange={e => setRf(p => ({ ...p, email: e.target.value }))} /></div>
            <div className="fg"><label className="flbl">Password</label><input className="finp" type="password" placeholder="6+ characters" value={rf.password} onChange={e => setRf(p => ({ ...p, password: e.target.value }))} /></div>
            <div className="fg"><label className="flbl">Choose Avatar</label><div className="av-grid">{AVATARS.map(a => <div key={a} className={`av-opt${rf.avatar === a ? " sel" : ""}`} onClick={() => setRf(p => ({ ...p, avatar: a }))}>{a}</div>)}</div></div>
            {authErr && <div className="err">{authErr}</div>}
            <button className="btn-p" onClick={handleRegister} disabled={authBusy}>{authBusy ? "Creating..." : "Create Account →"}</button>
          </>}
        </div>
      </div>
    </>
  );

  const user = userData;

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {activeTab === "home" && <div className="scroll">
          <div className="ph">
            <div><div className="ph-t">Home</div><div className="ph-s">Welcome back, {user?.username}</div></div>
            <div className="cbadge"><span>🪙</span><span className="cam">{(user?.coins || 0).toLocaleString()}</span></div>
          </div>
          <div className="hero">
            <div className="hero-g">⚔️ Your Arena Stats</div>
            <div className="hero-n"><Avatar user={user} size={40} />{user?.username}</div>
            <div className="hero-st">
              <div><div className="hst-v" style={{ color: "var(--gold)" }}>{(user?.respect || 0).toLocaleString()}</div><div className="hst-l">Respect</div></div>
              <div><div className="hst-v">Lv.{user?.level || 1}</div><div className="hst-l">Level</div></div>
              <div><div className="hst-v" style={{ color: getRespectRank(user?.respect || 0).color }}>{getRespectRank(user?.respect || 0).rank}</div><div className="hst-l">Rank</div></div>
              <div><div className="hst-v" style={{ color: "var(--green)" }}>{userRank > 0 ? `#${userRank}` : "-"}</div><div className="hst-l">World</div></div>
            </div>
          </div>
          <div className="ai-card"><div className="ai-lbl">✦ AI Insight</div><div className="ai-t">{aiText}</div></div>
          <div style={{ padding: "14px 20px 16px" }}><button className="btn-p" onClick={handleSimMatch}>⚡ Simulate Quick Match</button></div>
          <div className="stitle"><span>Games</span><span className="sa" onClick={() => setActiveTab("tournaments")}>Browse All →</span></div>
          <div className="gscroll">
            <div className={`gc${gameFilter === "all" ? " af" : ""}`} style={{ minWidth: 70 }} onClick={() => { setGameFilter("all"); setActiveTab("tournaments"); }}><div className="gc-icon">🎮</div><div className="gc-name">All</div></div>
            {GAMES.map(g => <div key={g.id} className="gc" onClick={() => { setGameFilter(g.id); setActiveTab("tournaments"); }}><div className="gc-icon">{g.icon}</div><div className="gc-name">{g.name}</div></div>)}
          </div>
          <div style={{ height: 16 }} />
          <div className="stitle"><span>Live & Open</span></div>
          <div className="tlist">
            {tournaments.filter(t => t.status !== "ended").slice(0, 3).map(t => {
              const g = GAMES.find(x => x.id === t.game); const joined = (t.players || []).includes(user?.id);
              return <div key={t.id} className="tc" onClick={() => setSelectedT(t)}>
                <div className="tch"><div className="tcgb"><span className="tcgi">{g?.icon}</span><span className="tcgn">{g?.name} · {t.mode}</span></div><div className={`tcs ${t.status}`}>{t.status === "live" ? "🔴 LIVE" : "OPEN"}</div></div>
                <div className="tcname">{t.name}</div>
                <div className="tcmeta"><div className="tcmi">👥 {(t.players || []).length}/{t.max_players}</div><div className="tcmi">🏆 {t.host}</div></div>
                <div className="tcf"><div><div className="tcp">🪙 {(t.prize || 0).toLocaleString()}</div><div className="tce">Entry: {t.entry_fee} coins</div></div>
                  <button className="jbtn" disabled={joined} onClick={e => { e.stopPropagation(); handleJoin(t); }}>{joined ? "✓ Joined" : "Join"}</button></div>
              </div>;
            })}
            {tournaments.filter(t => t.status !== "ended").length === 0 && <div className="es"><div className="es-i">🎮</div><p>No open tournaments yet. Host one!</p></div>}
          </div>
          <div style={{ height: 20 }} />
        </div>}

        {activeTab === "tournaments" && <div className="scroll">
          <div className="ph"><div><div className="ph-t">Tournaments</div><div className="ph-s">{filteredTs.length} available</div></div><button className="btn-s" onClick={() => setActiveTab("create")}>+ Host</button></div>
          <div style={{ padding: "14px 20px 8px" }}>
            <div className="gscroll" style={{ padding: 0 }}>
              <div className={`gc${gameFilter === "all" ? " af" : ""}`} style={{ minWidth: 70 }} onClick={() => setGameFilter("all")}><div className="gc-icon">🎮</div><div className="gc-name">All</div></div>
              {GAMES.map(g => <div key={g.id} className={`gc${gameFilter === g.id ? " af" : ""}`} onClick={() => setGameFilter(g.id)}><div className="gc-icon">{g.icon}</div><div className="gc-name">{g.name}</div></div>)}
            </div>
          </div>
          <div className="tlist" style={{ marginTop: 4 }}>
            {filteredTs.length === 0 ? <div className="es"><div className="es-i">🏆</div><p>No tournaments here yet</p></div> :
              filteredTs.map(t => {
                const g = GAMES.find(x => x.id === t.game); const joined = (t.players || []).includes(user?.id);
                return <div key={t.id} className="tc" onClick={() => setSelectedT(t)}>
                  <div className="tch"><div className="tcgb"><span className="tcgi">{g?.icon}</span><span className="tcgn">{g?.name} · {t.mode}</span></div><div className={`tcs ${t.status}`}>{t.status === "live" ? "🔴 LIVE" : t.status === "ended" ? "ENDED" : "OPEN"}</div></div>
                  <div className="tcname">{t.name}</div>
                  <div className="tcmeta"><div className="tcmi">👥 {(t.players || []).length}/{t.max_players}</div><div className="tcmi">🏆 {t.host}</div><div className="tcmi">🕐 {t.start_time}</div></div>
                  <div className="tcf"><div><div className="tcp">🪙 {(t.prize || 0).toLocaleString()}</div><div className="tce">Entry: {t.entry_fee} coins</div></div>
                    <button className="jbtn" disabled={joined || t.status === "ended"} onClick={e => { e.stopPropagation(); handleJoin(t); }}>{joined ? "✓ Joined" : t.status === "ended" ? "Ended" : "Join"}</button></div>
                </div>;
              })}
          </div>
          <div style={{ height: 20 }} />
        </div>}

        {activeTab === "leaderboard" && <div className="scroll" style={{ paddingBottom: 100 }}>
          <div className="ph"><div><div className="ph-t">World Rankings</div><div className="ph-s">Global Respect Board</div></div></div>
          <div className="bc-box">
            <div className="bc-title">🌍 Top Players Worldwide</div>
            <div className="bc">
              {top3[1] && <div className="bw"><div className="bar" style={{ height: `${(top3[1].respect / Math.max(top3[0].respect, 1)) * 140}px`, background: "linear-gradient(180deg,#C8C8C8,#888)", minWidth: 54 }}><Avatar user={top3[1]} size={28} /><div className="bval" style={{ color: "#fff" }}>{((top3[1].respect || 0) / 1000).toFixed(1)}k</div></div><div style={{ fontSize: 14 }}>🥈</div><div className="busr">{top3[1].username}</div></div>}
              {top3[0] && <div className="bw"><div className="bar" style={{ height: "155px", background: "linear-gradient(180deg,var(--gold2),var(--gold))", minWidth: 62 }}><Avatar user={top3[0]} size={32} /><div className="bval" style={{ color: "#0D0D0F", fontWeight: 800 }}>{((top3[0].respect || 0) / 1000).toFixed(1)}k</div></div><div style={{ fontSize: 18 }}>🥇</div><div className="busr" style={{ fontWeight: 700, color: "var(--gold)" }}>{top3[0].username}</div></div>}
              {top3[2] && <div className="bw"><div className="bar" style={{ height: `${(top3[2].respect / Math.max(top3[0].respect, 1)) * 140}px`, background: "linear-gradient(180deg,#CD7F32,#8B5A2B)", minWidth: 54 }}><Avatar user={top3[2]} size={28} /><div className="bval" style={{ color: "#F0EDE8" }}>{((top3[2].respect || 0) / 1000).toFixed(1)}k</div></div><div style={{ fontSize: 14 }}>🥉</div><div className="busr">{top3[2].username}</div></div>}
            </div>
            {user && <div className="upc"><Avatar user={user} size={48} /><div style={{ flex: 1, marginLeft: 12 }}><div style={{ fontSize: 15, fontWeight: 700 }}>{user.username}</div><div style={{ fontSize: 11, color: "var(--tx2)" }}>Rank #{userRank} · Lv.{user.level || 1} · {getLevelTitle(user.level || 1).title}</div></div><div style={{ textAlign: "right" }}><div className="upc-rp">{(user.respect || 0).toLocaleString()}</div><div className="upc-rb" style={{ background: `${getRespectRank(user.respect || 0).color}22`, color: getRespectRank(user.respect || 0).color }}>{getRespectRank(user.respect || 0).rank} Tier</div></div></div>}
          </div>
          <div style={{ padding: "14px 20px 8px", fontSize: 11, fontWeight: 600, color: "var(--tx2)", textTransform: "uppercase", letterSpacing: 1 }}>All Players</div>
          <div className="lblist">
            {sorted.map((p, i) => {
              const rd = getRespectRank(p.respect || 0); const iu = p.id === user?.id;
              return <div key={p.id} className={`lbi${iu ? " hl" : ""}`}>
                <div className="lb-rank" style={{ color: i === 0 ? "var(--gold)" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "var(--tx3)" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</div>
                <Avatar user={p} size={36} />
                <div style={{ flex: 1, marginLeft: 4 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{p.username}{iu && <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 600 }}> (You)</span>}</div><div style={{ fontSize: 11, color: getLevelTitle(p.level || 1).color }}>{getLevelTitle(p.level || 1).title} · Lv.{p.level || 1}</div></div>
                <div className="lb-rp"><div className="lb-rpv" style={{ color: rd.color }}>{(p.respect || 0).toLocaleString()}</div><div className="lb-rpl">{rd.rank} Tier</div></div>
              </div>;
            })}
            {sorted.length === 0 && <div className="es"><div className="es-i">🌍</div><p>No players yet</p></div>}
          </div>
          <div style={{ height: 20 }} />
        </div>}

        {activeTab === "profile" && <div className="scroll" style={{ paddingBottom: 100 }}>
          <div className="ph"><div className="ph-t">Profile</div><button className="btn-s" onClick={handleSignOut}>Sign Out</button></div>
          <div className="pr-hero" style={{ marginTop: 16 }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
              <label style={{ cursor: "pointer" }}>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
                <Avatar user={user} size={80} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, background: "var(--gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, border: "2px solid var(--bg)", cursor: "pointer" }}>
                  {uploading ? <span className="spin">⟳</span> : "📷"}
                </div>
              </label>
            </div>
            <div style={{ fontSize: 11, color: "var(--tx2)", marginBottom: 8 }}>Tap 📷 to change from gallery</div>
            <div className="pr-name">{user?.username}</div>
            <div className="pr-lbadge" style={{ background: `${getLevelTitle(user?.level || 1).color}22`, color: getLevelTitle(user?.level || 1).color }}>{getLevelTitle(user?.level || 1).title} · Level {user?.level || 1}</div>
            <div className="pr-chips">
              <div className="chip">🪙 {(user?.coins || 0).toLocaleString()}</div>
              <div className="chip" style={{ color: getRespectRank(user?.respect || 0).color }}>{getRespectRank(user?.respect || 0).rank} Tier</div>
              <div className="chip">🌍 Rank #{userRank > 0 ? userRank : "-"}</div>
            </div>
            <div className="pr-sgrid">
              <div className="pr-stat"><div className="pr-stv">{(user?.respect || 0).toLocaleString()}</div><div className="pr-stl">Respect</div></div>
              <div className="pr-stat"><div className="pr-stv">{user?.games_played || 0}</div><div className="pr-stl">Matches</div></div>
              <div className="pr-stat"><div className="pr-stv" style={{ color: "var(--green)" }}>{user?.wins || 0}</div><div className="pr-stl">Wins</div></div>
            </div>
          </div>
          <div style={{ padding: "14px 20px 10px" }}>
            <div className="ai-card" style={{ margin: 0 }}>
              <div className="ai-lbl">✦ AI Performance Analysis</div>
              <div className="ai-t">{(user?.games_played || 0) > 0 ? <>Win rate: <strong style={{ color: "var(--gold)" }}>{Math.round(((user?.wins || 0) / (user?.games_played || 1)) * 100)}%</strong>. {(user?.wins || 0) > 5 ? "Above average! Push into higher-stakes tournaments." : "More matches = faster Respect growth. Keep going!"}</> : "Play your first match to unlock AI performance insights!"}</div>
            </div>
          </div>
          <div style={{ padding: "0 20px 14px", marginTop: 10 }}><button className="btn-p" onClick={handleSimMatch}>⚡ Simulate Match & Earn Respect</button></div>
          <div className="stitle"><span>Match History</span></div>
          <div className="mh">
            {!(user?.match_history?.length) ? <div className="es"><div className="es-i">🎮</div><p>No matches yet. Get in the arena!</p></div> :
              user.match_history.map(m => <div key={m.id} className="mi">
                <div className={`mr ${m.result}`}>{m.result === "win" ? "W" : "L"}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{m.game}</div><div style={{ fontSize: 11, color: "var(--tx2)" }}>#{m.placement} place · {m.kills} kills · {m.date}</div></div>
                <div className="mi-rp" style={{ color: m.rpChange > 0 ? "var(--green)" : "var(--red)" }}>{m.rpChange > 0 ? "+" : ""}{m.rpChange} RP</div>
              </div>)}
          </div>
        </div>}

        {activeTab === "create" && <div className="crpage">
          <div style={{ marginBottom: 18 }}><div className="ph-t">Host a Tournament</div><div style={{ fontSize: 13, color: "var(--tx2)", marginTop: 4 }}>Costs 500 Retou Coins to host</div></div>
          <div className="crform">
            <div className="fg"><label className="flbl">Tournament Name</label><input className="finp" placeholder="e.g. Night Raiders Cup" value={cf.name} onChange={e => setCf(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="fst">Select Game</div>
            <div className="gsel-grid">{GAMES.map(g => <div key={g.id} className={`gso${cf.game === g.id ? " sel" : ""}`} onClick={() => setCf(p => ({ ...p, game: g.id }))}><div className="gso-icon">{g.icon}</div><div className="gso-name">{g.name}</div></div>)}</div>
            <div className="fst">Details</div>
            <div className="frow">
              <div className="fg"><label className="flbl">Entry Fee</label><input className="finp" type="number" value={cf.entryFee} onChange={e => setCf(p => ({ ...p, entryFee: e.target.value }))} /></div>
              <div className="fg"><label className="flbl">Prize Pool</label><input className="finp" type="number" value={cf.prize} onChange={e => setCf(p => ({ ...p, prize: e.target.value }))} /></div>
            </div>
            <div className="frow">
              <div className="fg"><label className="flbl">Max Players</label><input className="finp" type="number" value={cf.maxPlayers} onChange={e => setCf(p => ({ ...p, maxPlayers: e.target.value }))} /></div>
              <div className="fg"><label className="flbl">Mode</label><select className="finp" value={cf.mode} onChange={e => setCf(p => ({ ...p, mode: e.target.value }))}><option>Solo</option><option>Duos</option><option>Squad</option><option>Custom</option></select></div>
            </div>
            <div className="fg"><label className="flbl">Description</label><input className="finp" placeholder="Describe your tournament..." value={cf.description} onChange={e => setCf(p => ({ ...p, description: e.target.value }))} /></div>
            <div style={{ marginTop: 6 }}><button className="btn-p" onClick={handleCreate}>Create Tournament · 500 coins</button></div>
          </div>
        </div>}

        {activeTab === "admin" && isAdmin && <div className="adpage">
          <div className="ad-hdr"><div style={{ fontSize: 10, fontWeight: 700, color: "var(--red)", background: "rgba(255,92,92,.15)", padding: "3px 9px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 1, display: "inline-block", marginBottom: 8 }}>🔐 Admin Panel</div><div style={{ fontSize: 19, fontWeight: 800, marginTop: 6 }}>Control Center</div><div style={{ fontSize: 12, color: "var(--tx2)", marginTop: 2 }}>RebelWasTakenAway</div></div>
          <div className="sgrid">
            <div className="scard"><div className="scard-v">{players.length}</div><div className="scard-l">Players</div></div>
            <div className="scard"><div className="scard-v">{tournaments.length}</div><div className="scard-l">Tournaments</div></div>
            <div className="scard"><div className="scard-v">{tournaments.filter(t => t.status === "live").length}</div><div className="scard-l">Live Now</div></div>
            <div className="scard"><div className="scard-v">{tournaments.reduce((a, t) => a + (t.players || []).length, 0)}</div><div className="scard-l">Registrations</div></div>
          </div>
          <div className="atable">
            <div className="atblh"><span>All Players</span><span style={{ color: "var(--tx3)" }}>{players.length} total</span></div>
            {players.filter(p => p.username !== ADMIN_USERNAME).map(p => <div key={p.id} className="arow">
              <Avatar user={p} size={32} />
              <div style={{ flex: 1, marginLeft: 6 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{p.username}</div><div style={{ fontSize: 11, color: "var(--tx2)" }}>Lv.{p.level || 1} · {(p.respect || 0).toLocaleString()} RP · {(p.coins || 0).toLocaleString()} coins</div></div>
              <div style={{ display: "flex", gap: 5 }}>
                <button className="abtn g" onClick={async () => { await supabase.from("users").update({ coins: (p.coins || 0) + 1000 }).eq("id", p.id); showToast(`+1000 coins to ${p.username}`); }}>+Coins</button>
                <button className="abtn g" onClick={async () => { await supabase.from("users").update({ respect: (p.respect || 0) + 500 }).eq("id", p.id); showToast(`+500 RP to ${p.username}`); }}>+RP</button>
              </div>
            </div>)}
          </div>
          <div className="atable">
            <div className="atblh"><span>Tournaments</span></div>
            {tournaments.map(t => { const g = GAMES.find(x => x.id === t.game); return <div key={t.id} className="arow"><div style={{ fontSize: 17 }}>{g?.icon}</div><div style={{ flex: 1, marginLeft: 6 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: 11, color: "var(--tx2)" }}>{(t.players || []).length}/{t.max_players} · {t.status}</div></div><div style={{ display: "flex", gap: 5 }}><button className="abtn g" onClick={async () => { const next = t.status === "open" ? "live" : t.status === "live" ? "ended" : "open"; await supabase.from("tournaments").update({ status: next }).eq("id", t.id); showToast(`Status → ${next}`); }}>Toggle</button><button className="abtn d" onClick={async () => { await supabase.from("tournaments").delete().eq("id", t.id); showToast("Deleted"); }}>Delete</button></div></div>; })}
          </div>
        </div>}

        {selectedT && <div className="mov" onClick={() => setSelectedT(null)}>
          <div className="mod" onClick={e => e.stopPropagation()}>
            <div className="mod-h" />
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
              <span style={{ fontSize: 26 }}>{GAMES.find(g => g.id === selectedT.game)?.icon}</span>
              <div className={`tcs ${selectedT.status}`}>{selectedT.status === "live" ? "🔴 LIVE" : selectedT.status === "ended" ? "ENDED" : "OPEN"}</div>
            </div>
            <div className="mod-t">{selectedT.name}</div>
            <div style={{ color: "var(--tx2)", fontSize: 13, marginBottom: 18, lineHeight: 1.65 }}>{selectedT.description || "No description."}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[["🎮 Game", GAMES.find(g => g.id === selectedT.game)?.name], ["⚔️ Mode", selectedT.mode], ["👥 Players", `${(selectedT.players || []).length}/${selectedT.max_players}`], ["🕐 Start", selectedT.start_time], ["🪙 Entry", `${selectedT.entry_fee} coins`], ["🏆 Prize", `${(selectedT.prize || 0).toLocaleString()} coins`]].map(([l, v]) => (
                <div key={l} style={{ background: "var(--s2)", borderRadius: 8, padding: 11 }}><div style={{ fontSize: 10, color: "var(--tx3)", marginBottom: 3 }}>{l}</div><div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div></div>
              ))}
            </div>
            <button className="jbtn" style={{ width: "100%", padding: 14, fontSize: 14, borderRadius: 9 }} disabled={(selectedT.players || []).includes(user?.id) || selectedT.status === "ended"} onClick={() => handleJoin(selectedT)}>
              {(selectedT.players || []).includes(user?.id) ? "✓ Already Joined" : selectedT.status === "ended" ? "Tournament Ended" : `Join · ${selectedT.entry_fee} coins`}
            </button>
          </div>
        </div>}

        <div className="bnav">
          {[{ id: "home", icon: "🏠", label: "Home" }, { id: "tournaments", icon: "⚔️", label: "Compete" }, { id: "create", icon: "➕", label: "Host" }, { id: "leaderboard", icon: "🌍", label: "Rankings" }, { id: "profile", icon: "👤", label: "Profile" }, ...(isAdmin ? [{ id: "admin", icon: "🔐", label: "Admin" }] : [])].map(n => (
            <button key={n.id} className={`ni${activeTab === n.id ? " active" : ""}`} onClick={() => setActiveTab(n.id)}>
              <span className="ni-icon">{n.icon}</span><span className="ni-lbl">{n.label}</span>
            </button>
          ))}
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
