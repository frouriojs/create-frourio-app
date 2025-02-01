import useAspidaSWR from '@aspida/swr'
import Main from '~/components/main'
import { createApiClient } from '~/utils/apiClient'

const Home = () => {
  const apiClient = createApiClient()
  const { data: serverStatus, mutate } = useAspidaSWR(apiClient.status)
  return <Main serverStatus={serverStatus} mutate={mutate} useServer />
}

export default Home
