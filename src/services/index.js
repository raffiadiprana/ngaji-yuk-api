import { donations } from './donations/donations.js'
import { sections } from './sections/sections.js'
import { uploads } from './uploads/uploads.js'
import { videologs } from './videologs/videologs.js'
import { quiz } from './quiz/quiz.js'
import { answers } from './answers/answers.js'
import { profiles } from './profiles/profiles.js'
import { discussion } from './discussion/discussion.js'
import { media } from './media/media.js'
import { modules } from './modules/modules.js'

import { lessons } from './lessons/lessons.js'
import { user } from './users/users.js'
import { passwordReset } from './password-reset/password-reset.js'
import { userProgress } from './user-progress/user-progress.js'
export const services = app => {
  app.configure(donations)

  app.configure(sections)

  app.configure(uploads)

  app.configure(videologs)

  app.configure(quiz)

  app.configure(answers)

  app.configure(profiles)

  app.configure(discussion)

  app.configure(media)

  app.configure(modules)

  app.configure(lessons)

  app.configure(user)

  app.configure(passwordReset)

  app.configure(userProgress)

  // All services will be registered here
}
