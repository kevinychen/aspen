
function getState(id) {
    var obj = $('#value-' + id);
    $.get('/state/' + id, function(res) {
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
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Node');
        data.addColumn('string', 'Parent');
        for (var i = 0; i < res.data.length; i++) {
            var state = res.data[i];
            var html = '<span id="load-' + state.id + '">';
            html += 'Node ' + state.id + ': ';
            html += '<span id="value-' + state.path + '"></span>';
            html += '(' + state.parentId + ') <br/>';
            html += '</span>';
            var parentId = state.parentId ? state.parentId.toString() : '';
            data.addRow([{v: state.id.toString(), f: html}, state.parentId]);
        }
        var chart = new google.visualization.OrgChart(document.getElementById('canvas'));
        chart.draw(data, {allowHtml:true});
        for (var i = 0; i < res.data.length; i++) {
            var state = res.data[i];
            getState(state.id);
            addLoadListener(state.id);
        }
    });
}

function addListeners() {
    $('#nav-save').on('click', function() {
        $.post('/save', {projectId: projectId}, getStateObjs);
    });
}

