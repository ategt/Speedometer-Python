import { shallowMount, mount } from '../../../node_modules/@vue/test-utils/dist/vue-test-utils.js';
import axios from 'axios';
import { mockGet } from './helpers.js';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

//import Vue from 'vue'
//import Router from 'vue-router'



// Automatic script based navigation
//this.$router.push('/path-to-navigate-to')



import VueRouter, { useRouter, useRoute } from 'vue-router';

//VueRouter.useRouter
const router = useRouter();
const route = useRoute();



const router = VueRouter.createRouter({
          history:VueRouter.createWebHashHistory(),
          routes:routes
        });

const Home  = {template: "<div>Home</div>"};
const About = {template: "<div>About</div>"};

const User  = {template: "<div></div>",
                computed: {
                  username () {
                    return this.$route.params.username;
                  }
                },
                created () {
                  this.$watch(
                    () => this.$route.params,
                    (toParams, previousParams) => {
                      // react to route changes
                    }
                  )
                },
                async beforeRouteUpdate (to, from) {
                  // react to route changes
                  this.userData = await fetchUser(to.params.id)
                },
              };

const routes = [
                {path:"/", component: Home},
                {path:"/about", component: About},
                // will match anything and put it under '$route.params.pathMatch'
                {path:'/:pathMatch(.*)*', name: "NotFound", component: NotFound},
                // will match anything starting with '/user-' and put it under '$route.params.afterUser'
                {path:'/user-:afterUser(.*)', component: UserGeneric},
                {path:'/:chapters*', component: ManyChaptersGeneric}, // matches /, /one, /one/two, /one/two/three, ... (returns an array)
               ];

// Optional route params
const routes = [
                // :userId is equivelent to :userId([^/]+)
                {path:"/users/:userId", component: User},
                // will match /users and users/posna
                {path:"/users/:userId?", component: User},
                // will match /users and /users/42
                {path:"/users/:userId(\\d+)?", component: User},
               ];


// given {path:'/:chapters*', name: "chapters"},
router.resolve({name:"chapters", params:{ chapters:[]}}).href
// produces /
router.resolve({name:"chapters", params:{ chapters:['a','b']}}).href
// produces /a/b

// given {path: '/:chapters+', name: "chapters"},
router.resolve({name:"chapters", params:{ chapters:[]}}).href
// throws an Error because 'chapters' is empty

this.$route.push({
  name: 'NotFound',
  // preserve current path and remove the first char to avoid the target URL starting with '//'
  params: { pathMatch: this.$route.path.substring(1).split('/')},
  // preserve existing query and hash if any
  query: this.$route.query,
  hash: this.$route.hash,
});

router.push({path:"/users/edward"})
router.push({name:"user", params: { username: "edward"}})
router.push({path:"/register", query:{plan:"private"}}) // => /register?plan=private
router.push({path:"/register", hash: "#team"}) // => /register#team

router.push({name:"user", params: {username: "edward"}})
router.push({path:"/user", params: {username: "edward"}}) // => /user , path will ignore everything else

// followng three are the same
router.push({path:"/home", replace:true})
router.replace({path:"/home"})
//<router-link to="/home" replace></router-link>

router.go(1) // forward 1
router.go(-1) // back in history 1

// silently fails if not that many records
router.go(-100)
router.go(100)


// router-link accepts objects
// <rouer-link :to="{name:'user', params: {username: 'erina'}}">User</router-link>
// same as
router.push({name: 'user', params: {username: 'erina'}})


//<router-view class="view left-sidebar" name="LeftSideBar"></router-view>
//<router-view class="view main-content"></router-view>
//<router-view class="view right-sidebar" name="RightSideBar"></router-view>


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
      {
        path:'/',
        components: {
          default: Home,
          LeftSideBar,  // matches the name attribute on router-view
          RightSideBar, // same as RightSideBar: RightSideBar
        }
      }
  ]
})


{path: "/settings",
// you could also have named views at the top
component: UserSettings,
children: [
{path: "emails", component: UserEmailSubscriptions},
{path: "profile", components: {default: UserProfile, helper: UserProfilePreview},}
]
}


const routes = [{path:"/home", redirect:"/"}]
const routes = [{path:"/home", redirect:{name: "homepage"}}]


const routes = [
{
  // /search/screens -> /search?q=screens
  path: "/search/:searchText",
  redirect: to => {
    // the function recieves the target route as the argument
    // we return a redirect path/location here.
    return {path: "/search", query: {q: to.params.searchText}}
  },
},{path:"/search"}]


