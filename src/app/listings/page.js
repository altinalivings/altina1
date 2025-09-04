
import React from 'react';
import PropertyCard from '../../components/PropertyCard';

const SAMPLE = [
  {id:'p1', title:'Luxury 3BHK in South Delhi', price:'₹ 2.4 Cr', area:1800, type:'Apartment', amenities:['Pool','Gym','Parking'], image:'/assets/img/hero-default.jpg'},
  {id:'p2', title:'Premium Villa with Garden', price:'₹ 6.2 Cr', area:4200, type:'Villa', amenities:['Garden','Clubhouse','Security'], image:'/assets/img/hero-default.jpg'},
  {id:'p3', title:'Modern 2BHK near IT Hub', price:'₹ 1.1 Cr', area:900, type:'Apartment', amenities:['Gym','Parking'], image:'/assets/img/hero-default.jpg'}
];

export default function ListingsPage(){
  return (
    <main style={{padding:24}}>
      <h1>Featured Properties</h1>
      <p style={{color:'#9aa4b2'}}>Hand-picked premium listings. Work with us as a channel partner to get exclusive deals.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16,marginTop:18}}>
        {SAMPLE.map(p=> <PropertyCard key={p.id} property={p} />)}
      </div>
    </main>
  );
}
