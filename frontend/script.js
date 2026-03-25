const supabaseUrl = "https://rkqcnibvsvbjxdwjklim.supabase.co";
const supabaseAnonKey = "sb_publishable_08eKwdrsBXZWTzvH04hzJg_G6Z-ZgnV";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
console.log("script.js loaded");

//overriding the goPlay function from index
async function goPlay() {
  const email    = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
 
  //debugging
  console.log("goPlay fired", email, password);


  if (!email || !password) {
    alert('Please enter your email and password.');
    return;
  }
 
  // 1. Try signing in first; if that fails, sign up (new user)
  let userId = null;
 
  let { data: signInData, error: signInError } =
    await supabaseClient.auth.signInWithPassword({ email, password });
 
  if (signInError) {
    // Probably a new user — sign them up
    const { data: signUpData, error: signUpError } =
      await supabaseClient.auth.signUp({ email, password });
 
    if (signUpError) {
      alert('Auth error: ' + signUpError.message);
      return;
    }
 
    userId = signUpData.user?.id;
  } else {
    userId = signInData.user?.id;
  }
 
  if (!userId) {
    alert('Could not get user ID. Please try again.');
    return;
  }
 
  // 2. Figure out which map was selected (defaults to 1)
  const selectedBtn = document.querySelector('.map-btn.selected');
  const mapLabel    = selectedBtn ? selectedBtn.textContent.trim() : 'Map 1';
  const mapId       = mapLabel === 'Map 2' ? 2 : 1;
 
  // 3. Insert a new run row — started_at is set now, the rest filled in later
  const { error: insertError } = await supabaseClient
    .from('runs')
    .insert({
      user_id:    userId,
      map_id:     mapId,
      started_at: new Date().toISOString(),
    });
 
  if (insertError) {
    alert('Could not save run: ' + insertError.message);
    return;
  }
 
  // 4. Navigate to the game screen
  showScreen('game');
}
 