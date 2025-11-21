const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/download/track
// @desc    Track download for authenticated user
// @access  Private
router.post('/track', protect, async (req, res) => {
    try {
        const { version = '1.0.0' } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Add download record
        user.downloads.push({
            downloadedAt: new Date(),
            version,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        });
        
        user.totalDownloads += 1;
        user.lastDownload = new Date();
        
        await user.save();

        res.json({
            success: true,
            message: 'Download tracked successfully',
            data: {
                totalDownloads: user.totalDownloads,
                downloadUrl: process.env.DOWNLOAD_URL || 'https://drive.google.com/your-file-link'
            }
        });
    } catch (error) {
        console.error('Track Download Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error tracking download',
            error: error.message
        });
    }
});

// @route   GET /api/download/stats
// @desc    Get download statistics (admin)
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDownloads = await User.aggregate([
            { $group: { _id: null, total: { $sum: '$totalDownloads' } } }
        ]);
        
        const recentDownloads = await User.find({ lastDownload: { $exists: true } })
            .sort({ lastDownload: -1 })
            .limit(10)
            .select('name email lastDownload totalDownloads');

        res.json({
            success: true,
            data: {
                totalUsers,
                totalDownloads: totalDownloads[0]?.total || 0,
                recentDownloads
            }
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

module.exports = router;
