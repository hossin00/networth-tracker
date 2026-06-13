import { useState, useMemo } from 'react';
import { TrendingUp, Plus, Trash2, Edit2, X, DollarSign, Minus } from 'lucide-react';
import { format } from 'date-fns';

interface Asset { id:string; name:string; value:number; type:'asset'|'liability'; category:string; updatedAt:number; }
interface Snapshot { date:string; netWorth:number; }

const ASSET_CATS=['🏠 Real Estate','📈 Stocks','💰 Savings','🚗 Vehicle','💎 Other Assets'];
const LIAB_CATS=['🏦 Mortgage','💳 Credit Card','📚 Student Loan','🚗 Car Loan','💸 Other Debt'];
const SAVE='nw_data_v1';
const load=()=>{ try{return JSON.parse(localStorage.getItem(SAVE)||'{}')}catch{return {}} };
const persist=(d:object)=>localStorage.setItem(SAVE,JSON.stringify(d));

export default function App() {
  const stored=load();
  const [assets,setAssets]=useState<Asset[]>(stored.assets||[]);
  const [snapshots,setSnapshots]=useState<Snapshot[]>(stored.snapshots||[]);
  const [tab,setTab]=useState<'overview'|'assets'|'history'>('overview');
  const [showAdd,setShowAdd]=useState(false);
  const [editItem,setEditItem]=useState<Asset|null>(null);
  const [type,setType]=useState<'asset'|'liability'>('asset');

  const totalAssets=assets.filter(a=>a.type==='asset').reduce((s,a)=>s+a.value,0);
  const totalLiabilities=assets.filter(a=>a.type==='liability').reduce((s,a)=>s+a.value,0);
  const netWorth=totalAssets-totalLiabilities;

  const saveData=(items:Asset[],snaps:Snapshot[])=>{
    setAssets(items); setSnapshots(snaps); persist({assets:items,snapshots:snaps});
  };

  const recordSnapshot=()=>{
    const today=new Date().toISOString().split('T')[0];
    const updated=[...snapshots.filter(s=>s.date!==today),{date:today,netWorth}].sort((a,b)=>a.date.localeCompare(b.date)).slice(-12);
    saveData(assets,updated);
    alert('✅ Net worth recorded!');
  };

  return (
    <div style={{minHeight:'100vh',background:'#040d0a',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'16px 20px',borderBottom:'1px solid #052e1c',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#34d399,#059669)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px #34d39930'}}><TrendingUp size={16} color="white"/></div>
          <div><div style={{fontWeight:'700',fontSize:'16px',color:'white',lineHeight:1}}>NetWorth Tracker</div>
          <div style={{fontSize:'11px',color:'#065f46',marginTop:'2px'}}>{format(new Date(),'MMMM yyyy')}</div></div>
        </div>
        <button onClick={()=>{setEditItem(null);setShowAdd(true);}} style={{display:'flex',alignItems:'center',gap:'5px',padding:'8px 14px',borderRadius:'9px',background:'#34d399',border:'none',color:'white',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter',boxShadow:'0 4px 12px #34d39930'}}>
          <Plus size={13}/> Add
        </button>
      </header>

      {/* Net worth card */}
      <div style={{margin:'16px 20px',padding:'22px',background:'linear-gradient(135deg,#052e1c,#064e3b)',borderRadius:'16px',border:'1px solid #34d39920',boxShadow:'0 8px 32px #34d39910',textAlign:'center'}}>
        <div style={{fontSize:'12px',color:'#6ee7b7',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'6px'}}>Net Worth</div>
        <div style={{fontSize:'40px',fontWeight:'700',color:netWorth>=0?'#34d399':'#f87171',marginBottom:'16px'}}>${Math.abs(netWorth).toLocaleString()}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <div style={{background:'#10b98115',borderRadius:'10px',padding:'12px'}}>
            <div style={{fontSize:'11px',color:'#6ee7b7',marginBottom:'4px'}}>Total Assets</div>
            <div style={{fontSize:'16px',fontWeight:'700',color:'#34d399'}}>${totalAssets.toLocaleString()}</div>
          </div>
          <div style={{background:'#ef444410',borderRadius:'10px',padding:'12px'}}>
            <div style={{fontSize:'11px',color:'#fca5a5',marginBottom:'4px'}}>Total Liabilities</div>
            <div style={{fontSize:'16px',fontWeight:'700',color:'#f87171'}}>${totalLiabilities.toLocaleString()}</div>
          </div>
        </div>
        <button onClick={recordSnapshot} style={{marginTop:'14px',padding:'8px 18px',borderRadius:'8px',background:'#34d39920',border:'1px solid #34d39930',color:'#6ee7b7',fontSize:'12px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter'}}>
          📸 Record snapshot
        </button>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',padding:'0 20px',borderBottom:'1px solid #052e1c'}}>
        {([['overview','Overview'],['assets','All Items'],['history','History']] as const).map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:'10px 14px',fontSize:'12px',fontWeight:'500',borderBottom:`2px solid ${tab===id?'#34d399':'transparent'}`,color:tab===id?'#34d399':'#065f46',background:'none',border:'none',borderBottomWidth:'2px',borderBottomStyle:'solid',cursor:'pointer',fontFamily:'Inter',transition:'all 0.2s'}}>{label}</button>
        ))}
      </div>

      <div style={{flex:1,overflow:'auto',padding:'16px 20px'}}>
        {tab==='overview'&&(
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {assets.length===0?(
              <div style={{textAlign:'center',padding:'60px 20px'}}>
                <div style={{fontSize:'52px',marginBottom:'16px'}}>💎</div>
                <h3 style={{fontSize:'20px',fontWeight:'700',color:'white',marginBottom:'8px'}}>Start tracking your wealth</h3>
                <p style={{color:'#065f46',fontSize:'14px',marginBottom:'24px',lineHeight:'1.6',maxWidth:'240px',margin:'0 auto 24px'}}>Add your assets and liabilities to see your net worth.</p>
                <button onClick={()=>setShowAdd(true)} style={{padding:'12px 24px',borderRadius:'10px',background:'#34d399',border:'none',color:'white',fontSize:'14px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter',boxShadow:'0 4px 16px #34d39930'}}>Add first item</button>
              </div>
            ):(
              <>
                {(['asset','liability'] as const).map(t=>{
                  const items=assets.filter(a=>a.type===t);
                  const total=items.reduce((s,a)=>s+a.value,0);
                  if(items.length===0)return null;
                  const col=t==='asset'?'#34d399':'#f87171';
                  return <div key={t} style={{background:'#0a1a12',border:'1px solid #052e1c',borderRadius:'14px',padding:'16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                      <span style={{fontSize:'13px',fontWeight:'600',color:col,textTransform:'capitalize'}}>{t==='asset'?'Assets':'Liabilities'}</span>
                      <span style={{fontSize:'14px',fontWeight:'700',color:col}}>${total.toLocaleString()}</span>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      {items.map(a=>(
                        <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 10px',background:'#052e1c30',borderRadius:'8px',cursor:'pointer'}}
                          onClick={()=>{setEditItem(a);setShowAdd(true);}}>
                          <span style={{fontSize:'13px',color:'#d1fae5'}}>{a.name}</span>
                          <span style={{fontSize:'13px',fontWeight:'600',color:col}}>${a.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>;
                })}
              </>
            )}
          </div>
        )}
        {tab==='assets'&&(
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {assets.map(a=>{
              const col=a.type==='asset'?'#34d399':'#f87171';
              return <div key={a.id} style={{background:'#0a1a12',border:'1px solid #052e1c',borderRadius:'12px',padding:'13px',display:'flex',alignItems:'center',gap:'10px',transition:'all 0.2s',cursor:'pointer'}}
                onClick={()=>{setEditItem(a);setShowAdd(true);}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#34d39920'} onMouseLeave={e=>e.currentTarget.style.borderColor='#052e1c'}>
                <div style={{flex:1}}>
                  <div style={{color:'white',fontSize:'13px',fontWeight:'500'}}>{a.name}</div>
                  <div style={{color:'#065f46',fontSize:'11px',marginTop:'2px'}}>{a.category} · Updated {format(new Date(a.updatedAt),'MMM d')}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
                  <span style={{fontSize:'14px',fontWeight:'700',color:col}}>{a.type==='asset'?'+':'-'}${a.value.toLocaleString()}</span>
                  <button onClick={e=>{e.stopPropagation();const u=assets.filter(x=>x.id!==a.id);saveData(u,snapshots);}} style={{padding:'4px',background:'none',border:'none',cursor:'pointer',color:'#065f46'}}><Trash2 size={13}/></button>
                </div>
              </div>;
            })}
          </div>
        )}
        {tab==='history'&&(
          <div>
            {snapshots.length===0?(
              <div style={{textAlign:'center',padding:'40px 20px'}}>
                <div style={{fontSize:'40px',marginBottom:'12px'}}>📊</div>
                <p style={{color:'#065f46',fontSize:'14px',lineHeight:'1.6'}}>Click "Record snapshot" to start tracking your net worth over time.</p>
              </div>
            ):(
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {[...snapshots].reverse().map((s,i)=>{
                  const prev=snapshots[snapshots.length-2-i];
                  const diff=prev?s.netWorth-prev.netWorth:0;
                  return <div key={s.date} style={{background:'#0a1a12',border:'1px solid #052e1c',borderRadius:'12px',padding:'13px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{color:'white',fontSize:'13px',fontWeight:'500'}}>{format(new Date(s.date),'MMMM d, yyyy')}</div>
                      {diff!==0&&<div style={{fontSize:'11px',color:diff>=0?'#34d399':'#f87171',marginTop:'2px'}}>{diff>=0?'+':''}{diff>=0?'+':''}${diff.toLocaleString()} vs previous</div>}
                    </div>
                    <span style={{fontSize:'16px',fontWeight:'700',color:s.netWorth>=0?'#34d399':'#f87171'}}>${s.netWorth.toLocaleString()}</span>
                  </div>;
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showAdd&&(
        <div style={{position:'fixed',inset:0,background:'#00000080',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div style={{width:'100%',background:'#0a1a12',borderRadius:'20px 20px 0 0',border:'1px solid #052e1c',borderBottom:'none',padding:'24px',maxHeight:'80vh',overflowY:'auto'}}>
            <div style={{width:'36px',height:'3px',background:'#052e1c',borderRadius:'2px',margin:'0 auto 20px'}}/>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'18px'}}>
              <h3 style={{color:'white',fontSize:'16px',fontWeight:'700',fontFamily:'Inter'}}>{editItem?'Edit Item':'Add Item'}</h3>
              <button onClick={()=>{setShowAdd(false);setEditItem(null);}} style={{background:'none',border:'none',cursor:'pointer',color:'#065f46'}}>✕</button>
            </div>
            <AssetForm asset={editItem} onSave={a=>{const u=assets.find(x=>x.id===a.id)?assets.map(x=>x.id===a.id?a:x):[a,...assets];saveData(u,snapshots);setShowAdd(false);setEditItem(null);}} />
          </div>
        </div>
      )}
    </div>
  );
}

function AssetForm({asset,onSave}:{asset:Asset|null;onSave:(a:Asset)=>void}) {
  const [type,setType]=useState<'asset'|'liability'>(asset?.type||'asset');
  const [name,setName]=useState(asset?.name||'');
  const [value,setValue]=useState(asset?.value.toString()||'');
  const [cat,setCat]=useState(asset?.category||(asset?.type==='liability'?LIAB_CATS[0]:ASSET_CATS[0]));
  const cats=type==='asset'?ASSET_CATS:LIAB_CATS;
  const inp={width:'100%',background:'#040d0a',border:'1px solid #052e1c',borderRadius:'10px',padding:'11px 14px',color:'white',fontSize:'14px',outline:'none',fontFamily:'Inter'};
  const submit=()=>{
    if(!name.trim()||!value)return;
    onSave({id:asset?.id||crypto.randomUUID(),name:name.trim(),value:parseFloat(value),type,category:cat,updatedAt:Date.now()});
  };
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
        {(['asset','liability'] as const).map(t=><button key={t} onClick={()=>{setType(t);setCat(t==='asset'?ASSET_CATS[0]:LIAB_CATS[0]);}} style={{padding:'10px',borderRadius:'10px',border:`1px solid ${type===t?(t==='asset'?'#34d399':'#f87171'):'#052e1c'}`,background:type===t?(t==='asset'?'#34d39915':'#f8717115'):'transparent',color:type===t?(t==='asset'?'#34d399':'#f87171'):'#065f46',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter',transition:'all 0.2s',textTransform:'capitalize'}}>{t}</button>)}
      </div>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name (e.g. House, Savings)" style={inp} autoFocus onFocus={e=>e.target.style.borderColor='#34d399'} onBlur={e=>e.target.style.borderColor='#052e1c'}/>
      <input type="number" value={value} onChange={e=>setValue(e.target.value)} placeholder="Value ($)" style={inp} onFocus={e=>e.target.style.borderColor='#34d399'} onBlur={e=>e.target.style.borderColor='#052e1c'}/>
      <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:'5px 10px',borderRadius:'20px',border:`1px solid ${cat===c?'#34d399':'#052e1c'}`,background:cat===c?'#34d39915':'transparent',color:cat===c?'#6ee7b7':'#065f46',fontSize:'12px',cursor:'pointer',fontFamily:'Inter'}}>{c}</button>)}
      </div>
      <button onClick={submit} disabled={!name.trim()||!value} style={{padding:'14px',borderRadius:'12px',background:!name.trim()||!value?'#052e1c':'#34d399',border:'none',color:'white',fontSize:'15px',fontWeight:'700',cursor:!name.trim()||!value?'not-allowed':'pointer',fontFamily:'Inter',opacity:!name.trim()||!value?0.5:1}}>{asset?'Save Changes':'Add Item'}</button>
    </div>
  );
}