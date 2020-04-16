//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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
  const displayElem = document.getElementById("episodesDisplay");
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
