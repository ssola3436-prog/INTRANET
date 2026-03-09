import { useState, useEffect, useRef } from "react";

const COLORS = [
  "#e67e22","#2980b9","#8e44ad","#27ae60",
  "#c0392b","#16a085","#d35400","#1abc9c",
  "#e74c3c","#f39c12","#3498db","#9b59b6"
];

const DEPARTMENTS = [
  { id: "general",   name: "General",          icon: "House",  color: "#4f8ef7" },
  { id: "rh",        name: "Recursos Humanos",  icon: "RH",     color: "#e67e22" },
  { id: "tech",      name: "Tecnologia",        icon: "TI",     color: "#2980b9" },
  { id: "marketing", name: "Marketing",         icon: "MKT",    color: "#8e44ad" },
  { id: "finanzas",  name: "Finanzas",          icon: "FIN",    color: "#27ae60" },
  { id: "ops",       name: "Operaciones",       icon: "OPS",    color: "#c0392b" },
  { id: "ventas",    name: "Ventas",            icon: "VEN",    color: "#16a085" },
  { id: "legal",     name: "Legal",             icon: "LEG",    color: "#d35400" },
];

const DEPT_EMOJI = {
  general:"building", rh:"people", tech:"laptop", marketing:"megaphone",
  finanzas:"money", ops:"gear", ventas:"chart", legal:"law"
};

const EMOJI = {
  building:"\uD83C\uDFE2", people:"\uD83D\uDC65", laptop:"\uD83D\uDCBB",
  megaphone:"\uD83D\uDCE2", money:"\uD83D\uDCB0", gear:"\u2699\uFE0F",
  chart:"\uD83D\uDCC8", law:"\u2696\uFE0F", link:"\uD83D\uDD17",
  bell:"\uD83D\uDD14", lock:"\uD83D\uDD12", mail:"\uD83D\uDCEC",
  check:"\u2705", warn:"\u26A0\uFE0F", trash:"\uD83D\uDDD1\uFE0F",
  pencil:"\u270F\uFE0F", door:"\uD83D\uDEAA", ok:"\uD83D\uDC4D"
};

const DEFAULT_USERS = [
  { id:1, name:"Administrador",  area:"Direccion",        role:"Admin del Sistema", password:"admin1234", isAdmin:true,  color:"#7c3aed" },
  { id:2, name:"Ana Garcia",     area:"Recursos Humanos", role:"Gerente RH",        password:"1234",      isAdmin:false, color:"#e67e22" },
  { id:3, name:"Carlos Mendoza", area:"Tecnologia",       role:"Dev Senior",        password:"1234",      isAdmin:false, color:"#2980b9" },
];

const DEFAULT_MESSAGES = {
  general: [
    { id:1, userId:1, text:"Bienvenidos a IntraConnect! Esta es la plataforma de comunicacion interna de la empresa.", time:"09:00" }
  ]
};

const DEFAULT_ANN = [
  { id:1, title:"Bienvenidos a IntraConnect!", body:"Ya no usaremos WhatsApp para temas laborales. Toda comunicacion de trabajo se hace aqui.", author:"Administrador", area:"Direccion", time:"09:00", urgent:false }
];

function getInitials(name) {
  return name.split(" ").map(function(w){ return w[0]; }).join("").slice(0,2).toUpperCase();
}

function loadLS(key, fallback) {
  try {
    var v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch(e) { return fallback; }
}

function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
}

function getColor(user) {
  return user.color || COLORS[user.id % COLORS.length];
}

function Avatar({ user, size }) {
  size = size || 36;
  var color = getColor(user);
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:"linear-gradient(135deg,"+color+"99,"+color+")",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.34, fontWeight:800, color:"#fff", userSelect:"none"
    }}>
      {getInitials(user.name)}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, type }) {
  var [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:12 }}>
      {label && <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>{label}</div>}
      <input
        type={type || "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        onFocus={function(){ setFocused(true); }}
        onBlur={function(){ setFocused(false); }}
        style={{
          width:"100%",
          background:"rgba(255,255,255,0.04)",
          border:"1px solid "+(focused?"#4f8ef7":"rgba(255,255,255,0.1)"),
          borderRadius:9, padding:"10px 12px",
          color:"#f1f5f9", fontSize:14, outline:"none",
          fontFamily:"DM Sans,sans-serif",
          boxShadow:focused?"0 0 0 3px rgba(79,142,247,0.1)":"none",
          transition:"all 0.15s"
        }}
      />
    </div>
  );
}

