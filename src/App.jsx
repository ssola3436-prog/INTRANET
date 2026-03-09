import { useState, useEffect, useRef } from "react";

const COLORS = ["#e67e22","#2980b9","#8e44ad","#27ae60","#c0392b","#16a085","#d35400","#1abc9c","#e74c3c","#f39c12","#3498db","#9b59b6","#f1c40f","#1a6b4a","#8B0000","#4B0082"];

const DEF_DEPS = [
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
  { id:1,  name:"Administrador",  area:"Direccion",        role:"Admin",            pass:"admin1234", admin:true,  color:"#7c3aed", mgr:0 },
  { id:2,  name:"Ana Garcia",     area:"Recursos Humanos", role:"Gerente RH",       pass:"1234",      admin:false, color:"#e67e22", mgr:1 },
  { id:3,  name:"Carlos Mendoza", area:"Tecnologia",       role:"Dev Senior",       pass:"1234",      admin:false, color:"#2980b9", mgr:1 },
];

const DEF_MSGS = { general:[{ id:1, uid:1, text:"Bienvenidos a IntraConnect! Esta es la plataforma de comunicacion interna.", time:"09:00" }] };
const DEF_ANNS = [{ id:1, title:"Bienvenidos a IntraConnect!", body:"Ya no usaremos WhatsApp para temas de trabajo.", author:"Administrador", area:"Direccion", time:"09:00", urgent:false }];

