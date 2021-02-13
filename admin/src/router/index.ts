import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Main from '../views/Main.vue'
import Manual from '../views/Manual.vue'
import Reference from '../views/Reference.vue'
import Privacy from '../views/Privacy.vue'
import Imprint from '../views/Imprint.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    // children: [
    //   {name: 'home', path: '/', component: Home}
    // ]
  },
  {
    path: '/manual',
    name: 'Manual',
    component: Manual,
  },
  {
    path: '/reference',
    name: 'Reference',
    component: Reference,
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
  },
  {
    path: '/imprint',
    name: 'Imprint',
    component: Imprint,
  }
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode:'history',
  routes
})

export default router
