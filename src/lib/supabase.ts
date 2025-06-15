import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://quxjvorgnmxzbwzlvjiv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zc3d0bWRudnhtbGd0amN2YmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NjI3MDgsImV4cCI6MjA2NTUzODcwOH0.r2yvpFlfsCbmkGJzjFsf66-jcdvjIEZpYYHzJ9dLLto';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };