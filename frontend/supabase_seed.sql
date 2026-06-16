-- ═══════════════════════════════════════════════════════════════════════════
-- HUSTLEHUB — SUPABASE SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════
--
-- HOW TO USE THIS FILE:
--
-- STEP 1 ─ Run supabase_schema.sql first to create all tables + trigger.
--
-- STEP 2 ─ Sign up the following 4 test accounts via the HustleHub app (/signup):
--    • admin@hustlehub.cm        (select any role — we will promote to admin below)
--    • sarah.employer@gmail.com  (select "Hire Local Help" → employer)
--    • alex.worker@gmail.com     (select "Offer My Skills"  → student)
--    • grace.worker@gmail.com    (select "Offer My Skills"  → student)
--
-- STEP 3 ─ Confirm each account via the email link Supabase sends.
--   (Or: Supabase Dashboard → Authentication → Users → "Confirm" each user)
--   (Or: Supabase Dashboard → Authentication → Settings → disable email confirmation for testing)
--
-- STEP 4 ─ Paste and run the SQL below in Supabase Dashboard → SQL Editor.
--
-- STEP 5 ─ Login as admin@hustlehub.cm — you will be redirected to /admin.
-- ═══════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 1: PROMOTE ROLES & ENRICH PROFILES
-- Run this after the 4 accounts have signed up
-- ─────────────────────────────────────────────────────────────────────────────

-- Make admin account a platform admin
UPDATE public.profiles
SET
  role = 'admin',
  is_verified = true,
  name = 'HustleHub Admin',
  trust_score = 100
WHERE email = 'admin@hustlehub.cm';

-- Enrich the employer profile
UPDATE public.profiles
SET
  role = 'employer',
  is_verified = true,
  name = 'Sarah Kameni',
  trust_score = 95,
  rating = 4.8,
  total_reviews = 12
WHERE email = 'sarah.employer@gmail.com';

-- Enrich student worker 1 (Alex)
UPDATE public.profiles
SET
  role = 'student',
  is_verified = true,
  student_status = true,
  name = 'Alex Mbu',
  badge = 'Top Pro',
  trust_score = 98,
  rating = 4.9,
  total_reviews = 84,
  skills = ARRAY['Cleaning', 'Moving', 'Yard Work']
WHERE email = 'alex.worker@gmail.com';

-- Enrich student worker 2 (Grace)
UPDATE public.profiles
SET
  role = 'student',
  is_verified = true,
  student_status = true,
  name = 'Grace Tanyi',
  badge = 'Rising Star',
  trust_score = 92,
  rating = 4.7,
  total_reviews = 31,
  skills = ARRAY['Tech Support', 'Delivery', 'Assembly']
WHERE email = 'grace.worker@gmail.com';


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 2: SEED JOBS (FCFA budgets)
-- These insert jobs linked to the employer account. UUIDs are resolved by email.
-- ─────────────────────────────────────────────────────────────────────────────

-- Completed job assigned to Alex
INSERT INTO public.jobs (client_id, provider_id, title, category, description, location, budget, status, created_at, completed_at)
SELECT
  e.id,
  w.id,
  'Dorm Deep Cleaning & Organisation',
  'Cleaning',
  'Need thorough cleaning of a 3-room apartment before exams week. Must clean all surfaces, mop floors, clean bathroom, and organise wardrobe.',
  'Bastos, Yaoundé',
  15000,
  'completed',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '8 days'
FROM public.profiles e, public.profiles w
WHERE e.email = 'sarah.employer@gmail.com'
  AND w.email = 'alex.worker@gmail.com';

-- Completed job assigned to Alex
INSERT INTO public.jobs (client_id, provider_id, title, category, description, location, budget, status, created_at, completed_at)
SELECT
  e.id,
  w.id,
  'Help Moving Heavy Furniture',
  'Moving',
  'Need 2 strong people to help move a sofa and wardrobe from 2nd floor to ground floor. Estimated 2 hours. Refreshments provided.',
  'Cité Verte, Yaoundé',
  20000,
  'completed',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '14 days'
FROM public.profiles e, public.profiles w
WHERE e.email = 'sarah.employer@gmail.com'
  AND w.email = 'alex.worker@gmail.com';

