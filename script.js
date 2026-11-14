const form = document.getElementById("orderForm");
const successScreen = document.getElementById("successScreen");
const summaryText = document.getElementById("summaryText");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");
const materialSelect = document.getElementById("material");
const textStyleSelect = document.getElementById("textStyle");
const sketchInput = document.getElementById("sketch");
const sendBtn = document.getElementById("sendBtn");
const primaryColorSelect = document.getElementById("primaryColor");
const secondaryColorSelect = document.getElementById("secondaryColor");
const placementInput = document.getElementById("Placement");
const embossTextInput = document.getElementById("embossText");
const hasDeadlineBox = document.getElementById("hasDeadline");
const deadlineInput = document.getElementById("deadline");
const sketchPreview = document.getElementById("sketchPreview");

function updateSketchPreview() {
    for (const img of sketchPreview.querySelectorAll("img")) {
        URL.revokeObjectURL(img.src);
    }
    sketchPreview.replaceChildren();

    for (const file of sketchInput.files) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        sketchPreview.append(img);
    }
}

sketchInput.addEventListener("change", updateSketchPreview);

function updateDeadline() {
    deadlineInput.closest(".field").hidden = !hasDeadlineBox.checked;
    deadlineInput.required = hasDeadlineBox.checked;
    deadlineInput.min = new Date().toLocaleDateString("en-CA");
}

hasDeadlineBox.addEventListener("change", updateDeadline);
updateDeadline();

const DRAFT_KEY = "dimporiumOrderDraft";

function saveDraft() {
    const draft = Object.fromEntries(new FormData(form));
    delete draft.sketch;
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
        // Some private browsing modes block storage. The form still works.
    }
}

function clearDraft() {
    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch {
        // Nothing saved, nothing to clear.
    }
}

function restoreDraft() {
    let draft = null;
    try {
        draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
    } catch {
        return;
    }
    if (!draft) {
        return;
    }

    if (draft.material) {
        materialSelect.value = draft.material;
        updateColorLists();
    }

    for (const name in draft) {
        const field = form.elements[name];
        if (!field) {
            continue;
        }
        field.value = draft[name];
        if (field.tagName === "SELECT" && field.selectedIndex === -1) {
            field.selectedIndex = 0;
        }
    }

    hasDeadlineBox.checked = Boolean(draft.deadline);
    updateTextFields();
    updateDeadline();
}

form.addEventListener("input", saveDraft);

function updateTextFields() {
    const hasText = textStyleSelect.value !== "none";
    placementInput.closest(".field").hidden = !hasText;
    embossTextInput.closest(".field").hidden = !hasText;
    embossTextInput.required = hasText;
}

textStyleSelect.addEventListener("change", updateTextFields);
updateTextFields();

let stockColors = [];

function fillColorSelect(select, firstText) {
    select.replaceChildren(new Option(firstText, ""));

    const groups = {};
    for (const color of stockColors) {
        if (color.material !== materialSelect.value) {
            continue;
        }
        const finish = color.finish || "Basic";
        if (!groups[finish]) {
            groups[finish] = document.createElement("optgroup");
            groups[finish].label = finish;
            select.append(groups[finish]);
        }
        const value = finish === "Basic" ? color.color : `${color.color} (${finish})`;
        groups[finish].append(new Option(color.color, value));
    }

    select.append(new Option("A color not listed (describe below)", "Not listed, see description"));
}

function updateColorLists() {
    fillColorSelect(primaryColorSelect, "Pick a color");
    fillColorSelect(secondaryColorSelect, "None");
}

materialSelect.addEventListener("change", updateColorLists);
updateColorLists();

fetch("colors.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("colors.json not found");
        }
        return response.json();
    })
    .then(function (data) {
        stockColors = data.colors;
        updateColorLists();
    })
    .catch(function () {
        // Lists keep only "A color not listed", so the form still works.
    })
    .finally(restoreDraft);

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    for (const key in data) {
        if (typeof data[key] === "string") {
            data[key] = data[key].trim();
        }
    }

    const lines = [];

    lines.push(`Name: ${data.customerName}`);
    if (data.contact) {
        lines.push(`Contact: ${data.contact}`);
    }
    lines.push(`Quantity: ${data.quantity}`);
    lines.push(`Material: ${materialSelect.selectedOptions[0].text}`);
    lines.push(`Primary color: ${data.primaryColor}`);

    if (data.description) {
        lines.push(`Description: ${data.description}`);
    }
    if (sketchInput.files.length > 0) {
        lines.push(`Sketch/photo: ${sketchInput.files.length} attached`);
    }
    if (data.modelLink) {
        lines.push(`Model Link: ${data.modelLink}`);
    }
    if (data.secondaryColor) {
        lines.push(`Secondary color: ${data.secondaryColor}`);
    }
    if (data.textStyle !== "none") {
        lines.push(`Style: ${textStyleSelect.selectedOptions[0].text}`);
        if (data.Placement) {
            lines.push(`Placement: ${data.Placement}`);
        }
        if (data.embossText) {
            lines.push(`Emboss/Deboss: ${data.embossText}`);
        }
    }
    if (hasDeadlineBox.checked && data.deadline) {
        lines.push(`Deadline: ${data.deadline}`);
    }
    if (data.otherNotes) {
        lines.push(`Additional Notes: ${data.otherNotes}`);
    }

    const summary = lines.join("\r\n");

    summaryText.textContent = summary;
    document.getElementById("ticketDate").textContent = new Date().toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    form.hidden = true;
    successScreen.hidden = false;

});

copyBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(summaryText.textContent).then(function () {
        copyBtn.textContent = "Copied!";
        setTimeout(function () {
            copyBtn.textContent = "Copy Summary";
        }, 2000);
    });
});

resetBtn.addEventListener("click", function () {
    form.reset();
    clearDraft();
    updateColorLists();
    updateTextFields();
    updateDeadline();
    updateSketchPreview();
    form.hidden = false;
    successScreen.hidden = true;
    document.getElementById("customerName").focus();

});

sendBtn.addEventListener("click", function () {
    const shareData = {
        title: "Dimporium Order",
        text: summaryText.textContent,
    };

    const files = Array.from(sketchInput.files);
    if (files.length > 0) {
        shareData.files = files;
    }

    if (navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData).then(clearDraft).catch(function () { });
    } else {
        sendBtn.textContent = "Sharing isn't supported here. Use Copy Summary instead.";
    }
});
