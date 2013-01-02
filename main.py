from webapp2 import WSGIApplication, Route
import controllers
# Copy this file into secrets.py and set keys, secrets and scopes.

# This is a session secret key used by webapp2 framework.
# Get 'a random and long string' from here: 
# http://clsc.net/tools/random-string-generator.php
# or execute this from a python shell: import os; os.urandom(64)
SESSION_KEY = "\xb6r\xdc\xb0Y\x17'\xafG`LQYph\xe4\x1b\x15\xce\xae\x10/\xc1g\xa9J~\x9e\xdbc\x1e\x9dK\xfa\xcb\xda\x9f\xfb\xb2.Z\x13p,\x19v\xc1g\x0c\x87$,\x8b\xa5\xb5\xd1J\xe7\x7fzuo{n"

# webapp2 config
app_config = {
  'webapp2_extras.sessions': {
    'cookie_name': '_simpleauth_sess',
    'secret_key': SESSION_KEY
  },
  'webapp2_extras.auth': {
    'user_attributes': []
  }
}


routes = [
    Route('/', handler='controllers.handlers.IndexController')
]

app = WSGIApplication(routes, config=app_config, debug=True)
