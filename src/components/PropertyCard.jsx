
'use client';
import React from 'react';

export default function PropertyCard({property}) {
  const {title, price, area, type, amenities, image, id} = property;
  return (
    <div className="property-card" style={{background:'#07101a',padding:16,borderRadius:12,boxShadow:'0 8px 30px rgba(0,0,0,0.6)'}}>
      <div style={{height:160,overflow:'hidden',borderRadius:8,marginBottom:12}}>
        <img src={image || '/assets/img/hero-default.jpg'} alt={title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
      </div>
      <h3 style={{margin:'6px 0'}}>{title}</h3>
      <div style={{color:'#9aa4b2',fontSize:14,marginBottom:8}}>{type} • {area} sq ft</div>
      <div style={{fontWeight:800,color:'#e9a826',marginBottom:8}}>{price}</div>
      <div style={{fontSize:13,color:'#9aa4b2',marginBottom:12}}>
        {amenities && amenities.slice(0,4).map(a=> <span key={a} style={{marginRight:8}}>{a}</span>)}
      </div>
      <div style={{display:'flex',gap:8}}>
        <a href={"/listings/"+id} className="btn" style={{flex:1,textAlign:'center'}}>View</a>
        <a href="/contact" className="cta-secondary" style={{flex:1,textAlign:'center'}}>Contact</a>
      </div>
    </div>
  );
}
