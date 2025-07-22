 import Migration from "../models/migrationModel.js";
 
 export const getMigrationFileFromUploads = async (req, res) => {
  try {
    const { userId, filename } = req.params;
    // Verify the requesting user owns this file
    

    const filePath = path.join(__dirname, '../uploads', filename);

    // Security checks
    // if (!filePath.startsWith(path.join(__dirname, '../../migrations'))) {
    //   return res.status(403).json({ error: "Access denied" });
    // }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const stats = await fs.promises.stat(filePath);
    if (stats.isDirectory()) {
      return res.status(400).json({ error: "Invalid file request" });
    }

    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase();
    const contentType = {
      '.sql': 'application/sql',
      '.zip': 'application/zip',
      '.gz': 'application/gzip',
      '.tar': 'application/x-tar'
    }[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error streaming file" });
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export const getMigrationOfUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const userMigrations = await Migration.find({ uid:uid }).sort({ createdAt: -1   });
        if (userMigrations.length === 0)    {
            res.status(404).json({
                status: "Success",
                message: "No migration found for the User"
            })
        }

        res.status(200).json({
                status: "Success",
                message: "All migrations fetched successfully",
                data: userMigrations
            })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: error.message || "An error occurred while fetching migrations"
        });
    }
}