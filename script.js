//You can edit ALL of the code here

let allEpisodes;

function setup() {
  const showSelector = document.createElement("select");
  showSelector.id = "show-selector";
  showSelector.addEventListener("change", selectShow);
  getAllShows().forEach(show => {
    const option = document.createElement("option");
    option.value = show.id;
    option.text = show.name;
    showSelector.appendChild(option);
  });
  document.getElementById("show-container").appendChild(showSelector);
  selectShow();

  document.querySelector("#search").addEventListener("keyup", search);

  document.querySelector("#episode-selector").addEventListener("change", selected);
}

function selectShow(event) {
  fetch(`https://api.tvmaze.com/shows/${document.getElementById("show-selector").value}/episodes`).then(resp => resp.json()).then(episodes => {
    allEpisodes = episodes;

    render();
  })
}

function selected(event) {
  document.querySelectorAll(".episode-container.selected").forEach(element => {
    element.className = element.className.replace(" selected ", " ")
  })

  render();
}

function highlight(element) {
  element.className = `${element.className} selected `;
}

function search(event) {
  render()
}

function zeroPad(number) {
  if (number < 10) {
    return `0${number}`;
  }
  return `${number}`;
}

function episodeCode(episode) {
  return `S${zeroPad(episode.season)}E${zeroPad(episode.number)}`;
}

function render() {
  const selector = document.querySelector("#episode-selector");
  allEpisodes.forEach(episode => {
    const option = document.createElement("option");
    const code = episodeCode(episode);
    option.value = code;
    option.text = `${code} - ${episode.name}`;
    selector.appendChild(option)
  });

  const selectedCode = document.getElementById("episode-selector").value;
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const episodeList = allEpisodes
    .filter(episode => !selectedCode || episodeCode(episode) == selectedCode)
    .filter(episode => episode.name.toLowerCase().includes(searchTerm));

  document.querySelector("#episode-count").innerText = `Showing ${episodeList.length}/${allEpisodes.length} episodes`;

  const displayElem = document.getElementById("episodesDisplay");
  displayElem.innerText = '';
  episodeList.forEach((episode, index) => {
    const code = episodeCode(episode);
    if (selectedCode && selectedCode !== code) {
      return;
    }

    const episodeContainer = document.createElement("div");
    episodeContainer.className = "episode-container";
    if (code === selectedCode) {
      highlight(episodeContainer);
    }
    episodeContainer.id = code;

    const header = document.createElement("div");
    header.innerText = `${code} - ${episode.name}`;
    episodeContainer.appendChild(header);

    if (episode.image) {
      const image = document.createElement("img");
      image.src = episode.image.medium;
      episodeContainer.appendChild(image);
    }

    const description = document.createElement("div");
    episodeContainer.appendChild(description);
    // BOO! Insecure!
    description.outerHTML = episode.summary;

    episodeContainer.appendChild(description);
    displayElem.appendChild(episodeContainer);

    if (index % 3 === 2) {
      const divider = document.createElement("div");
      divider.style.clear = "both";
      displayElem.appendChild(divider);
    }
  });
}

window.onload = setup;
