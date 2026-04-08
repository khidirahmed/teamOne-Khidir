//authorization / authn

const supabaseUrl = "https://rkqcnibvsvbjxdwjklim.supabase.co";
const supabaseAnonKey = "sb_publishable_08eKwdrsBXZWTzvH04hzJg_G6Z-ZgnV";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
console.log("script.js loaded");

// Store these globally so the game can use them later
let currentUserId = null;
let currentMapId = null;

async function goPlay() {
  const email    = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please enter your email and password.');
    return;
  }

  let { data: signInData, error: signInError } =
    await supabaseClient.auth.signInWithPassword({ email, password });

  if (signInError) {
    const { data: signUpData, error: signUpError } =
      await supabaseClient.auth.signUp({ email, password });

    if (signUpError) {
      alert('Auth error: ' + signUpError.message);
      return;
    }
    currentUserId = signUpData.user?.id;
  } else {
    currentUserId = signInData.user?.id;
  }

  if (!currentUserId) {
    alert('Could not get user ID. Please try again.');
    return;
  }

  const selectedBtn = document.querySelector('.map-btn.selected');
  const mapLabel    = selectedBtn ? selectedBtn.textContent.trim() : 'Map 1';
  currentMapId      = mapLabel === 'Map 2' ? 2 : 1;

  showScreen('game');
}

//we will run this when the game ends
async function saveRun(stats) {
  const { error } = await supabaseClient
    .from('runs')
    .insert({
      user_id:    currentUserId,
      map_id:     currentMapId,
      started_at: stats.startedAt,
      ended_at:   new Date().toISOString(),
      score:      stats.score,
    });

  if (error) console.error('Failed to save run:', error.message);
}

async function login(){

};