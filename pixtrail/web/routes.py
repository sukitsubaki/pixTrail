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
import logging
from ..core import PixTrail
from ..utils import get_image_files, ensure_directory, get_default_output_path

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
    
    # Get source type (file or directory)
    source_type = request.form.get('source_type', 'file')
    
    # Create a session ID based on timestamp
    session_id = datetime.now().strftime('%Y%m%d%H%M%S')
    
    # Secure and normalize data directory path
    data_dir = os.path.normpath(current_app.config['PIXTRAIL_DATA_DIR'])
    process_dir = os.path.normpath(os.path.join(data_dir, session_id))
    
    # Ensure process_dir is within data_dir
    if not process_dir.startswith(data_dir):
        return jsonify({'error': 'Invalid session path'}), 400
    
    try:
        # Create processing directory
        os.makedirs(process_dir, exist_ok=True)
        
        # Save submitted files
        saved_files = []
        for file in files:
            if file and file.filename:
                # For directory submissions, maintain relative paths
                if source_type == 'directory':
                    # Get relative path from the filename
                    rel_path = file.filename
                    # Create subdirectories if they don't exist
                    file_dir = os.path.dirname(rel_path)
                    if file_dir:
                        # Secure the file directory
                        secure_file_dir = os.path.normpath(os.path.join(process_dir, 
                                                          *[secure_filename(part) for part in file_dir.split(os.sep)]))
                        # Ensure it's still within process_dir
                        if not secure_file_dir.startswith(process_dir):
                            continue
                        ensure_directory(secure_file_dir)
                    
                    # Secure the filename
                    secure_rel_path = os.path.join(
                        os.path.dirname(rel_path),
                        secure_filename(os.path.basename(rel_path))
                    )
                    # Save file with its secured relative path
                    file_path = os.path.normpath(os.path.join(process_dir, secure_rel_path))
                else:
                    # For individual file submissions, just use the filename
                    filename = secure_filename(file.filename)
                    file_path = os.path.normpath(os.path.join(process_dir, filename))
                
                # Final safety check
                if not file_path.startswith(process_dir):
                    continue
                
                file.save(file_path)
                saved_files.append({
                    'name': os.path.basename(file_path),
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
    # Secure and normalize paths
    secure_session_id = secure_filename(session_id)
    data_dir = os.path.normpath(current_app.config['PIXTRAIL_DATA_DIR'])
    process_dir = os.path.normpath(os.path.join(data_dir, secure_session_id))
    
    # Ensure process_dir is within data_dir
    if not process_dir.startswith(data_dir):
        return jsonify({'error': 'Invalid session path'}), 400
    
    if not os.path.exists(process_dir):
        return jsonify({'error': 'Session not found'}), 404
    
    try:
        # Get processing options from session
        session_file = os.path.normpath(os.path.join(process_dir, ".session_info"))
        processing_options = {}
        if os.path.exists(session_file) and session_file.startswith(process_dir):
            with open(session_file, 'r') as f:
                processing_options = json.load(f)
        
        # Check if recursive processing is enabled
        recursive = processing_options.get('recursive', False)
        max_depth = processing_options.get('max_depth', None)
        
        # Process photos in the directory
        pixtrail = PixTrail()
        
        # If max_depth is provided and not 0 (all levels), customize recursive depth
        if recursive and max_depth and int(max_depth) > 0:
            # TODO: Implement custom max_depth in PixTrail core
            # For now, we're just using simple recursive flag
            result = pixtrail.process_directory(process_dir, recursive=True)
        else:
            result = pixtrail.process_directory(process_dir, recursive=recursive)
            
        gps_data = result['gps_data']
        stats = result['stats']
        
        if not gps_data:
            # No GPS data found, clear all
            shutil.rmtree(process_dir)
            return jsonify({
                'success': False,
                'error': 'No GPS data found in any of the submitted photos',
                'stats': stats
            }), 400
        
        # Generate GPX file with secured filename
        gpx_filename = f"pixtrail_{secure_session_id}.gpx"
        gpx_file = os.path.normpath(os.path.join(process_dir, gpx_filename))
        
        # Verify path is still within process_dir
        if not gpx_file.startswith(process_dir):
            shutil.rmtree(process_dir)
            return jsonify({
                'success': False,
                'error': 'Invalid GPX file path',
                'stats': stats
            }), 400
            
        success = pixtrail.generate_gpx(gpx_file, gps_data)
        
        if not success:
            # Clear, if GPX file couldn't be generated
            shutil.rmtree(process_dir)
            return jsonify({
                'success': False,
                'error': 'Failed to generate GPX file',
                'stats': stats
            }), 500
        
        # Remove cached image files
        for item in os.listdir(process_dir):
            item_path = os.path.join(process_dir, item)
            # Normalize the path and verify it's within process_dir
            item_path = os.path.normpath(item_path)
            if not item_path.startswith(process_dir):
                continue
                
            # Keep GPX file and session_info
            if os.path.basename(item_path) != os.path.basename(gpx_file) and os.path.basename(item_path) != ".session_info":
                if os.path.isfile(item_path):
                    os.remove(item_path)
                elif os.path.isdir(item_path):
                    shutil.rmtree(item_path)
        
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
            'session_id': secure_session_id,
            'stats': stats
        })
    
    except Exception as e:
        import traceback
        error_details = str(e)
        traceback_details = traceback.format_exc()
        print(f"Error processing photos: {error_details}")
        print(f"Traceback: {traceback_details}")
        # Clear when error
        if os.path.exists(process_dir):
            shutil.rmtree(process_dir)
        return jsonify({'error': f"Processing failed: {error_details}", 'success': False}), 500


