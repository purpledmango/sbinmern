import Migration from '../models/migrationModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Deployment from '../models/deploymentModel.js';
// import { processDeploymentAsync } from '../controllers/deploymentControllers.js';

// Fix for ES modules - must be at the top level
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const migrateFiles = async (req, res) => {
  let sqlFile, wpConfigFile;
  let sqlFilename, wpFilename; // Declare these at the top
  
  try {
    const { mid } = req.params;
    const migrationId = mid;
    
    if (!migrationId) {
      return res.status(400).json({ message: 'Migration ID is required' });
    }

    // Find existing migration using findOne with migrationId
    const existingMigration = await Migration.findOne({ migrationId });
    if (!existingMigration) {
      return res.status(404).json({ message: 'Migration not found' });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const allFiles = Object.values(req.files).flat();

    // Debug: Log all uploaded files
    console.log('All uploaded files:', allFiles.map(f => ({
      name: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path
    })));

    // Improved SQL File identification
    sqlFile = allFiles.find(file => {
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = file.originalname.toLowerCase();
      
      // Check by extension
      const sqlExtensions = ['.sql', '.sql.gz', '.dump', '.db'];
      const hasValidExtension = sqlExtensions.includes(ext) || filename.endsWith('.sql.gz');
      
      // Check by MIME type
      const sqlMimeTypes = [
        'application/sql',
        'application/x-sql', 
        'text/sql',
        'text/plain',
        'application/octet-stream',
        'application/x-gzip',
        'application/gzip'
      ];
      const hasValidMimeType = sqlMimeTypes.includes(file.mimetype);
      
      // Check by filename patterns
      const sqlPatterns = /(\.sql|database|dump|backup|export|db_)/i;
      const hasValidPattern = sqlPatterns.test(filename);
      
      const isSqlFile = hasValidExtension || (hasValidMimeType && hasValidPattern);
      
      console.log(`SQL Check - File: ${file.originalname}`, {
        ext,
        mimetype: file.mimetype,
        hasValidExtension,
        hasValidMimeType,
        hasValidPattern,
        isSqlFile
      });
      
      return isSqlFile;
    });

    // WP Archive identification  
    wpConfigFile = allFiles.find(file => {
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = file.originalname.toLowerCase();
      
      const archiveExtensions = ['.zip', '.tar.gz', '.tar', '.rar'];
      const hasValidExtension = archiveExtensions.includes(ext);
      
      const archiveMimeTypes = [
        'application/zip',
        'application/x-zip-compressed',
        'application/octet-stream',
        'application/x-tar',
        'application/gzip'
      ];
      const hasValidMimeType = archiveMimeTypes.includes(file.mimetype);
      
      const wpPatterns = /(wp[-_]config|wordpress|backup|export|site)/i;
      const hasWpPattern = wpPatterns.test(filename);
      
      const isWpArchive = (hasValidExtension || hasValidMimeType) && hasWpPattern;
      
      console.log(`WP Check - File: ${file.originalname}`, {
        ext,
        mimetype: file.mimetype,
        hasValidExtension,
        hasValidMimeType,
        hasWpPattern,
        isWpArchive
      });
      
      return isWpArchive;
    });

    // Debug what was found
    console.log('SQL file found:', sqlFile ? sqlFile.originalname : 'None');
    console.log('WP file found:', wpConfigFile ? wpConfigFile.originalname : 'None');

    // Generate unique filenames
    const timestamp = Date.now();
    sqlFilename = sqlFile ? `sql_${timestamp}${path.extname(sqlFile.originalname)}` : null;
    wpFilename = wpConfigFile ? `wp_${timestamp}${path.extname(wpConfigFile.originalname)}` : null;

    // Create uploads directory - using the correctly defined __dirname
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    console.log('Uploads directory path:', uploadsDir);
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('Creating uploads directory...');
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Move files with better error handling
    const moveOperations = [];
    
    if (sqlFile && sqlFile.path) {
      const finalSqlPath = path.join(uploadsDir, sqlFilename);
      console.log(`Moving SQL file from ${sqlFile.path} to ${finalSqlPath}`);
      
      // Check if source file exists
      if (!fs.existsSync(sqlFile.path)) {
        throw new Error(`SQL source file does not exist: ${sqlFile.path}`);
      }
      
      moveOperations.push(
        fs.promises.rename(sqlFile.path, finalSqlPath)
          .then(() => console.log('SQL file moved successfully'))
          .catch(err => {
            console.error('SQL file move error:', err);
            throw new Error(`Failed to move SQL file: ${err.message}`);
          })
      );
    }
    
    if (wpConfigFile && wpConfigFile.path) {
      const finalWpPath = path.join(uploadsDir, wpFilename);
      console.log(`Moving WP file from ${wpConfigFile.path} to ${finalWpPath}`);
      
      // Check if source file exists
      if (!fs.existsSync(wpConfigFile.path)) {
        throw new Error(`WP source file does not exist: ${wpConfigFile.path}`);
      }
      
      moveOperations.push(
        fs.promises.rename(wpConfigFile.path, finalWpPath)
          .then(() => console.log('WP file moved successfully'))
          .catch(err => {
            console.error('WP file move error:', err);
            throw new Error(`Failed to move WP file: ${err.message}`);
          })
      );
    }

    // Execute all move operations
    if (moveOperations.length > 0) {
      await Promise.all(moveOperations);
      console.log('All files moved successfully');
    }

    // Update migration record using _id
    const updateData = {
      status: 'pending',
      updatedAt: new Date()
    };

    if (sqlFile) {
      updateData.sql_dump = sqlFilename;
      updateData.fileSize = {
        ...(existingMigration.fileSize || {}),
        sql_dump: sqlFile.size
      };
      updateData.originalFilenames = {
        ...(existingMigration.originalFilenames || {}),
        sql_dump: sqlFile.originalname
      };
    }

    if (wpConfigFile) {
      updateData.wp_archive = wpFilename;
      updateData.fileSize = {
        ...(existingMigration.fileSize || {}),
        wp_archive: wpConfigFile.size
      };
      updateData.originalFilenames = {
        ...(existingMigration.originalFilenames || {}),
        wp_archive: wpConfigFile.originalname
      };
    }

    console.log('Updating migration with data:', updateData);

    const updatedMigration = await Migration.findByIdAndUpdate(
      existingMigration._id,
      updateData,
      { new: true }
    );

    console.log('Migration updated successfully:', updatedMigration.migrationId);

    return res.status(200).json({
      message: 'Migration updated successfully',
      migrationId: updatedMigration.migrationId,
      files: {
        ...(sqlFile && {
          sql: {
            url: `/uploads/${sqlFilename}`,
            name: sqlFile.originalname,
            size: (sqlFile.size / 1024 / 1024).toFixed(2) + ' MB'
          }
        }),
        ...(wpConfigFile && {
          wpConfig: {
            url: `/uploads/${wpFilename}`,
            name: wpConfigFile.originalname,
            size: (wpConfigFile.size / 1024 / 1024).toFixed(2) + ' MB'
          }
        })
      },
      statusUrl: `/api/migrations/status/${updatedMigration.migrationId}`
    });

  } catch (error) {
    console.error('Migration error:', error);
    
    // Enhanced cleanup function
    const cleanup = async (file, filename) => {
      const cleanupTasks = [];
      
      try {
        // Clean up temporary file from multer
        if (file?.path && fs.existsSync(file.path)) {
          console.log(`Cleaning up temp file: ${file.path}`);
          cleanupTasks.push(fs.promises.unlink(file.path));
        }
        
        // Clean up moved file if it exists
        if (filename) {
          const filePath = path.join(__dirname, '..', 'uploads', filename);
          if (fs.existsSync(filePath)) {
            console.log(`Cleaning up moved file: ${filePath}`);
            cleanupTasks.push(fs.promises.unlink(filePath));
          }
        }
        
        if (cleanupTasks.length > 0) {
          await Promise.all(cleanupTasks);
          console.log('Cleanup completed successfully');
        }
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    };

    // Perform cleanup
    await Promise.all([
      cleanup(sqlFile, sqlFilename),
      cleanup(wpConfigFile, wpFilename)
    ]);
    
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred during file processing'
    });
  }
};

