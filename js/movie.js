const movieContainer = document.querySelector('#movie');
const forStream = document.querySelector('#for-stream');
const animeDetail = document.querySelector('#anime-detail');
const clsBtnTwo = document.querySelector("#cls-btn-two");
const searching = document.getElementById('search-form');
const sideMenu = document.getElementById("side-menu");
const menuBars = document.getElementsByClassName("mbc")[0];

function movieContainerFunc() {
    let url = 'https://gogoanime.herokuapp.com/anime-movies';
    fetch(url)
        .then(response => response.json())
        .then(result => {
            let bufferTwo = "";
            for (let x = 0; x < result.length / 2 - 1; x++) {
                if (result[x].animeTitle.length > 35) {
                    let slice = result[x].animeTitle.slice(0, 35);
                    result[x].animeDetail= slice;
                }
                bufferTwo += `<div class="col">
                        <div class="box-tittle">
                        <h2>${result[x].animeTitle}</h2>
                        </div>
                        <div class="box-img">
                        <img src="${result[x].animeImg}" alt="">
                        </div>
                        <div class="box-la-eps">
                        <p> Release Date : ${result[x].releasedDate} </p>
                        </div>   
                        <div class="box-url">
                        <button data-url="${result[x].animeId}" onclick="animeDetailFunc(this.dataset.url)"> Detail
                        </button>
                        </div>       
                        </div>`
                    ;
                movieContainer.innerHTML = `<h1>UPCOMING MOVIE</h1>
                            <div id="col-wrapper-two">${bufferTwo}</div>`;
            }
            document.querySelectorAll(".box-url>button").forEach((button) => {
                button.onclick = function () {
                    animeDetailFunc(button.dataset.url);
                }
            })
        })
        .catch(err => {
            const notFound = document.createElement('h2');
            notFound.setAttribute('class', 'nic');
            notFound.textContent = "No Internet Connection";
            movieContainer.appendChild(notFound);
        });

}

function searchFunc() {
    searching.addEventListener("submit", function (event) {
        event.preventDefault();
        window.scrollTo(0, 0);
        const data = new FormData(event.target);
        const buff = data.get('search');
        fetch('https://raznime.herokuapp.com/search?keyw=' + buff + '')
            .then(response => response.json())
            .then(result => {
                let bufferThree = "";
                for (let x = 0; x < result.length; x++) {
                    if (result[x].animeTitle.length > 55) {
                        let slice = result[x].animeTitle.slice(0, 55);
                        result[x].animeTitle = slice;
                    }
                    bufferThree +=
                        `<div class="col">
                <div class="box-tittle">
                <h2>${result[x].animeTitle}</h2>
                </div>
                <div class="box-img">
                <img src="${result[x].animeImg}" alt="">
                </div>
                <div class="box-la-eps">
                <p>${result[x].status} </p>
                </div>
                <div class="box-url">
                <button data-url="${result[x].animeId}" onclick="animeDetailFunc(this.dataset.url)"> Detail
                </button>
                </div>
                </div>`;
                }
                movieContainer.innerHTML = "";
                animeDetail.innerHTML = "";
                forStream.innerHTML = "";
                movieContainer.style.display = "block";
                movieContainer.innerHTML = `<h1>search result : ${buff}</h1><div id="col-wrapper">${bufferThree}
               </div>`;
                document.querySelectorAll(".box-url>button").forEach((button) => {
                    button.onclick = function () {
                        animeDetailFunc(button.dataset.url);
                    }
                })
            })
            .catch(err => {
                movieContainer.innerHTML = "";
                const notFound = document.createElement('h2');
                notFound.setAttribute('class', 'nic');
                notFound.textContent = "No Network";
                movieContainer.appendChild(notFound);
            })
    })
}

