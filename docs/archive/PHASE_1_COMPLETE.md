# Phase 1: Database Migrations - READY FOR EXECUTION

## ✅ Migration Files Created

All migration SQL files have been generated in `supabase/migrations/`:

1. **`20260212_001_add_paper_trading_flag.sql`** - Adds `is_paper` column to trades table
2. **`20260212_002_create_trade_patterns_table.sql`** - AI pattern detection storage
3. **`20260212_003_create_user_streaks_table.sql`** - Gamification streaks
4. **`20260212_004_create_cached_market_data_table.sql`** - External API cache
5. **`20260212_005_create_update_streak_rpc.sql`** - Streak update RPC function
6. **`MIGRATION_INSTRUCTIONS.md`** - Complete execution guide with verification

## 🎯 Key Clarifications from Jack's Review

### 1. Navigation Architecture (Critical for Phase 2)
**Current:** Chat page uses left sidebar for conversation navigation (no top nav)
**V2 Change:** Add top nav tabs globally, BUT keep sidebar on Chat page
**IMPORTANT:** The sidebar is NOT removed - it becomes a Chat-page-specific element underneath the new top nav bar.

### 2. Data Fetching Pattern (All Phase 3 Hooks)
**Confirmed:** Use SWR (NOT React Query, NOT raw useEffect)
**Reference Pattern:** `hooks/use-market-data.ts`
**Applies To:** All Phase 3 hooks (heatmap, journal, earnings, brief)

### 3. Color Format
**Use:** oklch values from `globals.css` (DO NOT convert to hex)
**Why:** Oklahoma LCH color space is more modern, better color consistency
**Spec hex values:** Reference points for hue/tone only, not literal values

### 4. Production Safety
**Supabase Project:** `ewcqmsfaostcwmgybbub` (us-east-2)
**Migration Safety:** All migrations are additive, use `IF NOT EXISTS`
**CRITICAL:** Run sequentially, verify each before proceeding to next

## 📋 Next Actions

### For Jack (Immediate)
1. Open Supabase SQL Editor for project `ewcqmsfaostcwmgybbub`
2. Execute migrations in order (001 → 005)
3. Run verification queries after each migration
4. Confirm all RLS policies and indexes are created

### Execution Checklist
- [ ] Migration 1: `is_paper` column added
- [ ] Migration 2: `trade_patterns` table created
- [ ] Migration 3: `user_streaks` table created
- [ ] Migration 4: `cached_market_data` table created
- [ ] Migration 5: `update_streak` RPC created
- [ ] Post-migration verification passed
- [ ] All RLS policies verified
- [ ] All indexes created

### After Phase 1 Complete
➡️ **Proceed to Phase 2: Shared Infrastructure**

Phase 2 will build:
1. **Pelican Chat Panel** - Reuses existing SSE streaming system
2. **Top Nav Bar** - Global nav with tabs (Brief | Chat | Heatmap | Journal | Earnings)
3. **Feature Layout Wrapper** - `app/(features)/layout.tsx` for V2 pages
4. **Streak Integration** - useStreaks hook calling the new RPC

Phase 2 is where the complexity lives - nav restructure + panel + SSE reuse.

## 🔧 Migration File Details

### Migration 1: Paper Trading Flag
```sql
ALTER TABLE trades ADD COLUMN IF NOT EXISTS is_paper BOOLEAN DEFAULT false;
```
- Defaults to `false` - all existing trades are real trades
- No data migration needed

### Migration 2: Trade Patterns Table
```sql
CREATE TABLE IF NOT EXISTS trade_patterns (...)
```
- Stores AI-discovered patterns (timing, behavioral, setup, etc.)
- RLS: Users read/update own patterns only
- Service role writes (pattern detection is server-side)

### Migration 3: User Streaks Table
```sql
CREATE TABLE IF NOT EXISTS user_streaks (...)
```
- Tracks journal and plan streaks
- Unique constraint on `(user_id, streak_type)`
- RLS: Users read/update/insert own streaks

### Migration 4: Cached Market Data Table
```sql
CREATE TABLE IF NOT EXISTS cached_market_data (...)
```
- Caches Finnhub/Polygon responses
- Optional `user_id` for user-specific caches (e.g., generated briefs)
- RLS: All authenticated users can read
- Service role writes (cache refresh is server-side)

### Migration 5: Update Streak RPC
```sql
CREATE OR REPLACE FUNCTION update_streak(p_streak_type TEXT) RETURNS JSON
```
- Handles streak logic: consecutive days, 4 PM ET reset
- Returns: `{ current_streak, best_streak, is_new }`
- Grants execute to authenticated users
- SECURITY DEFINER (runs as creator with elevated privileges)

## 📚 Reference Documents

- **Complete Audit:** `V2_CODEBASE_AUDIT.md` (21 sections, full implementation reference)
- **Migration Guide:** `supabase/migrations/MIGRATION_INSTRUCTIONS.md` (step-by-step)
- **Original Spec:** Phase 1 prompts from implementation guide

## ⚠️ Rollback Plan (If Needed)

If something goes wrong during migration:

```sql
-- Run in REVERSE order (5 → 1)
DROP FUNCTION IF EXISTS update_streak(TEXT);
DROP TABLE IF EXISTS cached_market_data;
DROP TABLE IF EXISTS user_streaks;
DROP TABLE IF EXISTS trade_patterns;
ALTER TABLE trades DROP COLUMN IF EXISTS is_paper;
```

**ONLY use if migration fails** - do NOT run preemptively.

---

**Status:** ✅ Phase 1 migration files ready for execution
**Next:** Jack runs migrations, then proceed to Phase 2
**ETA:** Phase 2 can start immediately after migration verification
