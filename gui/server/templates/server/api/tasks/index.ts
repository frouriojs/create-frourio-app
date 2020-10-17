import { Task } from '<%= orm === "prisma" ? "$prisma/client" : "$/types" %>'

export type Methods = {
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
}
