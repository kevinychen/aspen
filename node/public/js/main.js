function getState(index, id) {
    var obj = $('#canvas span:eq(' + index + ')');
    $.get('/state/' + id, function(res) {
        console.log(res);
        obj.text(res.data);
    });
}

function getStateObjs() {
    $.get('/states/' + projectId, function(res) {
        var html = '';
        for (var i = 0; i < res.data.length; i++) {
            html += '<span>' + res.data[i].path + '</span> (' + res.data[i].parentId + ')<br/>';
        }
        $('#canvas').html(html);
        for (var i = 0; i < res.data.length; i++) {
            getState(i, res.data[i].id);
        }
    });
}

function addListeners() {
    $('#nav-save').on('click', function() {
        $.post('/save', {projectId: projectId}, getStateObjs);
    });
}