/* -------- LOGIN -------- */
function LoginScreen({ users, onLogin }) {
  var [name, setName] = useState("");
  var [pass, setPass] = useState("");
  var [err, setErr]   = useState("");
  var [load, setLoad] = useState(false);

  function doLogin() {
    if (!name.trim() || !pass.trim()) { setErr("Completa todos los campos."); return; }
    setLoad(true); setErr("");
    setTimeout(function() {
      var u = users.find(function(u){
        return u.name.toLowerCase() === name.trim().toLowerCase() ||
               u.name.split(" ")[0].toLowerCase() === name.trim().toLowerCase();
      });
      if (!u) { setErr("Usuario no encontrado. Verifica tu nombre."); setLoad(false); return; }
      if (u.password !== pass.trim()) { setErr("Contrasena incorrecta."); setLoad(false); return; }
      onLogin(u);
    }, 600);
  }

  function handleKey(e) { if (e.key === "Enter") doLogin(); }

  return (
    <div style={{
      minHeight:"100vh", background:"#060d1a",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:20, fontFamily:"DM Sans,sans-serif"
    }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box}"}</style>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{
            width:56, height:56, borderRadius:16, margin:"0 auto 12px",
            background:"linear-gradient(135deg,#4f8ef7,#7c3aed)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, boxShadow:"0 8px 28px rgba(79,142,247,0.4)"
          }}>{EMOJI.link}</div>
          <h1 style={{ color:"#f1f5f9", fontSize:24, fontWeight:800, margin:0, letterSpacing:"-0.3px" }}>IntraConnect</h1>
          <p style={{ color:"#475569", fontSize:13, marginTop:4, marginBottom:0 }}>Comunicacion interna corporativa</p>
        </div>

        <div style={{
          background:"rgba(13,20,38,0.95)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:18, padding:"28px 24px",
          boxShadow:"0 20px 60px rgba(0,0,0,0.5)"
        }}>
          <div style={{ marginBottom:18 }}>
            <div style={{ color:"#334155", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>
              Acceso rapido:
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {users.filter(function(u){ return !u.isAdmin; }).slice(0,5).map(function(u) {
                return (
                  <button key={u.id}
                    onClick={function(){ setName(u.name.split(" ")[0]); setPass(u.password); }}
                    style={{
                      background:"rgba(255,255,255,0.04)",
                      border:"1px solid rgba(255,255,255,0.08)",
                      borderRadius:7, padding:"4px 10px",
                      color:"#94a3b8", fontSize:12,
                      cursor:"pointer", fontFamily:"DM Sans,sans-serif", fontWeight:600
                    }}>
                    {u.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>

          <TextInput label="Nombre de usuario" value={name} onChange={function(e){ setName(e.target.value); }} placeholder="Tu primer nombre" />
          <div onKeyDown={handleKey}>
            <TextInput label="Contrasena" type="password" value={pass} onChange={function(e){ setPass(e.target.value); }} placeholder="........" />
          </div>

          {err && (
            <div style={{
              background:"rgba(231,76,60,0.1)", border:"1px solid rgba(231,76,60,0.3)",
              borderRadius:8, padding:"9px 12px", color:"#fc8181", fontSize:13, marginBottom:12
            }}>{err}</div>
          )}

          <button onClick={doLogin} disabled={load} style={{
            width:"100%", padding:13, borderRadius:11, border:"none",
            background:"linear-gradient(135deg,#4f8ef7,#7c3aed)",
            color:"#fff", fontSize:15, fontWeight:700,
            cursor:"pointer", fontFamily:"DM Sans,sans-serif",
            opacity:load?0.7:1, boxShadow:"0 4px 16px rgba(79,142,247,0.35)"
          }}>
            {load ? "Verificando..." : "Ingresar"}
          </button>
        </div>

        <p style={{ textAlign:"center", color:"#1e293b", fontSize:12, marginTop:14 }}>
          Problemas para ingresar? Contacta al Administrador.
        </p>
      </div>
    </div>
  );
}

/* -------- ADMIN PANEL -------- */
function AdminPanel({ users, setUsers, onClose }) {
  var [tab, setTab]     = useState("list");
  var [nm, setNm]       = useState("");
  var [ar, setAr]       = useState("general");
  var [rl, setRl]       = useState("");
  var [pw, setPw]       = useState("1234");
  var [editId, setEditId] = useState(null);
  var [flash, setFlash]   = useState("");

  function areaLabel(id) {
    var d = DEPARTMENTS.find(function(d){ return d.id === id; });
    return d ? d.name : id;
  }

  function toast(msg) { setFlash(msg); setTimeout(function(){ setFlash(""); }, 3000); }

  function save() {
    if (!nm.trim() || !rl.trim()) { toast("WARN: Nombre y cargo son obligatorios."); return; }
    var area = areaLabel(ar);
    if (editId) {
      var updated = users.map(function(u){
        return u.id === editId ? Object.assign({}, u, { name:nm.trim(), area:area, role:rl.trim(), password:pw||"1234" }) : u;
      });
      setUsers(updated); saveLS("ic_users", updated); toast("OK: Empleado actualizado.");
    } else {
      var color = COLORS[users.length % COLORS.length];
      var nu = { id:Date.now(), name:nm.trim(), area:area, role:rl.trim(), password:pw||"1234", color:color, isAdmin:false };
      var updated2 = users.concat([nu]);
      setUsers(updated2); saveLS("ic_users", updated2); toast("OK: Empleado agregado.");
    }
    setNm(""); setRl(""); setPw("1234"); setEditId(null); setTab("list");
  }

  function del(id) {
    if (window.confirm("Eliminar este empleado?")) {
      var updated = users.filter(function(u){ return u.id !== id; });
      setUsers(updated); saveLS("ic_users", updated);
    }
  }

  function editUser(u) {
    var dId = "general";
    DEPARTMENTS.forEach(function(d){ if (d.name === u.area) dId = d.id; });
    setNm(u.name); setAr(dId); setRl(u.role); setPw(u.password); setEditId(u.id); setTab("add");
  }

  var iStyle = {
    width:"100%", background:"rgba(255,255,255,0.04)",
    border:"1px solid rgba(255,255,255,0.1)",
    borderRadius:8, padding:"9px 11px", color:"#f1f5f9", fontSize:13,
    outline:"none", fontFamily:"DM Sans,sans-serif", marginBottom:10
  };

  var nonAdmin = users.filter(function(u){ return !u.isAdmin; });

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.8)",
      zIndex:500, display:"flex", alignItems:"center", justifyContent:"center",
      padding:16, backdropFilter:"blur(4px)"
    }}>
      <div style={{
        background:"#0b1424", border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:18, width:"100%", maxWidth:520,
        maxHeight:"88vh", overflow:"hidden", display:"flex", flexDirection:"column",
        boxShadow:"0 24px 80px rgba(0,0,0,0.7)"
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <div style={{ color:"#f1f5f9", fontWeight:800, fontSize:15 }}>Panel de Administrador</div>
            <div style={{ color:"#475569", fontSize:12 }}>Gestion de empleados</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.05)", border:"none", borderRadius:7, padding:"5px 11px", color:"#64748b", cursor:"pointer", fontSize:16, fontFamily:"DM Sans,sans-serif" }}>X</button>
        </div>

        <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 6px" }}>
          {[
            { id:"list", label:"Empleados ("+nonAdmin.length+")" },
            { id:"add",  label:editId?"Editar":"Nuevo empleado" }
          ].map(function(t) {
            return (
              <button key={t.id}
                onClick={function(){
                  setTab(t.id);
                  if (t.id === "list") { setEditId(null); setNm(""); setRl(""); setPw("1234"); }
                }}
                style={{
                  background:"transparent", border:"none",
                  borderBottom:tab===t.id?"2px solid #4f8ef7":"2px solid transparent",
                  color:tab===t.id?"#4f8ef7":"#475569",
                  padding:"9px 13px", fontSize:13, fontWeight:600,
                  cursor:"pointer", fontFamily:"DM Sans,sans-serif"
                }}>
                {t.label}
              </button>
            );
          })}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }}>
          {flash && (
            <div style={{
              background:flash.startsWith("WARN")?"rgba(231,76,60,0.1)":"rgba(46,204,113,0.1)",
              border:"1px solid "+(flash.startsWith("WARN")?"rgba(231,76,60,0.3)":"rgba(46,204,113,0.3)"),
              borderRadius:8, padding:"9px 12px",
              color:flash.startsWith("WARN")?"#fc8181":"#2ecc71",
              fontSize:13, marginBottom:12
            }}>
              {flash.replace("WARN: ","").replace("OK: ","")}
            </div>
          )}

          {tab === "list" && (
            <div>
              {nonAdmin.length === 0 && (
                <div style={{ textAlign:"center", color:"#334155", padding:"28px 0" }}>
                  No hay empleados registrados.
                  <br />
                  <button onClick={function(){ setTab("add"); }}
                    style={{ marginTop:10, background:"rgba(79,142,247,0.1)", border:"1px solid rgba(79,142,247,0.25)", borderRadius:8, padding:"7px 14px", color:"#4f8ef7", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                    Agregar primero
                  </button>
                </div>
              )}
              {nonAdmin.map(function(u) {
                return (
                  <div key={u.id} style={{ display:"flex", alignItems:"center", gap:11, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:11, padding:"11px 13px", marginBottom:8 }}>
                    <Avatar user={u} size={36} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:14 }}>{u.name}</div>
                      <div style={{ color:"#475569", fontSize:12 }}>{u.role} - {u.area}</div>
                      <div style={{ color:"#334155", fontSize:11 }}>
                        {"Contrasena: "}
                        <span style={{ color:"#4f8ef7", fontFamily:"monospace" }}>{u.password}</span>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:5 }}>
                      <button onClick={function(){ editUser(u); }}
                        style={{ background:"rgba(79,142,247,0.1)", border:"1px solid rgba(79,142,247,0.2)", borderRadius:7, padding:"5px 9px", color:"#4f8ef7", fontSize:12, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                        Edit
                      </button>
                      <button onClick={function(){ del(u.id); }}
                        style={{ background:"rgba(231,76,60,0.08)", border:"1px solid rgba(231,76,60,0.2)", borderRadius:7, padding:"5px 9px", color:"#fc8181", fontSize:12, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                        Del
                      </button>
                    </div>
                  </div>
                );
              })}
              <button onClick={function(){ setTab("add"); }}
                style={{ width:"100%", marginTop:6, padding:"10px", borderRadius:9, border:"1px dashed rgba(79,142,247,0.3)", background:"rgba(79,142,247,0.04)", color:"#4f8ef7", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                + Agregar nuevo empleado
              </button>
            </div>
          )}

          {tab === "add" && (
            <div>
              <p style={{ color:"#64748b", fontSize:13, marginBottom:14 }}>
                {editId ? "Edita los datos del empleado." : "Completa para registrar un nuevo colaborador."}
              </p>
              <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Nombre completo *</div>
              <input value={nm} onChange={function(e){ setNm(e.target.value); }} placeholder="Ej: Juan Perez" style={iStyle} />
              <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Area / Departamento *</div>
              <select value={ar} onChange={function(e){ setAr(e.target.value); }} style={Object.assign({}, iStyle, { cursor:"pointer" })}>
                {DEPARTMENTS.map(function(d){ return <option key={d.id} value={d.id}>{d.name}</option>; })}
              </select>
              <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Cargo / Puesto *</div>
              <input value={rl} onChange={function(e){ setRl(e.target.value); }} placeholder="Ej: Analista de Ventas" style={iStyle} />
              <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Contrasena de acceso</div>
              <input value={pw} onChange={function(e){ setPw(e.target.value); }} placeholder="default: 1234" style={Object.assign({}, iStyle, { marginBottom:20 })} />
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={save} style={{ flex:1, padding:"11px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                  {editId ? "Guardar cambios" : "Registrar empleado"}
                </button>
                {editId && (
                  <button onClick={function(){ setEditId(null); setNm(""); setRl(""); setPw("1234"); setTab("list"); }}
                    style={{ padding:"11px 14px", borderRadius:9, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#64748b", fontSize:14, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------- MAIN APP -------- */
export default function IntraConnect() {
  var [users, setUsers]   = useState(function(){ return loadLS("ic_users", DEFAULT_USERS); });
  var [msgs, setMsgs]     = useState(function(){ return loadLS("ic_msgs",  DEFAULT_MESSAGES); });
  var [dms, setDms]       = useState(function(){ return loadLS("ic_dms",   {}); });
  var [anns, setAnns]     = useState(function(){ return loadLS("ic_anns",  DEFAULT_ANN); });
  var [me, setMe]         = useState(null);
  var [section, setSection] = useState("chat");
  var [chan, setChan]      = useState("general");
  var [dmUser, setDmUser] = useState(null);
  var [sideTab, setSideTab] = useState("channels");
  var [input, setInput]   = useState("");
  var [adminOpen, setAdminOpen]     = useState(false);
  var [profileOpen, setProfileOpen] = useState(false);
  var [annTitle, setAnnTitle]   = useState("");
  var [annBody, setAnnBody]     = useState("");
  var [annUrgent, setAnnUrgent] = useState(false);
  var bottomRef = useRef(null);
  var inputRef  = useRef(null);

  useEffect(function(){ saveLS("ic_users", users); }, [users]);
  useEffect(function(){ saveLS("ic_msgs",  msgs);  }, [msgs]);
  useEffect(function(){ saveLS("ic_dms",   dms);   }, [dms]);
  useEffect(function(){ saveLS("ic_anns",  anns);  }, [anns]);

  useEffect(function(){
    var t = setTimeout(function(){ if(bottomRef.current) bottomRef.current.scrollIntoView({ behavior:"smooth" }); }, 60);
    return function(){ clearTimeout(t); };
  }, [msgs, dms, chan, dmUser]);

  if (!me) return <LoginScreen users={users} onLogin={function(u){ setMe(u); }} />;

  function sendMsg() {
    var text = input.trim();
    if (!text) return;
    var m = {
      id: Date.now(), userId: me.id, text: text,
      time: new Date().toLocaleTimeString("es-MX", { hour:"2-digit", minute:"2-digit" })
    };
    if (dmUser) {
      var k = [me.id, dmUser.id].sort(function(a,b){return a-b;}).join("_");
      setDms(function(prev){
        var next = Object.assign({}, prev);
        next[k] = (prev[k]||[]).concat([m]);
        return next;
      });
    } else {
      setMsgs(function(prev){
        var next = Object.assign({}, prev);
        next[chan] = (prev[chan]||[]).concat([m]);
        return next;
      });
    }
    setInput("");
    setTimeout(function(){ if(inputRef.current) inputRef.current.focus(); }, 30);
  }

  function publishAnn() {
    if (!annTitle.trim() || !annBody.trim()) return;
    var a = {
      id:Date.now(), title:annTitle.trim(), body:annBody.trim(),
      author:me.name, area:me.area||"Empresa",
      time:new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}),
      urgent:annUrgent
    };
    setAnns(function(prev){ return [a].concat(prev); });
    setAnnTitle(""); setAnnBody(""); setAnnUrgent(false);
  }

  function getById(id) { return users.find(function(u){ return u.id === id; }); }

  function dmKey(a, b) { return [a,b].sort(function(x,y){return x-y;}).join("_"); }

  var chatMsgs = dmUser
    ? (dms[dmKey(me.id, dmUser.id)] || [])
    : (msgs[chan] || []);

  var dept  = DEPARTMENTS.find(function(d){ return d.id === chan; });
  var staff = users.filter(function(u){ return !u.isAdmin; });

  function sideBtn(active) {
    return {
      width:"100%", display:"flex", alignItems:"center", gap:10,
      padding:"7px 11px",
      background:active?"rgba(79,142,247,0.1)":"transparent",
      border:"none", cursor:"pointer", textAlign:"left",
      borderLeft:active?"3px solid #4f8ef7":"3px solid transparent",
      transition:"all 0.12s", fontFamily:"DM Sans,sans-serif"
    };
  }

  function navBtn(active) {
    return {
      background:active?"rgba(79,142,247,0.12)":"transparent",
      border:active?"1px solid rgba(79,142,247,0.25)":"1px solid transparent",
      color:active?"#4f8ef7":"#64748b",
      borderRadius:7, padding:"5px 11px", fontSize:12, fontWeight:600,
      cursor:"pointer", fontFamily:"DM Sans,sans-serif", whiteSpace:"nowrap"
    };
  }

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"#060d1a", fontFamily:"DM Sans,sans-serif", overflow:"hidden" }}>
      <style>
        {"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}textarea{resize:none}@keyframes su{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}"}
      </style>

      {adminOpen && <AdminPanel users={users} setUsers={setUsers} onClose={function(){ setAdminOpen(false); }} />}

      {/* NAV */}
      <div style={{ height:52, background:"rgba(7,12,22,0.98)", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", padding:"0 12px", gap:8, flexShrink:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginRight:4 }}>
          <div style={{ width:26, height:26, borderRadius:7, background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>
            {EMOJI.link}
          </div>
          <span style={{ color:"#f1f5f9", fontWeight:800, fontSize:14 }}>IntraConnect</span>
        </div>

        <button onClick={function(){ setSection("chat"); }}          style={navBtn(section==="chat")}>Mensajes</button>
        <button onClick={function(){ setSection("announcements"); }} style={navBtn(section==="announcements")}>Anuncios</button>
        <button onClick={function(){ setSection("directory"); }}     style={navBtn(section==="directory")}>Directorio</button>

        <div style={{ flex:1 }} />

        {me.isAdmin && (
          <button onClick={function(){ setAdminOpen(true); }}
            style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:7, padding:"5px 11px", color:"#a78bfa", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
            Admin
          </button>
        )}

        <div style={{ position:"relative" }}>
          <button
            onClick={function(){ setProfileOpen(function(p){ return !p; }); }}
            style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:9, padding:"4px 9px 4px 4px", cursor:"pointer" }}>
            <Avatar user={me} size={24} />
            <span style={{ color:"#e2e8f0", fontSize:12, fontWeight:700 }}>{me.name.split(" ")[0]}</span>
          </button>
          {profileOpen && (
            <React.Fragment>
              <div onClick={function(){ setProfileOpen(false); }} style={{ position:"fixed", inset:0, zIndex:150 }} />
              <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, zIndex:200, background:"#0b1424", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:14, width:200, boxShadow:"0 12px 40px rgba(0,0,0,0.6)", animation:"su 0.15s ease" }}>
                <div style={{ display:"flex", gap:9, marginBottom:12 }}>
                  <Avatar user={me} size={36} />
                  <div>
                    <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>{me.name}</div>
                    <div style={{ color:"#475569", fontSize:12 }}>{me.isAdmin?"Administrador":me.role}</div>
                  </div>
                </div>
                {me.isAdmin && (
                  <button onClick={function(){ setAdminOpen(true); setProfileOpen(false); }}
                    style={{ width:"100%", marginBottom:7, padding:"8px", borderRadius:7, border:"none", background:"rgba(124,58,237,0.1)", color:"#a78bfa", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                    Panel Admin
                  </button>
                )}
                <button onClick={function(){ setMe(null); setProfileOpen(false); }}
                  style={{ width:"100%", padding:"8px", borderRadius:7, border:"none", background:"rgba(231,76,60,0.1)", color:"#fc8181", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                  Cerrar sesion
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* === CHAT === */}
        {section === "chat" && (
          <React.Fragment>
            {/* Sidebar */}
            <div style={{ width:220, background:"rgba(6,10,19,0.97)", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", flexShrink:0 }}>
              <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"5px 5px 0" }}>
                {[{id:"channels",l:"Areas"},{id:"dm",l:"Directos"}].map(function(t){
                  return (
                    <button key={t.id} onClick={function(){ setSideTab(t.id); }}
                      style={{ flex:1, padding:"7px", background:"transparent", border:"none", borderBottom:sideTab===t.id?"2px solid #4f8ef7":"2px solid transparent", color:sideTab===t.id?"#4f8ef7":"#475569", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                      {t.l}
                    </button>
                  );
                })}
              </div>
              <div style={{ flex:1, overflowY:"auto", padding:"5px 0" }}>
                {sideTab === "channels" ? (
                  <React.Fragment>
                    <div style={{ padding:"7px 11px 3px", color:"#1e293b", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Canales</div>
                    {DEPARTMENTS.map(function(d){
                      var cnt  = (msgs[d.id]||[]).length;
                      var act  = !dmUser && chan === d.id;
                      return (
                        <button key={d.id} onClick={function(){ setChan(d.id); setDmUser(null); }} style={sideBtn(act)}>
                          <div style={{ width:20, height:20, borderRadius:5, background:d.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:d.color }}>{d.icon}</div>
                          <span style={{ color:act?"#e2e8f0":"#64748b", fontSize:12, fontWeight:act?700:500 }}>{d.name}</span>
                          {cnt > 0 && <span style={{ marginLeft:"auto", color:"#334155", fontSize:10 }}>{cnt}</span>}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div style={{ padding:"7px 11px 3px", color:"#1e293b", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>
                      {"Empleados - "+staff.length}
                    </div>
                    {staff.map(function(u){
                      var k   = dmKey(me.id, u.id);
                      var act = dmUser ? dmUser.id === u.id : false;
                      return (
                        <button key={u.id} onClick={function(){ setDmUser(u); setChan(null); }} style={sideBtn(act)}>
                          <Avatar user={u} size={26} />
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ color:act?"#e2e8f0":"#64748b", fontSize:12, fontWeight:600, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{u.name}</div>
                            <div style={{ color:"#1e293b", fontSize:10 }}>{u.area}</div>
                          </div>
                          {(dms[k]||[]).length > 0 && <span style={{ color:"#334155", fontSize:10 }}>{(dms[k]||[]).length}</span>}
                        </button>
                      );
                    })}
                    {staff.length === 0 && <div style={{ padding:"16px 12px", color:"#334155", fontSize:12 }}>Sin empleados aun.</div>}
                  </React.Fragment>
                )}
              </div>
            </div>

            {/* Chat area */}
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
              {/* Header */}
              <div style={{ padding:"9px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(9,14,26,0.7)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                {dmUser ? (
                  <React.Fragment>
                    <Avatar user={dmUser} size={32} />
                    <div>
                      <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>{dmUser.name}</div>
                      <div style={{ color:"#475569", fontSize:11 }}>{dmUser.role+" - "+dmUser.area}</div>
                    </div>
                  </React.Fragment>
                ) : dept ? (
                  <React.Fragment>
                    <div style={{ width:32, height:32, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, background:dept.color+"15", border:"1px solid "+dept.color+"25", color:dept.color }}>{dept.icon}</div>
                    <div>
                      <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>{"# "+dept.name}</div>
                      <div style={{ color:"#475569", fontSize:11 }}>{(msgs[chan]||[]).length+" mensajes"}</div>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>

              {/* Messages */}
              <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:1 }}>
                {chatMsgs.length === 0 && (
                  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#1e293b", gap:6 }}>
                    <div style={{ fontSize:36 }}>💬</div>
                    <div style={{ color:"#334155", fontSize:14, fontWeight:700 }}>
                      {dmUser ? "Inicia conversacion con "+dmUser.name.split(" ")[0] : "Canal #"+(dept?dept.name:"")}
                    </div>
                    <div style={{ color:"#1e293b", fontSize:13 }}>Escribe el primer mensaje abajo</div>
                  </div>
                )}

                {chatMsgs.map(function(m, i){
                  var sender  = getById(m.userId);
                  if (!sender) return null;
                  var isMe    = m.userId === me.id;
                  var grouped = i > 0 && chatMsgs[i-1].userId === m.userId;
                  return (
                    <div key={m.id} style={{ display:"flex", gap:9, alignItems:"flex-end", flexDirection:isMe?"row-reverse":"row", marginTop:grouped?2:11, animation:"su 0.2s ease" }}>
                      {!grouped ? <Avatar user={sender} size={28} /> : <div style={{ width:28, flexShrink:0 }} />}
                      <div style={{ maxWidth:"72%" }}>
                        {!grouped && (
                          <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:3, flexDirection:isMe?"row-reverse":"row" }}>
                            <span style={{ color:getColor(sender), fontSize:12, fontWeight:700 }}>{isMe?"Tu":sender.name}</span>
                            <span style={{ color:"#1e293b", fontSize:11 }}>{m.time}</span>
                          </div>
                        )}
                        <div style={{
                          background:isMe?"linear-gradient(135deg,#4f8ef7,#7c3aed)":"rgba(255,255,255,0.05)",
                          borderRadius:isMe?"13px 3px 13px 13px":"3px 13px 13px 13px",
                          padding:"9px 12px", color:"#e2e8f0", fontSize:14, lineHeight:1.5,
                          border:isMe?"none":"1px solid rgba(255,255,255,0.07)",
                          wordBreak:"break-word",
                          boxShadow:isMe?"0 2px 8px rgba(79,142,247,0.2)":"none"
                        }}>
                          {m.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding:"9px 12px", borderTop:"1px solid rgba(255,255,255,0.06)", background:"rgba(7,11,20,0.95)", flexShrink:0 }}>
                <div style={{ display:"flex", gap:8, alignItems:"flex-end", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:11, padding:"7px 7px 7px 12px" }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={function(e){ setInput(e.target.value); }}
                    onKeyDown={function(e){ if (e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMsg(); } }}
                    rows={1}
                    placeholder={dmUser ? "Mensaje a "+dmUser.name.split(" ")[0]+"..." : "Escribe en #"+(dept?dept.name:"")+"..."}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#f1f5f9", fontSize:14, lineHeight:1.5, fontFamily:"DM Sans,sans-serif", maxHeight:80, overflowY:"auto" }}
                  />
                  <button onClick={sendMsg}
                    style={{ width:32, height:32, borderRadius:8, border:"none", flexShrink:0, background:input.trim()?"linear-gradient(135deg,#4f8ef7,#7c3aed)":"rgba(255,255,255,0.04)", color:input.trim()?"#fff":"#334155", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
                    &gt;
                  </button>
                </div>
                <div style={{ color:"#1e293b", fontSize:11, marginTop:4, textAlign:"center" }}>
                  Enter para enviar - Shift+Enter para saltar linea
                </div>
              </div>
            </div>
          </React.Fragment>
        )}

        {/* === ANUNCIOS === */}
        {section === "announcements" && (
          <div style={{ flex:1, overflowY:"auto", padding:22 }}>
            <div style={{ maxWidth:660, margin:"0 auto" }}>
              <h2 style={{ color:"#f1f5f9", fontSize:20, fontWeight:800, marginBottom:4 }}>Tablero de Anuncios</h2>
              <p style={{ color:"#475569", fontSize:13, marginBottom:22 }}>Comunicados y avisos oficiales</p>

              {anns.map(function(a) {
                return (
                  <div key={a.id} style={{ background:"rgba(12,19,36,0.9)", border:"1px solid "+(a.urgent?"rgba(231,76,60,0.3)":"rgba(255,255,255,0.07)"), borderRadius:13, padding:16, marginBottom:12, borderLeft:"4px solid "+(a.urgent?"#e74c3c":"#4f8ef7"), animation:"su 0.2s ease" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:7 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        {a.urgent && <span style={{ background:"rgba(231,76,60,0.12)", color:"#fc8181", borderRadius:5, padding:"1px 7px", fontSize:11, fontWeight:700 }}>URGENTE</span>}
                        <h3 style={{ color:"#f1f5f9", fontSize:14, fontWeight:700 }}>{a.title}</h3>
                      </div>
                      <span style={{ color:"#334155", fontSize:11, whiteSpace:"nowrap", marginLeft:8 }}>{a.time}</span>
                    </div>
                    <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.6, marginBottom:9 }}>{a.body}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", background:"#4f8ef7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", fontWeight:700 }}>
                        {a.author.split(" ").map(function(w){ return w[0]; }).join("").slice(0,2)}
                      </div>
                      <span style={{ color:"#64748b", fontSize:12 }}>{a.author}</span>
                      <span style={{ color:"#334155" }}>-</span>
                      <span style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", borderRadius:4, padding:"1px 7px", fontSize:11, fontWeight:600 }}>{a.area}</span>
                    </div>
                  </div>
                );
              })}

              {anns.length === 0 && (
                <div style={{ textAlign:"center", color:"#334155", padding:"36px 0" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>📭</div>
                  No hay anuncios todavia.
                </div>
              )}

              <div style={{ background:"rgba(12,19,36,0.9)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:16, marginTop:8 }}>
                <h4 style={{ color:"#94a3b8", fontSize:13, fontWeight:700, marginBottom:11 }}>Publicar anuncio</h4>
                <input value={annTitle} onChange={function(e){ setAnnTitle(e.target.value); }} placeholder="Titulo del anuncio..."
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:7, padding:"8px 11px", color:"#f1f5f9", fontSize:13, outline:"none", marginBottom:8, fontFamily:"DM Sans,sans-serif" }} />
                <textarea value={annBody} onChange={function(e){ setAnnBody(e.target.value); }} placeholder="Contenido..." rows={3}
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:7, padding:"8px 11px", color:"#f1f5f9", fontSize:13, outline:"none", marginBottom:9, fontFamily:"DM Sans,sans-serif", resize:"vertical" }} />
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                  <label style={{ display:"flex", alignItems:"center", gap:6, color:"#94a3b8", fontSize:13, cursor:"pointer" }}>
                    <input type="checkbox" checked={annUrgent} onChange={function(e){ setAnnUrgent(e.target.checked); }} />
                    {" Marcar como urgente"}
                  </label>
                  <button onClick={publishAnn}
                    style={{ background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", border:"none", borderRadius:8, padding:"8px 16px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === DIRECTORIO === */}
        {section === "directory" && (
          <div style={{ flex:1, overflowY:"auto", padding:22 }}>
            <div style={{ maxWidth:760, margin:"0 auto" }}>
              <h2 style={{ color:"#f1f5f9", fontSize:20, fontWeight:800, marginBottom:4 }}>Directorio de Empleados</h2>
              <p style={{ color:"#475569", fontSize:13, marginBottom:20 }}>Todos los colaboradores registrados</p>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginBottom:20 }}>
                {[
                  { l:"Total empleados", v:staff.length,        i:"👤" },
                  { l:"Departamentos",   v:DEPARTMENTS.length,  i:"🏢" }
                ].map(function(s, idx) {
                  return (
                    <div key={idx} style={{ background:"rgba(12,19,36,0.9)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:11, padding:"12px 14px" }}>
                      <div style={{ fontSize:18, marginBottom:3 }}>{s.i}</div>
                      <div style={{ color:"#f1f5f9", fontSize:22, fontWeight:800 }}>{s.v}</div>
                      <div style={{ color:"#475569", fontSize:12 }}>{s.l}</div>
                    </div>
                  );
                })}
              </div>

              {staff.length === 0 && (
                <div style={{ textAlign:"center", color:"#334155", padding:"36px 0" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>👥</div>
                  No hay empleados registrados.
                  {me.isAdmin && (
                    <span>
                      {" "}
                      <button onClick={function(){ setAdminOpen(true); }}
                        style={{ color:"#4f8ef7", background:"none", border:"none", cursor:"pointer", fontWeight:700, fontFamily:"DM Sans,sans-serif" }}>
                        Ir al panel admin
                      </button>
                    </span>
                  )}
                </div>
              )}

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
                {staff.map(function(u) {
                  return (
                    <div key={u.id}
                      onClick={function(){ setDmUser(u); setSection("chat"); setSideTab("dm"); }}
                      style={{ background:"rgba(12,19,36,0.9)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:14, cursor:"pointer", transition:"all 0.18s", animation:"su 0.2s ease" }}
                      onMouseOver={function(e){ e.currentTarget.style.borderColor="rgba(79,142,247,0.3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                      onMouseOut={function(e){ e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
                      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
                        <Avatar user={u} size={38} />
                        <div style={{ minWidth:0 }}>
                          <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:700, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{u.name}</div>
                        </div>
                      </div>
                      <div style={{ background:(getColor(u))+"15", border:"1px solid "+(getColor(u))+"25", borderRadius:5, padding:"2px 7px", marginBottom:5, display:"inline-block" }}>
                        <span style={{ color:getColor(u), fontSize:11, fontWeight:700 }}>{u.area}</span>
                      </div>
                      <div style={{ color:"#475569", fontSize:12 }}>{u.role}</div>
                      <button
                        onClick={function(e){ e.stopPropagation(); setDmUser(u); setSection("chat"); setSideTab("dm"); }}
                        style={{ marginTop:9, width:"100%", padding:"6px", borderRadius:7, border:"none", background:"rgba(79,142,247,0.1)", color:"#4f8ef7", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
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