from __future__ import annotations

from pathlib import Path

import MensaKrabbler


def build_site(data_path: str | Path = "Website/data/menu.json") -> dict:
    return MensaKrabbler.write_week_json(data_path)


if __name__ == "__main__":
    build_site()
