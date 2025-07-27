// Parse "200g" -> { value: 200, unit: "g" }
function parseQuantity(qty) {
    const match = qty.match(/([\d.]+)\s*(\w+)?/);
    if (!match) return null;
    return { value: parseFloat(match[1]), unit: match[2] || '' };
}

module.exports = { parseQuantity };