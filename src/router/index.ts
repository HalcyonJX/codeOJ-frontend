import { createRouter, createWebHistory } from 'vue-router'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import QuestionsView from '@/pages/QuestionsView.vue'
import AddQuestionView from '@/pages/AddQuestionView.vue'
import ManageQuestionView from '@/pages/admin/ManageQuestionView.vue'
import QuestionSubmitView from '@/pages/QuestionSubmitView.vue'
import ViewQuestionView from '@/pages/ViewQuestionView.vue'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage,
    },
    {
      path: "/questions",
      name: "浏览题目",
      component: QuestionsView,
    },
    {
      path: "/question_submit",
      name: "浏览题目提交",
      component: QuestionSubmitView,
    },
    {
      path: "/question/:id",
      name: "在线做题",
      component: ViewQuestionView,
      props: true,
    },
    {
      path: "/add_question",
      name: "创建题目",
      component: AddQuestionView,
    },
    {
      path: "/update_question",
      name: "更新题目",
      component: AddQuestionView,
    },
    {
      path: "/admin/questionManage",
      name: "管理题目",
      component: ManageQuestionView,
    },
    {
      path: "/",
      name: "主页",
      component: HomePage,
    },
  ],
})

export default router
