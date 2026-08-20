import { FaPhoneVolume } from 'react-icons/fa';

// Bangladesh national helpline short-codes — public service numbers, same
// for every institution, so shown as fixed reference info (dial directly).
const HOTLINES = [
  { number:'৩৩৩',  dial:'333',  label:'সরকারি তথ্য',   color:'#1565C0' },
  { number:'৯৯৯',  dial:'999',  label:'জরুরি সেবা',    color:'#C62828' },
  { number:'১০৯',  dial:'109',  label:'নারী ও শিশু',   color:'#7B1FA2' },
  { number:'১০৬',  dial:'106',  label:'দুদক',           color:'#E65100' },
  { number:'১০৯০', dial:'1090', label:'দুর্যোগ',        color:'#37474F' },
  { number:'১০৯৮', dial:'1098', label:'শিশু সহায়তা',   color:'#2E7D32' },
];

export default function HotlineWidget() {
  return (
    <div className="card overflow-hidden">
      <div className="section-title" style={{ background:'linear-gradient(90deg,#B71C1C,#C62828)' }}>
        <FaPhoneVolume size={14}/>
        <span>জরুরি হটলাইন</span>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {HOTLINES.map(h => (
          <a key={h.dial} href={`tel:${h.dial}`}
            className="flex flex-col items-center justify-center text-center py-2.5 px-1 border-2 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ borderColor: h.color, borderRadius:'var(--border-radius)' }}>
            <span className="text-lg font-extrabold" style={{ color: h.color }}>{h.number}</span>
            <span className="text-xs text-gray-500 mt-0.5">{h.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
