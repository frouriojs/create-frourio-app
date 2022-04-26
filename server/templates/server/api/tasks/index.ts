import type { DefineMethods } from "aspida";
import type { Task } from '<%= orm === "prisma" ? "$prisma/client" : "$/types" %>'

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit?: number<% if (testing !== 'none') { %>
      message?: string<% } %>
    }

    resBody: Task[]
  }
  post: {
    reqBody: Pick<Task, 'label'>
    resBody: Task
  }
}>
