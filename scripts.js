// your weather wala tab
const userTab = document.querySelector("[data-userWeather]");
// search weather wala tab
const searchTab = document.querySelector("[data-searchWeather]");
// pura container jisme wearher ki information show hogi
const userContainer = document.querySelector(".weather-container");
// location wala div
const grantAccessContainer = document.querySelector(".grant-location-container");
//second page me search wala form
const searchForm = document.querySelector("[data-searchForm]");
// puri loading screen
const loadingScreen = document.querySelector(".loading-container");
// main container jaha sare chezee show hogi
const userInfoContainer = document.querySelector(".user-info-container");

// ek variable le rhe hai jo ye bata raha hai current tab konsa hai 
let oldTab = userTab;
const API_KEY = "5d8624a2770a834f337761f107bbb9ff";
// jo user tab currently chal raha hai uske baground  grey kerenge
oldTab.classList.add("current-tab");
// coordinates stored honge to theek hai nhi to user se request kerenge
getfromSessionStorage();

// ek function create kerenge jo tab switch hone pr baground bhe switch krega
function switchTab(newTab){
    if(newTab!=oldTab){
        // purani tab ko hata k new wala tab active ker rahe hai
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");


        // tab hange kerenge agar search form wala cheez pahele se active hua 
        // means hum search city wale section me hai to vo wala cheez bhe hume
        // hatana padega 
        if(!searchForm.classList.contains("active")){
            // search form wala container active hai to remove kerna padega 
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //pahele mai search weather wale section me tha  but aab mujhe search form wale me jana hai
            // to mujhe your weather me jana hai but ppahele se ek searched location 
            // wala section active hoga to usko hata k current location wale jahja 
            // active kerne paegi
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    
    }
}
function getfromSessionStorage(){
    //fetching local cordinates from session if present hoga to theek hai otherwise
    //  grant location wala container se feetch llerwa leenge 
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //this shows that we dont have any coordinate stored in session storage
        grantAccessContainer.classList.add("active"); 
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}= coordinates;
//    coordinates milne k bad vo conntainer remove kerna padega 
grantAccessContainer.classList.remove("active");
//jab tak load nhi hua hai tab tak loading wale screen chow kerwani padegi
loadingScreen.classList.add("active");
 
// API CALL for fetching rest data
try{
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
    const data = await response.json();
    
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    
    renderWeatherInfo(data);
}
catch(error){
    // console.log(error);
    loadingScreen.classList.remove("active");
    // 404 wala image show kerna hoga 
    // errorContainer.classList.add("active");
}

}
function renderWeatherInfo(weatherInfo){
   
    // Jis Jis cheez me kaam hai vo sare elemens fetch ker lenge
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    // console.log(fetching weather info is done);

   // fetched values ko show kerenge
   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText = `${weatherInfo?.main?.temp} °C`;
   windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText = `${weatherInfo?.main?.humidity}%`;
   cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}
// function which will call an alert box when we click on grant location button
function getLocation() {
    // if geo location avalable hoti hai to usko ek function k through session storage me update ker denge
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

//function to store cordinates into local session storage
function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")
    return;
    else 
    fetchSearchWeatherInfo(cityName);
});
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}