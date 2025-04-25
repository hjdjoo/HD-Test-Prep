// // import * as dotenv from "dotenv";
// import * as fs from "node:fs";
// import * as path from "node:path"
// import { spawn, exec } from "node:child_process";

// const PORT = 5173

// function startNgrok(port: number) {

//   // console.log(`starting Ngrok on port ${port}`)

//   const ngrokProcess = spawn("ngrok", ["http", String(port), "--log=stdout"], { stdio: ["ignore", "pipe", "pipe"] });

//   ngrokProcess.stdout.on("data", (data) => {

//     // console.log("Ngrok stdout: ", data.toString());
//     const output = data.toString();

//     const match = output.match(/https:\/\/(.+)\.ngrok-free\.app/g)
//     // // console.log("Ngrok URL: ", match[0]);

//     if (match && match[0]) {
//       updateEnv(match[0]);
//       // killVite();
//       // killNode();

//       // dotenv.config();
//       // startVite();
//     }

//   })

//   ngrokProcess.stderr.on("data", (data) => {

//     console.error("❌ Ngrok error: ", data.toString());
//   })

//   ngrokProcess.on("close", (code) => {
//     // console.log(`Ngrok process exited with code ${code}`)
//   })

//   ngrokProcess.on("error", (error) => {
//     console.error("❌ Ngrok failed to start:", error);
//   });
// }


// function updateEnv(ngrokUrl: string) {

//   // const ngrokUrl = match[0];
//   // console.log("ngrokUrl: ", ngrokUrl)

//   const envPath = path.resolve("./", ".env");
//   // console.log("envPath: ", envPath);
//   let envContent = "";

//   if (fs.existsSync(envPath)) {
//     envContent = fs.readFileSync(envPath, "utf8");
//     // Replace existing VITE_URL line
//     envContent = envContent.replace(/^VITE_URL=.*/m, `VITE_URL=${ngrokUrl}`);
//   } else {
//     envContent = `VITE_URL=${ngrokUrl}\n`;
//   }

//   fs.writeFileSync(envPath, envContent, "utf8");
//   // console.log(`✅ Updated .env file with VITE_URL=${ngrokUrl}`);

// }

// // function killVite() {

// //   exec(`pkill -f vite`, (error, stdout, stderr) => {
// //     if (error) {
// //       // console.log("⚠️ No existing Vite process found or already stopped.");
// //     } else {
// //       // console.log("✅ Vite process killed successfully.");
// //     }
// //     if (stdout) // console.log(stdout);
// //     if (stderr) console.error(stderr);
// //   });

// // }

// // function killNode() {

// //   exec(`pkill -f node`, (error, stdout, stderr) => {
// //     if (error) {
// //       // console.log("⚠️ No existing Node process found or already stopped.");
// //     } else {
// //       // console.log("✅ Node process killed successfully.");
// //     }
// //     if (stdout) // console.log(stdout);
// //     if (stderr) console.error(stderr);
// //   })
// // }

// // function startVite() {

// //   const viteProcess = spawn("npm", ["run", "dev"], {
// //     stdio: "inherit",
// //     shell: true,
// //     env: process.env
// //   });

// //   if (!viteProcess.stdout) {
// //     // console.log("❌ No stdout from vite process...");
// //     return;
// //   }

// //   viteProcess.stdout.on("data", (data) => {
// //     // console.log("viteProcess stdout: ", data.toString())
// //   })

// //   viteProcess.on("error", (error) => {
// //     console.error("❌ Error while starting Vite", error);
// //   })

// //   viteProcess.on("close", (code) => {
// //     // console.log(`🔻 Vite process exited with code ${code}`);
// //   });

// //   // console.log("Vite started successfully");

// // }

// startNgrok(PORT);