-- Open job (no provider yet)
INSERT INTO public.jobs (client_id, title, category, description, location, budget, status)
SELECT
  id,
  'Yard Cleanup & Grass Cutting',
  'Yard Work',
  'Looking for someone to cut the overgrown grass in my compound and dispose of clippings. All tools will be provided on site. Estimated 3 hours.',
  'Mfandena, Yaoundé',
  8000,
  'open'
FROM public.profiles WHERE email = 'sarah.employer@gmail.com';

-- Open job (no provider yet)
INSERT INTO public.jobs (client_id, title, category, description, location, budget, status)
SELECT
  id,
  'Laptop & Home WiFi Router Setup',
  'Tech Support',
  'Need someone tech-savvy to configure a new Dell laptop and set up the new Camtel router. Please arrive with patience.',
  'Essos, Yaoundé',
  12000,
  'open'
FROM public.profiles WHERE email = 'sarah.employer@gmail.com';

-- Open job for Grace to apply to
INSERT INTO public.jobs (client_id, title, category, description, location, budget, status)
SELECT
  id,
  'Weekly Grocery Delivery (Market Run)',
  'Delivery',
  'Looking for a reliable person to do a weekly run to Mvog-Mbi market and deliver groceries to my home. Shopping list provided in advance.',
  'Mendong, Yaoundé',
  5000,
  'open'
FROM public.profiles WHERE email = 'sarah.employer@gmail.com';

-- In-progress job assigned to Grace
INSERT INTO public.jobs (client_id, provider_id, title, category, description, location, budget, status)
SELECT
  e.id,
  w.id,
  'Assemble IKEA Bookshelf & TV Stand',
  'Assembly',
  'Have 2 flat-pack furniture items to assemble. Tools may be needed — please bring your own. Will take approximately 3 hours.',
  'Omnisport, Yaoundé',
  18000,
  'in_progress'
FROM public.profiles e, public.profiles w
WHERE e.email = 'sarah.employer@gmail.com'
  AND w.email = 'grace.worker@gmail.com';


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 3: SEED VERIFICATIONS (Pending student verification requests)
-- ─────────────────────────────────────────────────────────────────────────────

-- Alex's verification (approved — matches the profile update above)
INSERT INTO public.verifications (user_id, id_card_url, guarantor_form_url, status)
SELECT
  id,
  'https://example.com/uploads/id_alex_mbu.jpg',
  'https://example.com/uploads/guarantor_alex.pdf',
  'approved'
FROM public.profiles WHERE email = 'alex.worker@gmail.com'
ON CONFLICT DO NOTHING;

-- Grace's verification (approved)
INSERT INTO public.verifications (user_id, id_card_url, guarantor_form_url, status)
SELECT
  id,
  'https://example.com/uploads/id_grace_tanyi.jpg',
  'https://example.com/uploads/guarantor_grace.pdf',
  'approved'
FROM public.profiles WHERE email = 'grace.worker@gmail.com'
ON CONFLICT DO NOTHING;

-- Add 2 PENDING verification requests (simulate students waiting for approval)
-- NOTE: These require having 2 more registered users. If you only have 4 test
--       accounts, comment these out. Otherwise sign up extra test accounts first.
--
-- INSERT INTO public.verifications (user_id, id_card_url, status)
-- SELECT id, 'https://example.com/uploads/id_pending_01.jpg', 'pending'
-- FROM public.profiles WHERE email = 'student.pending1@email.com';


-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 4: SEED A MOCK DISPUTE
-- Uses the first completed job (Dorm Cleaning) between Sarah and Alex
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.disputes (job_id, opened_by, reason, status)
SELECT
  j.id,
  w.id,
  'Client Sarah Kameni approved the cleaning verbally but is now refusing to release payment via Fapshi. The dorm room was fully cleaned and photos were sent at completion. I need admin mediation to release the FCFA 15,000 escrow.',
  'open'
FROM public.jobs j, public.profiles w
WHERE j.title = 'Dorm Deep Cleaning & Organisation'
  AND w.email = 'alex.worker@gmail.com'
LIMIT 1;


-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFY: Quick summary query — run to confirm seed data looks correct
-- ─────────────────────────────────────────────────────────────────────────────
SELECT 'profiles' AS tbl, COUNT(*) FROM public.profiles
UNION ALL
SELECT 'jobs', COUNT(*) FROM public.jobs
UNION ALL
SELECT 'verifications', COUNT(*) FROM public.verifications
UNION ALL
SELECT 'disputes', COUNT(*) FROM public.disputes;
