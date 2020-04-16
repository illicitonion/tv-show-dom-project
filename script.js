//You can edit ALL of the code here

let allEpisodes;

function setup() {
  allEpisodes = getAllEpisodes();

  const selector = document.querySelector("#episode-selector");
  allEpisodes.forEach(episode => {
    const option = document.createElement("option");
    const code = episodeCode(episode);
    option.value = code;
    option.text = `${code} - ${episode.name}`;
    selector.appendChild(option)
  });
  selector.addEventListener("change", selected);

  makePageForEpisodes(allEpisodes);

  document.querySelector("#search").addEventListener("keyup", search);
}

function selected(event) {
  document.querySelectorAll(".episode-container.selected").forEach(element => {
    element.className = element.className.replace(" selected ", " ")
  })

  const element = document.getElementById(event.target.value);
  if (element) {
    highlight(element);
    element.scrollIntoView();
  }
}

function highlight(element) {
  element.className = `${element.className} selected `;
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
  const selectedCode = document.getElementById("episode-selector").value;

  const displayElem = document.getElementById("episodesDisplay");
  displayElem.innerText = '';
  episodeList.forEach((episode, index) => {
    const code = episodeCode(episode);

    const episodeContainer = document.createElement("div");
    episodeContainer.className = "episode-container";
    if (code === selectedCode) {
      highlight(episodeContainer);
    }
    episodeContainer.id = code;

    const header = document.createElement("div");
    header.innerText = `${code} - ${episode.name}`;
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
