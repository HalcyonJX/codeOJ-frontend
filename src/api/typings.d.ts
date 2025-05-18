declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageQuestion_ = {
    code?: number
    data?: PageQuestion_
    message?: string
  }

  type BaseResponsePageQuestionSubmitVO_ = {
    code?: number
    data?: PageQuestionSubmitVO_
    message?: string
  }

  type BaseResponsePageQuestionVO_ = {
    code?: number
    data?: PageQuestionVO_
    message?: string
  }

  type BaseResponsePageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type BaseResponseQuestionVO_ = {
    code?: number
    data?: QuestionVO
    message?: string
  }

  type BaseResponseUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type DeleteRequest = {
    id?: number
  }

  type getQuestionVOByIdUsingGETParams = {
    /** id */
    id: string
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type JudgeCase = {
    input?: string
    output?: string
  }

  type JudgeConfig = {
    memoryLimit?: number
    stackLimit?: number
    timeLimit?: number
  }

  type JudgeInfo = {
    memory?: number
    message?: string
    time?: number
  }

  type LoginUserVO = {
    createTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type PageQuestion_ = {
    current?: number
    pages?: number
    records?: Question[]
    size?: number
    total?: number
  }

  type PageQuestionSubmitVO_ = {
    current?: number
    pages?: number
    records?: QuestionSubmitVO[]
    size?: number
    total?: number
  }

  type PageQuestionVO_ = {
    current?: number
    pages?: number
    records?: QuestionVO[]
    size?: number
    total?: number
  }

  type PageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type Question = {
    acceptedNum?: number
    answer?: string
    content?: string
    createTime?: string
    favourNum?: number
    id?: number
    isDelete?: number
    judgeCase?: string
    judgeConfig?: string
    submitNum?: number
    tags?: string
    thumbNum?: number
    title?: string
    updateTime?: string
    userId?: number
  }

  type QuestionAddRequest = {
    answer?: string
    content?: string
    judgeCase?: JudgeCase[]
    judgeConfig?: JudgeConfig
    tags?: string[]
    title?: string
  }

  type QuestionEditRequest = {
    answer?: string
    content?: string
    id?: number
    judgeCase?: JudgeCase[]
    judgeConfig?: JudgeConfig
    tags?: string[]
    title?: string
  }

  type QuestionQueryRequest = {
    answer?: string
    content?: string
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    tags?: string[]
    title?: string
    userId?: number
  }

  type QuestionSubmitAddRequest = {
    code?: string
    language?: string
    questionId?: number
  }

  type QuestionSubmitQueryRequest = {
    current?: number
    language?: string
    pageSize?: number
    questionId?: number
    sortField?: string
    sortOrder?: string
    status?: number
    userId?: number
  }

  type QuestionSubmitVO = {
    code?: string
    createTime?: string
    id?: number
    judgeInfo?: JudgeInfo
    language?: string
    questionId?: number
    questionVO?: QuestionVO
    status?: number
    updateTime?: string
    userId?: number
    userVO?: UserVO
  }

  type QuestionUpdateRequest = {
    answer?: string
    content?: string
    id?: number
    judgeCase?: JudgeCase[]
    judgeConfig?: JudgeConfig
    tags?: string[]
    title?: string
  }

  type QuestionVO = {
    acceptedNum?: number
    content?: string
    createTime?: string
    favourNum?: number
    id?: number
    judgeConfig?: JudgeConfig
    submitNum?: number
    tags?: string[]
    thumbNum?: number
    title?: string
    updateTime?: string
    userId?: number
    userVO?: UserVO
  }

  type User = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserAddRequest = {
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    checkPassword?: string
    userAccount?: string
    userPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    createTime?: string
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
