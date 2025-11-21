const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                registeredAt: user.registeredAt,
                stats: user.getStats()
            }
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

// @route   GET /api/user/download-history
// @desc    Get user download history
// @access  Private
router.get('/download-history', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                totalDownloads: user.totalDownloads,
                downloads: user.downloads.sort((a, b) => b.downloadedAt - a.downloadedAt)
            }
        });
    } catch (error) {
        console.error('Get Download History Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching download history',
            error: error.message
        });
    }
});

// @route   GET /api/user/all (Admin only)
// @desc    Get all users
// @access  Private
router.get('/all', protect, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ registeredAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

module.exports = router;