// export const createMigration = async(req, res) => {
//   try {
//     // Get user ID from authenticated request
//     const { uid } = req.user;
//     const { mid } = req.params;
//     const { deploymentName, deploymentType = 'wordpress' } = req.body;
    

//     // Validate required fields
//     if (!uid || !deploymentName) {
//       console.warn('Validation failed - missing uid or deploymentName');
//       return res.status(400).json({
//         success: false,
//         message: "UID and deploymentName are required",
//         code: "MISSING_REQUIRED_FIELDS"
//       });
//     }

//     // Create new deployment record with initial configuration
//     const deployment = new Deployment({
//       uid,
//       deploymentName,
//       deploymentType,
//       status: 'initiated',
//       mid,
//       wpConfig: {
//         url: process.env.WP_DEFAULT_URL || 'http://localhost',
//         port: process.env.WP_DEFAULT_PORT || 64395,
//         databaseName: 'wpdb',
//         databaseUser: 'wpuser',
//         databasePassword: generateSecurePassword(),
//         rootPassword: generateSecurePassword()
//       },
//       logs: [`${new Date().toISOString()} - Deployment initiated by user ${uid}`]
//     });

//     await deployment.save();
//     console.log(`Deployment record created: ${deployment.deploymentId}`);

//     // Immediate response to client
//     res.status(202).json({
//       success: true,
//       message: "Deployment process started",
//       deployment: {
//         deploymentId: deployment.deploymentId,
//         name: deployment.deploymentName,
//         status: deployment.status,
//         created: deployment.createdAt,
//         monitorEndpoint: `/deployments/${deployment.deploymentId}/status`
//       },
//       uid
//     });

//     // Start background deployment process
//     // Use setImmediate instead of setTimeout for better performance
//    setTimeout(() => {
//   processDeploymentAsync(deployment.deploymentId)
//     .catch(err => {
//       console.error(`Background processing error for ${deployment.deploymentId}:`, err);
//     });
// }, 2000);

//   } catch (error) {
//     console.error("Deployment endpoint error:", error);
    
//     // Only send response if we haven't already sent one
//     if (!res.headersSent) {
//       res.status(500).json({
//         success: false,
//         message: "Internal server error during deployment initiation",
//         error: error.message,
//         code: "DEPLOYMENT_INIT_FAILURE"
//       });
//     }
//   }
// };