const routes = [{path:"/", component: HomePage, alias:"/home"}]


const routes = [
{path: "/users",
component: UsersLayout,
children: [
    // this will render the userslist for these three urls
    // - /users
    // - /users/list
    // - /people
    {path:'', component:UserList, alias:['/people','list']},
    ]
  }
]


const routes = [
{path: "/users/:id",
component: UsersByIdLayout,
children: [
    // this will render the userslist for these three urls
    // - /users/24
    // - /users/24/profiie
    // - /24
    {path:'profile', component:UserDetails, alias:['/:id','']},
    ]
  }
]

const User = { template: "<div>User {{ $route.params.id }}</div>" }
const routes = [{path:"/user/:id", component: User}]

// is replaceable with

const User = { 
  props: ['id'],
    template: "<div>User {{ id }}</div>" 
  }
const routes = [{path:"/user/:id", component: User, props:true}] // props:true makes route.params the props

// for named views, define props for each view
const routes = [
    {path: "/user/:id",
      component: { default: User, sidebar: SideBar},
      props: { default: true, sidebar: false}
     }
]


// when props is an object this will be set as the component props as-is
// useful for when the props are static
const routes = [{
  path: "/promotion/from-newsletter",
  component: Promotion,
  props: { newsletterPopUp: false}
}]


// props for routes can be a function, but should be stateless
const routes = [{
  path: "/search",
  component: SearchUser,
  props: route => ({query:route.query.q})
}]

createWebHistory() // HTML5 mode and recommended

router.beforeEach((to, from, next) => {
  if (to.name !== "Login" && !isAuthenticated) {
    next({name: "Login"})
  } else {
    next()
  }
})

router.beforeResolve(async to => {
    if (to.meta.requiresCamera) {
      // do async things asking for camera
    }
});


router.afterEach((to, from) => {
    sendToAnalytics(to.fullPath);
})

// detect navigation failure
router.afterEach((to, from, failure) => {
  if (!failure) {
    sendToAnalytics(to.fullPath);
  }
})


function removeQueryParams (to) {
    if (Object.keys(to.query).length) {
      return {path:to.path, query:{}, hash:to.hash}
    }
}

function removeHash (to) {
  if (to.hash) {
    return {path:to.path, query:to.query, hash:""}
  }
}

const routes = [
{
  path:"/users/:id",
  component: UserDetails,
  beforeEnter: [removeQueryParams, removeHash],
},
{
  path:"/about",
  component: UserDetails,
  beforeEnter: [removeQueryParams],
}
]

beforeRouteEnter(to, from)
beforeRouteUpdate(to, from)
beforeRouteLeave(to, from)

beforeRouteLeave (to, from) {
    const answer = window.confirm("Do you really want to leave?\nYou have unsaved changes that will be lost.")
    if (!answer) {
      return false;
    }
}

const routes = [
{
  path: "/posts",
  component: PostLayout,
  children: [
    {
      path: "new",
      component: PostsNew,
      // only authenticated users can create posts
      meta: {isAuthenticated: true}
    },
    {
      path: ":id",
      component: PostsDetail,
      // anybody can read a post
      meta: {isAuthenticated: false}
    }
  ]
}
]


router.beforeEach((to, from) => {
    // instead of having to check every route record with
    // to.matched.some(record => record.meta.requiresAuth)
    if (to.meta.requiresAuth && !auth.isLoggedIn()) {
      // this route requires auth, check if logged in
      // and if not, redirect to login page.
      return {
        path: "/login",
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      }
    }
});







import Footer from '../components/partials/Footer.vue';

const expect = chai.expect;

let axiosGet;

describe('Footer Shell Test', function () {
  beforeEach(() => {
      axiosGet = axios.get;
      axios.get = mockGet;
  })

  afterEach(() => {
      axios.get = axiosGet;
  })
  
  it('initializes with data', (done) => {
    const wrapper = shallowMount(Footer)

    expect(wrapper.text()).contains('Cool loading screen...')

    wrapper.vm.$nextTick().then(function () {
      expect(wrapper.text()).contains('Pending List')
      expect(wrapper.findAll('.mot-parent').length > 1).equal(true)
      expect(wrapper.findAll('.mot-parent').length > 1).equals(true)
      //expect(wrapper.findAll('.mot-parent').length > 1).same(true)

      // click one of the mot buttons
      wrapper.findAll('.mot-parent').at(0).trigger('click').then(() => {
        console.log(wrapper.vm.currentMot)
        done()
      })
    })
  })
})

mocha.run();
