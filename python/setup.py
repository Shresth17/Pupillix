import cx_Freeze
import sys
import os
base = None

if sys.platform == 'win32':
    base = 'Win32GUI'


executables = [cx_Freeze.Executable('main.py',base=base ,icon='icon.ico')]

cx_Freeze.setup(
    name = 'Pupillix',
    options = {"build_exe":{"packages":["mediapipe","os","cv2","tkinter",] , "include_files":["icon.ico"]}},
    version = "1.00",
    description = 'Pupillix - Control your mouse with facial movements.',
    executables = executables
)

