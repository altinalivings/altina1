
import projects from '../../../data/projects.json';
import Link from 'next/link';

export async function generateStaticParams() {
  return projects.map(p => ({ id: p.id }));
}

export default function ListingDetail({ params }) {
  const id = params.id;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return <main style={{padding:24}}>Project not found</main>;
  }
  return (
    <main style={{padding:24}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:24}}>
        <div>
          <h1>{project.title}</h1>
          <p style={{color:'#6b7280'}}>{project.location} • {project.type}</p>
          <div style={{marginTop:12}}><strong>Price:</strong> <span style={{color:'#e9a826'}}>{project.price}</span></div>
          <p style={{marginTop:16}}>{project.description}</p>

          <h3 style={{marginTop:20}}>Amenities</h3>
          <ul>
            {project.amenities.map(a => <li key={a}>{a}</li>)}
          </ul>

          <h3 style={{marginTop:20}}>Gallery</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
            {project.gallery && project.gallery.map((g,i)=>(
              <img key={i} src={g} style={{width:'100%',height:140,objectFit:'cover',borderRadius:6}} alt={`gallery-${i}`} />
            ))}
          </div>
        </div>

        <aside style={{background:'#fff',padding:16,borderRadius:8}}>
          <img src={project.floorPlan} alt="Floorplan" style={{width:'100%',borderRadius:6,marginBottom:12}} />
          <div style={{marginBottom:12}}><a href={project.brochure} target="_blank" rel="noreferrer" className="btn">Download Brochure</a></div>
          <div>
            <h4>Enquire</h4>
            <p>Contact our sales team for more details.</p>
            <a href="/contact" className="btn">Contact</a>
          </div>
        </aside>
      </div>
    </main>
  );
}
