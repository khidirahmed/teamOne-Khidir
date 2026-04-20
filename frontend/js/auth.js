// authorization / authn

const bobcatGoConfig = window.BOBCAT_GO_CONFIG || {};
const supabaseUrl = typeof bobcatGoConfig.supabaseUrl === "string"
  ? bobcatGoConfig.supabaseUrl.trim()
  : "";
const supabaseAnonKey = typeof bobcatGoConfig.supabaseAnonKey === "string"
  ? bobcatGoConfig.supabaseAnonKey.trim()
  : "";

const supabaseClient = supabaseUrl && supabaseAnonKey && window.supabase
  ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Store these globally so the game can use them later
let currentUserId = null;
let currentMapId = null;

function requireSupabaseClient() {
  if (supabaseClient) {
    return true;
  }

  console.error("Supabase is not configured. Add your project details to js/supabase-config.js.");
  alert(
    "Supabase is not configured yet. Copy js/supabase-config.example.js to js/supabase-config.js and add your project URL and publishable anon key.",
  );
  return false;
}

function getCredentials() {
  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter your email and password.");
    return null;
  }

  return { email, password };
}

async function goSignUp() {
  if (!requireSupabaseClient()) {
    return;
  }

  const credentials = getCredentials();
  if (!credentials) {
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp(credentials);

  if (error) {
    alert("Sign up error: " + error.message);
    return;
  }

  currentUserId = data.user?.id;

  if (!currentUserId) {
    alert(
      "Sign up succeeded but no user ID was returned. Disable email confirmation in Supabase for instant dev signup.",
    );
    return;
  }

  showScreen("mapselect");
}

async function goSignIn() {
  if (!requireSupabaseClient()) {
    return;
  }

  const credentials = getCredentials();
  if (!credentials) {
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword(credentials);

  if (error) {
    alert("Sign in error: " + error.message);
    return;
  }

  currentUserId = data.user?.id;
  showScreen("mapselect");
}

// Save the finished run when the Godot iframe reports a game over.
async function saveRun(stats) {
  if (!requireSupabaseClient()) {
    return false;
  }

  if (!currentUserId) {
    console.warn("Skipping run save because no user is signed in.");
    return false;
  }

  if (!Number.isInteger(currentMapId)) {
    console.warn("Skipping run save because no map is selected.");
    return false;
  }

  if (!stats || !stats.startedAt) {
    console.warn("Skipping run save because the run start time is missing.");
    return false;
  }

  const score = Math.max(0, Math.floor(Number(stats.score ?? 0)));

  const { error } = await supabaseClient
    .from("runs")
    .insert({
      user_id: currentUserId,
      map_id: currentMapId,
      started_at: stats.startedAt,
      ended_at: new Date().toISOString(),
      score,
    });

  if (error) {
    console.error("Failed to save run:", error.message);
    return false;
  }

  return true;
}
