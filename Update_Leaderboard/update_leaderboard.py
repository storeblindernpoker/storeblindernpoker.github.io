#!/usr/bin/env python3
"""
Store Blindern Poker — Leaderboard Updater

Usage:
    python scripts/update_leaderboard.py <path_to_csv_file> [--season "Spring 2026"] [--rounds 6]

The CSV file should be in this exact format (comma-separated, with padding):
    name, pseudonym, current points, highest points, lowest points
    William Ekedahl, Snorkfrøken, 83950, 83950, 40000
    ...

The script will:
  1. Parse the CSV file
  2. Sort players by current points (descending)
  3. Compute rank changes vs the existing leaderboard.json (if any)
  4. Write an updated data/leaderboard.json
"""

import json
import sys
import os
import argparse
from datetime import date


def parse_leaderboard_csv(filepath):
    """Parse the fixed-width comma-separated leaderboard file."""
    players = []
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # First line is the header — skip it
    for i, line in enumerate(lines[1:], start=2):
        line = line.strip()
        if not line:
            continue

        parts = [p.strip() for p in line.split(",")]
        if len(parts) < 5:
            print(f"  ⚠  Skipping line {i}: not enough columns → {line}")
            continue

        name = parts[0]
        pseudonym = parts[1]
        try:
            current_points = int(parts[2])
            highest_points = int(parts[3])
            lowest_points = int(parts[4])
        except ValueError:
            print(f"  ⚠  Skipping line {i}: could not parse numbers → {line}")
            continue

        players.append({
            "name": name,
            "pseudonym": pseudonym,
            "points": current_points,
            "highestPoints": highest_points,
            "lowestPoints": lowest_points,
        })

    return players


def load_existing_leaderboard(json_path):
    """Load the current leaderboard.json to get previous ranks."""
    if not os.path.exists(json_path):
        return {}
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    # Build a map of pseudonym -> rank
    return {p["pseudonym"]: p["rank"] for p in data.get("players", [])}


def build_leaderboard(players, previous_ranks, season, rounds):
    """Build the final leaderboard JSON structure."""
    # Sort by points descending
    players.sort(key=lambda p: p["points"], reverse=True)

    leaderboard_players = []
    for i, p in enumerate(players, start=1):
        prev_rank = previous_ranks.get(p["pseudonym"], i)  # default: same rank
        leaderboard_players.append({
            "rank": i,
            "previousRank": prev_rank,
            "pseudonym": p["pseudonym"],
            "points": p["points"],
            "highestPoints": p["highestPoints"],
            "lowestPoints": p["lowestPoints"],
        })

    return {
        "season": season,
        "lastUpdated": date.today().isoformat(),
        "rounds": rounds,
        "players": leaderboard_players,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Update Store Blindern Poker leaderboard from a CSV export."
    )
    parser.add_argument(
        "csv_file",
        help="Path to the CSV leaderboard file",
    )
    parser.add_argument(
        "--season",
        default=None,
        help='Season name, e.g. "Spring 2026". If omitted, keeps the existing season.',
    )
    parser.add_argument(
        "--rounds",
        type=int,
        default=None,
        help="Number of rounds played. If omitted, auto-increments the existing value by 1.",
    )

    args = parser.parse_args()

    # Resolve paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    json_path = os.path.join(project_root, "data", "leaderboard.json")

    # Load existing data for defaults
    existing = {}
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            existing = json.load(f)

    season = args.season or existing.get("season", f"Spring {date.today().year}")
    if args.rounds is not None:
        rounds = args.rounds
    else:
        # Auto-increment rounds by 1
        rounds = existing.get("rounds", 0) + 1
        print(f"   Auto-incrementing rounds: {rounds - 1} → {rounds}")

    # Parse the CSV
    print(f"📂 Reading: {args.csv_file}")
    players = parse_leaderboard_csv(args.csv_file)
    print(f"   Found {len(players)} players")

    # Get previous ranks
    previous_ranks = load_existing_leaderboard(json_path)

    # Build new leaderboard
    leaderboard = build_leaderboard(players, previous_ranks, season, rounds)

    # Write
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(leaderboard, f, indent=2, ensure_ascii=False)

    print(f"✅ Updated {json_path}")
    print(f"   Season: {season}")
    print(f"   Rounds: {rounds}")
    print(f"   Players: {len(players)}")
    print(f"   🥇 {leaderboard['players'][0]['pseudonym']} — {leaderboard['players'][0]['points']:,} pts")


if __name__ == "__main__":
    main()
