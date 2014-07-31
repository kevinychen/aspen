chrome.history.onVisited.addListener(function(item) {
    $.post('http://localhost:8080/save', {projectId: 1, state: item.url});
});

