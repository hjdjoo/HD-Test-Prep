const fs = require('fs');
const { exec } = require('child_process');
const ngrok = require('ngrok');

// Function to update the .env file
const updateEnvFile = (apiUrl) => {
  const envPath = '.env.ngrok'; // Adjust path based on your project structure
  let envContent = `VITE_URL=${apiUrl}`;

  // Write to the .env file
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(`✅ Updated .env with API URL: ${apiUrl}`);

  // Restart Vite for changes to take effect
  exec('pkill -f vite && npm run dev', { cwd: './frontend' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error restarting Vite: ${error}`);
      return;
    }
    console.log(`🔄 Restarted Vite: ${stdout}`);
  });
};

// Start ngrok and update .env
(async () => {
  try {
    const url = await ngrok.connect(5173); // Expose Vite Frontend
    console.log(`🚀 Ngrok started: ${url}`);
    updateEnvFile(url);
  } catch (error) {
    console.error('❌ Error starting ngrok:', error);
  }
})();
