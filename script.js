
const LEADERBOARD_BACKGROUNDS = {
    1: "linear-gradient(90deg, rgba(0,0,0,0) 20%, gold 30%, gold 77%, rgba(0,0,0,0) 87%)",
    2: "linear-gradient(90deg, rgba(0,0,0,0) 20%, silver 30%, silver 77%, rgba(0,0,0,0) 87%)",
    3: "linear-gradient(90deg, rgba(0,0,0,0) 20%, rgb(185, 133, 108) 30%, rgb(185, 133, 108) 77%, rgba(0,0,0,0) 87%)"
}
/**
 * @param {{name:string, authors:[{name:string}], imageurl:string, upcomingimageurl:string|None, gamebananaurl:string, description:string, difficulty:string, releaseAt:Number|None, isCurrent:boolean, order:Number}} data
 * @param {[[timestamp: string, name: string, discord: string, result: string, link: string, swear: string]]} leaderboardData
 * @returns {div}
 */
function generateGame(data, leaderboardData, nr=0) {

    let upcoming = false;
    if (data.releaseAt != null && (data.releaseAt * 1000) > (new Date().getTime())) {
        data.name = `${data.difficulty ?? "Unknown Difficulty"} Map`;
        data.gamebananaurl = "#";
        data.description = " ";
        data.difficulty = "???";
        data.imageurl = (data.upcomingimageurl != null ? data.upcomingimageurl : "");

        upcoming = true;
    }
    let hideLeaderboard = upcoming || data.isCurrent;
    // leaderboard

    let leaderboard = document.createElement('div');
    leaderboard.className = "row ms-0 me-0 p-2";
    if(!hideLeaderboard) {
        leaderboardData.forEach((row, i) => {
            if (i == 0) return;

            let leaderboardRow = document.createElement('div');
            leaderboardRow.className = "row justify-content-center ms-0 me-0 ps-0 pe-0";

            if(LEADERBOARD_BACKGROUNDS[i] != null) {
                leaderboardRow.style.background = LEADERBOARD_BACKGROUNDS[i];
            }

            let nr = document.createElement('div');
            nr.className = "col-2 col-sm-1 pe-1 text-end";
            let name = document.createElement('div');
            name.className = "col-5 col-sm-5 ps-1 pe-1 text-break text-start";
            let result = document.createElement('div');
            result.className = "col-2 col-sm-1 align-self-start text-end";

            nr.innerText = `${i}.`;
            name.innerText = row[1];
            if(row[4].length > 3) {
                result.innerHTML = `<a href="${row[4]}" target="_blank">${row[3]}</a>`;
            } else {
                result.innerText = row[3];
            }

            leaderboardRow.appendChild(nr);
            leaderboardRow.appendChild(name);
            leaderboardRow.appendChild(result);

            leaderboard.appendChild(leaderboardRow);
        });
    }

    // main div
    let div = document.createElement('div');
    div.className = "game text-center ms-3 me-3 mt-2 mb-2"
    div.innerHTML = `
        <div class="row container ms-0 me-0 ps-0 pe-0">
            <div class="col mb-2 me-2 mt-1 ms-1">
                <img src="${(data.imageurl.length > 0 ? data.imageurl : "Assets/none.png")}" onerror="if (this.src != 'Assets/none.png') this.src = 'Assets/none.png';" width="100%" style="filter: drop-shadow(6px 6px 0px #000000AA)"></img>
            </div>
            <div class="col-4 col-sm-8">
                <div class="row text-start text-break">
                    <h2 class="mb-0">${data.name}</h2>
                    <small class="text-secondary">${data.authors.map(author => author.name).join(", ")}</small>
                </div>
                <div class="row text-start text-break pt-2"><p>${data.description}</p></div>
            </div>
            <div class="col-4 col-sm-2 m-0 p-0 row container">
                <div class="row text-right me-0 ms-0 pe-0 align-self-start">
                    <p class="text-white bg-black text-break pe-0 ps-4 ${upcoming ? "countdown mono" : ""}" ${upcoming ? `until="${data.releaseAt*1000}"` : ""} style="border-radius: 0px 0px 0px 50px; overflow:hidden">${!upcoming ? data.difficulty : "soon.."}</p>
                </div>
                <div class="row container align-self-end  align-items-end me-0 ms-0 pe-0 pb-1 ps-4">
                    <a href="${data.gamebananaurl}" target=”_blank”>
                    <div class="col align-self-end text-right download shadow" ${upcoming ? `style="display: none"` : ""}>
                        <img src="Assets/download.svg" width="33%" min-width="32px"></img>
                    </div>
                    </a>
                </div>
            </div>
            <div class="row ms-0 me-0 ps-0 pe-0" ${hideLeaderboard ? 'style="display: none;"' : ""}>
                <button class="btn expand-leaderboard p-0 pb-1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#leaderboard${nr}" aria-expanded="false" aria-controls="leaderboard${nr}">
                    <span class="open">Open</span><span class="close">Close</span> Leaderboard
                </button>
            </div>
            <div class="container ms-0 me-0 collapse row leaderboard mono" id="leaderboard${nr}" ${upcoming ? 'style="display: none;"' : ""}>
                    ${leaderboard.outerHTML}
            </div>
        </div>`;
        //      <div class="col align-self-center p-2">

    return [(upcoming ? 1 : (data.isCurrent ? 0 : 2)), div]; 
}


