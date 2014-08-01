var socket = io.connect('http://' + window.location.host);

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

function drawTree(states) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Node');
    data.addColumn('string', 'Parent');
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        var html = '<span id="load-' + state.id + '">';
        html += state.id + ': ';
        html += '<span id="value-' + state.id + '">' + state.path + '</span>';
        html += '<br/>(' + state.timestamp + ')';
        if (state.icon) {
            html += '<br/><img src="' + state.icon + '" />';
        }
        html += '</span>';
        var parentId = state.parentId ? state.parentId.toString() : '';
        data.addRow([{v: state.id.toString(), f: html}, state.parentId]);
    }
    var chart = new google.visualization.OrgChart(document.getElementById('canvas'));
    chart.draw(data, {allowHtml:true, nodeClass:'treenode'});
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        getState(state.id);
        addLoadListener(state.id);
    }
}

function addMoveListeners() {
    var startX = 0, startY = 0, prevX = 0, prevY = 0;
    $('#canvas-container').on('mousedown', function(event) {
        startX = parseInt($('#canvas').css('left'));
        startY = parseInt($('#canvas').css('top'));
        prevX = event.clientX;
        prevY = event.clientY;
        $(window).on('mousemove', function(event) {
            $('#canvas').css({
                left: startX + event.clientX - prevX,
                top: startY + event.clientY - prevY
            });
        });
    });
    $(window).on('mouseup', function(event) {
        $(window).off('mousemove');
    });
}

function addMaximizeListener() {
    $('#toggle-maximize').on('click', function() {
        if ($('#canvas-wrapper').hasClass('overlay')) {
            var element = $('#canvas-wrapper').detach();
            $('#canvas-parent').append(element);
            $('#canvas-container').css('max-height', '600px');
            $('#canvas-wrapper').removeClass('overlay');
            $('#toggle-maximize').text('+');
        } else {
            var element = $('#canvas-wrapper').detach();
            $('body').append(element);
            $('#canvas-container').css('max-height', '100%');
            $('#canvas-wrapper').addClass('overlay');
            $('#toggle-maximize').text('-');
        }
    });
}

function addListeners() {
    $('#nav-save').on('click', function() {
        $.post('/requestSave', {projectId: projectId});
    });
    addMoveListeners();
    addMaximizeListener();
    socket.emit('projectId', projectId);
    socket.on('tree', function(data) {
        drawTree(data);
    });
}

