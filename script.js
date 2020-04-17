//You can edit ALL of the code here

let allEpisodes;

function setup() {
  root.innerText = '';

  let showContainer = document.getElementById("show-container");
  if (showContainer) {
    showContainer.innerText = '';
  } else {
    showContainer = document.createElement("div");
    showContainer.id = "show-container";
    root.appendChild(showContainer);
  }

  const searchBox = document.createElement("input");
  searchBox.id = "search-box";
  searchBox.placeholder = "Search for show name";
  searchBox.addEventListener("keyup", renderShows);
  showContainer.appendChild(searchBox);

  let showSelectorContainer = document.createElement("div");
  showSelectorContainer.id = "show-selector-container";
  showContainer.appendChild(showSelectorContainer);

  renderShows();
}

function renderShows(event) {
  window.scrollTo(0, 0);
  const searchTerm = event && event.target.value.toLowerCase() || "";

  let show = document.getElementById("show-container");

  const showSelector = document.createElement("ul");

  function showMatchesTerm(show) {
    return show.name.toLowerCase().includes(searchTerm) || show.summary.toLowerCase().includes(searchTerm);
  }

  getAllShows().filter(showMatchesTerm).forEach(show => {
    const option = document.createElement("li");

    const title = document.createElement("h2");
    title.style.clear = "both";
    const titleLink = document.createElement("a");
    titleLink.href = `javascript:selectShow(${show.id})`;
    titleLink.innerText = show.name;
    title.appendChild(titleLink);
    option.appendChild(title);

    const image = document.createElement("img");
    image.src = show.image.medium;
    image.style.float = "left";
    option.appendChild(image);

    const description = document.createElement("span");
    //BOO! Insecure!
    description.innerHTML = show.summary;
    option.appendChild(description);

    // TODO: And genre/ranking/...

    showSelector.appendChild(option);
  });
  const showSelectorContainer = document.getElementById("show-selector-container");
  showSelectorContainer.innerText = '';
  showSelectorContainer.appendChild(showSelector);
}

function selectShow(id) {
  fetch(`https://api.tvmaze.com/shows/${id}/episodes`).then(resp => resp.json()).then(episodes => {
    allEpisodes = episodes;

    const root = document.getElementById("root");
    root.innerText = '';

    const backLink = document.createElement("a");
    backLink.innerText = "< Select new show";
    backLink.href = "javascript:setup()";
    root.appendChild(backLink);

    let episodesView = document.getElementById("episodes-view");
    if (episodesView) {
      episodesView.innerText = '';
    } else {
      episodesView = document.createElement("div");
      episodesView.id = "episodes-view";
      root.appendChild(episodesView);
    }

    const episodeSelector = document.createElement("select");
    episodeSelector.id = "episode-selector";
    episodeSelector.innerHTML = '<option value="">Select an episode</option>';
    episodeSelector.addEventListener("change", selected);
    episodesView.appendChild(episodeSelector);

    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.id = "search";
    searchBox.placeholder = "Search by episode name";
    searchBox.addEventListener("keyup", search)
    episodesView.appendChild(searchBox);

    const episodeCounter = document.createElement("span");
    episodeCounter.id = "episode-count";
    episodesView.appendChild(episodeCounter);

    const episodesDisplay = document.createElement("div");
    episodesDisplay.id = "episodesDisplay";
    episodesView.appendChild(episodesDisplay);

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
  return `${number}`.padStart(2, "0");
}

function episodeCode(episode) {
  return `S${zeroPad(episode.season)}E${zeroPad(episode.number)}`;
}

function render() {
  window.scrollTo(0, 0);
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

  function episodeMatchesSearchTerm(episode) {
    return episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm);
  }

  const episodeList = allEpisodes
    .filter(episode => !selectedCode || episodeCode(episode) == selectedCode)
    .filter(episodeMatchesSearchTerm);

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
