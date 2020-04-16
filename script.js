//You can edit ALL of the code here

let allEpisodes;

function setup() {
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  document.querySelector("#search").addEventListener("keyup", search);
}

function search(event) {
  makePageForEpisodes(allEpisodes.filter(episode => episode.name.toLowerCase().includes(event.target.value.toLowerCase())))
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

function makePageForEpisodes(episodeList) {
  document.querySelector("#episode-count").innerText = `Showing ${episodeList.length}/${allEpisodes.length} episodes`;

  const displayElem = document.getElementById("episodesDisplay");
  displayElem.innerText = '';
  episodeList.forEach((episode, index) => {
    const episodeContainer = document.createElement("div");
    episodeContainer.className = "episode-container"

    const header = document.createElement("div");
    header.innerText = `${episodeCode(episode)} - ${episode.name}`;
    episodeContainer.appendChild(header);

    const image = document.createElement("img");
    image.src = episode.image.medium;
    episodeContainer.appendChild(image);

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
