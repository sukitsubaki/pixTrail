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


@main_bp.route('/api/upload', methods=['POST'])
def upload_photos():
    """
    Handle photo uploads.
    
    Receives uploaded photos, saves them to a temporary directory,
    and returns a session ID for further processing.
    """
    if 'photos' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400
    
    files = request.files.getlist('photos')
    if not files or all(not f.filename for f in files):
        return jsonify({'error': 'No files selected'}), 400
    
    # Create a session ID based on timestamp
    session_id = datetime.now().strftime('%Y%m%d%H%M%S')
    upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], session_id)
    
    try:
        # Create upload directory
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save uploaded files
        saved_files = []
        for file in files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join(upload_dir, filename)
                file.save(file_path)
                saved_files.append({
                    'name': filename,
                    'path': file_path
                })
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'message': f'Successfully uploaded {len(saved_files)} files',
            'file_count': len(saved_files)
        })
    
    except Exception as e:
        # Clean up on error
        if os.path.exists(upload_dir):
            shutil.rmtree(upload_dir)
        return jsonify({'error': str(e)}), 500


@main_bp.route('/api/process/<session_id>', methods=['POST'])
def process_photos(session_id):
    """
    Process uploaded photos and extract GPS data.
    
    Args:
        session_id: Session ID from the upload step
    """
    upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], session_id)
    
    if not os.path.exists(upload_dir):
        return jsonify({'error': 'Session not found'}), 404
    
    try:
        # Process photos in the upload directory
        pixtrail = PixTrail()
        gps_data = pixtrail.process_directory(upload_dir)
        
        if not gps_data:
            return jsonify({
                'success': False,
                'error': 'No GPS data found in the uploaded photos'
            }), 400
        
        # Generate GPX file
        gpx_file = os.path.join(upload_dir, f"pixtrail_{session_id}.gpx")
        success = pixtrail.generate_gpx(gpx_file)
        
        if not success:
            return jsonify({
                'success': False,
                'error': 'Failed to generate GPX file'
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
            'session_id': session_id
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
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], session_id, secure_name)
    
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
    Clean up the session by removing uploaded files.
    
    Args:
        session_id: Session ID to clean up
    """
    upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], session_id)
    
    if os.path.exists(upload_dir):
        try:
            shutil.rmtree(upload_dir)
            return jsonify({'success': True, 'message': 'Session cleaned up successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'success': True, 'message': 'Nothing to clean up'})