@main_bp.route('/api/download/<session_id>/<filename>', methods=['GET'])
def download_gpx(session_id, filename):
    """
    Download the generated GPX file.
    
    Args:
        session_id: Session ID
        filename: GPX filename
    """
    # Sanitize inputs
    secure_session_id = secure_filename(session_id)
    secure_name = secure_filename(filename)
    
    # Construct and normalize paths
    data_dir = os.path.normpath(current_app.config['PIXTRAIL_DATA_DIR'])
    file_path = os.path.normpath(os.path.join(data_dir, secure_session_id, secure_name))
    
    # Security check: ensure the path is still within the data directory
    if not file_path.startswith(data_dir):
        abort(404)
    
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
    # Sanitize session_id
    secure_session_id = secure_filename(session_id)
    
    # Construct and normalize path
    data_dir = os.path.normpath(current_app.config['PIXTRAIL_DATA_DIR'])
    session_dir = os.path.normpath(os.path.join(data_dir, secure_session_id))
    
    # Verify session_dir is within data_dir
    if not session_dir.startswith(data_dir):
        return jsonify({'error': 'Invalid session path'}), 400
    
    if os.path.exists(session_dir):
        try:
            shutil.rmtree(session_dir)
            return jsonify({'success': True, 'message': 'Session cleaned up successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'success': True, 'message': 'Nothing to clean up'})


@main_bp.route('/api/create-gpx', methods=['POST'])
def create_gpx():
    """
    Create a GPX file from GPS data extracted in the browser.
    
    The GPS data is extracted client-side and only the coordinate information
    is sent to the server to generate the GPX file.
    """
    if not request.is_json:
        return jsonify({'error': 'No files submitted'}), 400
    
    data = request.get_json()
    
    if 'gps_data' not in data or not data['gps_data']:
        return jsonify({'error': 'No GPS data provided'}), 400
    
    gps_data_list = data['gps_data']
    
    # Convert string timestamps to datetime objects
    for point in gps_data_list:
        if 'timestamp' in point and point['timestamp']:
            try:
                point['timestamp'] = datetime.fromisoformat(point['timestamp'].replace('Z', '+00:00'))
            except (ValueError, TypeError):
                point['timestamp'] = datetime.now()
    
    try:
        # Create a session ID based on timestamp
        session_id = datetime.now().strftime('%Y%m%d%H%M%S')
        
        # Construct and normalize paths
        data_dir = os.path.normpath(current_app.config['PIXTRAIL_DATA_DIR'])
        process_dir = os.path.normpath(os.path.join(data_dir, session_id))
        
        # Verify process_dir is within data_dir
        if not process_dir.startswith(data_dir):
            return jsonify({'error': 'Invalid session path'}), 400
        
        # Create output directory only, no image files are copied
        os.makedirs(process_dir, exist_ok=True)
        
        # Generate GPX file
        pixtrail = PixTrail()
        gpx_filename = f"pixtrail_{session_id}.gpx"
        gpx_file = os.path.normpath(os.path.join(process_dir, gpx_filename))
        
        # Final security check
        if not gpx_file.startswith(process_dir):
            if os.path.exists(process_dir):
                shutil.rmtree(process_dir)
            return jsonify({
                'success': False,
                'error': 'Invalid GPX file path'
            }), 400
            
        success = pixtrail.generate_gpx(gpx_file, gps_data_list)
        
        if not success:
            # Clean up on error
            if os.path.exists(process_dir):
                shutil.rmtree(process_dir)
            return jsonify({
                'success': False,
                'error': 'Failed to generate GPX file'
            }), 500
        
        # Prepare response data
        waypoints = [{
            'latitude': point['latitude'],
            'longitude': point['longitude'],
            'name': point['name'],
            'timestamp': point['timestamp'].isoformat() if isinstance(point['timestamp'], datetime) else point['timestamp'],
            'altitude': point.get('altitude', 0)
        } for point in gps_data_list]
        
        return jsonify({
            'success': True,
            'waypoints': waypoints,
            'gpx_file': os.path.basename(gpx_file),
            'session_id': session_id
        })
        
    except Exception as e:
        import traceback
        error_details = str(e)
        traceback_details = traceback.format_exc()
        logging.error(f"Error creating GPX: {error_details}")
        logging.error(f"Traceback: {traceback_details}")
        # Clean up on error
        if os.path.exists(process_dir):
            shutil.rmtree(process_dir)
        return jsonify({'error': 'An internal error has occurred. Please try again later.', 'success': False}), 500
