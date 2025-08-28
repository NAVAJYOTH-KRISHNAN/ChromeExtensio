const inputBtn = document.getElementById("inputBtn");
const inputEl = document.getElementById("input-el");
const savedEl = document.getElementById("saved-el");
const tabBtn = document.getElementById("tabBtn");
const remove = document.getElementById("removeAlink");
const wayback = document.getElementById("wayback");
const txtsave = document.getElementById("txtsave");
let links = [];
if (localStorage.links) {
  try {
    const parsedLinks = JSON.parse(localStorage.links);
    if (Array.isArray(parsedLinks)) {
      links = parsedLinks;
    } else {
      console.warn("Stored links is not an array. Resetting.");
      links = [];
    }
  } catch (e) {
    console.error("Error parsing localStorage.links:", e);
    links = [];
  }
  renderlink();
}
//find dulpli//
function addLink(newLink) {
  if (!links.includes(newLink)) {
    links.push(newLink);
    renderlink();
    storeTheData();
  } else {
    console.log("Link already saved");
  }
}
// data eduth marikan
function storeTheData() {
  localStorage.links = JSON.stringify(links);
  let storedLinks = JSON.parse(localStorage.links);
  console.log(storedLinks);
}
// end of storing code//

inputBtn.addEventListener("click", function () {
  const value = inputEl.value.trim();
  if (value !== "") {
    addLink(value);
    inputEl.value = "";
  }
});

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    addLink(activeTab.url);
  });
});
remove.addEventListener("click", function () {
  links.pop(links.length - 1);
  renderlink();
  storeTheData();
});
wayback.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    let urlk = activeTab.url;
    let wyurl = `https://web.archive.org/web/20250000000000*/${urlk}`;
    window.open(wyurl, "_blank");
  });
});
clearall.addEventListener("click", function () {
  links = "";
  renderlink();
  storeTheData();
});
txtsave.addEventListener("click", function () {
  let textToSave = links
    .map((link, index) => `${index + 1}. ${link}`)
    .join("\n");
  let blob = new Blob([textToSave], { type: "text/plain" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "links.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

//renderlink code //
function renderlink() {
  let listitems = "";
  savedEl.innerHTML = "";
  for (let i = 0; i < links.length; i++) {
    listitems += `
      <li>
        <a href="https://${links[i]}" target="_blank">
          ${links[i]}
        </a>
      </li>`;
  }
  savedEl.innerHTML = listitems;
}
//footer
document.getElementById("donate").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://rzp.io/rzp/0mbqomBS" });
});

document.getElementById("feedback").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://forms.gle/kWrpyv2oRTghWg4x5" });
});
