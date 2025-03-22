"""
API routes for the PixTrail web interface.
"""

import os
import json
import tempfile
import shutil
from datetime import datetime
from flask import (
    Blueprint, render_template, request, jsonify, 
    current_app, send_file, abort, redirect, url_for
)
from werkzeug.utils import secure_filename

from ..core import PixTrail
from ..utils import get_default_output_path, ensure_directory

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')


@main_bp.route('/api/submit', methods=['POST'])
def receive_photos():
    """
    Handle photo submissions.
    
    Receives submitted photos, saves them to a temporary directory,
    and returns a session ID for further processing.
    """
    if 'photos' not in request.files:
        return jsonify({'error': 'No files submitted'}), 400
    
    files = request.files.getlist('photos')
    if not files or all(not f.filename for f in files):
        return jsonify({'error': 'No files selected'}), 400
    
    # Create a session ID based on timestamp
    session_id = datetime.now().strftime('%Y%m%d%H%M%S')
    process_dir = os.path.join(current_app.config['PIXTRAIL_DATA_DIR'], session_id)
    
    try:
        # Create processing directory
        os.makedirs(process_dir, exist_ok=True)
        
        # Save submitted files
        saved_files = []
        for file in files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join(process_dir, filename)
                file.save(file_path)
                saved_files.append({
                    'name': filename,
                    'path': file_path
                })
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'message': f'Successfully received {len(saved_files)} files',
            'file_count': len(saved_files)
        })
    
    except Exception as e:
        # Clean up on error
        if os.path.exists(process_dir):
            shutil.rmtree(process_dir)
        return jsonify({'error': str(e)}), 500


@main_bp.route('/api/process/<session_id>', methods=['POST'])
def process_photos(session_id):
    """
    Process submitted photos and extract GPS data.
    
    Args:
        session_id: Session ID from the submission step
    """
    process_dir = os.path.join(current_app.config['PIXTRAIL_DATA_DIR'], session_id)
    
    if not os.path.exists(process_dir):
        return jsonify({'error': 'Session not found'}), 404
    
    try:
        # Process photos in the directory
        pixtrail = PixTrail()
        result = pixtrail.process_directory(process_dir)
        gps_data = result['gps_data']
        stats = result['stats']
        
        if not gps_data:
            return jsonify({
                'success': False,
                'error': 'No GPS data found in any of the submitted photos',
                'stats': stats
            }), 400
        
        # Generate GPX file
        gpx_file = os.path.join(process_dir, f"pixtrail_{session_id}.gpx")
        success = pixtrail.generate_gpx(gpx_file, gps_data)
        
        if not success:
            return jsonify({
                'success': False,
                'error': 'Failed to generate GPX file',
                'stats': stats
            }), 500
        
        # Prepare response data
        waypoints = [{
            'latitude': point['latitude'],
            'longitude': point['longitude'],
            'name': point['name'],
            'timestamp': point['timestamp'].isoformat() if 'timestamp' in point else None,
            'altitude': point.get('altitude', 0)
        } for point in gps_data]
        
        return jsonify({
            'success': True,
            'waypoints': waypoints,
            'gpx_file': os.path.basename(gpx_file),
            'session_id': session_id,
            'stats': stats
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@main_bp.route('/api/download/<session_id>/<filename>', methods=['GET'])
def download_gpx(session_id, filename):
    """
    Download the generated GPX file.
    
    Args:
        session_id: Session ID
        filename: GPX filename
    """
    secure_name = secure_filename(filename)
    file_path = os.path.join(current_app.config['PIXTRAIL_DATA_DIR'], session_id, secure_name)
    
    if not os.path.exists(file_path):
        abort(404)
    
    return send_file(
        file_path,
        as_attachment=True,
        download_name=secure_name,
        mimetype='application/gpx+xml'
    )


@main_bp.route('/api/cleanup/<session_id>', methods=['POST'])
def cleanup_session(session_id):
    """
    Clean up the session by removing temporary files.
    
    Args:
        session_id: Session ID to clean up
    """
    session_dir = os.path.join(current_app.config['PIXTRAIL_DATA_DIR'], session_id)
    
    if os.path.exists(session_dir):
        try:
            shutil.rmtree(session_dir)
            return jsonify({'success': True, 'message': 'Session cleaned up successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'success': True, 'message': 'Nothing to clean up'})