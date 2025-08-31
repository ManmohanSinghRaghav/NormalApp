import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth.jsx'
import { LanguageSwitcherMini } from './LanguageSelector.jsx'
import UserProfile from './UserProfile.jsx'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Avatar,
  Divider,
  Paper,
} from '@mui/material'
import {
  Map as MapIcon,
  DirectionsBus as BusIcon,
  LocationOn as StopIcon,
  Star as StarIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'

export default function Layout({ children }) {
  const { t } = useTranslation()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      setShowMenu(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const navItems = [
    { 
      icon: <MapIcon />, 
      label: t('nav.map', 'Map'), 
      path: '/',
      active: location.pathname === '/'
    },
    { 
      icon: <BusIcon />, 
      label: t('nav.buses', 'Buses'), 
      path: '/buses',
      active: location.pathname === '/buses'
    },
    { 
      icon: <StopIcon />, 
      label: t('nav.stops', 'Stops'), 
      path: '/stops',
      active: location.pathname === '/stops'
    },
    { 
      icon: <StarIcon />, 
      label: t('nav.favorites', 'Favorites'), 
      path: '/favorites',
      active: location.pathname === '/favorites'
    }
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <BusIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" component="h1" sx={{ fontWeight: 600, lineHeight: 1 }}>
                NextStop
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
                {t('app.tagline', 'Real-time Bus Tracking')}
              </Typography>
            </Box>
          </Box>

          {/* Header Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Switcher */}
            <LanguageSwitcherMini />
            
            {/* Notifications */}
            <IconButton>
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            {/* Profile Menu */}
            <IconButton
              onClick={(e) => setShowMenu(e.currentTarget)}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'black' }}>
                <PersonIcon />
              </Avatar>
              <ExpandMoreIcon />
            </IconButton>
            
            <Menu
              anchorEl={showMenu}
              open={Boolean(showMenu)}
              onClose={() => setShowMenu(false)}
              PaperProps={{
                sx: { minWidth: 200 }
              }}
            >
              <MenuItem
                onClick={() => {
                  setShowProfile(true)
                  setShowMenu(false)
                }}
              >
                <PersonIcon sx={{ mr: 2 }} />
                {t('nav.profile', 'Profile')}
              </MenuItem>
              
              <MenuItem
                onClick={() => {
                  navigate('/settings')
                  setShowMenu(false)
                }}
              >
                <SettingsIcon sx={{ mr: 2 }} />
                {t('nav.settings', 'Settings')}
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 2 }} />
                {t('nav.logout', 'Logout')}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Paper elevation={3} sx={{ position: 'relative', zIndex: 60 }}>
        <BottomNavigation
          value={location.pathname}
          onChange={(event, newValue) => navigate(newValue)}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              value={item.path}
              icon={item.icon}
              sx={{
                color: item.active ? 'black' : 'text.secondary',
                '&.Mui-selected': {
                  color: 'black',
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Profile Modal */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </Box>
  )
}
