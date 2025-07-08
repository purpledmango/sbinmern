


export const migrateFiles = (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  if (files.length !== 2) {
    return res.status(400).json({ message: 'Exactly two files must be uploaded: a SQL dump and a wp_config zip.' });
  }

  // Improved SQL file detection
  const sqlFile = files.find(file =>
    ['application/zip', 'application/x-sql', 'application/octet-stream'].includes(file.mimetype) ||
    file.originalname.match(/\.(sql|zip)$/i)
  );

  // Improved wp_config detection (case-insensitive, _ or -)
  const wpConfigFile = files.find(file =>
    file.originalname.toLowerCase().match(/wp[-_]config/) &&
    file.mimetype === 'application/zip'
  );

  if (!sqlFile || !wpConfigFile) {
    return res.status(400).json({ message: 'Both a SQL dump file and a wp_config zip file are required.' });
  }

  // Proceed with further processing of sqlFile and wpConfigFile as needed
  return res.status(200).json({
    message: 'Files uploaded successfully',
    files: {
      sqlFile: sqlFile.path,
      wpConfigFile: wpConfigFile.path
    }
  });
};