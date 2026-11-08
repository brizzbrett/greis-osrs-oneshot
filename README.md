# Greis OSRS One-Shot: character sheet

A character sheet for Grei's homebrew tabletop one-shot, set in a world inspired by Old School RuneScape.

**Play it:** https://brizzbrett.github.io/greis-osrs-oneshot/

## Using it

1. Open the link, type your character's name and pick a class: Warrior, Ranger, Wizard or Priest.
2. You start with that class's stats, armour, weapon, pack and coins.
3. During play, use **End turn** to tick special energy back up, drain active prayers and count down boosts.

The sheet covers:

- HP, prayer points, special energy and exhaustion, plus death saves when you're down
- AC from your worn armour, and to-hit and damage bonuses
- Weapon attacks and specials, the spellbook with rune costs, and prayers
- Potions, food, shops, life skills, saves and checks, and a dice roller
- A searchable rulebook with the text of all of Grei's rule PDFs, plus an FAQ for questions the PDFs don't answer
- God themes: each class follows its god (Warrior Bandos, Ranger Armadyl, Wizard Zaros, Priest Saradomin), with the god's colours and symbol on the page. Pick another god (Zamorak, Guthix, Seren and the rest) from the Theme menu, plus light or dark

## Playing together

1. The DM opens the site and clicks **Start a session as DM**. That opens the DM screen with a room code like `GREI-4821`, and **Copy invite link** copies a link that joins straight in.
2. Players open the invite link, or click **Play together** and type the code.
3. Everyone's sheet then syncs live:
   - **Party:** each player's HP, prayer, special energy, AC and status
   - **Table feed:** every roll and action, with names
   - **Turn order:** built from initiative rolls. End turn passes to the next player and the round counter goes up.
   - **Enemies:** players see names and whether an enemy is bloodied or down. Only the DM sees HP and AC. Picking a bloodied enemy as your target turns on Blood for Bandos.
   - **Priest prayers on allies:** they apply to the ally's own AC and damage.
   - **DM dice:** public or secret rolls.
   - **Removing a player:** the DM clicks **Remove from session** on a player (twice, to confirm). They leave the party and turn order, and the database stops them rejoining, posting or reading the session until the DM clicks **Let back in**. Sign-in is anonymous, so someone who clears their browser data comes back as a new player.
   - **New room code:** the DM can move the session to a fresh code at any time (two clicks). Turn order, enemies, the feed and the removed list come along, everyone still in the session is moved automatically (players who were offline follow the next time they open the site), and the old code stops working. Remove anyone unwanted first, then change the code, and they can't find the new one.
   - **Bestiary:** the DM's prepared enemies, saved on the DM's own computer. Import a list (CSV, pasted spreadsheet rows or JSON, one enemy per line: name, HP, AC, then optional initiative bonus, attack bonus, damage and notes), or add them one at a time. Nothing joins the fight until the DM clicks **Add to fight**, which can add several at once (Goblin 1, Goblin 2…). Enemies with an attack get an **Attack** button that rolls to hit and damage. **Download as CSV** keeps a copy or moves the list to another computer.
   - **Grei's monsters:** **Load Grei's monsters** adds the 21 monsters from Grei's monster stat sheets, with separate melee, ranged and magic AC, their attacks (rolled with Grei's stats), spells up to their Magic level, and a picture of each original stat block. The file (`monsters.json`) is DM-only and isn't published with the site, so the DM picks their own copy when asked.
   - **Editing:** **Edit** on a bestiary entry or an enemy in the fight changes its name, HP, AC, initiative, Magic level, multiattack and every attack (dice, modifiers, to-hit, extra damage, notes). **Download everything** saves the whole bestiary with all of that; the CSV keeps one attack per enemy.

**Stuck on "Couldn't reach the session server"?** Ad and tracker blockers often block the sign-in and database the sessions need, including the ones built into Opera GX and Brave. Click the shield icon in the address bar and turn blocking off for this site, then reload.

Sessions run on Firebase Realtime Database with anonymous sign-in, so nobody needs an account. The Firebase config in `net.js` is meant to be public. The database's security rules decide who can read and change what; the current rules are in `database.rules.json` (paste them into the Firebase console under Realtime Database, then Rules).

**Owlbear Rodeo:** add `https://brizzbrett.github.io/greis-osrs-oneshot/manifest.json` as a custom extension and the sheet opens in a panel next to the map.

## Saving

Your sheet saves in your browser automatically. A different browser, another device or clearing site data starts you fresh.
To keep your character safe or move it, use **Download backup** (under Notes), then **Load backup** on the other device.

## Credits

Game and rules by Grei. Sheet built for the playtest.

God symbols from the [Old School RuneScape Wiki](https://oldschool.runescape.wiki/), © Jagex.

Fan-made and not affiliated with Jagex or RuneScape.
