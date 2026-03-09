import { useState, useEffect, useRef } from "react";

const COLORS = ["#e67e22","#2980b9","#8e44ad","#27ae60","#c0392b","#16a085","#d35400","#1abc9c","#e74c3c","#f39c12","#3498db","#9b59b6"];

const DEPS = [
  { id:"general",   name:"General",          color:"#4f8ef7" },
  { id:"rh",        name:"Recursos Humanos",  color:"#e67e22" },
  { id:"tech",      name:"Tecnologia",        color:"#2980b9" },
  { id:"marketing", name:"Marketing",         color:"#8e44ad" },
  { id:"finanzas",  name:"Finanzas",          color:"#27ae60" },
  { id:"ops",       name:"Operaciones",       color:"#c0392b" },
  { id:"ventas",    name:"Ventas",            color:"#16a085" },
  { id:"legal",     name:"Legal",             color:"#d35400" },
];

const DEF_USERS = [
  { id:1, name:"Administrador",  area:"Direccion",        role:"Admin",     pass:"admin1234", admin:true,  color:"#7c3aed" },
  { id:2, name:"Ana Garcia",     area:"Recursos Humanos", role:"Gerente",   pass:"1234",      admin:false, color:"#e67e22" },
  { id:3, name:"Carlos Mendoza", area:"Tecnologia",       role:"Dev",       pass:"1234",      admin:false, color:"#2980b9" },
];

const DEF_MSGS = { general:[{ id:1, uid:1, text:"Bienvenidos a IntraConnect! Esta es la plataforma de comunicacion interna.", time:"09:00" }] };

const DEF_ANNS = [{ id:1, title:"Bienvenidos a IntraConnect!", body:"Ya no usaremos WhatsApp para temas de trabajo. Toda comunicacion laboral se hace aqui.", author:"Administrador", area:"Direccion", time:"09:00", urgent:false }];

function ls(key, def) {
  try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch(e) { return def; }
}
function sv(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}
function initials(name) {
  return name.split(" ").map(function(w){ return w[0] || ""; }).join("").slice(0,2).toUpperCase();
}
function col(u) { return u.color || COLORS[u.id % COLORS.length]; }

function Av({ u, sz }) {
  sz = sz || 36;
  var c = col(u);
  return (
    <div style={{ width:sz, height:sz, borderRadius:"50%", flexShrink:0, background:"linear-gradient(135deg,"+c+"88,"+c+")", display:"flex", alignItems:"center", justifyContent:"center", fontSize:sz*0.33, fontWeight:800, color:"#fff", userSelect:"none" }}>
      {initials(u.name)}
    </div>
  );
}

/* =========================================================
   LOGIN
   ========================================================= */
