const events = [
  {id:"e1", title:"Neon Nights: Live Music", category:"Music", date:"Fri, 24 Oct 2026", time:"7:30 PM", venue:"The Grand Arena, Chennai", price:899, emoji:"🎤", cover:"cover-music", description:"A high-energy live music night with local favourites and a spectacular light show."},
  {id:"e2", title:"Laugh Out Loud", category:"Comedy", date:"Sat, 25 Oct 2026", time:"6:00 PM", venue:"Studio One, Coimbatore", price:499, emoji:"😂", cover:"cover-comedy", description:"A feel-good stand-up evening packed with sharp observations and big laughs."},
  {id:"e3", title:"Colours of the Canvas", category:"Arts", date:"Sun, 26 Oct 2026", time:"11:00 AM", venue:"Art House, Chennai", price:349, emoji:"🎨", cover:"cover-arts", description:"Explore contemporary art, meet creators and discover hands-on creative sessions."},
  {id:"e4", title:"FutureTech Summit", category:"Technology", date:"Thu, 30 Oct 2026", time:"9:00 AM", venue:"Innovation Hub, Bengaluru", price:1299, emoji:"🚀", cover:"cover-tech", description:"A one-day gathering for people building the next wave of technology."},
  {id:"e5", title:"Indie by the Sea", category:"Music", date:"Fri, 31 Oct 2026", time:"5:30 PM", venue:"Bayfront Stage, Chennai", price:699, emoji:"🎸", cover:"cover-music", description:"Discover independent artists in an open-air sunset concert."},
  {id:"e6", title:"The Improv Room", category:"Comedy", date:"Sat, 1 Nov 2026", time:"7:00 PM", venue:"Laugh Lab, Coimbatore", price:399, emoji:"🎭", cover:"cover-comedy", description:"No script, no repeats: an improvised comedy show made with audience suggestions."}
];
const $ = s => document.querySelector(s);
const money = n => "₹" + n.toLocaleString("en-IN");
let selectedEvent = null;
let selectedSeats = [];
let toastTimer;
function getBookings(){ try{return JSON.parse(localStorage.getItem("seatspark-bookings")||"[]")}catch{return []} }
function saveBookings(items){localStorage.setItem("seatspark-bookings",JSON.stringify(items))}
function renderEvents(){
  const q=$("#search").value.trim().toLowerCase(), cat=$("#category").value;
  const visible=events.filter(e=>(cat==="All"||e.category===cat)&&(e.title+" "+e.venue+" "+e.category).toLowerCase().includes(q));
  $("#event-grid").innerHTML=visible.length?visible.map(e=>`<article class="event-card"><div class="event-cover ${e.cover}"><span class="category-tag">${e.category}</span><span class="emoji">${e.emoji}</span></div><div class="event-body"><div class="event-date">${e.date.toUpperCase()} · ${e.time}</div><h3>${e.title}</h3><div class="event-meta"><span>⌖ ${e.venue}</span><span>◷ ${e.description}</span></div><div class="event-foot"><div class="price">${money(e.price)} <small>/ person</small></div><button class="book-btn" data-book="${e.id}">Book tickets ↗</button></div></div></article>`).join(""):`<div class="empty-state">No events match your search. Try another keyword or category.</div>`;
}
function renderBookings(){
 const items=getBookings();
 $("#booking-list").innerHTML=items.length?items.slice().reverse().map(b=>`<div class="booking-row"><div class="booking-emoji">${b.emoji}</div><div class="booking-info"><b>${b.title}</b><small>${b.date} · ${b.seats.join(", ")} · Booking ID ${b.code}</small></div><span class="booking-status">CONFIRMED · DEMO</span><button class="secondary-btn" data-cancel="${b.code}">Cancel</button></div>`).join(""):`<div class="empty-state">🎟️<br><br>No bookings yet. Choose an event above to reserve your first seats.</div>`;
}
function openBooking(id){
 selectedEvent=events.find(e=>e.id===id);selectedSeats=[];
 const booked=getBookings().filter(b=>b.eventId===id).flatMap(b=>b.seats);
 const seats=Array.from({length:30},(_,i)=>`A${i+1}`);
 $("#dialog-content").innerHTML=`<p class="eyebrow">RESERVE YOUR SEAT</p><h2 class="dialog-title">${selectedEvent.title}</h2><p class="dialog-muted">${selectedEvent.date} · ${selectedEvent.time}<br>${selectedEvent.venue}</p><div class="screen-line">STAGE / SCREEN</div><div class="seat-legend"><span>Available</span><span class="selected">Selected</span><span class="taken">Booked</span></div><div class="seat-map">${seats.map(s=>`<button class="seat ${booked.includes(s)?"taken":""}" data-seat="${s}" ${booked.includes(s)?"disabled":""}>${s}</button>`).join("")}</div><div class="checkout-total"><span id="seat-count">0 seats selected</span><span id="total">${money(0)}</span></div><button class="confirm-btn" id="confirm-booking" disabled>Confirm demo booking</button><p class="dialog-muted">Demo mode: no payment is collected. Booking data is saved in this browser.</p>`;
 $("#booking-dialog").showModal();
}
function updateSelection(){
 $("#seat-count").textContent=`${selectedSeats.length} seat${selectedSeats.length===1?"":"s"} selected`;
 $("#total").textContent=money(selectedSeats.length*selectedEvent.price);
 $("#confirm-booking").disabled=selectedSeats.length===0;
}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2800)}
document.addEventListener("click",e=>{
 const book=e.target.closest("[data-book]");if(book)openBooking(book.dataset.book);
 const seat=e.target.closest("[data-seat]");
 if(seat&&!seat.disabled){const s=seat.dataset.seat;if(selectedSeats.includes(s)){selectedSeats=selectedSeats.filter(x=>x!==s);seat.classList.remove("selected")}else if(selectedSeats.length<8){selectedSeats.push(s);seat.classList.add("selected")}else showToast("Maximum 8 seats per demo booking.");updateSelection()}
 if(e.target.id==="confirm-booking"&&selectedSeats.length&&selectedEvent){
  const items=getBookings();const code="SS"+Math.random().toString(36).slice(2,8).toUpperCase();
  items.push({code,eventId:selectedEvent.id,title:selectedEvent.title,emoji:selectedEvent.emoji,date:selectedEvent.date,seats:[...selectedSeats],total:selectedSeats.length*selectedEvent.price,createdAt:new Date().toISOString()});
  saveBookings(items);$("#booking-dialog").close();renderBookings();showToast(`Demo booking confirmed! ID: ${code}`);$("#my-bookings").scrollIntoView({behavior:"smooth"});
 }
 const cancel=e.target.closest("[data-cancel]");if(cancel){saveBookings(getBookings().filter(b=>b.code!==cancel.dataset.cancel));renderBookings();showToast("Demo booking cancelled.")}
});
$("#search").addEventListener("input",renderEvents);
$("#category").addEventListener("change",renderEvents);
$("#clear-bookings").addEventListener("click",()=>{if(confirm("Clear all demo bookings saved in this browser?")){saveBookings([]);renderBookings();showToast("Demo bookings cleared.")}});
renderEvents();renderBookings();
