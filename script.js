const tags = document.querySelector('#tags');
const suggestions = document.querySelector('#suggestions');
tags.addEventListener('keyup', async (event) => {
    event.preventDefault();
    let value = event.target.value;
    if (value) {
        value = value.trim();
    }
    let response = await fetch(`https://clients1.google.com/complete/search?q=${value}&nolabels=t&client=youtube&ds=yt&dataType=jsonb`);
    response =  await response.text();
    response = parseJSONP(response);    
    showSuggestions(response.suggestions);
});

function showSuggestions(list) {
    let template = `<ul>`;

    list.forEach(item => {
        template += `<li>${item.phrase}</li>`;
    });
    template += `</ul>`;

    suggestions.innerHTML = template;
}

function parseJSONP(jsonpResponse) {
    const jsonStart = jsonpResponse.indexOf('(') + 1;
    const jsonEnd = jsonpResponse.lastIndexOf(')');
    const jsonString = jsonpResponse.substring(jsonStart, jsonEnd);

    const jsonData = JSON.parse(jsonString);

    const result = {
        query: jsonData[0],
        suggestions: jsonData[1].map(item => ({
            phrase: item[0],
            index: item[1],
            details: item[2]
        })),
        metadata: jsonData[2]
    };

    return result;
}