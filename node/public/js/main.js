function getState(index, id) {
    var obj = $('#canvas value:eq(' + index + ')');
    $.get('/state/' + id, function(res) {
        console.log(res);
        obj.text(res.data);
    });
}

function addLoadListener(id) {
    $('#load-' + id).on('click', function() {
        $.post('/load', {projectId: projectId, stateId: id});
    });
}

function getStateObjs() {
    $.get('/states/' + projectId, function(res) {
        var html = '';
        for (var i = 0; i < res.data.length; i++) {
            var state = res.data[i];
            html += '<span id="load-' + state.id + '">';
            html += 'Node ' + state.id + ': ';
            html += '<value>' + state.path + '</value>';
            html += '(' + state.parentId + ')<br/>';
            html += '</span>';
        }
        $('#canvas').html(html);
        for (var i = 0; i < res.data.length; i++) {
            var state = res.data[i];
            getState(i, state.id);
            addLoadListener(state.id);
        }
    });
}

function addListeners() {
    $('#nav-save').on('click', function() {
        $.post('/save', {projectId: projectId}, getStateObjs);
    });
}