function ls(k,d){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } }
function sv(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
function ini(name){ return name.split(" ").map(function(w){ return w[0]||""; }).join("").slice(0,2).toUpperCase(); }
function col(u){ return u.color||COLORS[u.id%COLORS.length]; }
function uid(){ return Date.now()+Math.floor(Math.random()*1000); }

/* ── Avatar ─────────────────────────────────────────────────────── */
function Av({ u, sz }){
  sz=sz||36; var c=col(u);
  return (
    <div style={{ width:sz, height:sz, borderRadius:"50%", flexShrink:0, background:"linear-gradient(135deg,"+c+"88,"+c+")", display:"flex", alignItems:"center", justifyContent:"center", fontSize:sz*0.33, fontWeight:800, color:"#fff", userSelect:"none", boxShadow:"0 2px 6px rgba(0,0,0,0.3)" }}>
      {ini(u.name)}
    </div>
  );
}

/* ── Login ──────────────────────────────────────────────────────── */
function Login({ users, onLogin }){
  var [nm,setNm]=useState(""), [pw,setPw]=useState(""), [err,setErr]=useState(""), [busy,setBusy]=useState(false);
  function go(){
    if(!nm.trim()||!pw.trim()){ setErr("Escribe tu nombre y contrasena."); return; }
    setBusy(true); setErr("");
    setTimeout(function(){
      var found=null;
      for(var i=0;i<users.length;i++){
        var u=users[i], first=u.name.split(" ")[0].toLowerCase();
        if(u.name.toLowerCase()===nm.trim().toLowerCase()||first===nm.trim().toLowerCase()){ found=u; break; }
      }
      if(!found){ setErr("Usuario no encontrado."); setBusy(false); return; }
      if(found.pass!==pw.trim()){ setErr("Contrasena incorrecta."); setBusy(false); return; }
      onLogin(found);
    },500);
  }
  var iS={ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:9, padding:"11px 13px", color:"#f1f5f9", fontSize:14, outline:"none", fontFamily:"inherit", marginBottom:12 };
  return (
    <div style={{ minHeight:"100vh", background:"#060d1a", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}"}</style>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:56, height:56, borderRadius:16, margin:"0 auto 14px", background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, color:"#fff", boxShadow:"0 8px 28px rgba(79,142,247,0.4)" }}>IC</div>
          <div style={{ color:"#f1f5f9", fontSize:24, fontWeight:800, letterSpacing:"-0.3px" }}>IntraConnect</div>
          <div style={{ color:"#475569", fontSize:13, marginTop:4 }}>Comunicacion interna corporativa</div>
        </div>
        <div style={{ background:"rgba(13,20,38,0.97)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:18, padding:"28px 24px", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ marginBottom:18 }}>
            <div style={{ color:"#334155", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Clic rapido:</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {users.filter(function(u){ return !u.admin; }).slice(0,6).map(function(u){
                return <button key={u.id} onClick={function(){ setNm(u.name.split(" ")[0]); setPw(u.pass); }} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:7, padding:"4px 10px", color:"#94a3b8", fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{u.name.split(" ")[0]}</button>;
              })}
            </div>
          </div>
          <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Nombre de usuario</div>
          <input style={iS} value={nm} onChange={function(e){ setNm(e.target.value); }} placeholder="Tu primer nombre" onKeyDown={function(e){ if(e.key==="Enter") go(); }} />
          <div style={{ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 }}>Contrasena</div>
          <input style={{ ...iS, marginBottom:err?0:4 }} type="password" value={pw} onChange={function(e){ setPw(e.target.value); }} placeholder="........" onKeyDown={function(e){ if(e.key==="Enter") go(); }} />
          {err && <div style={{ background:"rgba(231,76,60,0.1)", border:"1px solid rgba(231,76,60,0.3)", borderRadius:8, padding:"9px 12px", color:"#fc8181", fontSize:13, margin:"10px 0" }}>{err}</div>}
          <button onClick={go} disabled={busy} style={{ width:"100%", padding:13, borderRadius:11, border:"none", background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginTop:14, opacity:busy?0.7:1 }}>
            {busy?"Verificando...":"Ingresar"}
          </button>
        </div>
        <div style={{ textAlign:"center", color:"#1e293b", fontSize:12, marginTop:14 }}>Problemas? Contacta al Administrador.</div>
      </div>
    </div>
  );
}

/* ── Panel Admin ─────────────────────────────────────────────────── */
function Admin({ users, setUsers, deps, setDeps, close }){
  var [tab,setTab]=useState("users");
  /* --- users tab state --- */
  var [nm,setNm]=useState(""), [ar,setAr]=useState(""), [rl,setRl]=useState(""), [pw,setPw]=useState("1234"), [mgr,setMgr]=useState(0), [eid,setEid]=useState(null);
  /* --- deps tab state --- */
  var [dn,setDn]=useState(""), [dc,setDc]=useState("#4f8ef7"), [did,setDid]=useState(null);
  var [flash,setFlash]=useState(null);

  function toast(ok,text){ setFlash({ok:ok,text:text}); setTimeout(function(){ setFlash(null); },3000); }

  /* ---- dep helpers ---- */
  function depName(id){ for(var i=0;i<deps.length;i++) if(deps[i].id===id) return deps[i].name; return id; }
  function saveDep(){
    if(!dn.trim()){ toast(false,"El nombre del departamento es obligatorio."); return; }
    var next;
    if(did){
      next=deps.map(function(d){ return d.id===did?Object.assign({},d,{name:dn.trim(),color:dc}):d; });
      // update users area name too
      var oldName=depName(did);
      var newName=dn.trim();
      var updU=users.map(function(u){ return u.area===oldName?Object.assign({},u,{area:newName}):u; });
      setUsers(updU); sv("ic_u",updU);
      toast(true,"Departamento actualizado.");
    } else {
      var newId="dep_"+uid();
      next=deps.concat([{ id:newId, name:dn.trim(), color:dc }]);
      toast(true,"Departamento creado.");
    }
    setDeps(next); sv("ic_deps",next);
    setDn(""); setDc("#4f8ef7"); setDid(null);
  }
  function delDep(id){
    if(!window.confirm("Eliminar este departamento? Los empleados en el quedaran sin area.")) return;
    var next=deps.filter(function(d){ return d.id!==id; });
    setDeps(next); sv("ic_deps",next);
  }
  function editDep(d){ setDn(d.name); setDc(d.color); setDid(d.id); }

  /* ---- user helpers ---- */
  function saveUser(){
    if(!nm.trim()||!rl.trim()){ toast(false,"Nombre y cargo son obligatorios."); return; }
    var area=ar||deps[0].name;
    var next;
    if(eid){
      next=users.map(function(u){ return u.id===eid?Object.assign({},u,{name:nm.trim(),area:area,role:rl.trim(),pass:pw||"1234",mgr:Number(mgr)}):u; });
      toast(true,"Empleado actualizado.");
    } else {
      var c=COLORS[users.length%COLORS.length];
      next=users.concat([{ id:uid(), name:nm.trim(), area:area, role:rl.trim(), pass:pw||"1234", color:c, admin:false, mgr:Number(mgr) }]);
      toast(true,"Empleado registrado.");
    }
    setUsers(next); sv("ic_u",next);
    setNm(""); setRl(""); setPw("1234"); setMgr(0); setEid(null); setTab("users");
  }
  function delUser(id){
    if(!window.confirm("Eliminar este empleado?")) return;
    var next=users.filter(function(u){ return u.id!==id; });
    setUsers(next); sv("ic_u",next);
  }
  function editUser(u){
    var depId=deps[0]?deps[0].id:"general";
    for(var i=0;i<deps.length;i++) if(deps[i].name===u.area){ depId=deps[i].id; break; }
    setNm(u.name); setAr(u.area); setRl(u.role); setPw(u.pass); setMgr(u.mgr||0); setEid(u.id); setTab("adduser");
  }

  var staff=users.filter(function(u){ return !u.admin; });
  var iS={ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"9px 11px", color:"#f1f5f9", fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:10 };
  var lbl={ color:"#94a3b8", fontSize:12, fontWeight:700, marginBottom:5 };

  var TABS=[
    {id:"users",l:"Empleados ("+staff.length+")"},
    {id:"adduser",l:eid?"Editar empleado":"Nuevo empleado"},
    {id:"deps",l:"Departamentos ("+deps.length+")"},
    {id:"adddep",l:did?"Editar depto":"Nuevo depto"},
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#0b1424", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, width:"100%", maxWidth:540, maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"15px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <div style={{ color:"#f1f5f9", fontWeight:800, fontSize:15 }}>Panel de Administrador</div>
            <div style={{ color:"#475569", fontSize:12 }}>Gestiona empleados y departamentos</div>
          </div>
          <button onClick={close} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:7, padding:"5px 12px", color:"#64748b", cursor:"pointer", fontSize:15, fontFamily:"inherit" }}>X</button>
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 4px", overflowX:"auto" }}>
          {TABS.map(function(t){
            return <button key={t.id} onClick={function(){ setTab(t.id); if(t.id==="users"||t.id==="deps"){ setEid(null);setNm("");setRl("");setPw("1234");setMgr(0); setDid(null);setDn("");setDc("#4f8ef7"); } }} style={{ background:"transparent", border:"none", borderBottom:tab===t.id?"2px solid #4f8ef7":"2px solid transparent", color:tab===t.id?"#4f8ef7":"#475569", padding:"9px 12px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>{t.l}</button>;
          })}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }}>
          {flash && <div style={{ background:flash.ok?"rgba(46,204,113,0.1)":"rgba(231,76,60,0.1)", border:"1px solid "+(flash.ok?"rgba(46,204,113,0.3)":"rgba(231,76,60,0.3)"), borderRadius:8, padding:"9px 12px", color:flash.ok?"#2ecc71":"#fc8181", fontSize:13, marginBottom:12 }}>{flash.text}</div>}

          {/* ---- LIST USERS ---- */}
          {tab==="users" && (
            <div>
              {staff.length===0 && <div style={{ textAlign:"center", color:"#334155", padding:"24px 0" }}>Sin empleados. <button onClick={function(){setTab("adduser");}} style={{ color:"#4f8ef7", background:"none", border:"none", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Agregar primero</button></div>}
              {staff.map(function(u){
                var mgrUser=null; for(var i=0;i<users.length;i++) if(users[i].id===u.mgr){ mgrUser=users[i]; break; }
                return (
                  <div key={u.id} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:11, padding:"11px 13px", marginBottom:8 }}>
                    <Av u={u} sz={34} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:14 }}>{u.name}</div>
                      <div style={{ color:"#475569", fontSize:12 }}>{u.role} - {u.area}</div>
                      {mgrUser && <div style={{ color:"#334155", fontSize:11 }}>Reporta a: <span style={{ color:"#a78bfa" }}>{mgrUser.name}</span></div>}
                      <div style={{ color:"#334155", fontSize:11 }}>Contrasena: <span style={{ color:"#4f8ef7", fontFamily:"monospace" }}>{u.pass}</span></div>
                    </div>
                    <div style={{ display:"flex", gap:5 }}>
                      <button onClick={function(){ editUser(u); }} style={{ background:"rgba(79,142,247,0.1)", border:"1px solid rgba(79,142,247,0.2)", borderRadius:7, padding:"5px 9px", color:"#4f8ef7", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Editar</button>
                      <button onClick={function(){ delUser(u.id); }} style={{ background:"rgba(231,76,60,0.08)", border:"1px solid rgba(231,76,60,0.2)", borderRadius:7, padding:"5px 9px", color:"#fc8181", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Borrar</button>
                    </div>
                  </div>
                );
              })}
              <button onClick={function(){setTab("adduser");}} style={{ width:"100%", marginTop:6, padding:"10px", borderRadius:9, border:"1px dashed rgba(79,142,247,0.3)", background:"rgba(79,142,247,0.04)", color:"#4f8ef7", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Agregar nuevo empleado</button>
            </div>
          )}

          {/* ---- ADD/EDIT USER ---- */}
          {tab==="adduser" && (
            <div>
              <div style={{ color:"#64748b", fontSize:13, marginBottom:14 }}>{eid?"Modifica los datos del empleado.":"Completa el formulario."}</div>
              <div style={lbl}>Nombre completo *</div>
              <input style={iS} value={nm} onChange={function(e){setNm(e.target.value);}} placeholder="Ej: Juan Perez" />
              <div style={lbl}>Departamento / Area *</div>
              <select style={{ ...iS, cursor:"pointer" }} value={ar||""} onChange={function(e){setAr(e.target.value);}}>
                <option value="">-- Selecciona --</option>
                {deps.map(function(d){ return <option key={d.id} value={d.name}>{d.name}</option>; })}
              </select>
              <div style={lbl}>Cargo / Puesto *</div>
              <input style={iS} value={rl} onChange={function(e){setRl(e.target.value);}} placeholder="Ej: Ejecutivo de Ventas" />
              <div style={lbl}>Reporta a (jefe directo)</div>
              <select style={{ ...iS, cursor:"pointer" }} value={mgr} onChange={function(e){setMgr(e.target.value);}}>
                <option value={0}>-- Sin jefe directo (nivel top) --</option>
                {users.filter(function(u){ return u.id!==eid; }).map(function(u){ return <option key={u.id} value={u.id}>{u.name} - {u.role}</option>; })}
              </select>
              <div style={lbl}>Contrasena de acceso</div>
              <input style={{ ...iS, marginBottom:20 }} value={pw} onChange={function(e){setPw(e.target.value);}} placeholder="Por defecto: 1234" />
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={saveUser} style={{ flex:1, padding:"11px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>{eid?"Guardar cambios":"Registrar empleado"}</button>
                {eid && <button onClick={function(){setEid(null);setNm("");setRl("");setPw("1234");setMgr(0);setTab("users");}} style={{ padding:"11px 14px", borderRadius:9, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#64748b", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Cancelar</button>}
              </div>
            </div>
          )}

          {/* ---- LIST DEPS ---- */}
          {tab==="deps" && (
            <div>
              {deps.map(function(d){
                var count=0; for(var i=0;i<users.length;i++) if(users[i].area===d.name) count++;
                return (
                  <div key={d.id} style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:11, padding:"12px 14px", marginBottom:8 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:d.color+"22", border:"1px solid "+d.color+"44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:d.color, flexShrink:0 }}>{d.name.slice(0,3).toUpperCase()}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:14 }}>{d.name}</div>
                      <div style={{ color:"#475569", fontSize:12 }}>{count} empleado{count!==1?"s":""}</div>
                    </div>
                    <div style={{ width:12, height:12, borderRadius:"50%", background:d.color, flexShrink:0 }} />
                    <div style={{ display:"flex", gap:5 }}>
                      <button onClick={function(){ editDep(d); setTab("adddep"); }} style={{ background:"rgba(79,142,247,0.1)", border:"1px solid rgba(79,142,247,0.2)", borderRadius:7, padding:"5px 9px", color:"#4f8ef7", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Editar</button>
                      <button onClick={function(){ delDep(d.id); }} style={{ background:"rgba(231,76,60,0.08)", border:"1px solid rgba(231,76,60,0.2)", borderRadius:7, padding:"5px 9px", color:"#fc8181", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Borrar</button>
                    </div>
                  </div>
                );
              })}
              <button onClick={function(){setTab("adddep");}} style={{ width:"100%", marginTop:6, padding:"10px", borderRadius:9, border:"1px dashed rgba(79,142,247,0.3)", background:"rgba(79,142,247,0.04)", color:"#4f8ef7", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Crear nuevo departamento</button>
            </div>
          )}

          {/* ---- ADD/EDIT DEP ---- */}
          {tab==="adddep" && (
            <div>
              <div style={{ color:"#64748b", fontSize:13, marginBottom:14 }}>{did?"Edita el departamento.":"Crea un nuevo departamento. Aparecera en el chat y en el organigrama."}</div>
              <div style={lbl}>Nombre del departamento *</div>
              <input style={iS} value={dn} onChange={function(e){setDn(e.target.value);}} placeholder="Ej: Servicio al Cliente" />
              <div style={lbl}>Color identificador</div>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                <input type="color" value={dc} onChange={function(e){setDc(e.target.value);}} style={{ width:44, height:36, borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", cursor:"pointer", padding:2 }} />
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {["#4f8ef7","#e67e22","#2980b9","#8e44ad","#27ae60","#c0392b","#16a085","#d35400","#e74c3c","#f39c12"].map(function(c){
                    return <button key={c} onClick={function(){setDc(c);}} style={{ width:22, height:22, borderRadius:"50%", background:c, border:dc===c?"3px solid #fff":"2px solid transparent", cursor:"pointer", padding:0, outline:"none" }} />;
                  })}
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ color:"#475569", fontSize:12, marginBottom:6 }}>Vista previa:</div>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:dc+"18", border:"1px solid "+dc+"40", borderRadius:8, padding:"8px 14px" }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:dc+"25", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:dc }}>{dn?dn.slice(0,3).toUpperCase():"DEP"}</div>
                  <span style={{ color:dc, fontWeight:700, fontSize:13 }}>{dn||"Nombre del departamento"}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={saveDep} style={{ flex:1, padding:"11px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>{did?"Guardar cambios":"Crear departamento"}</button>
                {did && <button onClick={function(){setDid(null);setDn("");setDc("#4f8ef7");setTab("deps");}} style={{ padding:"11px 14px", borderRadius:9, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#64748b", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Cancelar</button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── OrgChart ─────────────────────────────────────────────────────── */
function OrgChart({ users, deps, me, onMsg }){
  var [sel,setSel]=useState(null);
  var [filterDep,setFilterDep]=useState("all");

  var staff=users.filter(function(u){ return !u.admin; });

  /* Build tree: find roots (mgr===0 or mgr not found) */
  function getChildren(parentId){
    return staff.filter(function(u){ return Number(u.mgr)===Number(parentId); });
  }
  var roots=staff.filter(function(u){ return !u.mgr||u.mgr===0; });

  /* For current user: find my manager and my direct reports */
  var myMgr=null;
  if(me&&!me.admin){ for(var i=0;i<users.length;i++) if(users[i].id===Number(me.mgr)){ myMgr=users[i]; break; } }
  var myReports=staff.filter(function(u){ return Number(u.mgr)===me.id; });

  /* Flatten to list grouped by dept for filtered view */
  var depList = filterDep==="all" ? deps : deps.filter(function(d){ return d.id===filterDep; });

  /* ---- My position card ---- */
  function MyCard(){
    return (
      <div style={{ background:"linear-gradient(135deg,rgba(79,142,247,0.12),rgba(124,58,237,0.12))", border:"1px solid rgba(79,142,247,0.3)", borderRadius:16, padding:20, marginBottom:28 }}>
        <div style={{ color:"#64748b", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>Mi posicion en la empresa</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:16, alignItems:"flex-start" }}>
          {/* My manager */}
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ color:"#475569", fontSize:11, fontWeight:700, marginBottom:8 }}>Mi jefe directo</div>
            {myMgr ? (
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 12px" }}>
                <Av u={myMgr} sz={36} />
                <div>
                  <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:13 }}>{myMgr.name}</div>
                  <div style={{ color:"#475569", fontSize:11 }}>{myMgr.role}</div>
                  <div style={{ color:col(myMgr), fontSize:11 }}>{myMgr.area}</div>
                </div>
              </div>
            ) : (
              <div style={{ color:"#334155", fontSize:13, padding:"10px 0" }}>Eres el nivel mas alto de la jerarquia.</div>
            )}
          </div>

          {/* Me */}
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ color:"#475569", fontSize:11, fontWeight:700, marginBottom:8 }}>Yo soy</div>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(79,142,247,0.08)", border:"2px solid rgba(79,142,247,0.35)", borderRadius:10, padding:"10px 12px" }}>
              <Av u={me} sz={36} />
              <div>
                <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:13 }}>{me.name}</div>
                <div style={{ color:"#475569", fontSize:11 }}>{me.role}</div>
                <div style={{ color:"#4f8ef7", fontSize:11 }}>{me.area}</div>
              </div>
            </div>
          </div>

          {/* My reports */}
          <div style={{ flex:2, minWidth:200 }}>
            <div style={{ color:"#475569", fontSize:11, fontWeight:700, marginBottom:8 }}>Me reportan ({myReports.length})</div>
            {myReports.length===0 ? (
              <div style={{ color:"#334155", fontSize:13, padding:"10px 0" }}>No tienes personas a tu cargo actualmente.</div>
            ) : (
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {myReports.map(function(u){
                  return (
                    <div key={u.id} style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"8px 10px" }}>
                      <Av u={u} sz={28} />
                      <div>
                        <div style={{ color:"#e2e8f0", fontSize:12, fontWeight:700 }}>{u.name}</div>
                        <div style={{ color:"#475569", fontSize:10 }}>{u.role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---- Recursive node ---- */
  function Node({ u, depth }){
    var children=getChildren(u.id);
    var isMe=u.id===me.id;
    var isSelected=sel&&sel.id===u.id;
    return (
      <div style={{ marginLeft:depth>0?24:0 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:0 }}>
          {depth>0 && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginRight:0, paddingTop:16 }}>
              <div style={{ width:20, height:1, background:"rgba(255,255,255,0.1)" }} />
            </div>
          )}
          <div style={{ flex:1 }}>
            <div
              onClick={function(){ setSel(isSelected?null:u); }}
              style={{ display:"inline-flex", alignItems:"center", gap:10, background:isMe?"rgba(79,142,247,0.1)":isSelected?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.03)", border:isMe?"2px solid rgba(79,142,247,0.4)":"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 14px", cursor:"pointer", marginBottom:6, transition:"all 0.15s" }}>
              <Av u={u} sz={32} />
              <div>
                <div style={{ color:isMe?"#93c5fd":"#e2e8f0", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                  {u.name}
                  {isMe && <span style={{ background:"rgba(79,142,247,0.2)", color:"#4f8ef7", borderRadius:4, padding:"1px 6px", fontSize:10 }}>Yo</span>}
                </div>
                <div style={{ color:"#475569", fontSize:11 }}>{u.role}</div>
                <div style={{ fontSize:10, fontWeight:700, color:col(u) }}>{u.area}</div>
              </div>
              {children.length>0 && <div style={{ color:"#334155", fontSize:11, marginLeft:4 }}>{children.length} rep.</div>}
            </div>

            {/* popup info */}
            {isSelected && (
              <div style={{ background:"#0d1829", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:14, marginBottom:10, marginLeft:4, maxWidth:280 }}>
                <div style={{ color:"#f1f5f9", fontWeight:700, marginBottom:8 }}>{u.name}</div>
                <div style={{ color:"#64748b", fontSize:12, marginBottom:4 }}>Cargo: <span style={{ color:"#94a3b8" }}>{u.role}</span></div>
                <div style={{ color:"#64748b", fontSize:12, marginBottom:4 }}>Area: <span style={{ color:col(u), fontWeight:700 }}>{u.area}</span></div>
                {(function(){
                  var m=null; for(var i=0;i<users.length;i++) if(users[i].id===Number(u.mgr)){ m=users[i]; break; }
                  return m?<div style={{ color:"#64748b", fontSize:12, marginBottom:8 }}>Jefe: <span style={{ color:"#a78bfa" }}>{m.name}</span></div>:null;
                })()}
                {u.id!==me.id && (
                  <button onClick={function(){ onMsg(u); }} style={{ width:"100%", padding:"7px", borderRadius:7, border:"none", background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                    Enviar mensaje
                  </button>
                )}
              </div>
            )}

            {/* children */}
            {children.length>0 && (
              <div style={{ borderLeft:"1px solid rgba(255,255,255,0.08)", marginLeft:16, paddingLeft:0 }}>
                {children.map(function(c){ return <Node key={c.id} u={c} depth={depth+1} />; })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---- By department view ---- */
  function DepView(){
    return (
      <div>
        {depList.map(function(d){
          var members=staff.filter(function(u){ return u.area===d.name; });
          if(members.length===0) return null;
          return (
            <div key={d.id} style={{ background:"rgba(11,18,34,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:d.color+"20", border:"1px solid "+d.color+"40", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:d.color }}>{d.name.slice(0,3).toUpperCase()}</div>
                <div>
                  <div style={{ color:"#f1f5f9", fontWeight:800, fontSize:15 }}>{d.name}</div>
                  <div style={{ color:"#475569", fontSize:12 }}>{members.length} colaborador{members.length!==1?"es":""}</div>
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {members.map(function(u){
                  var mgrU=null; for(var i=0;i<users.length;i++) if(users[i].id===Number(u.mgr)){ mgrU=users[i]; break; }
                  var isMe2=u.id===me.id;
                  return (
                    <div key={u.id} style={{ display:"flex", alignItems:"center", gap:9, background:isMe2?"rgba(79,142,247,0.1)":"rgba(255,255,255,0.03)", border:isMe2?"2px solid rgba(79,142,247,0.35)":"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"10px 12px", minWidth:160 }}>
                      <Av u={u} sz={32} />
                      <div>
                        <div style={{ color:isMe2?"#93c5fd":"#e2e8f0", fontWeight:700, fontSize:12, display:"flex", gap:5, alignItems:"center" }}>
                          {u.name}
                          {isMe2 && <span style={{ background:"rgba(79,142,247,0.2)", color:"#4f8ef7", borderRadius:4, padding:"0px 5px", fontSize:9 }}>Yo</span>}
                        </div>
                        <div style={{ color:"#475569", fontSize:11 }}>{u.role}</div>
                        {mgrU && <div style={{ color:"#334155", fontSize:10 }}>Rep. a: <span style={{ color:"#a78bfa" }}>{mgrU.name.split(" ")[0]}</span></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  var [view, setView] = useState("mine"); // mine | tree | deps

  return (
    <div style={{ flex:1, overflowY:"auto", padding:22 }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ color:"#f1f5f9", fontSize:20, fontWeight:800, marginBottom:4 }}>Organigrama de la Empresa</div>
        <div style={{ color:"#475569", fontSize:13, marginBottom:20 }}>Estructura jerarquica y relaciones de reporte</div>

        {/* View toggle */}
        <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
          {[{id:"mine",l:"Mi Posicion"},{id:"tree",l:"Arbol Jerarquico"},{id:"deps",l:"Por Departamento"}].map(function(v){
            return <button key={v.id} onClick={function(){setView(v.id);}} style={{ background:view===v.id?"rgba(79,142,247,0.15)":"rgba(255,255,255,0.04)", border:view===v.id?"1px solid rgba(79,142,247,0.4)":"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"8px 16px", color:view===v.id?"#4f8ef7":"#64748b", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{v.l}</button>;
          })}
          {view==="deps" && (
            <select value={filterDep} onChange={function(e){setFilterDep(e.target.value);}} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"7px 12px", color:"#94a3b8", fontSize:13, cursor:"pointer", fontFamily:"inherit", outline:"none" }}>
              <option value="all">Todos los departamentos</option>
              {deps.map(function(d){ return <option key={d.id} value={d.id}>{d.name}</option>; })}
            </select>
          )}
        </div>

        {view==="mine" && <MyCard />}

        {view==="tree" && (
          <div style={{ background:"rgba(11,18,34,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:20 }}>
            <div style={{ color:"#64748b", fontSize:12, marginBottom:16 }}>Haz clic en cualquier persona para ver su informacion.</div>
            {roots.length===0 && <div style={{ color:"#334155", textAlign:"center", padding:"24px 0" }}>No hay empleados registrados aun.</div>}
            {roots.map(function(u){ return <Node key={u.id} u={u} depth={0} />; })}
          </div>
        )}

        {view==="deps" && <DepView />}
      </div>
    </div>
  );
}

/* ── APP PRINCIPAL ───────────────────────────────────────────────── */
export default function App(){
  var [deps,  setDeps]  = useState(function(){ return ls("ic_deps", DEF_DEPS);  });
  var [users, setUsers] = useState(function(){ return ls("ic_u",    DEF_USERS); });
  var [msgs,  setMsgs]  = useState(function(){ return ls("ic_m",    DEF_MSGS);  });
  var [dms,   setDms]   = useState(function(){ return ls("ic_d",    {});         });
  var [anns,  setAnns]  = useState(function(){ return ls("ic_a",    DEF_ANNS);  });
  var [me,    setMe]    = useState(null);
  var [sec,   setSec]   = useState("chat");
  var [chan,  setChan]  = useState("general");
  var [dmu,   setDmu]   = useState(null);
  var [side,  setSide]  = useState("ch");
  var [txt,   setTxt]   = useState("");
  var [adm,   setAdm]   = useState(false);
  var [prof,  setProf]  = useState(false);
  var [atit,  setAtit]  = useState(""), [abod,setAbod]=useState(""), [aurg,setAurg]=useState(false);
  var bot=useRef(null), inp=useRef(null);

  useEffect(function(){ sv("ic_deps",deps);  },[deps]);
  useEffect(function(){ sv("ic_u",  users);  },[users]);
  useEffect(function(){ sv("ic_m",  msgs);   },[msgs]);
  useEffect(function(){ sv("ic_d",  dms);    },[dms]);
  useEffect(function(){ sv("ic_a",  anns);   },[anns]);
  useEffect(function(){
    var t=setTimeout(function(){ if(bot.current) bot.current.scrollIntoView({behavior:"smooth"}); },60);
    return function(){ clearTimeout(t); };
  },[msgs,dms,chan,dmu]);

  if(!me) return <Login users={users} onLogin={function(u){ setMe(u); }} />;

  function send(){
    var t=txt.trim(); if(!t) return;
    var m={ id:Date.now(), uid:me.id, text:t, time:new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}) };
    if(dmu){
      var k=[me.id,dmu.id].sort(function(a,b){return a-b;}).join("_");
      setDms(function(p){ var n=Object.assign({},p); n[k]=(p[k]||[]).concat([m]); return n; });
    } else {
      setMsgs(function(p){ var n=Object.assign({},p); n[chan]=(p[chan]||[]).concat([m]); return n; });
    }
    setTxt(""); setTimeout(function(){ if(inp.current) inp.current.focus(); },30);
  }
  function pub(){
    if(!atit.trim()||!abod.trim()) return;
    var a={ id:Date.now(), title:atit.trim(), body:abod.trim(), author:me.name, area:me.area||"Empresa", time:new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}), urgent:aurg };
    setAnns(function(p){ return [a].concat(p); });
    setAtit(""); setAbod(""); setAurg(false);
  }
  function goMsg(u){ setDmu(u); setSec("chat"); setSide("dm"); }
  function byId(id){ for(var i=0;i<users.length;i++) if(users[i].id===id) return users[i]; return null; }
  function dk(a,b){ return [a,b].sort(function(x,y){return x-y;}).join("_"); }

  var cmsg=dmu?(dms[dk(me.id,dmu.id)]||[]):(msgs[chan]||[]);
  var dep=null; for(var i=0;i<deps.length;i++) if(deps[i].id===chan){ dep=deps[i]; break; }
  var stf=users.filter(function(u){ return !u.admin; });

  function sb(act){ return { width:"100%", display:"flex", alignItems:"center", gap:10, padding:"7px 11px", background:act?"rgba(79,142,247,0.1)":"transparent", border:"none", cursor:"pointer", textAlign:"left", borderLeft:act?"3px solid #4f8ef7":"3px solid transparent", fontFamily:"inherit" }; }
  function nb(act){ return { background:act?"rgba(79,142,247,0.12)":"transparent", border:act?"1px solid rgba(79,142,247,0.25)":"1px solid transparent", color:act?"#4f8ef7":"#64748b", borderRadius:7, padding:"5px 11px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }; }
  var is={ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:7, padding:"8px 11px", color:"#f1f5f9", fontSize:13, outline:"none", fontFamily:"inherit" };

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"#060d1a", fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}textarea{resize:none}@keyframes su{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}"}</style>

      {adm && <Admin users={users} setUsers={setUsers} deps={deps} setDeps={setDeps} close={function(){ setAdm(false); }} />}

      {/* NAV */}
      <div style={{ height:50, background:"rgba(6,11,21,0.99)", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", padding:"0 12px", gap:8, flexShrink:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginRight:6 }}>
          <div style={{ width:24, height:24, borderRadius:6, background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", fontWeight:800 }}>IC</div>
          <span style={{ color:"#f1f5f9", fontWeight:800, fontSize:14 }}>IntraConnect</span>
        </div>
        <button onClick={function(){setSec("chat");}}          style={nb(sec==="chat")}>Mensajes</button>
        <button onClick={function(){setSec("announcements");}} style={nb(sec==="announcements")}>Anuncios</button>
        <button onClick={function(){setSec("directory");}}     style={nb(sec==="directory")}>Directorio</button>
        <button onClick={function(){setSec("orgchart");}}      style={nb(sec==="orgchart")}>Organigrama</button>
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
                    {!me.admin && <div style={{ color:"#4f8ef7", fontSize:11 }}>{me.area}</div>}
                  </div>
                </div>
                {me.admin && <button onClick={function(){setAdm(true);setProf(false);}} style={{ width:"100%", marginBottom:7, padding:"8px", borderRadius:7, border:"none", background:"rgba(124,58,237,0.1)", color:"#a78bfa", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Panel Admin</button>}
                <button onClick={function(){setSec("orgchart");setProf(false);}} style={{ width:"100%", marginBottom:7, padding:"8px", borderRadius:7, border:"none", background:"rgba(79,142,247,0.1)", color:"#4f8ef7", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Ver Organigrama</button>
                <button onClick={function(){setMe(null);setProf(false);}} style={{ width:"100%", padding:"8px", borderRadius:7, border:"none", background:"rgba(231,76,60,0.1)", color:"#fc8181", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Cerrar sesion</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ========== CHAT ========== */}
        {sec==="chat" && (
          <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
            <div style={{ width:215, background:"rgba(5,9,18,0.98)", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", flexShrink:0 }}>
              <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"4px 4px 0" }}>
                {[{id:"ch",l:"Canales"},{id:"dm",l:"Directos"}].map(function(t){
                  return <button key={t.id} onClick={function(){setSide(t.id);}} style={{ flex:1, padding:"7px", background:"transparent", border:"none", borderBottom:side===t.id?"2px solid #4f8ef7":"2px solid transparent", color:side===t.id?"#4f8ef7":"#475569", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{t.l}</button>;
                })}
              </div>
              <div style={{ flex:1, overflowY:"auto", padding:"4px 0" }}>
                {side==="ch" ? (
                  <div>
                    <div style={{ padding:"7px 11px 3px", color:"#1e293b", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Canales</div>
                    {deps.map(function(d){
                      var cnt=(msgs[d.id]||[]).length, act=!dmu&&chan===d.id;
                      return (
                        <button key={d.id} onClick={function(){setChan(d.id);setDmu(null);}} style={sb(act)}>
                          <div style={{ width:18, height:18, borderRadius:4, background:d.color+"20", fontSize:8, fontWeight:800, color:d.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{d.name.slice(0,3).toUpperCase()}</div>
                          <span style={{ color:act?"#e2e8f0":"#64748b", fontSize:12, fontWeight:act?700:500, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{d.name}</span>
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
                    {stf.length===0 && <div style={{ padding:"14px 11px", color:"#334155", fontSize:12 }}>Sin empleados.</div>}
                  </div>
                )}
              </div>
            </div>

            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
              <div style={{ padding:"9px 15px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(8,13,24,0.8)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                {dmu ? (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}><Av u={dmu} sz={30} /><div><div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>{dmu.name}</div><div style={{ color:"#475569", fontSize:11 }}>{dmu.role} - {dmu.area}</div></div></div>
                ) : dep ? (
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}><div style={{ width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, background:dep.color+"15", border:"1px solid "+dep.color+"25", color:dep.color }}>{dep.name.slice(0,3).toUpperCase()}</div><div><div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>#{dep.name}</div><div style={{ color:"#475569", fontSize:11 }}>{(msgs[chan]||[]).length} mensajes</div></div></div>
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
                {cmsg.map(function(m,idx){
                  var sndr=byId(m.uid); if(!sndr) return null;
                  var isMe2=m.uid===me.id, grp=idx>0&&cmsg[idx-1].uid===m.uid;
                  return (
                    <div key={m.id} style={{ display:"flex", gap:8, alignItems:"flex-end", flexDirection:isMe2?"row-reverse":"row", marginTop:grp?2:10, animation:"su 0.18s ease" }}>
                      {!grp?<Av u={sndr} sz={26} />:<div style={{ width:26, flexShrink:0 }} />}
                      <div style={{ maxWidth:"72%" }}>
                        {!grp && <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:3, flexDirection:isMe2?"row-reverse":"row" }}><span style={{ color:col(sndr), fontSize:12, fontWeight:700 }}>{isMe2?"Tu":sndr.name}</span><span style={{ color:"#1e293b", fontSize:11 }}>{m.time}</span></div>}
                        <div style={{ background:isMe2?"linear-gradient(135deg,#4f8ef7,#7c3aed)":"rgba(255,255,255,0.06)", borderRadius:isMe2?"12px 3px 12px 12px":"3px 12px 12px 12px", padding:"9px 12px", color:"#e2e8f0", fontSize:14, lineHeight:1.5, border:isMe2?"none":"1px solid rgba(255,255,255,0.07)", wordBreak:"break-word" }}>{m.text}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bot} />
              </div>

              <div style={{ padding:"8px 12px", borderTop:"1px solid rgba(255,255,255,0.06)", background:"rgba(6,10,19,0.98)", flexShrink:0 }}>
                <div style={{ display:"flex", gap:8, alignItems:"flex-end", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"6px 6px 6px 12px" }}>
                  <textarea ref={inp} value={txt} rows={1} onChange={function(e){setTxt(e.target.value);}} onKeyDown={function(e){ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }} placeholder={dmu?"Mensaje a "+dmu.name.split(" ")[0]+"...":"Escribe en #"+(dep?dep.name:"")+"..."} style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#f1f5f9", fontSize:14, lineHeight:1.5, fontFamily:"inherit", maxHeight:80, overflowY:"auto" }} />
                  <button onClick={send} style={{ width:30, height:30, borderRadius:7, border:"none", flexShrink:0, background:txt.trim()?"linear-gradient(135deg,#4f8ef7,#7c3aed)":"rgba(255,255,255,0.05)", color:txt.trim()?"#fff":"#334155", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>&gt;</button>
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
                <textarea value={abod} onChange={function(e){setAbod(e.target.value);}} placeholder="Contenido..." rows={3} style={{ ...is, marginBottom:9, resize:"vertical" }} />
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
                {[{l:"Total empleados",v:stf.length},{l:"Departamentos",v:deps.length}].map(function(s,i){
                  return <div key={i} style={{ background:"rgba(11,18,34,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"12px 14px" }}><div style={{ color:"#f1f5f9", fontSize:22, fontWeight:800 }}>{s.v}</div><div style={{ color:"#475569", fontSize:12 }}>{s.l}</div></div>;
                })}
              </div>
              {stf.length===0 && <div style={{ textAlign:"center", color:"#334155", padding:"32px 0" }}>No hay empleados.{me.admin&&<button onClick={function(){setAdm(true);}} style={{ color:"#4f8ef7", background:"none", border:"none", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}> Abrir Admin</button>}</div>}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))", gap:10 }}>
                {stf.map(function(u){
                  var mgrU=null; for(var i=0;i<users.length;i++) if(users[i].id===Number(u.mgr)){ mgrU=users[i]; break; }
                  return (
                    <div key={u.id} onClick={function(){goMsg(u);}} style={{ background:"rgba(11,18,34,0.95)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:14, cursor:"pointer", transition:"border-color 0.15s" }} onMouseOver={function(e){e.currentTarget.style.borderColor="rgba(79,142,247,0.3)";}} onMouseOut={function(e){e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";}}>
                      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}><Av u={u} sz={36} /><div style={{ minWidth:0 }}><div style={{ color:"#e2e8f0", fontSize:13, fontWeight:700, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{u.name}</div></div></div>
                      <div style={{ background:col(u)+"15", border:"1px solid "+col(u)+"25", borderRadius:5, padding:"2px 7px", marginBottom:5, display:"inline-block" }}><span style={{ color:col(u), fontSize:11, fontWeight:700 }}>{u.area}</span></div>
                      <div style={{ color:"#475569", fontSize:12, marginBottom:4 }}>{u.role}</div>
                      {mgrU && <div style={{ color:"#334155", fontSize:11, marginBottom:8 }}>Reporta a: <span style={{ color:"#a78bfa" }}>{mgrU.name.split(" ")[0]}</span></div>}
                      <button onClick={function(e){e.stopPropagation();goMsg(u);}} style={{ width:"100%", padding:"6px", borderRadius:7, border:"none", background:"rgba(79,142,247,0.1)", color:"#4f8ef7", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Enviar mensaje</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========== ORGANIGRAMA ========== */}
        {sec==="orgchart" && <OrgChart users={users} deps={deps} me={me} onMsg={goMsg} />}

      </div>
    </div>
  );
}