/**
 * Local Sync Service - Receives user-built apps from Vercel
 * Run this on your local machine to receive app data
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.SYNC_PORT || 4000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'default-secret';
const APPS_DIR = path.join(__dirname, '../../user-apps');

app.use(express.json({ limit: '50mb' }));

// Ensure apps directory exists
async function ensureAppsDir() {
  try {
    await fs.mkdir(APPS_DIR, { recursive: true });
    console.log(`✅ Apps directory ready: ${APPS_DIR}`);
  } catch (error) {
    console.error('Failed to create apps directory:', error);
  }
}

/**
 * Webhook endpoint to receive apps from Vercel
 */
app.post('/webhook/apps', async (req, res) => {
  try {
    // Verify webhook secret
    const secret = req.headers['x-webhook-secret'];
    if (secret !== WEBHOOK_SECRET) {
      console.warn('⚠️  Invalid webhook secret');
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const appData = req.body;
    const { appId, appName, user, project, files, timestamp } = appData;

    if (!appId || !user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid app data',
      });
    }

    console.log(`\n📦 Received app from user: ${user.name} (${user.email})`);
    console.log(`   App: ${appName || project?.name}`);
    console.log(`   Project ID: ${appId}`);

    // Create user directory
    const userDir = path.join(APPS_DIR, `user_${user.id}`);
    await fs.mkdir(userDir, { recursive: true });

    // Create app directory
    const appDir = path.join(userDir, appId);
    await fs.mkdir(appDir, { recursive: true });

    // Save app metadata
    const metadata = {
      appId,
      appName,
      user,
      project,
      timestamp,
      receivedAt: Date.now(),
      source: 'vercel',
    };

    await fs.writeFile(
      path.join(appDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Save app files
    if (files && typeof files === 'object') {
      for (const [filename, content] of Object.entries(files)) {
        const filePath = path.join(appDir, filename);
        const fileDir = path.dirname(filePath);
        
        // Ensure subdirectories exist
        await fs.mkdir(fileDir, { recursive: true });
        
        // Write file
        await fs.writeFile(filePath, content);
        console.log(`   ✓ Saved: ${filename}`);
      }
    }

    // Log to sync history
    const logEntry = `${new Date().toISOString()} | User: ${user.name} | App: ${appName} | Files: ${Object.keys(files || {}).length}\n`;
    await fs.appendFile(path.join(APPS_DIR, 'sync-log.txt'), logEntry);

    console.log(`✅ App saved successfully to: ${appDir}\n`);

    res.json({
      success: true,
      message: 'App received and saved',
      savedTo: appDir,
    });
  } catch (error) {
    console.error('❌ Error receiving app:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save app',
      error: error.message,
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'running',
    timestamp: Date.now(),
    appsDirectory: APPS_DIR,
  });
});

/**
 * Get list of synced apps
 */
app.get('/apps', async (req, res) => {
  try {
    const users = await fs.readdir(APPS_DIR);
    const apps = [];

    for (const userFolder of users) {
      if (!userFolder.startsWith('user_')) continue;
      
      const userPath = path.join(APPS_DIR, userFolder);
      const userApps = await fs.readdir(userPath);

      for (const appFolder of userApps) {
        const metadataPath = path.join(userPath, appFolder, 'metadata.json');
        try {
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
          apps.push({
            ...metadata,
            localPath: path.join(userPath, appFolder),
          });
        } catch (err) {
          // Skip if metadata doesn't exist
        }
      }
    }

    res.json({
      success: true,
      count: apps.length,
      apps: apps.sort((a, b) => b.receivedAt - a.receivedAt),
    });
  } catch (error) {
    console.error('Error listing apps:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list apps',
    });
  }
});

// Start server
async function start() {
  await ensureAppsDir();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Local Sync Service Started`);
    console.log(`📡 Listening on port: ${PORT}`);
    console.log(`📂 Apps directory: ${APPS_DIR}`);
    console.log(`🔐 Webhook secret: ${WEBHOOK_SECRET === 'default-secret' ? '⚠️  Using default secret!' : '✅ Custom secret configured'}`);
    console.log(`\n💡 To expose this locally for Vercel:`);
    console.log(`   ngrok http ${PORT}`);
    console.log(`   Then set ADMIN_WEBHOOK_URL in Vercel env vars\n`);
  });
}

start().catch(console.error);
