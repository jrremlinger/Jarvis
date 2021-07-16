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