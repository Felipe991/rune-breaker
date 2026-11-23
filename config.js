// PROTOTYPE - NOT FOR PRODUCTION
// Question: Is setting up a big color chain, with a rare Relic now and then, fun enough to start another run right away?
// Date: 2026-11-20
// Every tuning value lives here, each with value, min, max and step. The game reads them live
// through tune.<name> (index.html); the tweak panel, an add-on, writes them back here.
window.CONFIG = {
  seed: 1, // every gameplay random call reads rng(), seeded from this (or ?seed= in the address)
  volume: { value: 0.5, min: 0, max: 1, step: 0.05 },
  music_volume: { value: 0.55, min: 0, max: 1, step: 0.05 },     // how loud the music and its stingers are (the mute button silences it too)
  music_play_bpm: { value: 112, min: 80, max: 150, step: 2 },    // tempo of the in-run music

  // ---- Detonation and score ----
  detonate_size: { value: 4, min: 3, max: 6, step: 1 },          // runes in a touching same-colour group that detonate
  cell_score: { value: 10, min: 1, max: 50, step: 1 },           // points per detonated rune
  size_bonus: { value: 0.25, min: 0, max: 1, step: 0.05 },       // extra fraction per rune past the minimum group
  chain_step: { value: 2, min: 0, max: 6, step: 0.5 },          // chain multiplier gained per link after the first: x1, x2, x4, x6, x8...
  stone_clear: { value: 1, min: 0, max: 1, step: 1 },            // 1: stones touching a detonation break too

  // ---- Pieces and the deal ----
  p_size2: { value: 0.30, min: 0, max: 1, step: 0.05 },          // chance a piece has 2 runes
  p_size3: { value: 0.45, min: 0, max: 1, step: 0.05 },          // chance a piece has 3 runes (the rest have 4)
  piece_mix: { value: 0.35, min: 0, max: 1, step: 0.05 },        // chance a rune in a piece differs from its base colour
  fair_bias: { value: 0.55, min: 0, max: 1, step: 0.05 },        // chance a piece's base colour is one already on a stack top
  fair_decay: { value: 0.08, min: 0, max: 0.3, step: 0.01 },     // fair_bias lost per boss beaten
  fair_min: { value: 0.30, min: 0, max: 1, step: 0.05 },         // floor for fair_bias
  colors_start: { value: 4, min: 2, max: 5, step: 1 },           // rune colours at the start (more colours, fewer easy matches)
  colors_round_a: { value: 3, min: 1, max: 20, step: 1 },        // round that adds a 5th colour
  colors_round_b: { value: 30, min: 1, max: 30, step: 1 },       // spare: a further colour step (the palette stops at 5)

  // ---- Rounds, Relics and bosses ----
  round_len: { value: 10, min: 4, max: 20, step: 1 },            // drops in a normal round
  boss_every: { value: 5, min: 2, max: 10, step: 1 },            // every Nth round is a boss
  boss_round_len: { value: 12, min: 4, max: 24, step: 1 },       // drops in a boss round
  boss_hp: { value: 140, min: 50, max: 8000, step: 10 },         // first boss damage bar, in points scored that round
  boss_hp_step: { value: 85, min: 0, max: 5000, step: 5 },      // floor growth per later boss (the real health also follows your scoring pace)
  boss_bonus: { value: 800, min: 0, max: 8000, step: 50 },       // bonus points per boss number
  boss_stone_every: { value: 3, min: 1, max: 8, step: 1 },       // a stone falls every N drops in a boss round
  meter_base: { value: 14, min: 6, max: 40, step: 1 },           // runes cleared to fill the first Relic meter
  meter_growth: { value: 3, min: 0, max: 10, step: 1 },          // meter size added per Relic picked
  meter_per_cell: { value: 1, min: 0.25, max: 3, step: 0.25 },   // meter gained per rune cleared
  w_common: { value: 55, min: 0, max: 100, step: 1 },            // Relic rarity weight
  w_rare: { value: 30, min: 0, max: 100, step: 1 },              // Relic rarity weight
  w_epic: { value: 11, min: 0, max: 100, step: 1 },              // Relic rarity weight
  w_legendary: { value: 4, min: 0, max: 100, step: 1 },          // Relic rarity weight (boss rewards skip common)
  sparks_flat: { value: 6, min: 0, max: 20, step: 1 },           // Sparks: points per rune cleared
  overcharge_add: { value: 0.5, min: 0, max: 2, step: 0.1 },     // Overcharge: extra chain step per link
  wildfire_drops: { value: 5, min: 1, max: 10, step: 1 },        // Wildfire: drops with a smaller group size
  supernova_mult: { value: 5, min: 1, max: 10, step: 0.5 },      // Supernova: multiplier on that chain

  // ---- Move timer ----
  move_time: { value: 10, min: 3, max: 30, step: 0.5 },          // seconds to place a piece in round 1
  move_time_step: { value: 0.4, min: 0, max: 2, step: 0.1 },     // seconds taken off the move time each round
  move_time_min: { value: 4, min: 2, max: 15, step: 0.5 },       // the move time never shrinks below this, seconds
  boss_time_mult: { value: 0.8, min: 0.3, max: 1, step: 0.05 },  // move time multiplier in a boss round
  timer_grace_drops: { value: 2, min: 0, max: 10, step: 1 },     // opening drops with no timer, so the first minute teaches
  warn_at: { value: 5, min: 1, max: 10, step: 1 },               // seconds left when the double tick starts and the bar pulses

  // ---- Creature events ----
  event_start_round: { value: 2, min: 1, max: 10, step: 1 },     // first round a creature can appear
  event_gap_min: { value: 8, min: 2, max: 30, step: 1 },         // fewest drops between creatures
  event_gap_max: { value: 12, min: 2, max: 40, step: 1 },        // most drops between creatures
  event_in_boss: { value: 0, min: 0, max: 1, step: 1 },          // 1: creatures also come in boss rounds
  event_fuse_leech: { value: 6, min: 2, max: 15, step: 0.5 },    // seconds of input time before the Leech Moth eats
  event_fuse_bomb: { value: 5, min: 2, max: 15, step: 0.5 },     // seconds before the Bomb Sprite explodes
  event_fuse_thief: { value: 5, min: 2, max: 15, step: 0.5 },    // seconds before the Hourglass Thief steals time
  event_fuse_joker: { value: 5, min: 2, max: 15, step: 0.5 },    // seconds the Joker waits for a pick before he leaves
  event_bonus: { value: 250, min: 0, max: 2000, step: 10 },      // base points for defending
  event_bonus_round: { value: 25, min: 0, max: 200, step: 5 },   // extra defend points per round
  event_streak_step: { value: 0.25, min: 0, max: 1, step: 0.05 },// reward multiplier added per defence in a row
  event_streak_cap: { value: 2.5, min: 1, max: 6, step: 0.25 },  // most the streak can multiply a reward
  leech_meter: { value: 4, min: 0, max: 20, step: 1 },           // Relic meter gained from defeating a Moth or Bomb
  thief_penalty_time: { value: 2, min: 0, max: 6, step: 0.5 },   // seconds off the move bar after a theft
  thief_penalty_moves: { value: 3, min: 1, max: 8, step: 1 },    // moves the theft lasts
  thief_bonus_time: { value: 2, min: 0, max: 6, step: 0.5 },     // seconds added to the move bar for beating a Thief
  thief_bonus_moves: { value: 2, min: 1, max: 8, step: 1 },      // moves that bonus lasts
  ward_swats: { value: 3, min: 1, max: 8, step: 1 },             // swats a Ward Relic gives
  swat_mult: { value: 0.5, min: 0.1, max: 1, step: 0.05 },       // a swat pays this fraction of a clean defence
  joker_meter_frac: { value: 0.4, min: 0, max: 1, step: 0.05 },  // boon: fraction of the Relic meter gained
  joker_points_mult: { value: 3, min: 1, max: 10, step: 0.5 },   // boon: points as a multiple of event_bonus
  joker_stones: { value: 3, min: 1, max: 8, step: 1 },           // curse: stones that fall
  joker_slow_moves: { value: 3, min: 1, max: 8, step: 1 },       // curse: moves with a shorter bar
  joker_meter_loss: { value: 0.35, min: 0, max: 1, step: 0.05 },// curse: fraction of the Relic meter lost
  joker_reveal: { value: 1.1, min: 0.3, max: 3, step: 0.1 },     // seconds the chosen fist stays open

  // ---- The tide: a stone falls on a clock, so a slow run gets harder ----
  tide_start: { value: 60, min: 10, max: 900, step: 5 },         // seconds of run time before the first stone falls (set high to turn off)

  // ---- Meta: coins, trinkets, Workshop, Mastery, Heat ----
  coin_chance: { value: 0.08, min: 0, max: 0.4, step: 0.01 },    // chance a rune in a new piece carries a coin
  coin_value: { value: 1, min: 1, max: 10, step: 1 },            // coins per coin rune detonated
  event_coins: { value: 3, min: 0, max: 20, step: 1 },           // coins for defending against a creature
  chest_coins: { value: 25, min: 0, max: 200, step: 5 },         // boss chest coins, times the boss number
  payout_per_score: { value: 0.003, min: 0, max: 0.05, step: 0.001 }, // coins banked per point of score at run end
  heat_coin_bonus: { value: 0.25, min: 0, max: 1, step: 0.05 },  // extra coins per Heat level
  trinket_max_level: { value: 4, min: 1, max: 8, step: 1 },      // highest trinket level
  trinket_upgrade_cost: { value: 150, min: 10, max: 1000, step: 10 }, // coins per level to upgrade a trinket (cost = this x current level)
  dup_refund: { value: 50, min: 0, max: 500, step: 10 },         // coins for a duplicate of a max-level trinket
  tide_move_cap: { value: 2, min: 1, max: 4, step: 1 },             // most stones a tide may drop in one move (the rest wait for the next moves, so a tide never reads as a blow)
  stage2_runs: { value: 3, min: 1, max: 30, step: 1 },              // Stage 2 (creatures): runs played ...
  stage2_tier: { value: 2, min: 1, max: 4, step: 1 },               // ... and the combo tier reached in one run (2 = HOT)
  stage3_runs: { value: 6, min: 1, max: 50, step: 1 },              // Stage 3 (Wardens): runs played ...
  stage3_defended: { value: 3, min: 1, max: 50, step: 1 },          // ... and creatures defended against
  stage4_runs: { value: 9, min: 1, max: 80, step: 1 },              // Stage 4 (surprises): runs played ...
  stage4_wardens: { value: 1, min: 1, max: 30, step: 1 },           // ... and Wardens broken
  perk_cost: { value: 150, min: 10, max: 1000, step: 10 },        // coins per level for a perk (cost = this x next level)
  perk_meter_per_level: { value: 1, min: 0, max: 3, step: 1 },   // Deep Meter: runes off the Relic meter per level
  perk_time_per_level: { value: 0.5, min: 0, max: 2, step: 0.1 },// Steady Hands: seconds on every move bar per level
  perk_coin_per_level: { value: 0.02, min: 0, max: 0.1, step: 0.01 }, // Coin Magnet: coin chance per level
  ember_base: { value: 1.25, min: 1, max: 3, step: 0.05 },       // Ember Charm: first-detonation multiplier at level 0
  ember_per_level: { value: 0.25, min: 0, max: 1, step: 0.05 },  // Ember Charm: added per level
  ember_chain_cost: { value: 0.25, min: 0, max: 1, step: 0.05 },// Ember Charm trade-off: chain step lost
  lucky_mult: { value: 2, min: 1, max: 5, step: 0.5 },           // Lucky Coin: coin chance multiplier at level 1
  lucky_meter_cost: { value: 0.85, min: 0.3, max: 1, step: 0.05 },// Lucky Coin trade-off: Relic meter fill rate
  quick_time: { value: 1.5, min: 0, max: 5, step: 0.5 },         // Quick Sand: seconds added to every move bar at level 1
  quick_per_level: { value: 0.5, min: 0, max: 2, step: 0.1 },    // Quick Sand: added per level
  quick_meter_mult: { value: 1.2, min: 1, max: 2, step: 0.05 },  // Quick Sand trade-off: Relic meter size
  moth_gap_cost: { value: 2, min: 0, max: 6, step: 1 },          // Moth Net trade-off: drops sooner between creatures
  stone_score_base: { value: 0.9, min: 0.5, max: 1, step: 0.01 },// Stonebreaker trade-off: score multiplier at level 0
  stone_score_per_level: { value: 0.03, min: 0, max: 0.1, step: 0.01 }, // Stonebreaker: score multiplier regained per level
  gambler_boon_per_level: { value: 0.25, min: 0, max: 1, step: 0.05 }, // Gambler: Joker points boost per level past 1
  tidecaller_delay: { value: 30, min: 0, max: 120, step: 5 },    // Tidecaller: seconds the tide is delayed at level 1
  tidecaller_boss_mult: { value: 1.2, min: 1, max: 2, step: 0.05 }, // Tidecaller trade-off: Warden health
  golden_mult: { value: 3, min: 1, max: 8, step: 1 },            // Golden Rune: coin value multiplier at level 1
  heat1_time_mult: { value: 0.85, min: 0.4, max: 1, step: 0.05 },// Heat 1: move bar multiplier
  heat2_gap_cut: { value: 3, min: 0, max: 8, step: 1 },          // Heat 2: drops sooner between creatures
  heat2_tide_cut: { value: 15, min: 0, max: 60, step: 5 },       // Heat 2: seconds earlier the tide starts
  heat3_boss_mult: { value: 1.3, min: 1, max: 2.5, step: 0.05 }, // Heat 3: Warden health

  // ---- The combo: sets cleared across moves ----
  combo_step: { value: 0.1, min: 0, max: 0.5, step: 0.01 },      // score multiplier gained per combo point
  combo_cap: { value: 4, min: 0, max: 10, step: 0.5 },           // most the combo can add to the multiplier
  combo_blocks_per_point: { value: 4, min: 1, max: 12, step: 1 },  // blocks cleared per combo point: a 4-block set adds 1 (+0.1 to the multiplier), a bigger set adds more
  combo_event_count: { value: 1, min: 0, max: 5, step: 1 },       // combo count added for defeating a creature (clearing it or swatting it)
  combo_event_points: { value: 1, min: 0, max: 5, step: 0.5 },    // combo multiplier points added for defeating a creature (each is +combo_step)
  combo_chain_bonus: { value: 0.5, min: 0, max: 3, step: 0.25 },  // combo points a chain link past the first adds (the chain and the combo share one counter; 0 keeps them apart)
  combo_grace: { value: 1, min: 0, max: 4, step: 1 },            // moves in a row that clear nothing before the combo breaks (0 = any miss breaks it)

  // ---- Pieces on offer ----
  queue_size: { value: 2, min: 2, max: 3, step: 1 },             // pieces to choose from each move
  deal_mode: { value: 0, min: 0, max: 4, step: 1 },                // how the hand is dealt: 0 = pieces are made at drop time (before the chain clears the board); 1 = dealt once the board has settled; 2 = also guaranteed a clearing placement while you hold a combo; 3 = always guaranteed (makes the game far too easy); 4 = mercy: guaranteed only when one more miss would break your combo
  deal_guard_combo: { value: 3, min: 1, max: 20, step: 1 },        // modes 2 and 4: the combo size from which the guarantee applies
  deal_tries: { value: 24, min: 1, max: 100, step: 1 },            // how many hands are tried to find one with a clearing placement
  queue_refresh_all: { value: 1, min: 0, max: 1, step: 1 },      // 1: every piece is replaced after each move; 0: only the one you used

  // ---- More Relics, rerolls, rarity ----
  gilded_coin: { value: 0.1, min: 0, max: 0.4, step: 0.01 },     // Gilded: coin chance per stack
  hourglass_time: { value: 1, min: 0, max: 3, step: 0.5 },       // Hourglass: seconds on every move bar per stack
  chrono_moves: { value: 3, min: 1, max: 8, step: 1 },           // Chrono: moves with a stopped move bar
  cull_mult: { value: 2, min: 1, max: 6, step: 0.5 },            // Cull: multiplier on the top-rows detonation
  jackpot_mult: { value: 3, min: 1.5, max: 8, step: 0.5 },       // Jackpot: score multiplier
  jackpot_drops: { value: 5, min: 1, max: 12, step: 1 },         // Jackpot: drops it lasts
  phoenix_rows: { value: 5, min: 2, max: 8, step: 1 },           // Phoenix: rows that burn away when the board would top out
  rerolls_start: { value: 2, min: 0, max: 6, step: 1 },          // Relic rerolls at the start of a run
  boss_rerolls: { value: 1, min: 0, max: 3, step: 1 },           // rerolls gained for breaking a Warden

  // ---- Slash and boss intro ----
  slash_time: { value: 0.45, min: 0.15, max: 1, step: 0.05 },    // seconds a kill slash lasts
  kill_cine: { value: 1, min: 0, max: 1, step: 1 },                // 1: the set that kills a Warden is held and built up to (zoom, slow motion, a rising sound ending on a beat); 0: it kills at once
  kill_build_min: { value: 1.6, min: 0.4, max: 4, step: 0.1 },    // the shortest build-up before the final blow, in seconds
  kill_build_max: { value: 2.6, min: 0.6, max: 5, step: 0.1 },    // the longest: the blow waits for a beat of the music, but never longer than this
  kill_zoom: { value: 1.45, min: 1, max: 2.2, step: 0.05 },       // how far the board zooms in on the killing set
  kill_slow_secs: { value: 0.5, min: 0, max: 2, step: 0.1 },      // real seconds of slow motion after the blow
  kill_slow_scale: { value: 0.25, min: 0.1, max: 1, step: 0.05 }, // how fast time runs during it (1 = normal)
  kill_hold: { value: 0.4, min: 0, max: 1.5, step: 0.1 },         // seconds the dead Warden is shown before the chest opens
  kill_sparks: { value: 70, min: 0, max: 200, step: 10 },         // extra sparks thrown by the killing blow
  boss_intro_time: { value: 2.6, min: 1, max: 6, step: 0.2 },    // seconds of the boss entrance before play starts

  // ---- Difficulty ramp (a skilled player must eventually be overwhelmed) ----
  ramp_mix_per_round: { value: 0.02, min: 0, max: 0.1, step: 0.005 }, // piece_mix gained each round (more mixed colours inside pieces)
  ramp_mix_max: { value: 0.7, min: 0, max: 1, step: 0.05 },      // piece_mix never goes past this
  ramp_fair_per_round: { value: 0.015, min: 0, max: 0.1, step: 0.005 }, // fair_bias lost each round (a less helpful deal)
  boss_wound_keep: { value: 0.5, min: 0, max: 1, step: 0.05 },     // a Warden that escapes keeps this share of the damage you did as a wound, and returns at the next Warden round with that much less health (0 = it simply leaves, as before)
  boss_dmg_cap: { value: 0, min: 0, max: 10, step: 0.25 },        // the most one drop can do to a Warden, as a multiple of your recent points per drop (0 = off: every point counts). A big chain still hits hard but cannot end the fight alone
  boss_hp_stone: { value: 1.0, min: 0.3, max: 4, step: 0.05 },     // health of each Warden, as a multiple of the base (so the Warden types can be balanced against each other)
  boss_hp_ember: { value: 1.1, min: 0.3, max: 4, step: 0.05 },
  boss_hp_tide: { value: 1.2, min: 0.3, max: 4, step: 0.05 },
  boss_hp_storm: { value: 1.4, min: 0.3, max: 4, step: 0.05 },
  boss_hp_moon: { value: 1.25, min: 0.3, max: 4, step: 0.05 },
  boss_hp_factor: { value: 0.25, min: 0.05, max: 3, step: 0.01 },  // Warden health as a multiple of your recent points per drop x the boss round's drops
  boss_fail_stones: { value: 2, min: 0, max: 8, step: 1 },       // stones that fall when a Warden is not broken

  // ---- Surprises: unexpected good and bad events, each with a rarity ----
  surprise_start_round: { value: 2, min: 1, max: 20, step: 1 },  // first round a surprise can happen
  surprise_gap_min: { value: 6, min: 2, max: 30, step: 1 },      // fewest drops between surprises
  surprise_gap_max: { value: 10, min: 2, max: 40, step: 1 },     // most drops between surprises
  surprise_good_bias: { value: 0.5, min: 0, max: 1, step: 0.05 },// chance a surprise is a good one
  gold_rush_mult: { value: 3, min: 1, max: 8, step: 0.5 },       // Gold Rush: coin rune chance multiplier
  frenzy_mult: { value: 2, min: 1, max: 6, step: 0.5 },          // Frenzy: score multiplier
  golden_hour_mult: { value: 3, min: 1, max: 8, step: 0.5 },     // Golden Hour: score multiplier
  meteor_mult: { value: 4, min: 1, max: 10, step: 0.5 },         // Meteor: multiplier on the detonation
  eclipse_stones: { value: 2, min: 0, max: 8, step: 1 },         // Eclipse: stones that also fall
  rot_keep: { value: 0.5, min: 0, max: 1, step: 0.05 },          // Rune Rot: fraction of the combo you keep

  // ---- Flow: a streak for fast play ----
  flow_window: { value: 3.4, min: 0.5, max: 5, step: 0.1 },        // seconds after you get control within which a drop counts as fast
  kill_fast_time: { value: 0.7, min: 0.2, max: 3, step: 0.1 },   // seconds after a creature appears within which a kill counts as fast
  flow_combo_count: { value: 2, min: 0, max: 8, step: 1 },       // the fast bonus: combo count a fast clearing move adds (FAST +N)
  kindle_count: { value: 1, min: 0, max: 5, step: 1 },              // Kindle: combo count added per set cleared (each copy)
  kindle_points: { value: 0.25, min: 0, max: 2, step: 0.05 },        // ...and the combo multiplier it adds per set (each copy)
  overdrive_bonus: { value: 2, min: 0, max: 6, step: 1 },            // Overdrive: extra combo count on every fast clear (each copy)
  longfuse_grace: { value: 1, min: 0, max: 3, step: 1 },             // Long Fuse: extra missed moves your combo survives (each copy)
  unbroken_moves: { value: 6, min: 1, max: 20, step: 1 },            // Unbroken: moves during which your combo cannot break
  combo_t1: { value: 5, min: 2, max: 50, step: 1 },              // combo size where WARM begins (music and sparks grow with the combo)
  combo_t2: { value: 12, min: 3, max: 80, step: 1 },             // ...HOT
  combo_t3: { value: 25, min: 4, max: 120, step: 1 },            // ...BLAZING
  combo_t4: { value: 45, min: 5, max: 200, step: 1 },            // ...FRENZY
  flow_combo_points: { value: 1, min: 0, max: 5, step: 0.5 },    // combo multiplier points a fast clearing move adds
  kill_fast_mult: { value: 2, min: 1, max: 6, step: 0.5 },       // reward multiplier for a fast creature kill

  // ---- Daily Run ----
  daily_bonus: { value: 30, min: 0, max: 300, step: 5 },         // coins for your first Daily Run of a day
  daily_streak_bonus: { value: 10, min: 0, max: 100, step: 5 },  // extra coins per day of streak on that first run
  daily_streak_cap: { value: 7, min: 1, max: 30, step: 1 },      // streak days that count toward the bonus

  // ---- More trinkets ----
  stopwatch_window: { value: 0.4, min: 0, max: 2, step: 0.1 },   // Stopwatch: seconds added to the fast window at level 1
  clover_bias: { value: 0.15, min: 0, max: 0.5, step: 0.05 },    // Clover: added chance a surprise is good, at level 1
  clover_gap_cost: { value: 2, min: 0, max: 6, step: 1 },        // Clover trade-off: drops sooner between surprises
  whetstone_window: { value: 0.5, min: 0, max: 2, step: 0.1 },   // Whetstone: seconds added to the fast-kill window at level 1
  whetstone_fuse_cost: { value: 1, min: 0, max: 3, step: 0.5 },  // Whetstone trade-off: seconds off creature fuses
  pact_mult: { value: 1.2, min: 1, max: 2, step: 0.05 },         // Blood Pact: score multiplier at level 1
  pact_per_level: { value: 0.05, min: 0, max: 0.3, step: 0.01 }, // Blood Pact: added per level
  feather_time_cost: { value: 1, min: 0, max: 4, step: 0.5 },    // Ash Feather trade-off: seconds off every move bar

  // ---- Element powers: each rune colour charges its own tappable power ----
  power_cap: { value: 18, min: 4, max: 60, step: 1 },            // runes of a colour to blast to charge its power the first time
  power_growth: { value: 4, min: 0, max: 15, step: 1 },          // extra runes needed after each use of that power
  power_per_rune: { value: 1, min: 0.25, max: 4, step: 0.25 },   // charge per rune of its colour blasted
  power_mult: { value: 2, min: 1, max: 6, step: 0.5 },           // chain multiplier of Burn and Wash
  storm_mult: { value: 3, min: 1, max: 8, step: 0.5 },           // chain multiplier of Storm
  still_moves: { value: 3, min: 1, max: 8, step: 1 },            // Still: moves with a stopped bar that all count as fast

  // ---- Gems, the Vault, sockets, revive and (fake) ads ----
  chest_trinket_chance: { value: 0.6, min: 0, max: 1, step: 0.05 }, // chance a Warden chest holds a trinket (common or rare only)
  gem_score_per: { value: 20000, min: 1000, max: 50000, step: 500 }, // points per gem at the end of a run
  gem_per_boss: { value: 1, min: 0, max: 10, step: 1 },          // gems per Warden broken in a run
  gem_cap: { value: 8, min: 1, max: 40, step: 1 },               // most gems one run can give
  daily_gems: { value: 1, min: 0, max: 10, step: 1 },            // gems for the first Daily Run of a day
  vault_epic_gems: { value: 6, min: 1, max: 60, step: 1 },       // gem price of an epic trinket in the Vault
  vault_legend_gems: { value: 12, min: 1, max: 100, step: 1 },   // gem price of a legendary trinket in the Vault
  vault_revive_gems: { value: 8, min: 1, max: 100, step: 1 },    // gem price of Second Wind
  socket2_coins: { value: 400, min: 0, max: 20000, step: 50 },   // coin price of the 2nd trinket socket
  socket3_coins: { value: 1500, min: 0, max: 50000, step: 100 }, // coin price of the 3rd socket
  socket4_gems: { value: 10, min: 0, max: 100, step: 1 },        // gem price of the 4th socket
  socket5_gems: { value: 20, min: 0, max: 200, step: 1 },        // gem price of the 5th socket
  second_wind_hp: { value: 1.1, min: 1, max: 2, step: 0.05 },    // Second Wind trade-off: Warden health
  revive_first_ad: { value: 1, min: 0, max: 1, step: 1 },           // 1: the first revive of a run can only be an ad (or a free Second Wind); gems pay for the later ones. 0: gems may pay for the first one too
  revive_timer: { value: 12, min: 0, max: 60, step: 1 },             // seconds you have to decide on the revive offer before the run simply ends, as if you gave up (0 = no limit)
  revive_clear: { value: 1, min: 0, max: 1, step: 1 },              // 1: a revive shatters every block, in a wave from the middle; 0: only the top revive_rows rows burn away
  revive_rows: { value: 6, min: 2, max: 9, step: 1 },            // rows that burn away on a revive
  revive_gems: { value: 3, min: 1, max: 30, step: 1 },           // gems for a revive (x2 for the second one)
  ad_revives: { value: 1, min: 0, max: 3, step: 1 },             // revives per run by watching an ad
  gem_revives: { value: 1, min: 0, max: 5, step: 1 },            // revives per run by paying gems
  ad_seconds: { value: 5, min: 1, max: 30, step: 1 },            // length of the fake ad
  ad_banner: { value: 1, min: 0, max: 1, step: 1 },              // 1: show the reserved ad banner space on the end screen
  ad_double_gems: { value: 0, min: 0, max: 1, step: 1 },         // 1: the x2 ad reward also doubles gems

  // ---- The (fake) Shop: prices in dollars, packs in gems ----
  shop_full_unlock_dollars: { value: 8, min: 1, max: 50, step: 1 }, // what ALL gem content (Vault, sockets) costs in dollars at the base rate: sets gems per dollar
  shop_bonus2: { value: 0.25, min: 0, max: 2, step: 0.05 },      // extra gems per dollar in the medium pack
  shop_bonus3: { value: 0.6, min: 0, max: 3, step: 0.05 },       // extra gems per dollar in the large pack
  shop_first_bonus: { value: 1, min: 0, max: 3, step: 0.25 },    // the first buy of each pack gives this much extra (1 = double)
  shop_bundle_discount: { value: 0.35, min: 0, max: 0.8, step: 0.05 }, // Starter Bundle (Remove Ads + medium pack) discount
  gift_gems: { value: 2, min: 0, max: 50, step: 1 },             // gems in the Shop's free daily gift (no ad)
  free_gems_per_ad: { value: 1, min: 0, max: 10, step: 1 },      // gems for watching an ad in the shop
  free_gems_per_day: { value: 3, min: 0, max: 20, step: 1 },     // ad-gems you can claim each day
  shop_remove_ads_price: { value: 2.99, min: 0.99, max: 20, step: 0.5 }, // price of Remove Ads
  shop_pack1_price: { value: 0.99, min: 0.99, max: 20, step: 0.5 }, // price of the small pack
  shop_pack2_price: { value: 2.99, min: 0.99, max: 50, step: 0.5 }, // price of the medium pack
  shop_pack3_price: { value: 7.99, min: 0.99, max: 100, step: 0.5 }, // price of the large pack

  // ---- Stone pressure follows your score: calm far below your best, hard near and beyond it ----
  pressure_floor: { value: 4000, min: 500, max: 50000, step: 500 }, // score used as "your best" until you have a higher real best
  pressure_from: { value: 0.7, min: 0.2, max: 1, step: 0.05 },   // share of your best where the tide starts to quicken
  tide_gap_calm: { value: 28, min: 8, max: 120, step: 1 },       // seconds between tide stones when your score is low
  tide_gap_hot: { value: 14, min: 5, max: 60, step: 1 },         // ...when you reach your best score
  tide_gap_over: { value: 9, min: 4, max: 40, step: 1 },        // ...when you are at twice your best
  tide_gap_floor: { value: 6.5, min: 3, max: 30, step: 0.5 },    // ...and at three times your best (the fastest it gets); beyond your best it keeps getting a little harder
  tide_stones_max_at: { value: 2.6, min: 1, max: 6, step: 0.1 }, // share of your best where each tide drops 4 stones
  time_p_start: { value: 210, min: 60, max: 1200, step: 30 },    // seconds into a run when the clock itself starts adding pressure (keeps runs from dragging on)
  time_p_span: { value: 150, min: 60, max: 900, step: 30 },      // seconds for that time pressure to climb by 1.0 (1.0 = the pressure of reaching your best)
  revive_breath: { value: 0.8, min: 0, max: 1, step: 0.05 },     // how much pressure a revive removes at first
  revive_breath_s: { value: 45, min: 5, max: 180, step: 5 },     // seconds for the pressure to return after a revive
  pace_target_min: { value: 7, min: 3, max: 15, step: 0.5 },     // minutes a typical run should take to reach your best score
  pace_curve: { value: 1.3, min: 1, max: 2, step: 0.1 },         // runs score slowly at first: the pace line bends (1 = a straight line)
  help_ok: { value: 0.65, min: 0.3, max: 1, step: 0.05 },          // adaptive help: if the median of your last runs reaches this share of your best, you get no help
  help_full: { value: 0.35, min: 0.05, max: 0.9, step: 0.05 },     // ...and if it is at or below this share, you get the full help (in between: in proportion)
  help_runs: { value: 5, min: 2, max: 10, step: 1 },               // how many recent runs are looked at
  help_min_runs: { value: 3, min: 1, max: 10, step: 1 },           // fewer recent runs than this: no help yet
  help_min_best: { value: 3000, min: 0, max: 50000, step: 500 },   // a best smaller than this needs no help
  help_time_s: { value: 120, min: 0, max: 600, step: 10 },         // full help: the tide's time heat starts this many seconds later (the cap moves back, for you only)
  help_assist: { value: 0.5, min: 0, max: 2, step: 0.05 },         // full help: the pace assist's top multiplier grows by this much (and it works for any best, not only big ones)
  assist_cap: { value: 1.5, min: 1, max: 3, step: 0.05 },        // the most the quiet pace assist multiplies points when you are far behind (1 = off)
  assist_min_best: { value: 6000, min: 0, max: 100000, step: 500 }, // the pace assist only helps once your best is at least this big
  tide_stones_hot_at: { value: 0.85, min: 0.3, max: 3, step: 0.05 }, // share of your best where each tide drops 2 stones
  tide_stones_over_at: { value: 1.6, min: 0.5, max: 4, step: 0.1 },  // share of your best where each tide drops 3 stones
  tide_time_floor: { value: 0.9, min: 0.5, max: 1, step: 0.05 }, // slow play slowly shortens the gap, down to this fraction
  tough_p: { value: 0.9, min: 0.1, max: 3, step: 0.05 },         // share of your best where new stones take two hits
  boss_stone_calm: { value: 4, min: 1, max: 10, step: 1 },       // a Warden throws a stone every N drops while you are calm
  boss_fail_calm: { value: 1, min: 0, max: 8, step: 1 },         // stones for a missed Warden while you are calm

  // ---- Surprises last a while: how long, and what they do each second ----
  surprise_dur_common: { value: 14, min: 4, max: 40, step: 1 },  // seconds a common surprise lasts
  surprise_dur_rare: { value: 12, min: 4, max: 40, step: 1 },    // seconds a rare surprise lasts
  surprise_dur_epic: { value: 12, min: 4, max: 40, step: 1 },    // seconds an epic surprise lasts
  surprise_dur_legend: { value: 10, min: 4, max: 40, step: 1 },  // seconds a legendary surprise lasts
  coin_rain_per_s: { value: 3, min: 0, max: 20, step: 1 },       // Coin Rain: coins a second
  short_fuse_cut: { value: 3, min: 0, max: 8, step: 0.5 },       // Short Fuse: seconds off every move bar
  drizzle_every: { value: 3.5, min: 1, max: 10, step: 0.5 },     // Stone Drizzle: seconds between stones
  rain_every: { value: 4, min: 1, max: 10, step: 0.5 },          // Heavy Rain: seconds between stones
  storm_every: { value: 2, min: 0.5, max: 8, step: 0.5 },        // Stone Storm: seconds between stones

  // ---- Missions: what each unlock asks for (the number the mission counts to) ----
  ms_relic_a: { value: 2, min: 1, max: 50, step: 1 },            // Rare Relics: runs played
  ms_bomb: { value: 6, min: 1, max: 100, step: 1 },              // Bomb Sprite: creatures defended against
  ms_t_rare: { value: 2, min: 1, max: 100, step: 1 },            // Rare trinkets: Wardens broken
  ms_relic_b: { value: 15000, min: 1000, max: 200000, step: 1000 }, // Epic Relics: score in one run
  ms_heat1: { value: 3, min: 1, max: 4, step: 1 },               // Heat 1: Flow tier reached in one run (3 = BLAZING)
  ms_joker: { value: 8, min: 1, max: 100, step: 1 },             // Relic Joker: runs played
  ms_t_epic: { value: 6, min: 1, max: 200, step: 1 },            // Epic trinkets: Wardens broken
  ms_heat2: { value: 6, min: 2, max: 20, step: 1 },              // Heat 2: links in one chain
  ms_relic_c: { value: 420, min: 60, max: 1200, step: 30 },      // Legendary Relics: seconds survived in one run
  ms_t_legend: { value: 15, min: 1, max: 300, step: 1 },         // Legendary trinkets: Wardens broken
  ms_heat3: { value: 40000, min: 5000, max: 400000, step: 5000 }, // Heat 3: score in one run
  // ---- Daily and weekly missions: rewards ----
  daily_coins_easy: { value: 80, min: 0, max: 2000, step: 10 },  // coins for the easy daily mission
  daily_coins_med: { value: 140, min: 0, max: 2000, step: 10 },  // ...the medium one
  daily_coins_hard: { value: 240, min: 0, max: 2000, step: 10 }, // ...the hard one
  daily_all_gems: { value: 3, min: 0, max: 50, step: 1 },        // gems for finishing all three daily missions
  daily_all_dust: { value: 2, min: 0, max: 50, step: 1 },        // green dust for finishing all three
  week_d3_coins: { value: 400, min: 0, max: 5000, step: 50 },    // weekly track: all dailies done on 3 days
  week_d3_gems: { value: 3, min: 0, max: 100, step: 1 },
  week_d5_coins: { value: 800, min: 0, max: 5000, step: 50 },    // ...on 5 days
  week_d5_gems: { value: 6, min: 0, max: 100, step: 1 },
  week_d5_dust: { value: 3, min: 0, max: 50, step: 1 },          // blue dust
  week_d7_coins: { value: 1500, min: 0, max: 10000, step: 50 },  // ...on all 7 days
  week_d7_gems: { value: 12, min: 0, max: 200, step: 1 },
  week_d7_dust: { value: 3, min: 0, max: 50, step: 1 },          // purple dust
  week_wardens: { value: 10, min: 1, max: 100, step: 1 },        // weekly mission: Wardens broken in the week
  week_wardens_coins: { value: 500, min: 0, max: 5000, step: 50 },
  week_wardens_gems: { value: 4, min: 0, max: 100, step: 1 },
  week_runs: { value: 15, min: 1, max: 100, step: 1 },           // weekly mission: runs played in the week
  week_runs_coins: { value: 400, min: 0, max: 5000, step: 50 },
  week_runs_gems: { value: 3, min: 0, max: 100, step: 1 },
  // ---- Supplies: consumables bought with coins and brought on a run ----
  sup_spark_price: { value: 120, min: 0, max: 5000, step: 10 },  // Power Spark: one element power starts fully charged
  sup_calm_price: { value: 150, min: 0, max: 5000, step: 10 },   // Calm Tonic: the tide starts later
  sup_sand_price: { value: 100, min: 0, max: 5000, step: 10 },   // Time Sand: more time on your first moves
  sup_scroll_price: { value: 180, min: 0, max: 5000, step: 10 }, // Fortune Scroll: the first Relic offer is Rare or better
  sup_primer_price: { value: 120, min: 0, max: 5000, step: 10 }, // Combo Primer: start with a combo
  sup_ash_price: { value: 400, min: 0, max: 5000, step: 10 },    // Phoenix Ash: one free revive
  sup_calm_secs: { value: 60, min: 5, max: 300, step: 5 },       // seconds Calm Tonic delays the tide
  sup_sand_secs: { value: 2.5, min: 0.5, max: 8, step: 0.5 },    // seconds Time Sand adds to the move bar...
  sup_sand_moves: { value: 15, min: 3, max: 60, step: 1 },       // ...for this many moves
  sup_primer_combo: { value: 6, min: 1, max: 30, step: 1 },      // the combo Combo Primer starts you with
  sup_cap: { value: 5, min: 1, max: 20, step: 1 },               // most of each supply you can hold
  pack_slots: { value: 2, min: 1, max: 5, step: 1 },             // supplies you can bring on one run
  // ---- Bosses: types, rarity (chained) and their attacks ----
  boss_up: { value: 0.28, min: 0, max: 1, step: 0.01 },          // chance each step that a Warden is one rarity better (chained; Heat adds more)
  boss_up_heat: { value: 0.05, min: 0, max: 0.3, step: 0.01 },   // extra chance per Heat level
  boss_hp_t1: { value: 1.5, min: 1, max: 4, step: 0.05 },        // health of a Rare Warden (times the normal)
  boss_hp_t2: { value: 2.0, min: 1, max: 4, step: 0.05 },        // Epic
  boss_hp_t3: { value: 2.55, min: 1, max: 5, step: 0.05 },        // Legendary
  boss_every_t1: { value: 0.85, min: 0.3, max: 1, step: 0.05 },  // a Rare Warden strikes this much sooner (times the drops between strikes)
  boss_every_t2: { value: 0.75, min: 0.3, max: 1, step: 0.05 },
  boss_every_t3: { value: 0.65, min: 0.3, max: 1, step: 0.05 },
  boss_ember_every: { value: 5, min: 2, max: 12, step: 1 },      // Ember Tyrant: drops between scorches
  boss_tide_every: { value: 6, min: 2, max: 12, step: 1 },       // Tide Leviathan: drops between surges
  boss_storm_every: { value: 4, min: 2, max: 12, step: 1 },      // Storm Warden: drops between static bursts
  boss_moon_every: { value: 5, min: 2, max: 12, step: 1 },       // Hollow Moon: drops between devourings
  boss_scorch_runes: { value: 3, min: 1, max: 10, step: 1 },     // Ember Tyrant: runes turned to stone each strike (+1 per rarity step)
  boss_surge_stones: { value: 3, min: 1, max: 8, step: 1 },      // Tide Leviathan: stones each strike
  boss_static_runes: { value: 6, min: 1, max: 20, step: 1 },     // Storm Warden: runes recoloured each strike
  boss_static_secs: { value: 5, min: 1, max: 15, step: 1 },      // ...and how long your pieces' colours are hidden
  boss_devour_runes: { value: 4, min: 1, max: 12, step: 1 },     // Hollow Moon: runes eaten each strike
  shard_rare: { value: 0.4, min: 0, max: 1, step: 0.05 },        // chance a Rare Warden's chest holds a Forge shard (Epic: one, Legendary: two)
  ms_boss_ember: { value: 4, min: 1, max: 100, step: 1 },        // Ember Tyrant appears once you have broken this many Wardens
  ms_boss_tide: { value: 8, min: 1, max: 100, step: 1 },         // Tide Leviathan
  ms_boss_storm: { value: 12, min: 1, max: 100, step: 1 },       // Storm Warden
  ms_boss_moon: { value: 18, min: 1, max: 100, step: 1 },        // Hollow Moon
  ms_forge: { value: 1, min: 1, max: 3, step: 1 },               // the Forge opens when you break a Warden of this rarity or better (1 = Rare)
  forge_max_stars: { value: 2, min: 1, max: 3, step: 1 },        // stars a trinket can be enhanced to (each adds one level of power)
  forge1_shards: { value: 2, min: 0, max: 30, step: 1 },         // first star: Forge shards...
  forge1_dust: { value: 6, min: 0, max: 60, step: 1 },           // ...dust of the trinket's tier...
  forge1_coins: { value: 2000, min: 0, max: 50000, step: 100 },  // ...and coins
  forge2_shards: { value: 4, min: 0, max: 30, step: 1 },
  forge2_dust: { value: 10, min: 0, max: 60, step: 1 },
  forge2_coins: { value: 6000, min: 0, max: 50000, step: 100 },
  // ---- Warden chests and dust (green, blue, purple, yellow) ----
  chest_rare_at: { value: 3, min: 1, max: 20, step: 1 },         // from this Warden on, chests start at the blue tier
  chest_epic_at: { value: 6, min: 1, max: 30, step: 1 },         // ...and at the purple tier from this one
  chest_up: { value: 0.22, min: 0, max: 1, step: 0.01 },         // chance each step that a chest is one tier better (chained; Heat adds more)
  chest_up_heat: { value: 0.05, min: 0, max: 0.3, step: 0.01 },  // extra chance per Heat level
  chest_dust: { value: 3, min: 0, max: 30, step: 1 },            // dust of the chest's own tier
  chest_dust_low: { value: 2, min: 0, max: 30, step: 1 },        // dust of the tier below (blue chests and up)
  chest_dust_lucky: { value: 0.25, min: 0, max: 1, step: 0.05 }, // chance of one dust of the tier above
  dust_up1: { value: 3, min: 0, max: 100, step: 1 },             // dust to take a trinket from level 1 to 2 (its own tier)
  dust_up2: { value: 6, min: 0, max: 100, step: 1 },             // ...2 to 3
  dust_up3: { value: 10, min: 0, max: 100, step: 1 },            // ...3 to 4
  dust_scale_epic: { value: 0.7, min: 0.1, max: 2, step: 0.05 }, // epic trinkets need this share of the dust (purple is rarer than green)
  dust_scale_legend: { value: 0.4, min: 0.1, max: 2, step: 0.05 }, // legendary trinkets need this share (yellow is the rarest)
  dust_merge: { value: 5, min: 2, max: 20, step: 1 },            // dust of one tier that makes one of the next tier
    // ---- Feel ----
  fall_speed: { value: 26, min: 8, max: 60, step: 1 },           // rows per second a rune falls
  flash_time: { value: 0.30, min: 0.05, max: 0.8, step: 0.05 },  // seconds a group holds before it bursts (the hit-stop)
  shake_base: { value: 4, min: 0, max: 20, step: 1 },            // pixels of shake on a first detonation
  shake_per_chain: { value: 3, min: 0, max: 10, step: 1 },       // extra shake pixels per chain link
  shake_max: { value: 24, min: 0, max: 40, step: 1 },            // shake cap, pixels
  particles_per_cell: { value: 7, min: 0, max: 20, step: 1 },    // sparks per detonated rune
  repeat_delay: { value: 0.25, min: 0.05, max: 0.6, step: 0.05 },// seconds a held key waits before repeating
  repeat_rate: { value: 0.08, min: 0.03, max: 0.3, step: 0.01 }, // seconds between repeats of a held key
};
