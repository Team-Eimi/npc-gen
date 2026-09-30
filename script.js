const IMAGES_FOLDER = "images/Random_character_generator";
const MANIFEST_URL = "images/manifest.json";
const PERSONALITY_URL = "personality.json";
const ALL_URL = "all.json";
const TEXTPOST_FOLDER = "images/textpost";
const TEXTPOST_MANIFEST_URL = "images/textpost-manifest.json";

const button = document.getElementById("generate-btn");
const imageEl = document.getElementById("npc-image");
const statusEl = document.getElementById("status");
const personalityButton = document.getElementById("personality-btn");
const personalityStatusEl = document.getElementById("personality-status");
const allButton = document.getElementById("generate-all-btn");
const allStatusEl = document.getElementById("generate-all-status");
const resetAllButton = document.getElementById("reset-all-btn");
const textpostButton = document.getElementById("textpost-btn");
const textpostImageEl = document.getElementById("textpost-image");
const textpostStatusEl = document.getElementById("textpost-status");
const burstButton = document.getElementById("burst-btn");
const burstGridEl = document.getElementById("burst-grid");
const burstStatusEl = document.getElementById("burst-status");
const BURST_CATEGORIES = [
  "Head shape",
  "Eyes",
  "Nose",
  "Mouth",
  "Eyebrows",
  "Misc detail",
];

// caches jsonUrl -> parsed data, so repeated clicks don't refetch
const jsonCache = new Map();

async function loadJson(jsonUrl) {
  if (jsonCache.has(jsonUrl)) return jsonCache.get(jsonUrl);
  const response = await fetch(jsonUrl);
  if (!response.ok) {
    throw new Error(`Could not load ${jsonUrl} (${response.status})`);
  }
  const data = await response.json();
  jsonCache.set(jsonUrl, data);
  return data;
}

async function loadList(jsonUrl) {
  const data = await loadJson(jsonUrl);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`${jsonUrl} must be a non-empty array`);
  }
  return data;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pickMultipleRandom(list, count) {
  const pool = [...list];
  const picks = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    picks.push(pool.splice(index, 1)[0]);
  }
  return picks;
}

// arrays pick one value; nested objects (like "backstory") pick one value per subcategory
function pickFromNode(node) {
  if (Array.isArray(node)) return pickRandom(node);
  if (node && typeof node === "object") {
    const picked = {};
    for (const [key, value] of Object.entries(node)) {
      picked[key] = pickFromNode(value);
    }
    return picked;
  }
  return node;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function renderCategoryList(data) {
  const list = document.createElement("ul");
  for (const [key, value] of Object.entries(data)) {
    const item = document.createElement("li");
    if (value && typeof value === "object" && !Array.isArray(value)) {
      item.append(`${capitalize(key)}:`, renderCategoryList(value));
    } else {
      item.textContent = `${capitalize(key)}: ${value}`;
    }
    list.appendChild(item);
  }
  return list;
}

async function generateRandomImage() {
  button.disabled = true;
  statusEl.textContent = "";
  try {
    const files = await loadList(MANIFEST_URL);
    imageEl.src = `${IMAGES_FOLDER}/${pickRandom(files)}`;
    imageEl.hidden = false;
  } catch (err) {
    statusEl.textContent = err.message;
    imageEl.hidden = true;
  } finally {
    button.disabled = false;
  }
}

async function generateRandomPersonality() {
  personalityButton.disabled = true;
  try {
    const traits = await loadList(PERSONALITY_URL);
    personalityStatusEl.textContent = pickRandom(traits);
  } catch (err) {
    personalityStatusEl.textContent = err.message;
  } finally {
    personalityButton.disabled = false;
  }
}

async function generateRandomAll() {
  allButton.disabled = true;
  allStatusEl.textContent = "";
  try {
    const [allData, traits] = await Promise.all([
      loadJson(ALL_URL),
      loadList(PERSONALITY_URL),
    ]);
    const picked = pickFromNode(allData);
    picked.personality = pickMultipleRandom(traits, 2).join(", ");
    allStatusEl.replaceChildren(renderCategoryList(picked));
  } catch (err) {
    allStatusEl.textContent = err.message;
  } finally {
    allButton.disabled = false;
  }
}

async function showRandomTextpost() {
  textpostButton.disabled = true;
  textpostStatusEl.textContent = "";
  try {
    const files = await loadList(TEXTPOST_MANIFEST_URL);
    textpostImageEl.src = `${TEXTPOST_FOLDER}/${encodeURIComponent(pickRandom(files))}`;
    textpostImageEl.hidden = false;
  } catch (err) {
    textpostStatusEl.textContent = err.message;
    textpostImageEl.hidden = true;
  } finally {
    textpostButton.disabled = false;
  }
}

async function generateBurstImages() {
  burstButton.disabled = true;
  burstStatusEl.textContent = "";
  try {
    const files = await loadList(MANIFEST_URL);
    const picks = pickMultipleRandom(files, BURST_CATEGORIES.length);
    const cards = BURST_CATEGORIES.map((category, index) => {
      const card = document.createElement("figure");
      const image = document.createElement("img");
      const caption = document.createElement("figcaption");

      image.src = `${IMAGES_FOLDER}/${encodeURIComponent(picks[index])}`;
      image.alt = `${category} reference`;
      caption.textContent = category;
      card.append(image, caption);
      return card;
    });

    burstGridEl.replaceChildren(...cards);
    burstGridEl.hidden = false;
  } catch (err) {
    burstStatusEl.textContent = err.message;
    burstGridEl.hidden = true;
  } finally {
    burstButton.disabled = false;
  }
}

function resetAll() {
  allStatusEl.textContent = "";
}

button.addEventListener("click", generateRandomImage);
personalityButton.addEventListener("click", generateRandomPersonality);
allButton.addEventListener("click", generateRandomAll);
resetAllButton.addEventListener("click", resetAll);
textpostButton.addEventListener("click", showRandomTextpost);
burstButton.addEventListener("click", generateBurstImages);
