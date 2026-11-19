# Haritha & Alen: setting up the invite

## 1. Put the invite online (GitHub Pages)

1. Create a new **public** repository on GitHub, for example `haritha-alen`.
2. Upload **`index.html`**. That one file holds all three invitations. (`guest-list-sheet.gs` and this guide can go in too; they don't affect the invite.)
3. Go to **Settings › Pages**, choose the `main` branch, and save.
4. After a minute the invite is live at `https://YOUR-USERNAME.github.io/haritha-alen/`.

Opening that link shows a first screen with three choices: **Haritha's family** (bride's side), **Alen's family** (groom's side), or **Both families together** (which then asks Team Haritha or Team Alen).

To send a link that skips the first screen, add one of these to the end:
   - `?invite=bride` opens Haritha's family's invitation
   - `?invite=groom` opens Alen's family's invitation
   - `?invite=together` opens the joint invitation and asks Team Haritha or Team Alen
   - `?team=haritha` or `?team=alen` opens the joint invitation with the team already picked

Guests can always switch from the hearts menu at the top (**Open a different invitation**).

## 2. Where RSVPs go

Every RSVP, from both families and all versions, opens WhatsApp addressed to **90393 11154** with the guest's answers already typed. The guest just taps send.

Performance sign-ups (dance, song, fun game) go to the family on each side: **98932 77910** for the bride's side and **75102 48598** for the groom's side.

## 3. Turn on the Google Sheet guest list (about 5 minutes, one time)

With this switched on, every RSVP and performance sign-up is **also saved automatically** into a Google Sheet, even if the guest forgets to press send in WhatsApp.

1. Open **sheets.google.com** with the Google account you want the list in, and create a **blank spreadsheet**. Name it "Haritha & Alen guest list".
2. Click **Extensions › Apps Script**.
3. Delete anything in the editor, paste the whole of `guest-list-sheet.gs`, and click the **save** icon.
4. Click **Deploy › New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, then **Authorize access**, pick your account and allow it. (Google may say the app isn't verified because you wrote it yourself. Click **Advanced › Go to project** to continue.)
6. Copy the **Web app URL** (it ends in `/exec`).
7. On GitHub, open **`index.html`**, click the pencil icon, and search (Ctrl+F) for `sheetUrl`. Paste the link between the quotes:

   ```
   sheetUrl: "https://script.google.com/macros/s/AKfy.../exec"
   ```

   Commit the change. That switches the sheet on for all three invitations.
8. To test, open your invite, send a test RSVP, and check the sheet. Delete the test row afterwards.

### Getting the sheet to 90393 11154

Google Sheets is shared by link or email, not by phone number. In the sheet, click **Share › General access › Anyone with the link › Viewer** (or Editor), click **Copy link**, and send that link on WhatsApp to 90393 11154. Whoever has that number can then open the live guest list any time.

### What you get in the sheet

- **Summary**: live counts for the engagement and the wedding: how many said yes, the total number of people coming, can't make it, not sure yet, and the number of performance entries.
- **RSVPs**: one row per guest with their side (Team Haritha or Team Alen), both answers, number of people, phone and note. If the same guest answers again, their row is updated instead of counted twice.
- **Performances**: everyone who signed up to dance, sing or run a fun game, and for which celebration.

## 4. Other things you can change (top of the script in index.html)

- `engagementStart` / `engagementTimeLabel`: engagement date and time (now 20 January 2027, 11.30 am)
- `rsvpWhatsApp`: the number RSVPs go to (now `9039311154`)
- `performTo`: the number performance entries go to on each side
- `payPhones`: PhonePe numbers shown in the gift box
- `churchMap`, `receptionMap`, `engagementMap`: exact Google Maps links
- `music`: a song file placed next to `index.html`
