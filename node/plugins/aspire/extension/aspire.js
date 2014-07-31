var socket = io.connect('http://localhost:8092');
socket.on('load', function(data) {
    chrome.tabs.update(undefined, {url: data});
});

chrome.history.onVisited.addListener(function(item) {
    $.post('http://localhost:8080/save', {projectId: 1, state: item.url});
});

