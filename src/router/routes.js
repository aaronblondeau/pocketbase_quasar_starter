
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') }
    ]
  },

  {
    path: '/auth',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'forgot_password', name: 'forgot_password', component: () => import('pages/auth/ForgotPasswordPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/auth/RegisterPage.vue') },
      { path: 'resend_verification', name: 'resend_verification', meta: { requiresAuth: true }, component: () => import('pages/auth/ResendVerificationPage.vue') },
      { path: 'profile', name: 'profile', meta: { requiresAuth: true }, component: () => import('pages/auth/ProfilePage.vue') }
    ]
  },

  {
    path: '/invoice',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':invoiceId', name: 'invoice', meta: { requiresAuth: true }, component: () => import('pages/invoice/InvoicePage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
