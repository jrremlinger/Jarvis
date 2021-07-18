let navhide = true;
let togglenav = function () {
	navhide = !navhide;
	$('#navpanel').css('display', navhide ? 'none' : 'block');
	$('#navvis p').html(navhide ? '&#5123;' : '&#5121;')
}

let windows = [
	{
	title : 'Checkers',
	link : '../static/windows/checkers.html',
	category : 'Games',
	hidden : true
	},
	{
		title : 'Tic Tac Toe',
		link : '../static/windows/tictactoe.html',
		category : 'Games',
		hidden : false
	},
	{
		title : 'J-Chat',
		link : '../static/windows/j-chat.html',
		category : 'Social',
		hidden : true
	},
	{
		title : 'Amnesia',
		link : '../static/windows/amnesia.html',
		category : 'Tools',
		hidden : true
	}
];

// Hide/Show windows and update the nav-bar. Eventually this should somehow reset the programs probably.
let toggleWindow = function(windowID) {
	$(`#navID${windowID}`).css('color', (windows[windowID].hidden == false) ? '#F44' : '#4F4');
	windows[windowID].hidden = (windows[windowID].hidden == false) ? true : false;
	buildUI(true);
}

// Builds the windows and nav-bar
let buildUI = async function(skipNav = false) {
	let toolsnav = [];
	let socialnav = [];
	let gamesnav = [];

	// Add the windows into their categories (This can probably be done more efficiently)
	for (let i in windows) {
		switch (windows[i].category) {
			case 'Games':
				gamesnav.push(windows[i]);
				break;
			case 'Social':
				socialnav.push(windows[i]);
				break;
			case 'Tools':
				toolsnav.push(windows[i]);
				break;
		}
	}

	if (!skipNav) {
		// Build the nav-bar
		let navcontent = `<div class="collapsible">Games</div><div class="collapselist">`;
		for (let i in gamesnav) { navcontent += `<p onclick="toggleWindow(${windows.indexOf(gamesnav[i])})" id="navID${windows.indexOf(gamesnav[i])}">${gamesnav[i].title}</p>` }
		navcontent += '</div><div class="collapsible">Social</div><div class="collapselist">'
		for (let i in socialnav) { navcontent += `<p onclick="toggleWindow(${windows.indexOf(socialnav[i])})" id="navID${windows.indexOf(socialnav[i])}">${socialnav[i].title}</p>` }
		navcontent += '</div><div class="collapsible">Tools</div><div class="collapselist">'
		for (let i in toolsnav) { navcontent += `<p onclick="toggleWindow(${windows.indexOf(toolsnav[i])})" id="navID${windows.indexOf(toolsnav[i])}">${toolsnav[i].title}</p>` }
		navcontent += '</div>'
		$('#navpanel').html(navcontent);

		// Make the nav-bar categories collapsible
		let coll = $('.collapsible');
		for (let i = 0; i < coll.length; i++) {
			$(coll[i]).click(function() {
				this.classList.toggle('collactive');
				let content = this.nextElementSibling;
				content.style.display = (content.style.display === 'block') ? 'none' : 'block';
			})
		}
	}

	// Build the windows
	let content = '';
	for (let i in windows) {
		if (windows[i].hidden) continue;
		let response = await fetch(windows[i].link);
		let data = await response.text();
		content += `
			<div class="window" id="winID${i}">
				<div class="windowtitlebar">
					<p>${windows[i].title}</p>
					<div class="windowclosebtn" onclick="toggleWindow(${i})">&#10005</div>
				</div>
				<div class="windowcontent">
					${data}
				</div>
			</div>`
	}
	$('#displayzone').html(content);
}

// Socket stuff
let socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function() {
	socket.emit('from-client', { 'system' : 'User Connected' });
	
	$('form').on('submit', function(e) {
		e.preventDefault();
		let myinput = $('#input').val();
		if (myinput !== "" && myinput !== ' ') { socket.emit('from-client', { 'input' : myinput }); }
		$('#input').val('');
	});
});

socket.on('from-server', function(str) {
	console.log(str);
})

// Let there be light!
buildUI();

fakewin = function() {
	$('#displayzone').html(`
		<div class="window" id="winID9" style="display: block;">
			<div class="windowtitlebar">
				<p>Test Window</p>
				<div class="windowclosebtn" onclick="toggleWindow(9)">&#10005</div>
			</div>
			<div class="windowcontent"></div>
		</div>`
	);
}