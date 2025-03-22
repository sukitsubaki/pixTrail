"""
Flask server for the PixTrail web interface.
"""

import os
import webbrowser
import threading
import time
from flask import Flask
from werkzeug.serving import make_server


def create_app():
    """
    Create and configure the Flask application.
    
    Returns:
        Flask: Configured Flask application
    """
    # Create Flask app
    app = Flask(
        __name__,
        static_folder='static',
        template_folder='templates'
    )
    
    # Set configuration
    app.config['SECRET_KEY'] = os.urandom(24)
    app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size
    app.config['PIXTRAIL_DATA_DIR'] = os.path.join(os.path.expanduser('~'), 'PixTrail_Files')
    
    # Ensure storage folder exists
    os.makedirs(app.config['PIXTRAIL_DATA_DIR'], exist_ok=True)
    
    # Register blueprints
    from .routes import main_bp
    app.register_blueprint(main_bp)
    
    return app


class ServerThread(threading.Thread):
    """Thread for running the Flask server."""
    
    def __init__(self, app, host, port):
        """
        Initialize the server thread.
        
        Args:
            app: Flask application
            host: Server host
            port: Server port
        """
        threading.Thread.__init__(self)
        self.server = make_server(host, port, app)
        self.ctx = app.app_context()
        self.ctx.push()
        self.daemon = True
    
    def run(self):
        """Run the server."""
        self.server.serve_forever()
    
    def shutdown(self):
        """Shutdown the server."""
        self.server.shutdown()


def start_server(host='127.0.0.1', port=5000, open_browser=True):
    """
    Start the Flask server in a separate thread and optionally open a browser.
    
    Args:
        host: Server host
        port: Server port
        open_browser: Whether to open a browser window
        
    Returns:
        tuple: (Flask app, server thread)
    """
    app = create_app()
    server = ServerThread(app, host, port)
    server.start()
    
    url = f"http://{host}:{port}"
    print(f"PixTrail web interface started at {url}")
    
    if open_browser:
        # Wait a moment for the server to start up
        time.sleep(0.5)
        webbrowser.open(url)
    
    return app, server


if __name__ == '__main__':
    app, server = start_server()
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        server.shutdown()
        print("Server shutdown successfully")