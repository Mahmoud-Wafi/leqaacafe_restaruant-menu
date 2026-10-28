# Leqaa (لقاء) – QR menu, table orders, captain screen

Free to host: **Cloudflare Pages** (the website) + **Supabase** (database, logins, photos). No server, no build step.

What you get:

| Page | Address | Who |
|---|---|---|
| Menu with two tabs (المطعم / الكافيه) and an order button | `/` (`/?table=7` from the QR code) | customers |
| Manager dashboard: edit menu, prices, availability, photos, settings, table QR codes | `/admin/` | manager |
| Captain screen: all orders with table number and notes, phone notification | `/captain/` | 2 captains |

Orders disappear **30 minutes** after they are sent.

---

## Step 1 – Supabase (database)

1. Create a free project at https://supabase.com (region close to Egypt, e.g. Frankfurt).
2. **Authentication > Users > Add user > Create new user**. Create **3 users** with a password and tick **Auto Confirm User**:
   - the manager
   - captain 1
   - captain 2
3. **SQL Editor > New query**. Paste `supabase/setup.sql`, change the manager email at the top, press **Run**.
4. New query again. Paste `supabase/orders.sql`, change the two captain emails at the top (they must be the same emails you created in step 2), press **Run**.
5. Find your keys in **Project Settings > API Keys**:
   - Project URL is `https://<project-id>.supabase.co` (the project id is in the address bar of the dashboard).
   - Use the **Publishable** key. Never use the secret key in the website.
6. Open `public/config.js` and fill `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

## Step 2 – Phone notifications for captains

Skip this and the captain screen still works (it refreshes every 4 seconds with a sound, while it is open). Do it for notifications when the phone is locked.

1. Double-click `tools/make-push-keys.html` and press **Create keys**. Put the **public key** in `public/config.js` as `VAPID_PUBLIC_KEY`. Keep the **private key** for the next step.
2. Supabase **Edge Functions > Deploy a new function > Via editor**. Name it exactly `notify-captains` and paste `supabase/functions/notify-captains/index.ts`. **Turn "Verify JWT" OFF**, then Deploy.
3. **Edge Functions > Secrets**, add:
   - `VAPID_PUBLIC_KEY` (public key)
   - `VAPID_PRIVATE_KEY` (private key)
   - `VAPID_SUBJECT` = `mailto:you@example.com`
   - `WEBHOOK_SECRET` = any long random text
4. SQL Editor: paste `supabase/push.sql`. Replace `PROJECT-REF` with your project id and `PUT-A-LONG-RANDOM-SECRET-HERE` with the same text as `WEBHOOK_SECRET`. Run.

## Step 3 - Publish the website (Cloudflare Pages, free)

1. Sign up at https://dash.cloudflare.com (free).
2. **Workers & Pages > Create > Pages > Upload assets** (if you only see Workers, look for "Looking to deploy Pages? Get started" at the bottom).
3. Project name: for example `leqaa` (your address will be `https://leqaa.pages.dev`). Press **Create project**.
4. Drag the **contents of the `public` folder** (config.js, index.html, admin, captain ... must sit at the top level, not inside another folder) and press **Deploy**.
5. To update later: open the project > **Create deployment** and upload `public` again.
6. Open `/admin/`, log in as manager. If an older menu was published before, use **Backup > Restore** with `public/seed-menu.json`. Check prices.
7. In the dashboard open the **QR codes** tab (needs internet), enter the final address and print the table QR codes. Print only after the address is final (a custom domain can be added later in Cloudflare, but then QR codes must be reprinted).

## Step 4 – Captains install the screen

On each captain phone open `https://YOUR-SITE/captain/` and log in, then:

- **Android (Chrome):** menu ⋮ > *Install app* / *Add to Home screen*.
- **iPhone (Safari):** Share > *Add to Home Screen*. Needs iOS 16.4 or newer. Open it from the new icon, not from Safari.

Then press **تفعيل الإشعارات** and allow notifications. Do this once on every phone.

## Managing the menu from a phone

Open `/admin/` on the phone and sign in as manager.

- **Menu tab:** pick المطعم or الكافيه, tap a category, then edit prices right inside each row. The green switch marks an item as sold out. Tap the item name for names, sizes, photo and category. The red button adds an item. "ترتيب الأصناف" reorders.
- **Search:** type in the search box to find any item across all categories.
- **Publish:** a bar appears at the bottom after any change. Nothing reaches customers until you press **نشر التغييرات**.
- **Site is missing items?** Account tab > **إضافة الناقص**, then publish. It adds every category and item from the printed menus that is not on the site, and keeps your prices and edits. **استبدال المنيو بالكامل** resets everything to the printed menus.

## Test checklist

1. Scan a table QR, add items, write a note, send. A 4-character code appears.
2. The captain phone rings with the table number, items and notes. Open the screen: the card shows the table, items and the notes box.
3. Press *بدء التحضير* / *تم التسليم*.
4. After 30 minutes the order is gone.
5. In the dashboard turn **Ordering** off: the order buttons disappear.

## Troubleshooting

- **"Notifications blocked"**: allow notifications for the site in the phone settings, then reopen the app.
- **No notification but orders show up**: check the function name, "Verify JWT" is off, the secret in `push.sql` equals `WEBHOOK_SECRET`, and the captain pressed the enable button on that phone.
- **Order refused**: the item may be out of stock or hidden, the table number is above the number of tables in settings, or the spam limit was hit (3 per phone / 5 min).
- **Captain sees nothing**: the email must be listed in `captain_emails` and exist under Authentication.
- **Free Supabase projects pause after a week of no use.** `.github/workflows/keepalive.yml` pings it daily (optional, add secrets `SUPABASE_URL` and `SUPABASE_ANON_KEY` on GitHub).

Designed by Eng: Mahmoud Wafi 01127603628
