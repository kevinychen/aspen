var socket = io.connect('http://localhost:8092');
var projectId = -1;

socket.on('projectId', function(data) {
    projectId = data;
});
socket.on('load', function(data) {
    chrome.tabs.update(undefined, {url: data});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.favIconUrl) {
        $.post('http://localhost:8080/save', {projectId: projectId,
            state: tab.url, name: tab.title, icon: tab.favIconUrl});
    }
});

