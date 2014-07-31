function mainMenu() {
    $('#billboard_options').hide();
    $('#billboard_links').show();
}

function loadProjectMenu() {
    $.get('/projects', function(data) {
        $('#billboard_links').hide();
        var html = '';
        for (var i = 0; i < data.projects.length; i++) {
            var project = data.projects[i];
            html += '<li><a href="/main/' + project.id + '">' + project.name + '</a></li>';
        }
        html += '<mini id="main_menu"><a href="#">Cancel</a></mini>';
        $('#billboard_options').html(html);
        $('#main_menu').on('click', mainMenu);
        $('#billboard_options').show();
    });
}

function addListeners() {
    $('#load_project').on('click', loadProjectMenu);
}
