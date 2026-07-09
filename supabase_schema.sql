-- FitBharat Supabase Database Schema
-- Run this in your Supabase SQL Editor to initialize all tables

-- 1. PROFILES TABLE (linked to Auth.Users)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text not null,
    age integer,
    gender text check (gender in ('Male', 'Female', 'Non-binary', 'Prefer not to say')),
    height numeric(5,2), -- in cm
    weight numeric(5,2), -- in kg
    target_weight numeric(5,2), -- in kg
    goal_type text check (goal_type in ('Lose Weight', 'Gain Muscle', 'Stay Fit')),
    activity_level text check (activity_level in ('Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active')),
    avatar_url text,
    diet_style text check (diet_style in ('Vegetarian', 'Vegan', 'Eggitarian', 'Non-Vegetarian')),
    water_target numeric(4,2) default 3.0, -- in liters
    sleep_target numeric(3,1) default 8.0, -- in hours
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;
create policy "Allow users to view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Allow users to update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Allow users to insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- 2. WEIGHT LOGS
create table if not exists public.weight_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    weight numeric(5,2) not null,
    logged_at date default current_date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_user_weight_date unique (user_id, logged_at)
);

alter table public.weight_logs enable row level security;
create policy "Users can manage weight logs" on public.weight_logs for all using (auth.uid() = user_id);

-- 3. WORKOUT PLANS
create table if not exists public.workout_plans (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    type text check (type in ('Strength', 'Cardio', 'HIIT', 'Yoga')) not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.workout_plans enable row level security;
create policy "Users can manage workout plans" on public.workout_plans for all using (auth.uid() = user_id);

-- 4. WORKOUT LOGS
create table if not exists public.workout_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    plan_id uuid references public.workout_plans(id) on delete set null,
    title text not null,
    duration_minutes integer not null,
    total_volume_kg numeric(8,2) default 0.0,
    completed_at date default current_date not null,
    exercises_data jsonb not null, -- Stores exercises, sets, reps, and weights completed
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.workout_logs enable row level security;
create policy "Users can manage workout logs" on public.workout_logs for all using (auth.uid() = user_id);

-- 5. MEAL LOGS
create table if not exists public.meal_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    meal_type text check (meal_type in ('Breakfast', 'Lunch', 'Dinner', 'Snacks')) not null,
    food_name text not null,
    calories numeric(6,2) not null,
    protein numeric(5,2) not null,
    carbs numeric(5,2) not null,
    fat numeric(5,2) not null,
    serving_quantity numeric(5,2) default 1.0,
    serving_unit text default 'serving',
    logged_at date default current_date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.meal_logs enable row level security;
create policy "Users can manage meal logs" on public.meal_logs for all using (auth.uid() = user_id);

-- 6. DAILY LIFESTYLE LOGS
create table if not exists public.daily_lifestyle_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    log_date date default current_date not null,
    water_liters numeric(4,2) default 0.0,
    sleep_hours numeric(3,1) default 0.0,
    steps_count integer default 0,
    mood_rating integer check (mood_rating between 1 and 5),
    energy_rating integer check (energy_rating between 1 and 5),
    stress_rating text check (stress_rating in ('Low', 'Medium', 'High')),
    consistency_score integer default 0 check (consistency_score between 0 and 100),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_user_lifestyle_date unique (user_id, log_date)
);

alter table public.daily_lifestyle_logs enable row level security;
create policy "Users can manage lifestyle logs" on public.daily_lifestyle_logs for all using (auth.uid() = user_id);

-- 7. GARDEN STATES
create table if not exists public.garden_states (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    growth_stage integer default 0 check (growth_stage between 0 and 4),
    water_level numeric(5,2) default 0.0,
    sunlight_level numeric(5,2) default 0.0,
    plants_unlocked jsonb default '[]'::jsonb, -- Positions/types of plants in the garden
    garden_theme text default 'Default Sage',
    last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_user_garden unique (user_id)
);

alter table public.garden_states enable row level security;
create policy "Users can manage garden state" on public.garden_states for all using (auth.uid() = user_id);

-- 8. CHALLENGES
create table if not exists public.challenges (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    type text check (type in ('Hydration', 'Steps', 'Workout', 'Consistency')) not null,
    target_value numeric(8,2) not null,
    duration_days integer not null,
    points_reward integer not null,
    badge_icon text
);

-- Seed default challenges
insert into public.challenges (title, description, type, target_value, duration_days, points_reward, badge_icon) values
('Hydration Hero', 'Drink at least 3 liters of water daily for 7 days', 'Hydration', 3.0, 7, 100, 'droplet'),
('Daily Steps Master', 'Reach 10,000 steps daily for 7 days', 'Steps', 10000.0, 7, 150, 'footprints'),
('Workout Discipline', 'Log 3 workouts in a week', 'Workout', 3.0, 7, 200, 'dumbbell'),
('Consistency Star', 'Maintain a consistency score of >80% for 5 days', 'Consistency', 80.0, 5, 250, 'sprout')
on conflict do nothing;

create table if not exists public.user_challenges (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    challenge_id uuid references public.challenges(id) on delete cascade not null,
    started_at date default current_date not null,
    progress numeric(8,2) default 0.0,
    completed boolean default false,
    completed_at date,
    constraint unique_user_challenge unique (user_id, challenge_id)
);

alter table public.user_challenges enable row level security;
create policy "Users can manage challenges" on public.user_challenges for all using (auth.uid() = user_id);
