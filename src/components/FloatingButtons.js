export default function FloatingButtons() {
  const phone = "+918891234195"; // change if needed
  const waNumber = "918891234195"; // no +, for wa.me
  const waText = encodeURIComponent("Hi Altina Livings, I'm interested in your projects.");
  return (
    <div className="fab-stack">
      <a href={`tel:${phone}`} className="fab-btn fab-call" aria-label="Request a Call" title="Request a Call">☎</a>
      <a href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="fab-btn fab-wa" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">𝚆</a>
    </div>
  );
}
