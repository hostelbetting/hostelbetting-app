import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Home } from '../pages/home/Home'
import { Profile } from '../pages/profile/Profile'
import { BetterLeaderBoard, LeaderBoard, TeamLeaderBoard } from '../pages/leaderboard/LeaderBoard'
import { WalletPage } from '../pages/wallet-pages/WalletPage'
import { WithdrawalPage } from '../pages/wallet-pages/WithdrawalPage'
import { NotificationPage } from '../pages/notification-page/NotificationPage'
import { EditProfilePage } from '../pages/profile/EditProfilePage'
import { EventPage } from '../pages/event-page/EventPage'
import { BettingPage } from '../pages/bidding-page/BettingPage'
import { BettingConfirmPage } from '../pages/bidding-page/BettingConfirmPage'
import { ErrorPage } from '../pages/error-page/ErrorPage'
import { AuthenticationPage, Login, Registration } from '../pages/registration-page/AuthenticationPage'
import { PreloginRoute } from './Prelogin.routes'
import { PrivateRoute } from './Private.routes'
import { PasswordResetPage } from '../pages/registration-page/PasswordResetPage'
import { PrivacyPolicyPage, TermsAndConditions } from '../pages/policy-pages/PolicyPages'
import { ContactPage } from '../pages/policy-pages/ContactPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      {/* open Routes  */}
      <Route path='/home' element={<Home />} />
      <Route path='/events' element={<EventPage />} />
      <Route path='/leaderboard' element={<LeaderBoard />} />
      <Route path='/terms-conditions' element={<TermsAndConditions />} />
      <Route path='/privacy' element={<PrivacyPolicyPage />} />
      <Route path='/contact' element={<ContactPage />} />
      {/* secured routes  */}
      <Route path='/profile/:userId' element={<PrivateRoute children={<Profile />} />} />
      <Route path='/edit-profile' element={<PrivateRoute children={<EditProfilePage />} />} />
      <Route path='/wallet' element={<PrivateRoute children={<WalletPage />} />} />
      <Route path='/withdraw' element={<PrivateRoute children={<WithdrawalPage />} />} />
      <Route path='/notification' element={<PrivateRoute children={<NotificationPage />} />} />
      <Route path='/create-bet' element={<PrivateRoute children={<BettingPage />} />} />
      <Route path='/confirm-betting' element={<PrivateRoute children={<BettingConfirmPage />} />} />
      {/* authentication routes  */}
      <Route path='/auth' element={<PreloginRoute children={<AuthenticationPage />} />} >
        <Route path='/auth' element={<Navigate to={'login'} />} />
        <Route path='registration' element={<Registration />} />
        <Route path='login' element={<Login />} />
      </Route>
      <Route path='/auth/reset-password' element={<PasswordResetPage />} />
      <Route path='/*' element={<ErrorPage />} />
    </Routes>
  )
}