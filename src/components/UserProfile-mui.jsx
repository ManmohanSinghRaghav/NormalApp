import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material'
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
} from '@mui/icons-material'

export default function UserProfile({ onClose }) {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    gender: user?.user_metadata?.gender || '',
    dateOfBirth: user?.user_metadata?.date_of_birth || '',
    profilePicture: user?.user_metadata?.avatar_url || null
  })
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Here you would update the user profile in Supabase
      console.log('Saving profile:', profileData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original data
    setProfileData({
      fullName: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '',
      gender: user?.user_metadata?.gender || '',
      dateOfBirth: user?.user_metadata?.date_of_birth || '',
      profilePicture: user?.user_metadata?.avatar_url || null
    })
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {t('profile.title', 'User Profile')}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {loading && <LinearProgress />}

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Profile Picture Section */}
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={profileData.profilePicture}
                sx={{ 
                  width: 120, 
                  height: 120,
                  bgcolor: 'black',
                  fontSize: '3rem'
                }}
              >
                {!profileData.profilePicture && <PersonIcon sx={{ fontSize: '3rem' }} />}
              </Avatar>
              {isEditing && (
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    width: 40,
                    height: 40,
                  }}
                >
                  <PhotoCameraIcon />
                </IconButton>
              )}
            </Box>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
            />
          </Box>

          {/* User Info */}
          <Card elevation={0} sx={{ bgcolor: 'grey.50' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {t('profile.basicInfo', 'Basic Information')}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="fullName"
                    label={t('profile.fullName', 'Full Name')}
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label={t('profile.email', 'Email')}
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email typically shouldn't be editable
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="phone"
                    type="tel"
                    label={t('profile.phone', 'Phone Number')}
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>{t('profile.gender', 'Gender')}</InputLabel>
                    <Select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      label={t('profile.gender', 'Gender')}
                    >
                      <MenuItem value="male">{t('profile.male', 'Male')}</MenuItem>
                      <MenuItem value="female">{t('profile.female', 'Female')}</MenuItem>
                      <MenuItem value="other">{t('profile.other', 'Other')}</MenuItem>
                      <MenuItem value="prefer-not-to-say">{t('profile.preferNotToSay', 'Prefer not to say')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="dateOfBirth"
                    type="date"
                    label={t('profile.dateOfBirth', 'Date of Birth')}
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <CakeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card elevation={0} sx={{ bgcolor: 'grey.50' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {t('profile.accountStats', 'Account Statistics')}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={600} color="primary">
                      24
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.tripsThisMonth', 'Trips This Month')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={600} color="success.main">
                      156
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.totalTrips', 'Total Trips')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={600} color="warning.main">
                      4.8
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.rating', 'Rating')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card elevation={0} sx={{ bgcolor: 'grey.50' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {t('profile.preferences', 'Preferences')}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={t('profile.notifications', 'Notifications')} size="small" />
                <Chip label={t('profile.darkMode', 'Dark Mode')} size="small" />
                <Chip label={t('profile.location', 'Location Services')} size="small" />
                <Chip label={t('profile.analytics', 'Analytics')} size="small" />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {!isEditing ? (
          <>
            <Button onClick={onClose} color="inherit">
              {t('common.close', 'Close')}
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              variant="contained"
              startIcon={<EditIcon />}
            >
              {t('profile.edit', 'Edit Profile')}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleCancel}
              color="inherit"
              startIcon={<CancelIcon />}
              disabled={loading}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {t('common.save', 'Save')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
