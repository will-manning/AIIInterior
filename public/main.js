const form = document.getElementById("designForm");
const statusEl = document.getElementById("status");
const gridEl = document.getElementById("designGrid");
const submitBtn = document.getElementById("submitBtn");
const roomInput = document.getElementById("roomImage");

function setStatus(message, isWarning = false) {
  statusEl.textContent = message;
  statusEl.className = isWarning ? "status warning" : "status";
}

function renderDesigns(designs = []) {
  gridEl.innerHTML = "";

  designs.forEach((design) => {
    const card = document.createElement("article");
    card.className = "design";

    const img = document.createElement("img");
    img.src = design.imageUrl;
    img.alt = `${design.style} interior design`;

    const meta = document.createElement("div");
    meta.className = "meta";

    const title = document.createElement("h3");
    title.textContent = design.style;

    const prompt = document.createElement("small");
    prompt.textContent = design.prompt;

    meta.append(title, prompt);
    card.append(img, meta);
    gridEl.appendChild(card);
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read uploaded image."));
    reader.readAsDataURL(file);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const file = roomInput.files?.[0];
  if (!file) {
    setStatus("Please choose a room image first.", true);
    return;
  }

  gridEl.innerHTML = "";
  setStatus("Generating design options...");
  submitBtn.disabled = true;

  try {
    const roomImageDataUrl = await fileToDataUrl(file);

    const response = await fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomImageDataUrl,
        styles: form.styles.value,
        numDesigns: form.numDesigns.value
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Failed to generate designs");
    }

    renderDesigns(payload.designs || []);

    if (payload.warning) {
      setStatus(payload.warning, true);
    } else {
      setStatus(`Generated ${payload.designs.length} design option(s).`);
    }
  } catch (error) {
    setStatus(error.message || "Unexpected error.", true);
  } finally {
    submitBtn.disabled = false;
  }
});
