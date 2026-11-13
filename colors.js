const colorList = document.getElementById("colorList");
const updated = document.getElementById("updated");

const LEVEL_TEXT = {
    plenty: "Plenty",
    limited: "Limited",
    low: "Low, ask me first",
};

const CHECKERBOARD = "repeating-conic-gradient(#d9d9d9 0% 25%, #ffffff 0% 50%) 0 0 / 16px 16px";

function swatch(color) {
    let hexes = color.hex;
    if (hexes.length === 0) {
        return "var(--border)";
    }
    if (color.translucent) {
        hexes = hexes.map(h => h + "99");
    }

    let layer;
    if (hexes.length === 1) {
        layer = `linear-gradient(${hexes[0]}, ${hexes[0]})`;
    } else if (color.style === "gradient") {
        layer = `linear-gradient(135deg, ${hexes.join(", ")})`;
    } else {
        const step = 100 / hexes.length;
        const stops = hexes.map((h, i) => `${h} ${i * step}% ${(i + 1) * step}%`);
        layer = `linear-gradient(135deg, ${stops.join(", ")})`;
    }

    if (color.translucent) {
        return `${layer}, ${CHECKERBOARD}`;
    }
    return layer;
}

function describe(color) {
    const details = [];
    if (color.hex.length === 2) {
        details.push(color.style === "gradient" ? "Gradient" : "Dual color");
    }
    if (color.hex.length === 3) {
        details.push(color.style === "gradient" ? "Gradient" : "Tri color");
    }
    if (color.translucent) {
        details.push("Translucent");
    }
    return details.join(" · ");
}

function makeColorCard(color) {
    const item = document.createElement("div");
    item.className = "color-item";

    const chip = document.createElement("div");
    chip.className = "color-chip";
    chip.style.background = swatch(color);

    const name = document.createElement("p");
    name.className = "color-name";
    name.textContent = color.color;

    const details = document.createElement("p");
    details.className = "color-details";
    details.textContent = describe(color);

    const level = document.createElement("span");
    level.className = `level level-${color.level}`;
    level.textContent = LEVEL_TEXT[color.level];

    item.append(chip, name, details, level);
    return item;
}

function showColors(colors) {
    if (colors.length === 0) {
        colorList.textContent = "No colors listed right now. Ask me in your order.";
        return;
    }

    const groups = {};
    for (const color of colors) {
        if (!groups[color.material]) {
            groups[color.material] = [];
        }
        groups[color.material].push(color);
    }

    for (const material in groups) {
        const section = document.createElement("div");
        section.className = "card";

        const heading = document.createElement("h2");
        heading.textContent = material;

        const grid = document.createElement("div");
        grid.className = "color-grid";
        for (const color of groups[material]) {
            grid.append(makeColorCard(color));
        }

        section.append(heading, grid);
        colorList.append(section);
    }
}

fetch("colors.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("colors.json not found");
        }
        return response.json();
    })
    .then(function (data) {
        updated.textContent = `Last updated: ${data.updated}`;
        showColors(data.colors);
    })
    .catch(function () {
        colorList.textContent = "Couldn't load the color list. Ask me what's in stock in your order.";
    });