import http.server
import socketserver
import webbrowser
import os
import urllib.parse

# The initial port to try.
PORT = 8000

# The directory this script is in.
# This ensures the server serves files from the script's location.
web_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(web_dir)

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        # Guess the MIME type based on the file extension
        import mimetypes
        if not mimetypes.inited:
            mimetypes.init() # Read system mime.types
        
        ext = os.path.splitext(path)[1].lower()
        if ext == '.js':
            return 'application/javascript'
        elif ext == '.css':
            return 'text/css'
        elif ext == '.json':
            return 'application/json'
        elif ext in ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg'):
            return f'image/{ext.lstrip(".")}'
        elif ext == '.html' or ext == '.htm':
            return 'text/html'
        else:
            return mimetypes.guess_type(path)[0] or 'application/octet-stream'

    def send_head(self):
        """Common code for GET and HEAD commands.
        This sends the response code and MIME headers.
        Return value is either a file object (which has to be copied
        to the outputfile by the caller unless the command was HEAD,
        and must be closed by the caller) or None (in which case the
        caller must assume that the server has completed the
        response sending and should not send anything further).
        """
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = urllib.parse.urlsplit(self.path)
            if not parts.path.endswith('/'):
                # redirect browser - doing basically what apache does
                self.send_response(301)
                new_url = urllib.parse.urlunsplit((parts.scheme, parts.netloc, parts.path + '/', parts.query, parts.fragment))
                self.send_header("Location", new_url)
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return self.list_directory(path)
        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        try:
            self.send_response(200)
            self.send_header("Content-type", ctype)
            fs = os.fstat(f.fileno())
            self.send_header("Content-Length", str(fs[6]))
            self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
            self.end_headers()
            return f
        except:
            f.close()
            raise

Handler = MyHttpRequestHandler

httpd = None
# Keep trying to create a server on the next available port.
while True:
    try:
        # Try to create the server on the current PORT.
        httpd = socketserver.TCPServer(("", PORT), Handler)
        # If successful, break the loop.
        break
    except OSError:
        # This means the port is already in use.
        print(f"Port {PORT} is already in use, trying next port.")
        # Try the next port number.
        PORT += 1

# The URL to open in the web browser.
url = f"http://localhost:{PORT}"

print(f"Serving directory '{web_dir}' at {url}")

# Open the URL in a new browser tab.
webbrowser.open_new(url)

# Keep the server running until it's manually stopped.
httpd.serve_forever()
