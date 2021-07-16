from flask import Flask, render_template
from flask_socketio import SocketIO
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_urlsafe(16)	# Sets the secret key
socketio = SocketIO(app)

@app.route('/')
def main():
	return render_template('index.html')

@socketio.on('from-client')
def handle_my_event(json, methods = ['GET', 'POST']):
	if 'system' in json:
		print(f"System: { json['system'] }")
	elif 'input' in json:
		socketio.emit('from-server', f"The server received your message: { json['input'] }")
		print(f"User: { json['input'] }")

if __name__ == '__main__':
	socketio.run(app, host = '0.0.0.0', port = '5050', debug = True)