function Login({ users, onLogin }) {
  var [nm, setNm] = useState("");
  var [pw, setPw] = useState("");
  var [err, setErr] = useState("");
  var [busy, setBusy] = useState(false);

  function go() {
    if (!nm.trim() || !pw.trim()) { setErr("Escribe tu nombre y contrasena."); return; }
    setBusy(true); setErr("");
    setTimeout(function() {
      var found = null;
      for (var i = 0; i < users.length; i++) {
        var u = users[i];
        var first = u.name.split(" ")[0].toLowerCase();
        if (u.name.toLowerCase() === nm.trim().toLowerCase() || first === nm.trim().toLowerCase()) {
          found = u; break;
        }
      }
      if (!found) { setErr("Usuario no encontrado. Verifica tu nombre."); setBusy(false); return; }
      if (found.pass !== pw.trim()) { setErr("Contrasena incorrecta."); setBusy(false); return; }
      onLogin(found);
    }, 500);
  }

  var inp = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:9, padding:"11px 13px", color:"#f1f5f9", fontSize:14, outline:"none", fontFamily:"inherit", marginBottom:12 };

  return (
    <div style={{ minHeight:"100vh", background:"#060d1a", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:56, height:56, borderRadius:16, margin:"0 auto 14px", background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, boxShadow:"0 8px 28px rgba(79,142,247,0.4)" }}>IC</div>
          <div style={{ color:"#f1f5f9", fontSize:24, fontWeight:800, letterSpacing:"-0.3px" }}>IntraConnect</div>
          <div style={{ color:"#475569", fontSize:13, marginTop:4 }}>Comunicacion interna corporativa</div>
        </div>
        <div style={{ background:"rgba(13,20,38,0.97)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:18, padding:"28px 24px", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ marginBottom:18 }}>
            <div style={{ color:"#334155", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Clic rapido en tu nombre:</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {users.filter(function(u){ return !u.admin; }).slice(0,6).map(function(u) {
                return (
                  <button key={u.id} onClick={function(){ setNm(u.name.split(" ")[0]); setPw(u.pass); }}
                    style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:7, padding:"4px 10px", color:"#94a3b8", fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
                    {u.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Nombre de usuario</div>
          <input style={inp} value={nm} onChange={function(e){ setNm(e.target.value); }} placeholder="Tu primer nombre" onKeyDown={function(e){ if(e.key==="Enter") go(); }} />
          <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Contrasena</div>
          <input style={{ ...inp, marginBottom: err ? 0 : 4 }} type="password" value={pw} onChange={function(e){ setPw(e.target.value); }} placeholder="........" onKeyDown={function(e){ if(e.key==="Enter") go(); }} />
          {err && <div style={{ background:"rgba(231,76,60,0.1)", border:"1px solid rgba(231,76,60,0.3)", borderRadius:8, padding:"9px 12px", color:"#fc8181", fontSize:13, margin:"10px 0" }}>{err}</div>}
          <button onClick={go} disabled={busy} style={{ width:"100%", padding:13, borderRadius:11, border:"none", background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginTop:14, opacity:busy?0.7:1 }}>
            {busy ? "Verificando..." : "Ingresar"}
          </button>
        </div>
        <div style={{ textAlign:"center", color:"#1e293b", fontSize:12, marginTop:14 }}>Problemas? Contacta al Administrador.</div>
      </div>
    </div>
  );
}

/* =========================================================
   PANEL ADMIN
   ========================================================= */
function Admin({ users, setUsers, close }) {
  var [tab, setTab] = useState("list");
  var [nm, setNm]   = useState("");
  var [ar, setAr]   = useState("general");
  var [rl, setRl]   = useState("");
  var [pw, setPw]   = useState("1234");
  var [eid, setEid] = useState(null);
  var [msg, setMsg] = useState(null); // { ok:bool, text:str }

  function flash(ok, text) { setMsg({ ok:ok, text:text }); setTimeout(function(){ setMsg(null); }, 3000); }
  function depName(id) { for(var i=0;i<DEPS.length;i++) if(DEPS[i].id===id) return DEPS[i].name; return id; }

  function save() {
    if (!nm.trim() || !rl.trim()) { flash(false, "Nombre y cargo son obligatorios."); return; }
    var area = depName(ar);
    var next;
    if (eid) {
      next = users.map(function(u){ return u.id===eid ? Object.assign({},u,{name:nm.trim(),area:area,role:rl.trim(),pass:pw||"1234"}) : u; });
      flash(true, "Empleado actualizado correctamente.");
    } else {
      var c = COLORS[users.length % COLORS.length];
      next = users.concat([{ id:Date.now(), name:nm.trim(), area:area, role:rl.trim(), pass:pw||"1234", color:c, admin:false }]);
      flash(true, "Empleado registrado.");
    }
    setUsers(next); sv("ic_u", next);
    setNm(""); setRl(""); setPw("1234"); setEid(null); setTab("list");
  }

  function del(id) {
    if (!window.confirm("Eliminar este empleado?")) return;
    var next = users.filter(function(u){ return u.id!==id; });
    setUsers(next); sv("ic_u", next);
  }

  function edit(u) {
    var did = "general";
    for(var i=0;i<DEPS.length;i++) if(DEPS[i].name===u.area){ did=DEPS[i].id; break; }
    setNm(u.name); setAr(did); setRl(u.role); setPw(u.pass); setEid(u.id); setTab("add");
  }

  var staff = users.filter(function(u){ return !u.admin; });
  var iS = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"9px 11px", color:"#f1f5f9", fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:10 };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#0b1424", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, width:"100%", maxWidth:500, maxHeight:"88vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"15px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <div style={{ color:"#f1f5f9", fontWeight:800, fontSize:15 }}>Panel de Administrador</div>
            <div style={{ color:"#475569", fontSize:12 }}>Gestion de empleados</div>
          </div>
          <button onClick={close} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:7, padding:"5px 12px", color:"#64748b", cursor:"pointer", fontSize:15, fontFamily:"inherit" }}>X</button>
        </div>

        <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 6px" }}>
          {[{id:"list",l:"Empleados ("+staff.length+")"},{id:"add",l:eid?"Editar":"Nuevo empleado"}].map(function(t){
            return (
              <button key={t.id} onClick={function(){ setTab(t.id); if(t.id==="list"){setEid(null);setNm("");setRl("");setPw("1234");} }}
                style={{ background:"transparent", border:"none", borderBottom:tab===t.id?"2px solid #4f8ef7":"2px solid transparent", color:tab===t.id?"#4f8ef7":"#475569", padding:"9px 13px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                {t.l}
              </button>
            );
          })}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }}>
          {msg && (
            <div style={{ background:msg.ok?"rgba(46,204,113,0.1)":"rgba(231,76,60,0.1)", border:"1px solid "+(msg.ok?"rgba(46,204,113,0.3)":"rgba(231,76,60,0.3)"), borderRadius:8, padding:"9px 12px", color:msg.ok?"#2ecc71":"#fc8181", fontSize:13, marginBottom:12 }}>
              {msg.text}
            </div>
          )}

          {tab==="list" && (
            <div>
              {staff.length===0 && (
                <div style={{ textAlign:"center", color:"#334155", padding:"28px 0" }}>
                  No hay empleados registrados.
                  <br/>
                  <button onClick={function(){ setTab("add"); }} style={{ marginTop:10, background:"rgba(79,142,247,0.1)", border:"1px solid rgba(79,142,247,0.25)", borderRadius:8, padding:"7px 14px", color:"#4f8ef7", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Agregar primero</button>
                </div>
              )}
              {staff.map(function(u){
                return (
                  <div key={u.id} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:11, padding:"11px 13px", marginBottom:8 }}>
                    <Av u={u} sz={36} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:14 }}>{u.name}</div>
                      <div style={{ color:"#475569", fontSize:12 }}>{u.role} - {u.area}</div>
                      <div style={{ color:"#334155", fontSize:11 }}>Contrasena: <span style={{ color:"#4f8ef7", fontFamily:"monospace" }}>{u.pass}</span></div>
                    </div>
                    <div style={{ display:"flex", gap:5 }}>
                      <button onClick={function(){ edit(u); }} style={{ background:"rgba(79,142,247,0.1)", border:"1px solid rgba(79,142,247,0.2)", borderRadius:7, padding:"5px 9px", color:"#4f8ef7", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Editar</button>
                      <button onClick={function(){ del(u.id); }} style={{ background:"rgba(231,76,60,0.08)", border:"1px solid rgba(231,76,60,0.2)", borderRadius:7, padding:"5px 9px", color:"#fc8181", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Borrar</button>
                    </div>
                  </div>
                );
              })}
              <button onClick={function(){ setTab("add"); }} style={{ width:"100%", marginTop:6, padding:"10px", borderRadius:9, border:"1px dashed rgba(79,142,247,0.3)", background:"rgba(79,142,247,0.04)", color:"#4f8ef7", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                + Agregar nuevo empleado
              </button>
            </div>
          )}

          {tab==="add" && (
            <div>
              <div style={{ color:"#64748b", fontSize:13, marginBottom:14 }}>{eid?"Modifica los datos del empleado.":"Completa el formulario para agregar un colaborador."}</div>
              <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Nombre completo *</div>
              <input style={iS} value={nm} onChange={function(e){setNm(e.target.value);}} placeholder="Ej: Juan Perez" />
              <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Area *</div>
              <select style={{ ...iS, cursor:"pointer" }} value={ar} onChange={function(e){setAr(e.target.value);}}>
                {DEPS.map(function(d){ return <option key={d.id} value={d.id}>{d.name}</option>; })}
              </select>
              <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Cargo / Puesto *</div>
              <input style={iS} value={rl} onChange={function(e){setRl(e.target.value);}} placeholder="Ej: Ejecutivo de Ventas" />
              <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Contrasena</div>
              <input style={{ ...iS, marginBottom:20 }} value={pw} onChange={function(e){setPw(e.target.value);}} placeholder="Por defecto: 1234" />
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={save} style={{ flex:1, padding:"11px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  {eid ? "Guardar cambios" : "Registrar empleado"}
                </button>
                {eid && <button onClick={function(){ setEid(null);setNm("");setRl("");setPw("1234");setTab("list"); }} style={{ padding:"11px 14px", borderRadius:9, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#64748b", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Cancelar</button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   APP PRINCIPAL
   ========================================================= */
export default function App() {
  var [users, setUsers]  = useState(function(){ return ls("ic_u", DEF_USERS); });
  var [msgs,  setMsgs]   = useState(function(){ return ls("ic_m", DEF_MSGS);  });
  var [dms,   setDms]    = useState(function(){ return ls("ic_d", {});         });
  var [anns,  setAnns]   = useState(function(){ return ls("ic_a", DEF_ANNS);  });
  var [me,    setMe]     = useState(null);
  var [sec,   setSec]    = useState("chat");
  var [chan,  setChan]   = useState("general");
  var [dmu,   setDmu]    = useState(null);
  var [side,  setSide]   = useState("ch");
  var [txt,   setTxt]    = useState("");
  var [adm,   setAdm]    = useState(false);
  var [prof,  setProf]   = useState(false);
  var [atit,  setAtit]   = useState("");
  var [abod,  setAbod]   = useState("");
  var [aurg,  setAurg]   = useState(false);
  var bot = useRef(null);
  var inp = useRef(null);

  useEffect(function(){ sv("ic_u",users); },[users]);
  useEffect(function(){ sv("ic_m",msgs);  },[msgs]);
  useEffect(function(){ sv("ic_d",dms);   },[dms]);
  useEffect(function(){ sv("ic_a",anns);  },[anns]);
  useEffect(function(){
    var t=setTimeout(function(){ if(bot.current) bot.current.scrollIntoView({behavior:"smooth"}); },60);
    return function(){ clearTimeout(t); };
  },[msgs,dms,chan,dmu]);

  if (!me) return <Login users={users} onLogin={function(u){ setMe(u); }} />;

  function send() {
    var t = txt.trim(); if (!t) return;
    var m = { id:Date.now(), uid:me.id, text:t, time:new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}) };
    if (dmu) {
      var k = [me.id,dmu.id].sort(function(a,b){return a-b;}).join("_");
      setDms(function(p){ var n=Object.assign({},p); n[k]=(p[k]||[]).concat([m]); return n; });
    } else {
      setMsgs(function(p){ var n=Object.assign({},p); n[chan]=(p[chan]||[]).concat([m]); return n; });
    }
    setTxt(""); setTimeout(function(){ if(inp.current) inp.current.focus(); },30);
  }

  function pub() {
    if (!atit.trim()||!abod.trim()) return;
    var a={ id:Date.now(), title:atit.trim(), body:abod.trim(), author:me.name, area:me.area||"Empresa", time:new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}), urgent:aurg };
    setAnns(function(p){ return [a].concat(p); });
    setAtit(""); setAbod(""); setAurg(false);
  }

  function byId(id){ for(var i=0;i<users.length;i++) if(users[i].id===id) return users[i]; return null; }
  function dk(a,b){ return [a,b].sort(function(x,y){return x-y;}).join("_"); }

  var cmsg = dmu ? (dms[dk(me.id,dmu.id)]||[]) : (msgs[chan]||[]);
  var dep  = null; for(var i=0;i<DEPS.length;i++) if(DEPS[i].id===chan){ dep=DEPS[i]; break; }
  var stf  = users.filter(function(u){ return !u.admin; });

  function sb(act){ return { width:"100%", display:"flex", alignItems:"center", gap:10, padding:"7px 11px", background:act?"rgba(79,142,247,0.1)":"transparent", border:"none", cursor:"pointer", textAlign:"left", borderLeft:act?"3px solid #4f8ef7":"3px solid transparent", fontFamily:"inherit" }; }
  function nb(act){ return { background:act?"rgba(79,142,247,0.12)":"transparent", border:act?"1px solid rgba(79,142,247,0.25)":"1px solid transparent", color:act?"#4f8ef7":"#64748b", borderRadius:7, padding:"5px 11px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }; }

  var is = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:7, padding:"8px 11px", color:"#f1f5f9", fontSize:13, outline:"none", fontFamily:"inherit" };

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"#060d1a", fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}textarea{resize:none}@keyframes su{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}"}</style>

      {adm && <Admin users={users} setUsers={setUsers} close={function(){ setAdm(false); }} />}

      {/* ── NAV ── */}
      <div style={{ height:50, background:"rgba(6,11,21,0.99)", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", padding:"0 12px", gap:8, flexShrink:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginRight:6 }}>
          <div style={{ width:24, height:24, borderRadius:6, background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", fontWeight:800 }}>IC</div>
          <span style={{ color:"#f1f5f9", fontWeight:800, fontSize:14 }}>IntraConnect</span>
        </div>
        <button onClick={function(){setSec("chat");}}          style={nb(sec==="chat")}>Mensajes</button>
        <button onClick={function(){setSec("announcements");}} style={nb(sec==="announcements")}>Anuncios</button>
        <button onClick={function(){setSec("directory");}}     style={nb(sec==="directory")}>Directorio</button>
        <div style={{ flex:1 }} />
        {me.admin && <button onClick={function(){setAdm(true);}} style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:7, padding:"5px 11px", color:"#a78bfa", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Admin</button>}
        <div style={{ position:"relative" }}>
          <button onClick={function(){setProf(function(p){return !p;});}} style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:9, padding:"4px 9px 4px 4px", cursor:"pointer" }}>
            <Av u={me} sz={24} />
            <span style={{ color:"#e2e8f0", fontSize:12, fontWeight:700 }}>{me.name.split(" ")[0]}</span>
          </button>
          {prof && (
            <div>
              <div onClick={function(){setProf(false);}} style={{ position:"fixed", inset:0, zIndex:150 }} />
              <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, zIndex:200, background:"#0b1424", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:14, width:190, boxShadow:"0 12px 40px rgba(0,0,0,0.6)" }}>
                <div style={{ display:"flex", gap:9, marginBottom:12 }}>
                  <Av u={me} sz={36} />
                  <div>
                    <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>{me.name}</div>
                    <div style={{ color:"#475569", fontSize:11 }}>{me.admin?"Administrador":me.role}</div>
                  </div>
                </div>
                {me.admin && <button onClick={function(){setAdm(true);setProf(false);}} style={{ width:"100%", marginBottom:7, padding:"8px", borderRadius:7, border:"none", background:"rgba(124,58,237,0.1)", color:"#a78bfa", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Panel Admin</button>}
                <button onClick={function(){setMe(null);setProf(false);}} style={{ width:"100%", padding:"8px", borderRadius:7, border:"none", background:"rgba(231,76,60,0.1)", color:"#fc8181", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Cerrar sesion</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ========== CHAT ========== */}
        {sec==="chat" && (
          <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

            {/* sidebar */}
            <div style={{ width:215, background:"rgba(5,9,18,0.98)", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", flexShrink:0 }}>
              <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"4px 4px 0" }}>
                {[{id:"ch",l:"Areas"},{id:"dm",l:"Directos"}].map(function(t){
                  return <button key={t.id} onClick={function(){setSide(t.id);}} style={{ flex:1, padding:"7px", background:"transparent", border:"none", borderBottom:side===t.id?"2px solid #4f8ef7":"2px solid transparent", color:side===t.id?"#4f8ef7":"#475569", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{t.l}</button>;
                })}
              </div>
              <div style={{ flex:1, overflowY:"auto", padding:"4px 0" }}>
                {side==="ch" ? (
                  <div>
                    <div style={{ padding:"7px 11px 3px", color:"#1e293b", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Canales</div>
                    {DEPS.map(function(d){
                      var cnt=(msgs[d.id]||[]).length, act=!dmu&&chan===d.id;
                      return (
                        <button key={d.id} onClick={function(){setChan(d.id);setDmu(null);}} style={sb(act)}>
                          <div style={{ width:18, height:18, borderRadius:4, background:d.color+"20", fontSize:8, fontWeight:800, color:d.color, display:"flex", alignItems:"center", justifyContent:"center" }}>{d.id.slice(0,3).toUpperCase()}</div>
                          <span style={{ color:act?"#e2e8f0":"#64748b", fontSize:12, fontWeight:act?700:500 }}>{d.name}</span>
                          {cnt>0 && <span style={{ marginLeft:"auto", color:"#334155", fontSize:10 }}>{cnt}</span>}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <div style={{ padding:"7px 11px 3px", color:"#1e293b", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Empleados ({stf.length})</div>
                    {stf.map(function(u){
                      var k=dk(me.id,u.id), act=dmu?dmu.id===u.id:false;
                      return (
                        <button key={u.id} onClick={function(){setDmu(u);setChan(null);}} style={sb(act)}>
                          <Av u={u} sz={26} />
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ color:act?"#e2e8f0":"#64748b", fontSize:12, fontWeight:600, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{u.name}</div>
                            <div style={{ color:"#1e293b", fontSize:10 }}>{u.area}</div>
                          </div>
                          {(dms[k]||[]).length>0 && <span style={{ color:"#334155", fontSize:10 }}>{(dms[k]||[]).length}</span>}
                        </button>
                      );
                    })}
                    {stf.length===0 && <div style={{ padding:"14px 11px", color:"#334155", fontSize:12 }}>Sin empleados registrados.</div>}
                  </div>
                )}
              </div>
            </div>

            {/* chat panel */}
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
              <div style={{ padding:"9px 15px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(8,13,24,0.8)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                {dmu ? (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <Av u={dmu} sz={30} />
                    <div>
                      <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>{dmu.name}</div>
                      <div style={{ color:"#475569", fontSize:11 }}>{dmu.role} - {dmu.area}</div>
                    </div>
                  </div>
                ) : dep ? (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, background:dep.color+"15", border:"1px solid "+dep.color+"25", color:dep.color }}>{dep.id.slice(0,3).toUpperCase()}</div>
                    <div>
                      <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>#{dep.name}</div>
                      <div style={{ color:"#475569", fontSize:11 }}>{(msgs[chan]||[]).length} mensajes</div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div style={{ flex:1, overflowY:"auto", padding:"10px 13px", display:"flex", flexDirection:"column" }}>
                {cmsg.length===0 && (
                  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#1e293b", gap:8 }}>
                    <div style={{ fontSize:32 }}>💬</div>
                    <div style={{ color:"#334155", fontSize:14, fontWeight:700 }}>{dmu?"Inicia conversacion con "+dmu.name.split(" ")[0]:"Canal #"+(dep?dep.name:"")}</div>
                    <div style={{ color:"#1e293b", fontSize:13 }}>Escribe el primer mensaje abajo</div>
                  </div>
                )}
                {cmsg.map(function(m, idx){
                  var sndr=byId(m.uid); if(!sndr) return null;
                  var isMe=m.uid===me.id;
                  var grp=idx>0&&cmsg[idx-1].uid===m.uid;
                  return (
                    <div key={m.id} style={{ display:"flex", gap:8, alignItems:"flex-end", flexDirection:isMe?"row-reverse":"row", marginTop:grp?2:10, animation:"su 0.18s ease" }}>
                      {!grp ? <Av u={sndr} sz={26} /> : <div style={{ width:26, flexShrink:0 }} />}
                      <div style={{ maxWidth:"72%" }}>
                        {!grp && (
                          <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:3, flexDirection:isMe?"row-reverse":"row" }}>
                            <span style={{ color:col(sndr), fontSize:12, fontWeight:700 }}>{isMe?"Tu":sndr.name}</span>
                            <span style={{ color:"#1e293b", fontSize:11 }}>{m.time}</span>
                          </div>
                        )}
                        <div style={{ background:isMe?"linear-gradient(135deg,#4f8ef7,#7c3aed)":"rgba(255,255,255,0.06)", borderRadius:isMe?"12px 3px 12px 12px":"3px 12px 12px 12px", padding:"9px 12px", color:"#e2e8f0", fontSize:14, lineHeight:1.5, border:isMe?"none":"1px solid rgba(255,255,255,0.07)", wordBreak:"break-word" }}>
                          {m.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bot} />
              </div>

              <div style={{ padding:"8px 12px", borderTop:"1px solid rgba(255,255,255,0.06)", background:"rgba(6,10,19,0.98)", flexShrink:0 }}>
                <div style={{ display:"flex", gap:8, alignItems:"flex-end", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 6px 6px 12px" }}>
                  <textarea ref={inp} value={txt} rows={1}
                    onChange={function(e){setTxt(e.target.value);}}
                    onKeyDown={function(e){ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
                    placeholder={dmu?"Mensaje a "+dmu.name.split(" ")[0]+"...":"Escribe en #"+(dep?dep.name:"")+"..."}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#f1f5f9", fontSize:14, lineHeight:1.5, fontFamily:"inherit", maxHeight:80, overflowY:"auto" }}
                  />
                  <button onClick={send} style={{ width:30, height:30, borderRadius:7, border:"none", flexShrink:0, background:txt.trim()?"linear-gradient(135deg,#4f8ef7,#7c3aed)":"rgba(255,255,255,0.05)", color:txt.trim()?"#fff":"#334155", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>
                    &gt;
                  </button>
                </div>
                <div style={{ color:"#1e293b", fontSize:11, marginTop:4, textAlign:"center" }}>Enter = enviar | Shift+Enter = nueva linea</div>
              </div>
            </div>
          </div>
        )}

        {/* ========== ANUNCIOS ========== */}
        {sec==="announcements" && (
          <div style={{ flex:1, overflowY:"auto", padding:22 }}>
            <div style={{ maxWidth:640, margin:"0 auto" }}>
              <div style={{ color:"#f1f5f9", fontSize:20, fontWeight:800, marginBottom:4 }}>Tablero de Anuncios</div>
              <div style={{ color:"#475569", fontSize:13, marginBottom:20 }}>Comunicados y avisos oficiales</div>
              {anns.map(function(a){
                return (
                  <div key={a.id} style={{ background:"rgba(11,18,34,0.95)", border:"1px solid "+(a.urgent?"rgba(231,76,60,0.3)":"rgba(255,255,255,0.07)"), borderRadius:12, padding:16, marginBottom:12, borderLeft:"4px solid "+(a.urgent?"#e74c3c":"#4f8ef7") }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        {a.urgent && <span style={{ background:"rgba(231,76,60,0.12)", color:"#fc8181", borderRadius:5, padding:"1px 7px", fontSize:11, fontWeight:700 }}>URGENTE</span>}
                        <div style={{ color:"#f1f5f9", fontSize:14, fontWeight:700 }}>{a.title}</div>
                      </div>
                      <span style={{ color:"#334155", fontSize:11 }}>{a.time}</span>
                    </div>
                    <div style={{ color:"#94a3b8", fontSize:13, lineHeight:1.6, marginBottom:9 }}>{a.body}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", background:"#4f8ef7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", fontWeight:700 }}>{a.author.split(" ").map(function(w){return w[0];}).join("").slice(0,2)}</div>
                      <span style={{ color:"#64748b", fontSize:12 }}>{a.author}</span>
                      <span style={{ color:"#334155" }}>-</span>
                      <span style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", borderRadius:4, padding:"1px 7px", fontSize:11, fontWeight:600 }}>{a.area}</span>
                    </div>
                  </div>
                );
              })}
              {anns.length===0 && <div style={{ textAlign:"center", color:"#334155", padding:"36px 0" }}>No hay anuncios todavia.</div>}
              <div style={{ background:"rgba(11,18,34,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:16, marginTop:8 }}>
                <div style={{ color:"#94a3b8", fontSize:13, fontWeight:700, marginBottom:11 }}>Publicar nuevo anuncio</div>
                <input value={atit} onChange={function(e){setAtit(e.target.value);}} placeholder="Titulo..." style={{ ...is, marginBottom:8 }} />
                <textarea value={abod} onChange={function(e){setAbod(e.target.value);}} placeholder="Contenido del anuncio..." rows={3} style={{ ...is, marginBottom:9, resize:"vertical" }} />
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                  <label style={{ display:"flex", alignItems:"center", gap:6, color:"#94a3b8", fontSize:13, cursor:"pointer" }}>
                    <input type="checkbox" checked={aurg} onChange={function(e){setAurg(e.target.checked);}} />
                    {" Marcar como urgente"}
                  </label>
                  <button onClick={pub} style={{ background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", border:"none", borderRadius:8, padding:"8px 16px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Publicar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== DIRECTORIO ========== */}
        {sec==="directory" && (
          <div style={{ flex:1, overflowY:"auto", padding:22 }}>
            <div style={{ maxWidth:740, margin:"0 auto" }}>
              <div style={{ color:"#f1f5f9", fontSize:20, fontWeight:800, marginBottom:4 }}>Directorio de Empleados</div>
              <div style={{ color:"#475569", fontSize:13, marginBottom:20 }}>Todos los colaboradores registrados</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginBottom:20 }}>
                {[{l:"Total empleados",v:stf.length},{l:"Departamentos",v:DEPS.length}].map(function(s,i){
                  return <div key={i} style={{ background:"rgba(11,18,34,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"12px 14px" }}><div style={{ color:"#f1f5f9", fontSize:22, fontWeight:800 }}>{s.v}</div><div style={{ color:"#475569", fontSize:12 }}>{s.l}</div></div>;
                })}
              </div>
              {stf.length===0 && (
                <div style={{ textAlign:"center", color:"#334155", padding:"32px 0" }}>
                  No hay empleados.{" "}
                  {me.admin && <button onClick={function(){setAdm(true);}} style={{ color:"#4f8ef7", background:"none", border:"none", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Abrir panel Admin</button>}
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))", gap:10 }}>
                {stf.map(function(u){
                  return (
                    <div key={u.id} onClick={function(){setDmu(u);setSec("chat");setSide("dm");}}
                      style={{ background:"rgba(11,18,34,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:14, cursor:"pointer", transition:"border-color 0.15s" }}
                      onMouseOver={function(e){e.currentTarget.style.borderColor="rgba(79,142,247,0.3)";}}
                      onMouseOut={function(e){e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";}}>
                      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
                        <Av u={u} sz={36} />
                        <div style={{ minWidth:0 }}>
                          <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:700, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{u.name}</div>
                        </div>
                      </div>
                      <div style={{ background:col(u)+"15", border:"1px solid "+col(u)+"25", borderRadius:5, padding:"2px 7px", marginBottom:5, display:"inline-block" }}>
                        <span style={{ color:col(u), fontSize:11, fontWeight:700 }}>{u.area}</span>
                      </div>
                      <div style={{ color:"#475569", fontSize:12, marginBottom:9 }}>{u.role}</div>
                      <button onClick={function(e){e.stopPropagation();setDmu(u);setSec("chat");setSide("dm");}} style={{ width:"100%", padding:"6px", borderRadius:7, border:"none", background:"rgba(79,142,247,0.1)", color:"#4f8ef7", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                        Enviar mensaje
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}