#!/usr/bin/env python3
"""
Build the PixTrail documentation website using MkDocs.
"""

import os
import subprocess
import sys

def build_docs():
    """Build the documentation."""
    print("Building PixTrail documentation...")
    
    # Ensure we're in the project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Build the docs
    try:
        subprocess.run(["mkdocs", "build"], check=True)
        print("\nDocumentation built successfully!")
        print("The generated website is available in the 'site' directory.")
        print("To view locally, run: python -m http.server -d site")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"\nError building documentation: {e}", file=sys.stderr)
        return 1
    except FileNotFoundError:
        print("\nError: mkdocs command not found!", file=sys.stderr)
        print("Please install MkDocs first: pip install mkdocs mkdocs-material", file=sys.stderr)
        return 1

def serve_docs():
    """Serve the documentation locally."""
    print("Starting local documentation server...")
    
    # Ensure we're in the project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Serve the docs
    try:
        subprocess.run(["mkdocs", "serve"], check=True)
        return 0
    except subprocess.CalledProcessError as e:
        print(f"\nError serving documentation: {e}", file=sys.stderr)
        return 1
    except FileNotFoundError:
        print("\nError: mkdocs command not found!", file=sys.stderr)
        print("Please install MkDocs first: pip install mkdocs mkdocs-material", file=sys.stderr)
        return 1

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Build or serve PixTrail documentation")
    parser.add_argument("--serve", action="store_true", help="Serve documentation locally")
    args = parser.parse_args()
    
    if args.serve:
        sys.exit(serve_docs())
    else:
        sys.exit(build_docs())
