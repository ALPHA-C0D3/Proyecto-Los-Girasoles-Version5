// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('✅ Carpeta uploads/ creada');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `comprobante-${uniqueSuffix}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf'
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato no permitido. Solo se aceptan JPG, PNG o PDF'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024
    },
    fileFilter: fileFilter
});

const manejarErrorUpload = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                mensaje: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
            });
        }
        
        return res.status(400).json({
            success: false,
            mensaje: `Error al subir archivo: ${err.message}`
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            mensaje: err.message
        });
    }
    
    next();
};

const eliminarArchivo = (nombreArchivo) => {
    const rutaArchivo = path.join(uploadDir, nombreArchivo);
    
    fs.unlink(rutaArchivo, (err) => {
        if (err) console.error('Error al eliminar archivo:', err);
        else console.log('Archivo eliminado:', nombreArchivo);
    });
};

module.exports = { upload, manejarErrorUpload, eliminarArchivo };