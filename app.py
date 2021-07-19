from os import close
from flask import Flask, render_template
from flask_socketio import SocketIO
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_urlsafe(16)	# Sets the secret key
socketio = SocketIO(app)

log = "[]"

# Load the log file into a variable
with open('pchat_log.txt', 'r') as f:
	log = eval(f.read())

@app.route('/')
def main():
	return render_template('index.html', key = secrets.token_urlsafe(16))

@app.route('/' + app.config['SECRET_KEY'])
def admin():
	return render_template('index.html', key = app.config['SECRET_KEY'], admin = True)

@socketio.on('from-client')
def handle_my_event(json, methods = ['GET', 'POST']):
	if 'system' in json:
		print(f"System: { json['system'] }")
	elif 'input' in json:
		socketio.emit('from-server', f"The server received your message: { json['input'] }")
		print(f"User: { json['input'] }")

@socketio.on('pchat_event')
def handle_my_event(e_json, methods = ['GET', 'POST']):
	global log
	if 'data' not in e_json:	# Prevents non-message data from getting in the chat log
		log.append(e_json)	# Add latest message to the log

		# Handle admin commands
		if e_json['session_id'] == app.config['SECRET_KEY']:
			if e_json['msg'] == '/clear':
				log.clear()
			elif e_json['msg'] == '/reload':
				log.clear()
				with open('log.txt', 'r') as f:
					for msg in eval(f.read()):
						log.append(msg)
			elif e_json['msg'].startswith('/del ', 0, 5):
				log.pop()
				x = 0
				flag = False

				# I think this can be simplified and have its 'finally' removed, research first though
				try:
					x = int(e_json['msg'].split(' ')[1])
				except ValueError:
					flag = True
				finally:
					if not flag:
						log.pop(x)

	# Backup chat log to file
	try:
		with open('pchat_log.txt', 'w') as f:
			f.write(repr(log))
	except UnicodeEncodeError:
		with open('pchat_log.txt', 'r') as f:
			log = eval(f.read())

	socketio.emit('pchat_response', log) # Send chat log back to client for processing

if __name__ == '__main__':
	print(f'\n------------------------\nSecret Key: {app.config["SECRET_KEY"]}\n------------------------\n')
	socketio.run(app, host = '0.0.0.0', port = '5050', debug = True)