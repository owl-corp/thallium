import asyncio
import logging
import os

from src.settings import CONFIG

# On Windows, the selector event loop is required for aiodns.
if os.name == "nt":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# Console handler prints to terminal
console_handler = logging.StreamHandler()
level = logging.DEBUG if CONFIG.debug else logging.INFO
console_handler.setLevel(level)

# Remove old loggers, if any
root = logging.getLogger()
if root.handlers:
    for handler in root.handlers:
        root.removeHandler(handler)

# Setup new logging configuration
logging.basicConfig(
    format="%(asctime)s - %(name)s %(levelname)s: %(message)s",
    datefmt="%D %H:%M:%S",
    level=logging.DEBUG if CONFIG.debug else logging.INFO,
    handlers=[console_handler],
)
