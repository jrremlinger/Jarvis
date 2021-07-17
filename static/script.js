// List deco
// let coll = document.getElementsByClassName("collapsible");
let coll = $('.collapsible');
for (let i = 0; i < coll.length; i++) {
	$(coll[i]).click(function() {
		this.classList.toggle('collactive');
		let content = this.nextElementSibling;
		content.style.display = (content.style.display === 'block') ? 'none' : 'block';
	})
}

let buildWindows = async function() {
	let response = await fetch('../static/windows/amnesia/amnesia.html');
	let data = await response.text();
	$('#displayzone').html(`\
		<div class="window">\
			<div class="windowtitlebar">\
				<p>Window Name</p>\
				<div class="windowclosebtn">&#10005</div>\
			</div>\
			<div class="windowcontent">\
				${data}
			</div>\
		</div>\
	`);
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

buildWindows();