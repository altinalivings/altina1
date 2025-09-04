export default function FloatingButtons({ onRequestCall }) {
  const waNumber = "918891234195"; // change if needed (no + sign)
  const waText = encodeURIComponent("Hi Altina Livings, I'm interested in your projects.");
  return (
    <div className="fab-stack">
      <button onClick={onRequestCall} className="fab-btn fab-call" aria-label="Request a Call" title="Request a Call">☎</button>
      <a href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="fab-btn fab-wa" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">𝚆</a>
    </div>
  );
}
