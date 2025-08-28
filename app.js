// ====== Locations ======
const locations = [
  { state: "Bihar", districts: [ { name: "Aurangabad", cities: [{name:"Daudnagar", pincode:"824143"}] } ] }
];

const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const citySelect = document.getElementById("citySelect");

const formState = document.getElementById("formState");
const formDistrict = document.getElementById("formDistrict");
const formCity = document.getElementById("formCity");

function populateDistricts(stateValue, districtDropdown, cityDropdown){
    districtDropdown.innerHTML = '<option value="">Select District</option>';
    cityDropdown.innerHTML = '<option value="">Select City</option>';
    cityDropdown.disabled = true;
    const stateObj = locations.find(s=>s.state===stateValue);
    if(stateObj){
        districtDropdown.disabled = false;
        stateObj.districts.forEach(d => districtDropdown.innerHTML += `<option value="${d.name}">${d.name}</option>`);
    } else districtDropdown.disabled=true;
}

function populateCities(stateValue, districtValue, cityDropdown){
    cityDropdown.innerHTML = '<option value="">Select City</option>';
    const stateObj = locations.find(s=>s.state===stateValue);
    if(!stateObj) return;
    const districtObj = stateObj.districts.find(d=>d.name===districtValue);
    if(districtObj){
        cityDropdown.disabled=false;
        districtObj.cities.forEach(c => cityDropdown.innerHTML += `<option value="${c.name}">${c.name} (${c.pincode})</option>`);
    } else cityDropdown.disabled=true;
}

// Populate states
locations.forEach(s => {
    stateSelect.innerHTML += `<option value="${s.state}">${s.state}</option>`;
    formState.innerHTML += `<option value="${s.state}">${s.state}</option>`;
});

stateSelect.addEventListener('change',()=>populateDistricts(stateSelect.value,districtSelect,citySelect));
districtSelect.addEventListener('change',()=>populateCities(stateSelect.value,districtSelect.value,citySelect));

formState.addEventListener('change',()=>populateDistricts(formState.value,formDistrict,formCity));
formDistrict.addEventListener('change',()=>populateCities(formState.value,formDistrict.value,formCity));


// ====== Firebase ======
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAV2urSFCepmH-mNhsC-yXA4SKk6c2Cfm4",
  authDomain: "connect4you-2c70b.firebaseapp.com",
  projectId: "connect4you-2c70b",
  storageBucket: "connect4you-2c70b.appspot.com",
  messagingSenderId: "781589980644",
  appId: "1:781589980644:web:a5c3ed8e85c644bf6893f1"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const listContainer = document.getElementById("business-list");

async function loadBusinesses(cityFilter){
    listContainer.innerHTML = '';
    const snapshot = await getDocs(collection(db,"businesses"));
    snapshot.forEach(doc=>{
        const data = doc.data();
        if(!cityFilter || data.city===cityFilter){
            listContainer.innerHTML += `
            <div class="card">
                <img src="${data.image || 'https://dummyimage.com/200x120/ccc/000.png&text=Business'}" alt="Business">
                <h4>${data.businessName}</h4>
                <p>${data.category}</p>
            </div>`;
        }
    });
}
loadBusinesses();
citySelect.addEventListener('change',()=>loadBusinesses(citySelect.value));


// ====== Popup Form ======
const openForm = document.getElementById("openForm");
const popupForm = document.getElementById("popupForm");
const form = document.getElementById("businessForm");
const message = document.getElementById("formMessage");

openForm.addEventListener('click', e=>{
    e.preventDefault();
    popupForm.style.display='flex';

    // Reset form dropdowns
    formState.innerHTML = '<option value="">Select State</option>';
    locations.forEach(s => formState.innerHTML += `<option value="${s.state}">${s.state}</option>`);
    formDistrict.innerHTML = '<option value="">Select District</option>';
    formDistrict.disabled=true;
    formCity.innerHTML = '<option value="">Select City</option>';
    formCity.disabled=true;
});

window.closeForm = ()=>popupForm.style.display='none';

form.addEventListener('submit', async e=>{
    e.preventDefault();
    const businessName = document.getElementById("businessName").value.trim();
    const category = document.getElementById("category").value.trim();
    const ownerName = document.getElementById("ownerName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const state = formState.value;
    const district = formDistrict.value;
    const city = formCity.value;
    const image = document.getElementById("image").value.trim();

    if(!businessName||!category||!ownerName||!email||!phone||!state||!district||!city){
        message.innerText="❌ Fill all required fields!";
        message.style.color="red";
        return;
    }

    try{
        await addDoc(collection(db,"businesses"), {businessName,category,ownerName,email,phone,state,district,city,image,timestamp:new Date()});
        message.innerText="✅ Business submitted successfully!";
        message.style.color="green";
        form.reset();
        closeForm();
        loadBusinesses(city);
    }catch(err){
        console.error(err);
        message.innerText="❌ Error submitting business!";
        message.style.color="red";
    }
});


// ====== Floating Tech Animation ======
const hero = document.querySelector('.hero');

function createFloatingElement() {
    const shapes = ['circle','hexagon'];
    const element = document.createElement('div');
    element.className = 'floating-tech';
    const size = 10 + Math.random()*30;
    const left = Math.random()*100;
    const top = Math.random()*100;

    element.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: ${top}%;
        opacity: ${0.2 + Math.random()*0.5};
        background: ${Math.random()>0.5 ?
            'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' :
            'linear-gradient(45deg, rgba(46,204,113,0.3) 0%, rgba(39,174,96,0.3) 100%)'};
        border-radius: ${shapes[Math.floor(Math.random()*shapes.length)]==='circle'?'50%':'10%'};
        animation: floatUpDown ${15 + Math.random()*15}s ease-in-out infinite alternate,
                   rotate ${20 + Math.random()*20}s linear infinite;
    `;
    hero.appendChild(element);
}

function generateTechElements() {
    const count = window.innerWidth>768 ? 25 : 10;
    document.querySelectorAll('.floating-tech').forEach(el=>el.remove());
    Array.from({length: count}).forEach(createFloatingElement);
}

window.addEventListener('load', generateTechElements);
window.addEventListener('resize', generateTechElements);


// ====== Animation CSS ======
const style = document.createElement('style');
style.textContent = `
.floating-tech { will-change: transform, opacity; }
@keyframes floatUpDown {
    0% { transform: translateY(0); opacity: 0.3; }
    50% { transform: translateY(20px); opacity: 0.6; }
    100% { transform: translateY(0); opacity: 0.3; }
}
@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);