var countdownInterval;
function startCountdown() {
    let countdownElements = Array.from(document.getElementsByClassName("countdown")).map(div => [div, Number(div.attributes.until.value)]);
    updateTimers(countdownElements);
    countdownInterval = setInterval(() => {
        updateTimers(countdownElements);
    }, 500);
    function updateTimers(elarr) {
        elarr.forEach(([div, until]) => {
            let remaining = until - new Date().getTime();
            if(remaining < 0) {
                div.innerText = "Coming soon..";
                location.reload();
            } else {
                div.innerText = get_time_hh_mm_ss(remaining);
            }
        });
    }
    function get_time_hh_mm_ss(time_in_ms) {
        if(time_in_ms < 0) return "00:00:00";
        let hrs = Math.floor(time_in_ms / (1000*60*60)); 
        let min = Math.floor((time_in_ms % (1000*60*60)) / (1000*60)); 
        let s = Math.floor((time_in_ms % (1000*60)) / (1000)); 
        return `${hrs.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }
}

/**
 * @param {{name:string, discord:string, avatarurl:string}} data
 * @returns {div}
 */
function generateCredit(data) {
    let div = document.createElement('div');
    div.className = "col credit-container";
    div.innerHTML = `
    <div class="credit">
        <div class="col pt-2 pb-2">
            <img class="img-fluid credit-image" src="${data.avatarurl.length > 0 ? data.avatarurl : "Assets/none.png"}" onerror="if (this.src != 'Assets/none.png') this.src = 'Assets/none.png';"></img>
        </div>
        <div class="col text-break">
            <div class="mb-2">
                <h3 class="mb-0">${data.name}</h3>
            </div>
            <p><img src="Assets/discord.svg" width="16px"> </img >${data.discord}</p>
        </div>
    </div>`;

    return div;
}

/**
 * @param {[{csv_data:[[timestamp: string, name: string, discord: string, result: string, link: string, swear: string]], map_data:{name:string, authors:[{name:string, discord:string, avatarurl:string}], imageurl:string, gamebananaurl:string, description:string, difficulty:string, releaseAt:Number|None, isCurrent:boolean, order:Number}}]} data
 */
function main_function(data) {
    let gameDivs = [];
    gameDivs[0] = document.getElementById("currentMaps");
    gameDivs[1] = document.getElementById("upcomingMaps");
    gameDivs[2] = document.getElementById("previousMaps");
    let creditDiv = document.getElementById("creators");

    let authorList = [];
    data.sort((mapA, mapB) => -1*(mapA.map_data.order - mapB.map_data.order));
    data.forEach((map, i) => {
        let [pos, game] = generateGame(map.map_data, map.csv_data, i);
        if(map.map_data.isCurrent) gameDivs[pos].insertBefore(game, gameDivs[pos].children[1]);
        else gameDivs[pos].appendChild(game);
        map.map_data.authors.forEach(author => {
            authorList.push([author.name + author.discord, author])
        })
    });

    authorList = authorList.filter((namehash, i, arr) => arr.findIndex((v) => v == namehash) == i);
    authorList.sort((a,b) => a[0].localeCompare(b[0]));

    authorList.forEach(([_, author]) => {
        let credit = generateCredit(author);
        creditDiv.appendChild(credit);
    })

    if(creditDiv.childElementCount < 1) creditDiv.parentElement.style.display = "none";

    gameDivs.forEach(div => {
        if(div.childElementCount < 2) div.style.display = "none";
    })

    if(gameDivs[1].style.display != "none") startCountdown();



}

function tabSetup() {

    // Remember last tab
    let tabs = document.querySelectorAll('button[data-bs-toggle="tab"]');
    tabs.forEach(tabEl => {
        tabEl.addEventListener('shown.bs.tab', event => {
            localStorage.setItem("CSC-currTab", event.target.id);
        });
    });

    // recover last tab if possible
    let tab = localStorage.getItem("CSC-currTab");
    if(tab == null) {
        tab = "about-tab";
    }
    bootstrap.Tab.getOrCreateInstance(document.getElementById(tab))?.show();
    document.getElementById("everything").classList.remove("d-none");
    document.getElementById("loading").classList.add("d-none");

}

tabSetup();

window.addEventListener("load", (event) => {
    // no cache for me!
    const ms = Date.now();
    fetch('Assets/Maps/map_index.json?nocache='+ms)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            main_function(data);
        })

})
