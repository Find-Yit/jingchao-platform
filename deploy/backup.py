"""Run as root or zhixu: python backup.py /path/to/private-backup-directory."""
import os
import shutil
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

source=Path(os.environ.get('DATA_DIR','/var/lib/zhixu'))
target=Path(sys.argv[1])/datetime.now(timezone.utc).strftime('zhixu-%Y%m%dT%H%M%SZ')
target.mkdir(parents=True,mode=0o700)
os.chmod(target,0o700)
with sqlite3.connect(source/'school.db') as origin, sqlite3.connect(target/'school.db') as dest:
    origin.backup(dest)
for name in ('session.key','encryption.key'):
    shutil.copyfile(source/name,target/name)
for path in target.iterdir():
    os.chmod(path,0o600)
print(target)