function animeDetailFunc(params) {
    fetch(`https://raznime.herokuapp.com/anime-details/${params}`)
        .then(response => response.json())
        .then(result => {
            window.scrollTo(0, 0);
            movieContainer.style.display = "none";
            animeDetail.style.display = "block";
            let buffer =
                `
    <h4>Title</h4>
    <p>${result.animeTitle}</p>
    <h4>Type</h4>
    <p>${result.type}</p>
    <h4>Released Date</h4>
    <p>${result.releasedDate}</p>
    <h4>Status</h4>
    <p>${result.status}</p>
    <h4>Genre</h4>
    <p>${result.genres}</p>
    <h4>Other Name</h4>
    <p>${result.otherNames}</p>
    <h4>Synopsis</h4>
    <p>-${result.synopsis}-</p>
    <h4>Image</h4>
    <img src="${result.animeImg}">
    <h4>Total Episode</h4>
    <p>${result.totalEpisodes}</p>
    <h4>Episode List</h4>
    `;
            let bufferTwo = "";
            if (result.episodesList.length == 0) {
                animeDetail.innerHTML =
                    `${buffer} ${bufferTwo} 
                        <div id="back-to-search">
                        <button id="btn-bts" onclick="backToSearchFunc()">Back To Search</buttton>
                        </div>`;
            }


            for (let x = 0; x < result.episodesList.length; x++) {

                fetch('https://raznime.herokuapp.com/stream/watch/' + result.episodesList[x].episodeId + '')
                    .then(response => response.json())
                    .then(res => {
                        bufferTwo +=
                            `<div class="btn">
            <button data-url="${res.Referer}" onclick="streamTwo(this.dataset.url)">
            Episode ${result.episodesList[x].episodeNum}
            </button>
            </div>`;
                        animeDetail.innerHTML =
                            `${buffer} ${bufferTwo} 
                        <div id="back-to-search">
                        <button id="btn-bts" onclick="backToSearchFunc()">Back To Search</buttton>
                        </div>`;
                    })

            }
            document.querySelectorAll(".btn>button").forEach((button) => {
                button.onclick = function () {
                    streamTwo(button.dataset.url);
                }
            })

        })
}
function close() {
    menuBars.addEventListener('click', function () {
        let sideMenuContent =
            `<ul>
        <li title="HOME"><a href="home.html"><i class="fa-solid fa-house-chimney"></a></i></li>
        <li title="ONGOING"><a href="on-going.html"><i class="fa-solid fa-person-running"></i></a></li>
        <li title="RECENT UPDATE"><a href="recent-update.html"><i class="fa-solid fa-bullhorn"></a></i> </li>
        <li title="MOVIE" class="active"> <a href="movie.html"><i class="fa fa-film" aria-hidden="true"></i></a></li>
        <li title="POPULAR"> <a href="popular.html"><i class="fa-solid fa-star"></i></a> </li>
    </ul>`;
        sideMenu.innerHTML = sideMenuContent;
        menuBars.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i>`;
        menuBars.addEventListener('click', function () {
            sideMenu.innerHTML = "";
            menuBars.innerHTML = ` <i class="fa fa-bars" aria-hidden="true"></i>`;
            close();
        })
    })
}

function stream(url) {
    forStream.style.display = "block";
    window.scrollTo(0, 0);
    movieContainer.style.display = "none";
    forStream.innerHTML =
        `<iframe src="${url}"></iframe>
    <button id="cls-btn">
        <a href="home.html">CLOSE STREAM</a>
    </button>`;
    alert(`This Site Will Playing ${url}`);
}

function streamTwo(url) {
    forStream.style.display = "block";
    window.scrollTo(0, 0);
    movieContainer.style.display = "none";
    forStream.innerHTML =
        `<iframe src="${url}"></iframe>
    <button id="cls-btn-two" onclick="clsBtnTwoFunc()">
       <p>CLOSE STREAM<p>
    </button>`;
    alert(`This Site Will Playing${url}`);
}

function clsBtnTwoFunc() {
    forStream.innerHTML = "";
    animeDetail.style.display = "block";
    window.scrollTo(0, 0);
}

function backToSearchFunc() {
    movieContainer.style.display = "block";
    forStream.style.display = "none";
    animeDetail.style.display = "none";
}

movieContainerFunc();
searchFunc();
close();
clsBtnTwoFunc();
