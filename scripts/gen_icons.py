#!/usr/bin/env python3
"""Generate icons/{16,48,128}.png — no deps, stdlib PNG encoder.

Design: dark rounded-square badge, white eye, coral diagonal "blocked" slash.
Regenerate with: python3 scripts/gen_icons.py
"""
import os
import struct
import zlib

BG = (26, 26, 46, 255)       # #1a1a2e
EYE = (240, 240, 245, 255)   # near-white
PUPIL = BG
SLASH = (255, 84, 112, 255)  # #ff5470


def rounded_square_mask(x, y, size, radius):
    cx0, cy0 = radius, radius
    cx1, cy1 = size - 1 - radius, radius
    cx2, cy2 = radius, size - 1 - radius
    cx3, cy3 = size - 1 - radius, size - 1 - radius
    if x < radius and y < radius:
        return (x - cx0) ** 2 + (y - cy0) ** 2 <= radius ** 2
    if x > size - 1 - radius and y < radius:
        return (x - cx1) ** 2 + (y - cy1) ** 2 <= radius ** 2
    if x < radius and y > size - 1 - radius:
        return (x - cx2) ** 2 + (y - cy2) ** 2 <= radius ** 2
    if x > size - 1 - radius and y > size - 1 - radius:
        return (x - cx3) ** 2 + (y - cy3) ** 2 <= radius ** 2
    return True


def pixel(x, y, size):
    cx, cy = size / 2, size / 2
    if not rounded_square_mask(x, y, size, size * 0.18):
        return (0, 0, 0, 0)

    # eye: ellipse outline, wide oval centered
    ex, ey = (x - cx) / (size * 0.36), (y - cy) / (size * 0.22)
    eye_dist = ex * ex + ey * ey
    if eye_dist <= 1.0:
        # pupil: small circle in the middle of the eye
        px, py = (x - cx) / (size * 0.1), (y - cy) / (size * 0.1)
        if px * px + py * py <= 1.0:
            color = PUPIL
        else:
            color = EYE
    else:
        color = BG

    # diagonal slash band across the whole badge (top-left to bottom-right)
    band = (x - y)
    half_w = max(1, size * 0.06)
    if abs(band) <= half_w:
        color = SLASH

    return color


def render(size):
    return [[pixel(x, y, size) for x in range(size)] for y in range(size)]


def encode_png(path, size):
    rows = render(size)
    raw = bytearray()
    for row in rows:
        raw.append(0)  # filter: none
        for (r, g, b, a) in row:
            raw += bytes((r, g, b, a))

    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff))

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw), 9)
    with open(path, "wb") as f:
        f.write(sig)
        f.write(chunk(b"IHDR", ihdr))
        f.write(chunk(b"IDAT", idat))
        f.write(chunk(b"IEND", b""))


if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "..", "icons")
    os.makedirs(out_dir, exist_ok=True)
    for sz in (16, 48, 128):
        p = os.path.join(out_dir, f"{sz}.png")
        encode_png(p, sz)
        print(p)
